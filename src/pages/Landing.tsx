import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
    Crosshair,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Zap,
    Bot,
    ShieldCheck,
    BarChart3,
    ArrowUpRight,
    Search,
    Map
} from 'lucide-react'
import { cn } from '@/lib/utils'

const Landing: React.FC = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-white text-[#1B2559] font-sans overflow-x-hidden selection:bg-[#3965FF]/10 selection:text-[#3965FF]">
            {/* --- Navbar --- */}
            <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between bg-[#030712]/50 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-[2rem] shadow-2xl animate-in slide-in-from-top-10 duration-700">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Crosshair className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-black text-white tracking-tight">WebHunt</span>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        {['Features', 'About Us', 'Pricing', 'Functionalities', 'Integration'].map((link) => (
                            <a
                                key={link}
                                href="#"
                                className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors"
                            >
                                {link}
                            </a>
                        ))}
                    </div>

                    <button
                        onClick={() => navigate('/login')}
                        className="bg-white text-[#030712] px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg hover:shadow-white/20"
                    >
                        Try it free
                    </button>
                </div>
            </nav>

            {/* --- Hero Section --- */}
            <section className="relative pt-48 pb-32 px-6 overflow-hidden bg-[#030712]">
                {/* Background Glow Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 blur-[120px] -z-10 rounded-full animate-pulse duration-[8s]" />
                <div className="absolute -top-40 -left-20 w-[600px] h-[600px] bg-purple-600/20 blur-[150px] -z-10 rounded-full" />
                <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] -z-10 rounded-full" />

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CgkJPGcgc3Ryb2tlPSIjZmZmZmZmMWUiIGZpbGw9Im5vbmUiPgoJCQk8cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIC8+CgkJPC9nPgoJPC9zdmc+')] opacity-[0.03] -z-10" />

                <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full backdrop-blur-md animate-in zoom-in duration-700">
                        <Sparkles size={14} className="text-indigo-400" />
                        <span className="text-[12px] font-bold text-indigo-300 uppercase tracking-widest">AI Powered Lead Generation</span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl md:text-[80px] font-black tracking-tighter leading-[1.05] animate-in fade-in slide-in-from-bottom-10 duration-700 delay-100 text-white drop-shadow-2xl">
                        Your ultimate solution for <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 filter drop-shadow-[0_0_30px_rgba(167,139,250,0.3)]">
                            Business Automation
                        </span>
                    </h1>

                    <p className="text-neutral-400 text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
                        WebHunt eliminates repetitive tasks, integrates with your favorite tools, and boosts productivity—so you can focus on scaling your business.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                        <button
                            onClick={() => navigate('/login')}
                            className="relative group w-full sm:w-auto px-8 py-4 bg-white text-[#030712] font-bold rounded-2xl hover:scale-105 transition-all duration-300"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Start your run <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300 -z-10" />
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                            Get a quick Demo
                        </button>
                    </div>

                    {/* Dashboard Mesh Preview */}
                    <div className="pt-24 relative animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-500">
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#030712] to-transparent z-20 pointer-events-none" />
                        <div className="relative group max-w-5xl mx-auto perspective-1000">
                            {/* Outer Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                            {/* Glass Container */}
                            <div className="relative bg-[#0A0F1C]/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transform-gpu transition-all duration-700 group-hover:-translate-y-2 group-hover:shadow-[0_20px_60px_-10px_rgba(99,102,241,0.2)]">

                                {/* Mock Browser Header */}
                                <div className="h-12 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                    </div>
                                    <div className="flex-1 mx-4">
                                        <div className="w-full max-w-md mx-auto h-6 bg-white/5 rounded-md border border-white/5 flex items-center justify-center">
                                            <span className="text-[10px] text-white/30 font-medium tracking-wider">app.webhunt.ai</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Image Content */}
                                <div className="relative aspect-[16/9]">
                                    <img
                                        src="/dashboard-preview.png"
                                        alt="Dashboard Preview"
                                        className="w-full h-full object-cover opacity-80 mix-blend-screen"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent to-transparent opacity-80" />
                                </div>

                                {/* Data Overlay Floating Card */}
                                <div className="absolute bottom-10 left-10 p-5 bg-[#030712]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl animate-bounce duration-[5s]">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                            <Zap size={20} className="text-indigo-400" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Automation</p>
                                            <p className="text-lg font-black text-white">+84% Speed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Logo Cloud --- */}
            <div className="py-20 border-y border-white/5 relative bg-[#030712]">
                <div className="absolute inset-0 bg-indigo-500/5 blur-3xl" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <p className="text-center text-sm font-bold text-neutral-500 uppercase tracking-[0.2em] mb-12">Trusted by visionaries worldwide</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale group hover:grayscale-0 transition-all duration-700">
                        {['norton', 'bestsmile', 'endpoint', 'BARCLAYS', 'VISUAL STATEMENTS'].map((logo) => (
                            <span key={logo} className="text-2xl font-black tracking-tighter text-white/80 hover:text-white hover:text-shadow-sm transition-colors italic">{logo}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Feature Hero --- */}
            <section className="py-32 px-6 bg-[#030712] relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] -z-10 rounded-full" />

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
                            <span className="text-[12px] font-bold text-indigo-400 uppercase tracking-widest">About WebHunt</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1]">
                            AI-Driven Platform Designed to Automate Workflows
                        </h2>
                        <p className="text-neutral-400 text-lg font-medium leading-relaxed">
                            All in one place! Whether you're a startup, an enterprise, or a freelancer, WebHunt helps you save time, reduce manual tasks, and boost efficiency with cutting-edge AI.
                        </p>
                        <div className="flex flex-wrap items-center gap-4 pt-4">
                            <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/25">
                                What we propose
                            </button>
                            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 backdrop-blur-sm transition-all">
                                Learn more
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] -z-10 rounded-full" />
                        <div className="relative bg-[#0A0F1C]/60 backdrop-blur-xl p-12 rounded-[3.5rem] border border-white/10 shadow-2xl">
                            {/* Visual Representation of 3D Block */}
                            <div className="aspect-square relative flex items-center justify-center">
                                {/* Back glowing card */}
                                <div className="absolute w-[80%] h-[80%] bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-3xl rotate-12 blur-xl" />
                                <div className="absolute w-[80%] h-[80%] bg-[#111827] rounded-3xl rotate-12 shadow-2xl border border-white/10" />

                                {/* Front card */}
                                <div className="absolute w-[80%] h-[80%] bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-3xl -rotate-6 shadow-2xl border border-white/10 flex items-center justify-center group">
                                    <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <Sparkles className="h-24 w-24 text-indigo-400 animate-pulse duration-[3s]" />
                                </div>

                                {/* Floating Stat Chips */}
                                <StatChip className="top-0 -right-4 hover:scale-105 transition-transform" icon={<Bot size={14} />} label="50+ App Integrations" color="bg-purple-500/20 border border-purple-500/30" text="text-purple-400" />
                                <StatChip className="top-1/4 -right-20 hover:scale-105 transition-transform delay-75" icon={<Zap size={14} />} label="2M+ Workflows Executed" color="bg-blue-500/20 border border-blue-500/30" text="text-blue-400" />
                                <StatChip className="bottom-1/4 -right-12 hover:scale-105 transition-transform delay-100" icon={<CheckCircle2 size={14} />} label="95% Satisfaction Rate" color="bg-emerald-500/20 border border-emerald-500/30" text="text-emerald-400" />
                                <StatChip className="bottom-0 -right-4 hover:scale-105 transition-transform delay-150" icon={<BarChart3 size={14} />} label="10k+ Businesses Automated" color="bg-amber-500/20 border border-amber-500/30" text="text-amber-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Bento Benefits --- */}
            <section className="py-24 px-6 bg-[#030712] relative">
                <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] -z-10 rounded-full" />

                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="text-center space-y-6">
                        <h4 className="text-[12px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Why WebHunt?</h4>
                        <h3 className="text-5xl font-black text-white">WebHunt is Built to Fix That</h3>
                        <p className="text-neutral-400 font-medium max-w-lg mx-auto leading-relaxed text-lg">
                            If you're struggling with manual tasks and inefficient workflows, then WebHunt is the upgrade your business needs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-[750px]">
                        {/* Box 1 - Image */}
                        <div className="md:col-span-12 lg:col-span-5 bg-[#0A0F1C] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden group relative">
                            <div className="absolute inset-0 bg-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mixing-blend-overlay" />
                            <img
                                src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2669&auto=format&fit=crop"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                                alt="Efficiency"
                            />
                        </div>

                        {/* Box 2 - Automate */}
                        <div className="md:col-span-6 lg:col-span-4 bg-[#0A0F1C] p-10 rounded-[2.5rem] border border-white/10 shadow-xl flex flex-col justify-between group hover:border-purple-500/30 transition-colors">
                            <div className="h-14 w-14 bg-purple-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                                <Zap size={28} />
                            </div>
                            <div>
                                <h5 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-4">Automate Repetitive Tasks</h5>
                                <p className="text-3xl font-black text-white leading-tight">Save up to 10+ hours weekly</p>
                            </div>
                        </div>

                        {/* Box 3 - No Code */}
                        <div className="md:col-span-6 lg:col-span-3 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 p-10 rounded-[2.5rem] shadow-2xl border border-indigo-500/30 flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/40 rounded-full blur-2xl" />
                            <div className="h-14 w-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-white relative z-10 group-hover:scale-110 transition-transform">
                                <Bot size={28} />
                            </div>
                            <div className="relative z-10">
                                <h5 className="text-[11px] font-bold text-indigo-200 uppercase tracking-widest mb-4">No-code Setup</h5>
                                <p className="text-3xl font-black text-white leading-tight">Drag, drop & automate</p>
                            </div>
                        </div>

                        {/* Box 4 - Integrations */}
                        <div className="md:col-span-12 lg:col-span-7 bg-[#0A0F1C] p-10 rounded-[2.5rem] border border-white/10 shadow-xl flex items-center justify-between group hover:border-blue-500/30 transition-colors">
                            <div className="space-y-4 max-w-sm">
                                <div className="h-12 w-12 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400">
                                    <Map size={24} />
                                </div>
                                <h5 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Seamless Integrations</h5>
                                <p className="text-4xl font-black text-white">Connect securely with Slack, Zapier, Notion & more.</p>
                            </div>
                            <div className="hidden md:flex gap-4 relative">
                                {/* Connecting line */}
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2" />

                                <div className="h-20 w-20 bg-[#111827] rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center group-hover:-translate-y-2 transition-transform relative z-10">
                                    <Zap size={32} className="text-blue-400" />
                                </div>
                                <div className="h-20 w-20 bg-[#111827] rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center group-hover:-translate-y-2 transition-transform delay-100 relative z-10">
                                    <Search size={32} className="text-indigo-400" />
                                </div>
                            </div>
                        </div>

                        {/* Box 5 - Security */}
                        <div className="md:col-span-12 lg:col-span-5 bg-[#0A0F1C] p-10 rounded-[2.5rem] border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.05)] flex flex-col justify-center relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full" />
                            <div className="relative z-10">
                                <div className="h-14 w-14 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mb-8 group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={28} />
                                </div>
                                <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-4">Enterprise-grade security</h5>
                                <p className="text-4xl font-black text-white">99.99% uptime with end-to-end encryption.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Steps Section --- */}
            <section className="py-32 px-6 bg-[#030712]">
                <div className="max-w-7xl mx-auto bg-[#0A0F1C] border border-white/10 rounded-[4rem] p-12 md:p-24 flex flex-col lg:flex-row gap-20 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 blur-[150px] pointer-events-none rounded-full" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] pointer-events-none rounded-full" />

                    <div className="flex-1 space-y-8 relative z-10">
                        <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
                            <span className="text-[12px] font-bold text-indigo-400 uppercase tracking-widest">How WebHunt Works</span>
                        </div>
                        <h2 className="text-6xl md:text-7xl font-black text-white leading-[1.1]">Automate In <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">3 Steps!</span></h2>
                        <p className="text-neutral-400 text-lg font-medium leading-relaxed max-w-md">
                            WebHunt makes automation effortless, allowing you to streamline tasks without coding. Here's how it works-
                        </p>
                        <div className="flex flex-wrap items-center gap-4 pt-4">
                            <button className="px-8 py-4 bg-white text-[#030712] font-bold rounded-2xl hover:scale-105 transition-all shadow-xl hover:shadow-white/20">
                                Start Now
                            </button>
                            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 backdrop-blur-sm transition-all">
                                Learn more
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 space-y-6 relative z-10">
                        <WorkflowStep number="Step 1" title="Choose your apps & triggers" message="Select from 50+ integrations, and pick a trigger event (e.g., 'New lead found')." />
                        <WorkflowStep number="Step 2" title="Define actions & conditions" message="Add actions and use conditional logic (If X happens, do Y; otherwise, do Z)." />
                        <WorkflowStep number="Step 3" title="Activate & monitor in real-time" message="Your automation is live! Track performance in your global dashboard." />
                    </div>
                </div>
            </section>

            {/* --- Features Grid --- */}
            <section className="py-32 px-6 bg-[#030712] relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[150px] pointer-events-none rounded-full" />
                <div className="max-w-7xl mx-auto space-y-20 relative z-10">
                    <div className="text-center space-y-6">
                        <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
                            <span className="text-[12px] font-bold text-indigo-400 uppercase tracking-widest">Toolbox</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-white">Features That Set us Apart</h2>
                        <p className="text-neutral-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                            WebHunt goes beyond basic automation – our powerful AI-driven workflows, seamless integrations, and enterprise-grade security make automation effortless and efficient.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            title="AI-Powered Automation"
                            desc="Automate complex workflows with intelligent AI-driven decision-making."
                            img="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2664&auto=format&fit=crop"
                        />
                        <FeatureCard
                            title="Real-Time Analytics"
                            desc="Monitor live data, track KPIs, and make data-driven decisions."
                            img="/dashboard-preview.png"
                        />
                        <FeatureCard
                            title="Multi-App Workflows"
                            desc="Seamlessly connect your favorite apps, sync data effortlessly."
                            img="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2564&auto=format&fit=crop"
                        />
                        <FeatureCard
                            title="Smart Error Handling"
                            desc="AI-powered monitoring ensures seamless workflow execution."
                            img="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2670&auto=format&fit=crop"
                        />
                        <FeatureCard
                            title="Enterprise Security"
                            desc="Enjoy enterprise-grade security with end-to-end encryption."
                            img="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop"
                        />
                        <FeatureCard
                            title="Lightning-Fast Execution"
                            desc="Experience ultra-fast automation with AI-powered optimization."
                            img="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop"
                        />
                    </div>

                    <div className="flex justify-center gap-4 pt-10">
                        <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/25">
                            Talk to expert
                        </button>
                        <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 backdrop-blur-sm transition-all">
                            Explore all features
                        </button>
                    </div>
                </div>
            </section>

            {/* --- Footer --- */}
            <footer className="py-16 px-6 border-t border-white/10 bg-[#030712]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                            <Crosshair className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-black text-white">WebHunt</span>
                    </div>

                    <div className="flex items-center gap-10 text-sm font-bold text-neutral-500">
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Contacts</a>
                    </div>

                    <p className="text-sm font-medium text-neutral-600">© 2026 WebHunt Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

