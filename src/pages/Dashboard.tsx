import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import NewSearchModal from '@/components/NewSearchModal'
import LeadsTable from '@/components/LeadsTable'
import {
    Clock,
    History,
    TrendingUp,
    Plus,
    ArrowUpRight,
    ChevronDown,
    Filter,
    CheckCircle2,
    Calendar,
    ExternalLink
} from 'lucide-react'

interface SearchRecord {
    id: string
    niche: string
    location: string
    status: string
    created_at: string
}

function mapSearch(row: any): SearchRecord {
    return {
        id: row.id,
        niche: row.business_type ?? row.niche,
        location: row.location,
        status: row.status,
        created_at: row.created_at,
    }
}

const MOCK_SEARCHES: SearchRecord[] = [
    { id: '1', niche: 'BrightBridge - Website Design', location: 'Design a framer website with modern templates', status: 'completed', created_at: '2026-02-25T10:30:00Z' },
    { id: '2', niche: 'Github - Upload Dev Files', location: 'Collaborate with Developers to handle SaaS Project', status: 'completed', created_at: '2026-02-24T14:15:00Z' },
    { id: '3', niche: '9TDesign - Mobile App Prototype', location: 'Ready prototype for testing user in this week', status: 'pending', created_at: '2026-02-26T01:00:00Z' },
    { id: '4', niche: 'Horizon - Dashboard Design', location: 'Design a dashboard comfortable with Vision Pro', status: 'completed', created_at: '2026-02-23T09:45:00Z' },
]

