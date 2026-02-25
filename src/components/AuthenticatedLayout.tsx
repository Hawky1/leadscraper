import React from 'react'
import { useAuth } from '@/components/AuthProvider'
import { isSupabaseConfigured } from '@/lib/supabase'
import { Navigate, Outlet, NavLink, useLocation } from 'react-router-dom'
import NotificationDropdown from './NotificationDropdown'
import {
    LayoutGrid,
    Search,
    Settings,
    Crosshair,
    HelpCircle,
    Map,
    Terminal,
    PhoneCall,
    Bot,
    Mic2,
    Film,
    AppWindow
} from 'lucide-react'

const AuthenticatedLayout: React.FC = () => {
    const { user, loading, signOut } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-muted-foreground font-medium">Loading WebHunt...</p>
                </div>
            </div>
        )
    }

    const isDemoMode = !isSupabaseConfigured
    if (!user && !isDemoMode) {
        return <Navigate to="/login" replace />
    }

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/dashboard': return 'Global Dashboard'
            case '/lead-gen': return 'Lead Generation'
            case '/roadmap': return 'AI Agency Roadmap'
            case '/prompt-builder': return 'Website Prompt Builder'
            case '/objection-handling': return 'Objection Handling'
            case '/gpts': return 'Custom GPTs'
            case '/voice-agent': return 'AI Voice Agent'
            case '/sora': return 'Sora 2 Film'
            case '/app-builder': return 'AI App Builder'
            case '/help': return 'Help Center'
            case '/settings': return 'Account Settings'
            default: return 'Project Dashboard'
        }
    }

    return (
        <div className="flex h-screen bg-[#F4F7FE] text-[#1B2559]">
            {/* Expanding Sidebar */}
            <aside className="group w-[100px] hover:w-[300px] border-r border-[#E9EDF7] bg-white hidden md:flex flex-col items-start py-8 z-50 transition-all duration-300 ease-in-out overflow-y-auto no-scrollbar overflow-x-hidden">
                <NavLink to="/dashboard" className="flex items-center gap-4 px-6 mb-10 shrink-0 outline-none">
                    <div className="h-12 w-12 rounded-xl bg-black flex items-center justify-center shadow-lg shadow-black/10 shrink-0">
                        <Crosshair className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">WebHunt</span>
                </NavLink>

                <nav className="flex-1 flex flex-col items-start gap-3 w-full px-5">
                    <SidebarIcon to="/dashboard" icon={<LayoutGrid size={22} />} label="Dashboard" />
                    <SidebarIcon to="/lead-gen" icon={<Crosshair size={22} />} label="Lead Generation" />
                    <SidebarIcon to="/roadmap" icon={<Map size={22} />} label="AI Agency Roadmap" />
                    <SidebarIcon to="/prompt-builder" icon={<Terminal size={22} />} label="Website Prompt Builder" />
                    <SidebarIcon to="/objection-handling" icon={<PhoneCall size={22} />} label="Cold Call Objection Handling" />
                    <SidebarIcon to="/gpts" icon={<Bot size={22} />} label="Custom GPTs" />
                    <SidebarIcon to="/voice-agent" icon={<Mic2 size={22} />} label="AI Voice Agent Builder" />
                    <SidebarIcon to="/sora" icon={<Film size={22} />} label="Sora 2 Film Prompt Generator" />
                    <SidebarIcon to="/app-builder" icon={<AppWindow size={22} />} label="AI App Builder Prompt Generator" />
                </nav>

                <div className="flex flex-col items-start gap-3 mt-8 shrink-0 w-full px-5">
                    <SidebarIcon to="/help" icon={<HelpCircle size={22} />} label="Help" />
                    <SidebarIcon to="/settings" icon={<Settings size={22} />} label="Settings" />
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="h-[100px] flex items-center justify-between px-8 bg-transparent shrink-0">
                    <div>
                        <p className="text-sm font-medium text-[#707EAE]">Manage and track your projects</p>
                        <h1 className="text-[34px] font-bold leading-tight">{getPageTitle()}</h1>
                    </div>

                    <div className="flex items-center gap-4 bg-white/70 backdrop-blur-xl p-2.5 rounded-[30px] shadow-sm border border-white/50">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A3AED0]" />
                            <input
                                type="text"
                                placeholder="Search Task, Meeting, Projects..."
                                className="pl-11 pr-4 py-3 bg-[#F4F7FE] rounded-full text-sm font-medium outline-none w-[280px] border-none focus:ring-2 focus:ring-[#3965FF]/20 transition-all font-medium"
                            />
                        </div>

                        <NotificationDropdown />
                        <HeaderIcon icon={<HelpCircle size={18} />} />
                        <HeaderIcon icon={<Settings size={18} />} />

                        <div className="flex items-center gap-3 pl-2 pr-1 ml-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold">{isDemoMode ? 'John Smith' : (user?.email?.split('@')[0])}</p>
                                <p className="text-[11px] font-medium text-[#707EAE]">{isDemoMode ? 'Project manager' : 'WebHunt Pro'}</p>
                            </div>
                            <div className="h-[43px] w-[43px] rounded-full bg-gradient-to-tr from-[#3965FF] to-[#0031E3] flex items-center justify-center text-white font-bold text-sm shadow-md">
                                <img
                                    src="https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1974&auto=format&fit=crop"
                                    className="h-full w-full rounded-full object-cover"
                                    alt="Avatar"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 overflow-auto px-8 pb-8">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

const SidebarIcon = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 w-full group/btn ${isActive
            ? 'bg-[#1B2559] text-white shadow-xl shadow-black/10'
            : 'text-[#A3AED0] hover:text-[#1B2559] hover:bg-[#F4F7FE]'
            }`}
    >
        <div className="shrink-0 w-6 flex justify-center">
            {icon}
        </div>
        <span className="text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
            {label}
        </span>
    </NavLink>
)

const HeaderIcon = ({ icon }: { icon: React.ReactNode }) => (
    <button className="p-2.5 text-[#A3AED0] hover:text-[#1B2559] transition-colors rounded-full hover:bg-[#F4F7FE]">
        {icon}
    </button>
)

export default AuthenticatedLayout
