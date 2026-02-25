import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured, createNotification } from '@/lib/supabase'
import { Plus, Search, MapPin, Loader2, ListOrdered, Filter, X, CheckCircle2 } from 'lucide-react'

interface NewSearchModalProps {
    onSuccess: (searchId: string) => void
}

type SubmitStage = 'idle' | 'saving' | 'running' | 'done'

const NewSearchModal: React.FC<NewSearchModalProps> = ({ onSuccess }) => {
    const queryClient = useQueryClient()
    const [isOpen, setIsOpen] = useState(false)
    const [businessType, setBusinessType] = useState('')
    const [location, setLocation] = useState('')
    const [leadType, setLeadType] = useState('Phone Number, Website')
    const [leadsCount, setLeadsCount] = useState('10')
    const [stage, setStage] = useState<SubmitStage>('idle')

    const handleClose = () => {
        if (stage === 'idle') setIsOpen(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStage('saving')

        const { data: { user } } = await supabase.auth.getUser()

        // ── Demo Mode ────────────────────────────────────────────────────────────
        if (!user) {
            await new Promise(r => setTimeout(r, 1000))
            setStage('running')
            await new Promise(r => setTimeout(r, 2200))
            setStage('done')
            await new Promise(r => setTimeout(r, 900))
            setIsOpen(false)
            setStage('idle')
            onSuccess(Math.random().toString())
            return
        }

        // ── Live Mode ─────────────────────────────────────────────────────────────
        // 1. Insert the search record
        const { data, error } = await supabase
            .from('searches')
            .insert([{
                user_id: user.id,
                business_type: businessType,
                location,
                lead_type: leadType,
                leads_count: parseInt(leadsCount),
                status: 'pending'
            }])
            .select()

        if (error || !data?.[0]) {
            alert(error?.message ?? 'Failed to create search.')
            setStage('idle')
            return
        }

        const searchId = data[0].id
        setStage('running')

        // 2. Invoke the Edge Function which calls Google Places API
        const { data: fnData, error: fnError } = await supabase.functions.invoke('run-search', {
            body: { search_id: searchId }
        })

        console.log('Edge function result:', fnData, 'Error:', fnError)

        if (fnError) {
            // Try to get the real error body from the function response
            let errorMsg = fnError.message
            try {
                const ctx = (fnError as any).context
                if (ctx) {
                    const body = await ctx.json()
                    errorMsg = body.error || JSON.stringify(body)
                }
            } catch { }
            console.error('Edge function error detail:', errorMsg)
            alert(`Hunt Error: ${errorMsg}`)
        } else if (fnData && !fnData.success) {
            alert(`Hunt failed: ${fnData.error}`)
        } else if (fnData) {
            console.log(`✅ Found ${fnData.leads_found} leads`)
            // Log full debug info
            if (fnData.debug) {
                console.log('=== DEBUG LOG ===')
                fnData.debug.forEach((line: string) => console.log(line))
                console.log('=================')
            }
            if (fnData.leads_found === 0) {
                const debugInfo = fnData.debug?.join('\n') ?? 'No debug info'
                alert(`0 leads matched your filter.\n\nPages scanned: ${fnData.pages_scanned}\nTotal places checked: ${fnData.total_places_scanned}\n\n--- Debug Log ---\n${debugInfo}`)
            }
        }

        setStage('done')
        await new Promise(r => setTimeout(r, 900))
        setIsOpen(false)
        setStage('idle')
        setBusinessType('')
        setLocation('')
        // Invalidate leads cache so LeadsTable picks up new data
        queryClient.invalidateQueries({ queryKey: ['leads'] })
        queryClient.invalidateQueries({ queryKey: ['searches'] })
        onSuccess(searchId)

        // Trigger notification
        createNotification({
            title: 'Lead Search Completed',
            message: `Your run for "${businessType}" in ${location} is ready.`,
            type: 'success',
            link: '/lead-gen'
        })
    }

    // ── Trigger Button ──────────────────────────────────────────────────────────
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-3 rounded-[2rem] bg-[#1B2559] px-8 py-4 font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10"
            >
                <Plus className="h-5 w-5" />
                Start New Run
            </button>
        )
    }

    const isBusy = stage === 'saving' || stage === 'running' || stage === 'done'

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1B2559]/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-white/50 bg-white/95 backdrop-blur-2xl shadow-2xl animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="bg-[#F4F7FE]/50 p-8 border-b border-[#E9EDF7] flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-[#1B2559]">Start New Run</h2>
                        <p className="text-[#707EAE] text-sm mt-1 font-medium">Configure your lead generation search.</p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isBusy}
                        className="h-10 w-10 rounded-full hover:bg-white flex items-center justify-center text-[#A3AED0] transition-colors disabled:opacity-30"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Running state overlay */}
                {isBusy && (
                    <div className="px-8 py-6 bg-[#F4F7FE] border-b border-[#E9EDF7]">
                        <div className="flex items-center gap-4">
                            {stage === 'done'
                                ? <CheckCircle2 className="h-6 w-6 text-[#34D399]" />
                                : <Loader2 className="h-6 w-6 text-[#3965FF] animate-spin" />}
                            <div>
                                <p className="text-sm font-bold text-[#1B2559]">
                                    {stage === 'saving' && 'Saving your search...'}
                                    {stage === 'running' && `Hunting ${leadsCount} leads via Google Places...`}
                                    {stage === 'done' && 'Leads found! Closing...'}
                                </p>
                                <p className="text-xs text-[#707EAE] mt-0.5 font-medium">
                                    {stage === 'running' ? 'This may take a few seconds.' : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Business Type */}
                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-bold text-[#1B2559] flex items-center gap-2">
                                <Search className="h-4 w-4 text-[#3965FF]" />
                                Business Type
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Roofers, Dentists"
                                value={businessType}
                                onChange={(e) => setBusinessType(e.target.value)}
                                disabled={isBusy}
                                className="w-full rounded-2xl border border-[#E9EDF7] bg-white px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#3965FF]/20 focus:border-[#3965FF] transition-all font-medium text-sm disabled:opacity-50"
                                required
                            />
                        </div>

                        {/* Location */}
                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-bold text-[#1B2559] flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-[#3965FF]" />
                                Location
                                <span className="text-[#A3AED0] text-xs font-normal">City, State</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Sydney, NSW"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                disabled={isBusy}
                                className="w-full rounded-2xl border border-[#E9EDF7] bg-white px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#3965FF]/20 focus:border-[#3965FF] transition-all font-medium text-sm disabled:opacity-50"
                                required
                            />
                        </div>

                        {/* Lead Type */}
                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-bold text-[#1B2559] flex items-center gap-2">
                                <Filter className="h-4 w-4 text-[#3965FF]" />
                                Lead Type
                            </label>
                            <select
                                value={leadType}
                                onChange={(e) => setLeadType(e.target.value)}
                                disabled={isBusy}
                                className="w-full rounded-2xl border border-[#E9EDF7] bg-white px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#3965FF]/20 focus:border-[#3965FF] transition-all font-medium text-sm appearance-none cursor-pointer disabled:opacity-50"
                                required
                            >
                                <option>Phone Number, Website</option>
                                <option>Phone Number for Business Without Websites</option>
                                <option>Phone Number Only</option>
                            </select>
                        </div>

                        {/* Number of Leads */}
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-sm font-bold text-[#1B2559] flex items-center gap-2">
                                <ListOrdered className="h-4 w-4 text-[#3965FF]" />
                                Number of Leads
                            </label>
                            <select
                                value={leadsCount}
                                onChange={(e) => setLeadsCount(e.target.value)}
                                disabled={isBusy}
                                className="w-full rounded-2xl border border-[#E9EDF7] bg-white px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#3965FF]/20 focus:border-[#3965FF] transition-all font-medium text-sm appearance-none cursor-pointer disabled:opacity-50"
                                required
                            >
                                <option value="10">10 Leads</option>
                                <option value="20">20 Leads</option>
                                <option value="50">50 Leads</option>
                                <option value="100">100 Leads</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isBusy}
                            className="flex-1 rounded-2xl border border-[#E9EDF7] px-6 py-4 font-bold text-[#707EAE] hover:bg-[#F4F7FE] transition-colors disabled:opacity-40"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isBusy}
                            className="flex-1 flex items-center justify-center gap-3 rounded-2xl bg-[#3965FF] px-6 py-4 font-bold text-white hover:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-[#3965FF]/20"
                        >
                            {stage === 'done' ? (
                                <><CheckCircle2 className="h-5 w-5" /> Done!</>
                            ) : stage === 'running' ? (
                                <><Loader2 className="h-5 w-5 animate-spin" /> Hunting leads...</>
                            ) : stage === 'saving' ? (
                                <><Loader2 className="h-5 w-5 animate-spin" /> Saving...</>
                            ) : (
                                'Launch Hunt'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NewSearchModal
