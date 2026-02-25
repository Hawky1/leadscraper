import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from './cors.ts'

const PLACES_API_BASE = 'https://places.googleapis.com/v1'
const MAX_PAGES = 5 // Safety cap — at most 5 pages × 20 results = 100 places scanned

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchRecord {
    id: string
    business_type: string
    location: string
    lead_type: string
    leads_count: number
}

interface Place {
    id: string
    displayName?: { text: string }
    formattedAddress?: string
    internationalPhoneNumber?: string
    nationalPhoneNumber?: string
    websiteUri?: string
    rating?: number
}

interface LeadInsert {
    search_id: string
    business_name: string
    phone: string | null
    website_url: string | null
    has_website: boolean
    google_place_id: string
    rating: number | null
    address: string | null
}

// ─── Filter Helper ────────────────────────────────────────────────────────────

function passesFilter(place: Place, leadType: string): boolean {
    const hasPhone = !!place.internationalPhoneNumber || !!place.nationalPhoneNumber
    const hasWebsite = !!place.websiteUri

    switch (leadType) {
        case 'Phone Number, Website':
            return hasPhone && hasWebsite
        case 'Phone Number for Business Without Websites':
            return hasPhone && !hasWebsite
        case 'Phone Number Only':
            return hasPhone
        default:
            return true // No filter — keep everything
    }
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { search_id } = await req.json()

        if (!search_id) {
            return new Response(JSON.stringify({ error: 'search_id is required' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const googleApiKey = Deno.env.get('MAPS_API_KEY') ?? ''
        if (!googleApiKey) {
            throw new Error('MAPS_API_KEY is not set in Supabase secrets.')
        }

        // 1. Fetch the search record
        const { data: search, error: searchError } = await supabase
            .from('searches')
            .select('*')
            .eq('id', search_id)
            .single()

        if (searchError || !search) {
            throw new Error(`Search not found: ${searchError?.message}`)
        }

        const searchData = search as SearchRecord
        const targetCount = searchData.leads_count

        console.log(`🔍 Hunting "${searchData.business_type}" in "${searchData.location}" — need ${targetCount} leads (filter: ${searchData.lead_type})`)

        // 2. Paginated Google Places search — keep going until we have enough filtered results
        const collectedLeads: LeadInsert[] = []
        const seenPlaceIds = new Set<string>()
        let pageToken: string | undefined = undefined
        let pagesScanned = 0
        let totalPlacesScanned = 0
        const debugLog: string[] = []

        const fieldMask = [
            'places.id',
            'places.displayName',
            'places.formattedAddress',
            'places.internationalPhoneNumber',
            'places.nationalPhoneNumber',
            'places.websiteUri',
            'places.rating',
            'nextPageToken',
        ].join(',')

        while (collectedLeads.length < targetCount && pagesScanned < MAX_PAGES) {
            const body: Record<string, unknown> = {
                textQuery: `${searchData.business_type} in ${searchData.location}`,
                maxResultCount: 20,
                languageCode: 'en',
            }
            if (pageToken) {
                body.pageToken = pageToken
            }

            const res = await fetch(`${PLACES_API_BASE}/places:searchText`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': googleApiKey,
                    'X-Goog-FieldMask': fieldMask,
                },
                body: JSON.stringify(body),
            })

            if (!res.ok) {
                const errText = await res.text()
                debugLog.push(`❌ Page ${pagesScanned + 1} API error: ${errText}`)
                throw new Error(`Google Places API error (page ${pagesScanned + 1}): ${errText}`)
            }

            const rawBody = await res.text()
            debugLog.push(`📄 Page ${pagesScanned + 1} raw response (first 500 chars): ${rawBody.substring(0, 500)}`)
            console.log(`📄 Page ${pagesScanned + 1} raw response:`, rawBody.substring(0, 1000))

            let data: Record<string, unknown>
            try {
                data = JSON.parse(rawBody)
            } catch {
                throw new Error(`Failed to parse Google response: ${rawBody.substring(0, 200)}`)
            }

            const places: Place[] = (data.places as Place[]) ?? []
            pageToken = data.nextPageToken as string | undefined

            pagesScanned++
            totalPlacesScanned += places.length

            debugLog.push(`📍 Page ${pagesScanned}: ${places.length} places, nextPageToken: ${pageToken ? 'yes' : 'no'}`)
            console.log(`📍 Page ${pagesScanned}: ${places.length} places`)

            // Log each place for debugging
            for (const place of places) {
                const hasPhone = !!place.internationalPhoneNumber || !!place.nationalPhoneNumber
                const hasWebsite = !!place.websiteUri
                const passes = passesFilter(place, searchData.lead_type)
                const name = place.displayName?.text ?? 'Unknown'
                debugLog.push(`  → ${name} | phone:${hasPhone} | website:${hasWebsite} | passes:${passes}`)
                console.log(`  → ${name} | phone:${hasPhone} | website:${hasWebsite} | passes:${passes}`)
            }

            // Filter and collect
            for (const place of places) {
                if (collectedLeads.length >= targetCount) break
                if (seenPlaceIds.has(place.id)) continue
                seenPlaceIds.add(place.id)

                if (!passesFilter(place, searchData.lead_type)) continue

                collectedLeads.push({
                    search_id,
                    business_name: place.displayName?.text ?? 'Unknown',
                    phone: place.internationalPhoneNumber ?? place.nationalPhoneNumber ?? null,
                    website_url: place.websiteUri ?? null,
                    has_website: !!place.websiteUri,
                    google_place_id: place.id,
                    rating: place.rating ?? null,
                    address: place.formattedAddress ?? null,
                })
            }

            debugLog.push(`✅ Collected ${collectedLeads.length}/${targetCount} matching leads so far`)
            console.log(`✅ Collected ${collectedLeads.length}/${targetCount}`)

            // Stop if no more pages
            if (!pageToken) break
        }

        console.log(`📊 Scanned ${totalPlacesScanned} places across ${pagesScanned} pages → ${collectedLeads.length} leads match filter`)

        // 3. Insert leads
        if (collectedLeads.length > 0) {
            const { error: insertError } = await supabase.from('leads').insert(collectedLeads)
            if (insertError) {
                throw new Error(`Failed to insert leads: ${insertError.message}`)
            }
        }

        // 4. Mark search as completed
        const finalStatus = collectedLeads.length > 0 ? 'completed' : 'failed'
        await supabase
            .from('searches')
            .update({ status: finalStatus })
            .eq('id', search_id)

        console.log(`🏁 Search ${search_id} → ${finalStatus} (${collectedLeads.length} leads)`)

        return new Response(
            JSON.stringify({
                success: true,
                status: finalStatus,
                leads_found: collectedLeads.length,
                pages_scanned: pagesScanned,
                total_places_scanned: totalPlacesScanned,
                debug: debugLog,
            }),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
        )
    } catch (error) {
        console.error('❌ run-search error:', error)

        return new Response(
            JSON.stringify({ success: false, error: String(error) }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
        )
    }
})
