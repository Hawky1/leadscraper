import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Globe, AlertCircle, Phone, Star, GlobeIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Lead {
    id: string
    business_name: string
    phone: string | null
    website_url: string | null
    has_website: boolean
    google_place_id: string | null
    rating: number | null
    address: string | null
    ai_design_score: number | null
    ai_critique: string | null
}

interface LeadsTableProps {
    searchId: string
}

const MOCK_LEADS: Record<string, Lead[]> = {
    '1': [
        { id: 'l1', business_name: 'Smith Roofing Co.', phone: '+61 3 9876 5432', website_url: 'https://smithroofing.com.au', has_website: true, google_place_id: null, rating: 4.3, address: '42 Collins St, Melbourne VIC', ai_design_score: 3, ai_critique: 'Outdated design, no mobile responsiveness.' },
        { id: 'l2', business_name: 'Melbourne Roof Repairs', phone: '+61 3 1234 5678', website_url: null, has_website: false, google_place_id: null, rating: 3.8, address: '15 Bourke St, Melbourne VIC', ai_design_score: null, ai_critique: null },
        { id: 'l3', business_name: 'TopTier Roofing Solutions', phone: '+61 4 2222 3333', website_url: 'https://toptierroofing.com', has_website: true, google_place_id: null, rating: 4.7, address: '99 Swanston St, Melbourne VIC', ai_design_score: 8, ai_critique: 'Clean layout, good CTA placement.' },
    ],
    '2': [
        { id: 'l6', business_name: 'Kandy Dental Care', phone: '+61 2 234 5678', website_url: 'https://kandydental.com', has_website: true, google_place_id: null, rating: 4.5, address: '1 George St, Sydney NSW', ai_design_score: 5, ai_critique: 'Average design, acceptable mobile experience.' },
        { id: 'l7', business_name: 'Smile Sydney Dentistry', phone: '+61 2 987 6543', website_url: null, has_website: false, google_place_id: null, rating: 4.1, address: 'Park St, Sydney NSW', ai_design_score: null, ai_critique: null },
    ],
    '3': [],
}

type FilterTab = 'all' | 'without_website' | 'with_website'

const FILTER_TABS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'without_website', label: 'Without Website' },
    { key: 'with_website', label: 'With Website' },
]

const LeadsTable: React.FC<LeadsTableProps> = ({ searchId }) => {
    const [activeFilter, setActiveFilter] = useState<FilterTab>('all')

    const { data: leads, isLoading } = useQuery({
        queryKey: ['leads', searchId],
        queryFn: async () => {
            if (!isSupabaseConfigured) return MOCK_LEADS[searchId || '1'] || []
            const { data, error } = await supabase.from('leads').select('*').eq('search_id', searchId).order('created_at', { ascending: false })
            if (error) throw error
            return data as Lead[]
        },
        enabled: !!searchId
    })

    // Client-side filtering
    const filteredLeads = (leads ?? []).filter((lead) => {
        if (activeFilter === 'without_website') return !lead.has_website
        if (activeFilter === 'with_website') return lead.has_website
        return true
    })

    // Counts for tab badges
    const counts = {
        all: leads?.length ?? 0,
        without_website: leads?.filter(l => !l.has_website).length ?? 0,
        with_website: leads?.filter(l => l.has_website).length ?? 0,
    }

    if (isLoading) return <div className="p-12 text-center text-gray-400 font-bold animate-pulse">Syncing lead intelligence...</div>

    if (!leads?.length) return (
        <div className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-bold text-white">No Leads Yet</p>
            <p className="text-sm text-gray-500 mt-1 font-medium">Start a new run to hunt leads, or select another run.</p>
        </div>
    )

    return (
        <div>
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                {FILTER_TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveFilter(tab.key)}
                        className={cn(
                            'px-4 py-2 rounded-xl text-sm font-bold transition-all',
                            activeFilter === tab.key
                                ? 'bg-[#3965FF] text-white shadow-md shadow-[#3965FF]/25 border border-[#3965FF]/50'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                        )}
                    >
                        {tab.label}
                        <span className={cn(
                            'ml-2 text-xs px-1.5 py-0.5 rounded-full',
                            activeFilter === tab.key
                                ? 'bg-white/20 text-white'
                                : 'bg-white/10 text-gray-400'
                        )}>
                            {counts[tab.key]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Table */}
            {filteredLeads.length === 0 ? (
                <div className="p-8 text-center">
                    <p className="text-gray-400 font-medium">No leads match this filter.</p>
                </div>
            ) : (
                <div className="overflow-x-auto -mx-2">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Business</th>
                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Website</th>
                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-4">
                                        <p className="text-sm font-bold text-white">{lead.business_name}</p>
                                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[220px]">{lead.address ?? '—'}</p>
                                    </td>
                                    <td className="px-4 py-4">
                                        {lead.phone ? (
                                            <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-sm text-[#3965FF] font-medium hover:text-white transition-colors">
                                                <Phone size={14} />
                                                {lead.phone}
                                            </a>
                                        ) : (
                                            <span className="text-xs text-gray-500">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        {lead.has_website ? (
                                            <a href={lead.website_url ?? '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-[#34D399] font-medium hover:text-white transition-colors">
                                                <Globe size={14} />
                                                Visit
                                            </a>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-xs font-bold text-[#FF5C8E]">
                                                <GlobeIcon size={14} className="opacity-50" />
                                                No website
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        {lead.rating != null ? (
                                            <span className="flex items-center gap-1 text-sm font-bold text-[#FFB547]">
                                                <Star size={14} fill="currentColor" />
                                                {lead.rating}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-500">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default LeadsTable