const StatChip = ({ className, icon, label, color, text }: any) => (
    <div className={cn("absolute px-6 py-4 rounded-2xl flex items-center gap-4 bg-[#0A0F1C]/80 shadow-2xl border border-white/10 backdrop-blur-xl animate-in fade-in zoom-in slide-in-from-right-10 duration-1000", className)}>
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", color, text)}>
            {icon}
        </div>
        <p className="text-sm font-black whitespace-nowrap text-white">{label}</p>
    </div>
)

const WorkflowStep = ({ number, title, message }: { number: string, title: string, message: string }) => (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl group hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-500 cursor-default">
        <div className="flex items-start gap-6">
            <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-black rounded-lg uppercase tracking-widest">{number}</span>
            <div className="space-y-2">
                <h4 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">{title}</h4>
                <p className="text-neutral-400 text-sm leading-relaxed">{message}</p>
            </div>
        </div>
    </div>
)

const FeatureCard = ({ title, desc, img }: { title: string, desc: string, img: string }) => (
    <div className="bg-[#0A0F1C] border border-white/10 rounded-[2.5rem] p-4 group transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30">
        <div className="aspect-[4/3] rounded-[2rem] overflow-hidden mb-6 relative">
            <div className="absolute inset-0 bg-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mixing-blend-overlay" />
            <img src={img} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" alt={title} />
        </div>
        <div className="px-6 pb-6 space-y-3">
            <h5 className="text-xl font-black text-white">{title}</h5>
            <p className="text-sm font-medium text-neutral-400 leading-relaxed">{desc}</p>
            <button className="flex items-center gap-2 text-sm font-bold text-indigo-400 pt-2 group-hover:translate-x-1 group-hover:text-indigo-300 transition-all">
                Learn more <ArrowUpRight size={16} />
            </button>
        </div>
    </div>
)

export default Landing