const Dashboard: React.FC = () => {
    const [selectedSearchId, setSelectedSearchId] = useState<string | null>(null)

    const { data: searches, refetch } = useQuery({
        queryKey: ['searches'],
        queryFn: async () => {
            if (!isSupabaseConfigured) return MOCK_SEARCHES
            const { data, error } = await supabase.from('searches').select('*').order('created_at', { ascending: false })
            if (error) throw error
            return (data as any[]).map(mapSearch)
        }
    })

    return (
        <div className="grid grid-cols-12 gap-8">
            {/* Left Column: My Hunts (History) */}
            <div className="col-span-12 lg:col-span-3 space-y-8">
                <RedesignedCard title="My Hunts" icon={<Plus size={18} className="text-[#707EAE]" />}>
                    <div className="flex gap-2 mb-6">
                        <button className="px-5 py-2.5 rounded-full bg-[#3965FF] text-white text-xs font-bold shadow-lg shadow-[#3965FF]/20 transition-all">Today</button>
                        <button className="px-5 py-2.5 rounded-full bg-transparent text-gray-400 text-xs font-bold hover:bg-white/5 hover:text-white transition-all">Tomorrow</button>
                    </div>

                    <div className="relative mb-6">
                        <button className="w-full flex items-center justify-between p-4 bg-[#0A0F1C] border border-white/10 rounded-2xl text-sm font-bold hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full bg-white/10 text-white flex items-center justify-center text-[10px]">12</div>
                                <span>On Going Hunts</span>
                            </div>
                            <ChevronDown size={16} className="text-gray-400" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {searches?.map((search, i) => (
                            <SearchItem
                                key={search.id}
                                title={search.niche}
                                desc={search.location}
                                active={selectedSearchId === search.id}
                                onClick={() => setSelectedSearchId(search.id)}
                                color={i % 3 === 0 ? 'bg-[#FFEDE1]' : i % 3 === 1 ? 'bg-[#E0E7FF]' : 'bg-[#FFE4F2]'}
                                icon={i % 3 === 0 ? '🦊' : i % 3 === 1 ? '🐙' : '💎'}
                            />
                        ))}
                    </div>
                </RedesignedCard>
            </div>

            {/* Middle Column: Overview & Analytics */}
            <div className="col-span-12 lg:col-span-6 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                    {/* Projects Overview */}
                    <RedesignedCard title="Hunts Overview" className="aspect-square" action={<ArrowUpRight size={18} className="text-[#A3AED0]" />}>
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="h-48 w-48 rounded-full border-[18px] border-white/5 relative flex items-center justify-center">
                                <div className="h-48 w-48 rounded-full border-[18px] border-transparent border-t-[#3965FF] border-r-[#FF8F39] absolute -inset-[18px]" style={{ transform: 'rotate(45deg)' }} />
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-400">Health</p>
                                    <p className="text-4xl font-bold">92%</p>
                                </div>
                            </div>
                            <div className="mt-8 flex gap-6 text-xs font-bold">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-[#FF8F39]" /> Pending: 14
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-[#3965FF]" /> Completed: 32
                                </div>
                            </div>
                        </div>
                    </RedesignedCard>

                    {/* Activity Graph Placeholder */}
                    <RedesignedCard title="Conversion vs Leads" action={<div className="flex gap-2"><Filter size={18} className="text-[#A3AED0]" /><ArrowUpRight size={18} className="text-[#A3AED0]" /></div>}>
                        <div className="h-full w-full flex flex-col justify-end pt-4">
                            <div className="h-32 w-full flex items-end gap-1.5 px-2">
                                {[40, 65, 45, 90, 60, 85, 45, 75, 55, 95, 40].map((h, i) => (
                                    <div key={i} className="flex-1 bg-gradient-to-t from-[#E0E7FF] to-[#3965FF] rounded-t-sm" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2">
                                <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span>
                            </div>
                        </div>
                    </RedesignedCard>
                </div>

                {/* Lead Analytics / Overview */}
                <RedesignedCard title="Hunt Performance" action={<Filter size={18} className="text-gray-400" />}>
                    <div className="space-y-6 py-2">
                        <PerformanceBar label="Total Leads Extracted" value={85} color="bg-[#4318FF]" total="12,300" />
                        <PerformanceBar label="Missing Websites" value={65} color="bg-[#FF5C8E]" total="8,100" />
                        <PerformanceBar label="Poor Design Found" value={45} color="bg-[#34D399]" total="4,200" />
                    </div>
                </RedesignedCard>

                {/* Dynamic Section: Leads Table */}
                <div className="col-span-12">
                    <LeadsTable searchId={selectedSearchId || '1'} />
                </div>
            </div>

            {/* Right Column: Meetings and Tickets */}
            <div className="col-span-12 lg:col-span-3 space-y-8">
                <RedesignedCard title="Upcoming Meetings" icon={<Calendar size={18} className="text-[#707EAE]" />}>
                    <div className="space-y-4">
                        <MeetingItem title="App Project" time="6:45 PM" type="Meet" />
                        <MeetingItem title="Lead Research" time="8:00 PM" type="Zoom" />
                        <button className="text-xs font-bold text-[#3965FF] mt-4 flex items-center gap-1 hover:text-white transition-colors">See All Meetings <ChevronDown size={14} className="-rotate-90" /></button>
                    </div>
                </RedesignedCard>

                <RedesignedCard title="Open Hunts" icon={<Filter size={18} className="text-[#707EAE]" />}>
                    <div className="space-y-4">
                        <TicketItem name="Jacob Martinez" issue="Needs 3 more niches" avatar="JM" />
                        <TicketItem name="Luke Bell" issue="Site analysis pending" avatar="LB" />
                        <TicketItem name="Connor Mitchell" issue="Webhook failed" avatar="CM" color="bg-red-500/10 border border-red-500/20" />
                    </div>
                </RedesignedCard>
            </div>
        </div>
    )
}

const RedesignedCard = ({ title, children, className = "", action, icon }: { title: string, children: React.ReactNode, className?: string, action?: React.ReactNode, icon?: React.ReactNode }) => (
    <div className={`bg-[#0A0F1C]/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-sm border border-white/10 flex flex-col ${className}`}>
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold tracking-tight">{title}</h2>
            {action ? action : icon ? (
                <button className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/10">
                    {icon}
                </button>
            ) : null}
        </div>
        {children}
    </div>
)

const SearchItem = ({ title, desc, active, onClick, color, icon }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 p-4 rounded-[2rem] transition-all duration-300 ${active ? 'bg-white/10 ring-1 ring-white/20' : 'hover:bg-white/5'
            }`}
    >
        <div className={`h-12 w-12 rounded-2xl ${color} flex items-center justify-center text-xl shadow-sm border border-white/10`}>
            {icon}
        </div>
        <div className="flex-1 text-left overflow-hidden">
            <h3 className="text-sm font-bold truncate leading-tight mb-1 text-white">{title}</h3>
            <p className="text-xs text-gray-400 font-medium truncate">{desc}</p>
        </div>
        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'border-[#3965FF] bg-[#3965FF] text-white' : 'border-white/10 text-transparent'
            }`}>
            <CheckCircle2 size={12} strokeWidth={3} />
        </div>
    </button>
)

const PerformanceBar = ({ label, value, color, total }: any) => (
    <div className="space-y-2">
        <div className="flex justify-between text-sm font-bold">
            <span className="text-gray-400">{label}</span>
            <span>{total}</span>
        </div>
        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${value}%` }} />
        </div>
    </div>
)

const MeetingItem = ({ title, time, type }: any) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-[1.5rem] group cursor-pointer hover:bg-white/10 border border-white/5 transition-all">
        <div className="flex items-center gap-3">
            <div className="text-left">
                <p className="text-xs font-bold text-gray-400 mb-1">My Meetings</p>
                <p className="text-sm font-bold text-white">{title}</p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-xs font-bold text-white mb-1">{time}</p>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                <div className="h-2 w-2 rounded-full bg-[#3965FF]" /> {type}
            </div>
        </div>
    </div>
)

const TicketItem = ({ name, issue, avatar, color = "bg-white/5 border border-white/5" }: any) => (
    <div className={`flex items-center gap-4 p-4 ${color} rounded-[1.5rem] hover:bg-white/10 transition-all cursor-pointer`}>
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#3965FF] to-[#0031E3] flex items-center justify-center text-white text-[10px] font-bold">
            {avatar}
        </div>
        <div className="flex-1 truncate">
            <p className="text-sm font-bold truncate text-white">{name}</p>
            <p className="text-xs text-gray-400 font-medium truncate">{issue}</p>
        </div>
        <button className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-bold shadow-sm border border-white/10 hover:bg-[#3965FF] hover:border-[#3965FF] text-white transition-all">
            Check
        </button>
    </div>
)

export default Dashboard
