import React, { useState, useRef, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured, createNotification } from '@/lib/supabase'
import NewSearchModal from '@/components/NewSearchModal'
import LeadsTable from '@/components/LeadsTable'
import {
    CheckCircle2,
    ArrowUpRight,
    Trash2,
    Loader2,
    GripVertical,
    Search,
    ArrowDownAZ,
    ArrowUpAZ,
    CalendarArrowDown,
    CalendarArrowUp,
    Clock,
    Users,
    Tag,
    ChevronDown,
    SlidersHorizontal
} from 'lucide-react'

interface SearchRecord {
    id: string
    business_type: string
    location: string
    lead_type: string
    leads_count: number
    status: string
    created_at: string
}

const MOCK_SEARCHES: SearchRecord[] = [
    { id: '1', business_type: 'Roofers', location: 'Melbourne, VIC', lead_type: 'Phone Number, Website', leads_count: 25, status: 'completed', created_at: '2026-02-25T10:30:00Z' },
    { id: '2', business_type: 'Dentists', location: 'Sydney, NSW', lead_type: 'Phone Number for Business Without Websites', leads_count: 12, status: 'completed', created_at: '2026-02-24T14:15:00Z' },
    { id: '3', business_type: 'Plumbers', location: 'Brisbane, QLD', lead_type: 'Phone Number Only', leads_count: 0, status: 'pending', created_at: '2026-02-26T01:00:00Z' },
]

type SortOption = 'date_desc' | 'date_asc' | 'name_asc' | 'name_desc'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'date_desc', label: 'Newest first' },
    { value: 'date_asc', label: 'Oldest first' },
    { value: 'name_asc', label: 'Name A → Z' },
    { value: 'name_desc', label: 'Name Z → A' },
]

function formatRelativeDate(dateStr: string): string {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
}

function shortenLeadType(lt: string): string {
    if (lt.includes('Without Websites')) return 'No Website'
    if (lt.includes('Website')) return 'Has Website'
    if (lt.includes('Phone')) return 'Phone Only'
    return lt
}

const LeadGeneration: React.FC = () => {
    const [selectedSearchId, setSelectedSearchId] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const queryClient = useQueryClient()

    // ─── Search, Sort & Drag state ──────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<SortOption>('date_desc')
    const [showSortDropdown, setShowSortDropdown] = useState(false)
    const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
    const [dropTargetIdx, setDropTargetIdx] = useState<number | null>(null)
    const dragCounter = useRef(0)

    const { data: searches, refetch } = useQuery({
        queryKey: ['searches'],
        queryFn: async () => {
            if (!isSupabaseConfigured) return MOCK_SEARCHES
            const { data, error } = await supabase.from('searches').select('*').order('created_at', { ascending: false })
            if (error) throw error
            return data as SearchRecord[]
        }
    })

    // ─── Filtered + Sorted list ─────────────────────────────────────────
    const displayedSearches = useMemo(() => {
        let list = [...(searches ?? [])]

        // Filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            list = list.filter(s =>
                s.business_type.toLowerCase().includes(q) || s.location.toLowerCase().includes(q)
            )
        }

        // Sort
        list.sort((a, b) => {
            switch (sortBy) {
                case 'date_desc': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                case 'date_asc': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                case 'name_asc': return a.business_type.localeCompare(b.business_type)
                case 'name_desc': return b.business_type.localeCompare(a.business_type)
                default: return 0
            }
        })

        return list
    }, [searches, searchQuery, sortBy])

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        if (!window.confirm('Delete this run and all its leads?')) return

        setDeletingId(id)
        try {
            if (isSupabaseConfigured) {
                const { data: deleted, error } = await supabase
                    .from('searches')
                    .delete()
                    .eq('id', id)
                    .select()
                if (error) throw error
                if (!deleted || deleted.length === 0) {
                    throw new Error('Delete blocked by RLS policy. Please run the DELETE policy SQL in your Supabase SQL Editor.')
                }
            }
            queryClient.setQueryData<SearchRecord[]>(['searches'], (old) =>
                (old ?? []).filter((s) => s.id !== id)
            )
            if (selectedSearchId === id) setSelectedSearchId(null)

            // Trigger notification
            createNotification({
                title: 'Run Deleted',
                message: 'A lead generation run has been removed from your history.',
                type: 'warning'
            })
        } catch (error: any) {
            alert(error.message || 'Failed to delete search')
            queryClient.invalidateQueries({ queryKey: ['searches'] })
        } finally {
            setDeletingId(null)
        }
    }

    // ─── Drag Handlers ──────────────────────────────────────────────────
    const handleDragStart = (e: React.DragEvent, idx: number) => {
        setDraggedIdx(idx)
        e.dataTransfer.effectAllowed = 'move'
        const el = e.currentTarget as HTMLElement
        setTimeout(() => el.style.opacity = '0.4', 0)
    }

    const handleDragEnd = (e: React.DragEvent) => {
        (e.currentTarget as HTMLElement).style.opacity = '1'
        setDraggedIdx(null)
        setDropTargetIdx(null)
        dragCounter.current = 0
    }

    const handleDragEnter = (e: React.DragEvent, idx: number) => {
        e.preventDefault()
        dragCounter.current++
        if (draggedIdx !== null && idx !== draggedIdx) {
            setDropTargetIdx(idx)
        }
    }

    const handleDragLeave = () => {
        dragCounter.current--
        if (dragCounter.current <= 0) {
            setDropTargetIdx(null)
            dragCounter.current = 0
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }

    const handleDrop = (e: React.DragEvent, dropIdx: number) => {
        e.preventDefault()
        if (draggedIdx === null || draggedIdx === dropIdx || !searches) return

        const reordered = [...searches]
        const [dragged] = reordered.splice(draggedIdx, 1)
        reordered.splice(dropIdx, 0, dragged)

        queryClient.setQueryData<SearchRecord[]>(['searches'], reordered)

        setDraggedIdx(null)
        setDropTargetIdx(null)
        dragCounter.current = 0
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#0A0F1C]/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-sm border border-white/10">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">Lead Generation Hub</h2>
                    <p className="text-gray-400 mt-1 font-medium">Start a new automated hunt or manage your existing lead runs.</p>
                </div>
                <NewSearchModal onSuccess={(id) => {
                    refetch()
                    setSelectedSearchId(id)
                }} />
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Search History */}
                <div className="col-span-12 lg:col-span-4">
                    <div className="bg-[#0A0F1C]/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-sm border border-white/10 h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">Recent Runs</h3>
                            <span className="text-xs font-semibold text-gray-300 bg-white/10 border border-white/10 px-2.5 py-1 rounded-full">
                                {displayedSearches.length} runs
                            </span>
                        </div>

                        {/* Search + Sort row */}
                        <div className="flex gap-2 mb-5">
                            <div className="relative flex-1">
                                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search runs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-[#3965FF]/20 placeholder:text-gray-500 font-medium transition-all"
                                />
                            </div>
                            {/* Sort dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                                    className="h-full px-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                    title="Sort by"
                                >
                                    <SlidersHorizontal size={15} />
                                    <ChevronDown size={13} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                {showSortDropdown && (
                                    <>
                                        <div className="fixed inset-0 z-20" onClick={() => setShowSortDropdown(false)} />
                                        <div className="absolute right-0 top-[calc(100%+6px)] z-30 bg-[#0A0F1C] border border-white/10 rounded-xl shadow-lg py-1.5 min-w-[160px] animate-in fade-in slide-in-from-top-2 duration-200">
                                            {SORT_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => { setSortBy(opt.value); setShowSortDropdown(false) }}
                                                    className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${sortBy === opt.value
                                                        ? 'text-[#3965FF] bg-white/5'
                                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Runs list */}
                        <div className="space-y-2">
                            {displayedSearches.map((search, i) => (
                                <div
                                    key={search.id}
                                    className="relative group/item"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, i)}
                                    onDragEnd={handleDragEnd}
                                    onDragEnter={(e) => handleDragEnter(e, i)}
                                    onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, i)}
                                >
                                    {/* Drop indicator (above) */}
                                    {dropTargetIdx === i && draggedIdx !== null && draggedIdx > i && (
                                        <div className="absolute -top-[2px] left-4 right-4 h-[3px] rounded-full bg-[#3965FF] z-10 shadow-[0_0_6px_rgba(57,101,255,0.4)]" />
                                    )}

                                    <div
                                        onClick={() => setSelectedSearchId(search.id)}
                                        className={`w-full p-4 rounded-2xl transition-all cursor-grab active:cursor-grabbing ${selectedSearchId === search.id
                                            ? 'bg-white/10 ring-1 ring-[#3965FF]/50 border border-white/5'
                                            : 'hover:bg-white/5 border border-transparent'
                                            } ${draggedIdx === i ? 'opacity-40' : ''}`}
                                    >
                                        {/* Top row: icon + name + actions */}
                                        <div className="flex items-center gap-3">
                                            {/* Drag handle */}
                                            <div className="opacity-0 group-hover/item:opacity-40 transition-opacity flex-shrink-0">
                                                <GripVertical size={16} className="text-[#A3AED0]" />
                                            </div>

                                            <div className={`h-11 w-11 rounded-xl flex items-center justify-center text-lg shadow-sm flex-shrink-0 ${i % 3 === 0 ? 'bg-[#FFEDE1]' : i % 3 === 1 ? 'bg-[#E0E7FF]' : 'bg-[#FFE4F2]'
                                                }`}>
                                                {i % 3 === 0 ? '🎯' : i % 3 === 1 ? '🚀' : '🔥'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-white truncate">{search.business_type}</h4>
                                                <p className="text-xs text-gray-400 font-medium truncate">{search.location}</p>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {search.status === 'completed' && <CheckCircle2 size={16} className="text-[#34D399]" />}
                                                {search.status === 'pending' && <Loader2 size={16} className="text-[#FBBF24] animate-spin" />}
                                                {search.status === 'failed' && <span className="text-xs text-[#FF5C8E] font-bold">Failed</span>}
                                                <button
                                                    onClick={(e) => handleDelete(e, search.id)}
                                                    disabled={deletingId === search.id}
                                                    className="opacity-0 group-hover/item:opacity-100 p-1.5 rounded-lg text-[#FF5C8E] hover:bg-[#FF5C8E]/10 transition-all"
                                                    title="Delete Run"
                                                >
                                                    {deletingId === search.id ? (
                                                        <Loader2 size={14} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={14} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Run details row */}
                                        <div className="flex items-center gap-2 mt-2.5 ml-[4.25rem] flex-wrap">
                                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                                                <Clock size={10} />
                                                {formatRelativeDate(search.created_at)}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                                                <Users size={10} />
                                                {search.leads_count ?? 0} leads
                                            </span>
                                            {search.lead_type && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                                                    <Tag size={10} />
                                                    {shortenLeadType(search.lead_type)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Drop indicator (below) */}
                                    {dropTargetIdx === i && draggedIdx !== null && draggedIdx < i && (
                                        <div className="absolute -bottom-[2px] left-4 right-4 h-[3px] rounded-full bg-[#3965FF] z-10 shadow-[0_0_6px_rgba(57,101,255,0.4)]" />
                                    )}
                                </div>
                            ))}

                            {displayedSearches.length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm font-medium">
                                    {searchQuery ? 'No runs match your search' : 'No runs yet — start a new hunt!'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Leads Table */}
                <div className="col-span-12 lg:col-span-8">
                    <div className="bg-[#0A0F1C]/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-sm border border-white/10 min-h-[500px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-white">Leads Identified</h3>
                            <button className="text-[#3965FF] text-sm font-bold flex items-center gap-1 hover:text-blue-400 transition-colors">Export CSV <ArrowUpRight size={14} /></button>
                        </div>
                        <LeadsTable searchId={selectedSearchId || '1'} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeadGeneration
