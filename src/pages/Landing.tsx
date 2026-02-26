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
                <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/70 backdrop-blur-2xl border border-white/50 px-6 py-3 rounded-[2.5rem] shadow-xl shadow-black/5 animate-in slide-in-from-top-10 duration-700">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-black flex items-center justify-center shadow-lg shadow-black/10">
                            <Crosshair className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight">WebHunt</span>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        {['Features', 'About Us', 'Pricing', 'Functionalities', 'Integration'].map((link) => (
                            <a
                                key={link}
                                href="#"
                                className="text-sm font-bold text-[#707EAE] hover:text-[#1B2559] transition-colors"
                            >
                                {link}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-7 py-3 border border-[#E9EDF7] text-[#1B2559] font-bold text-sm rounded-2xl hover:bg-[#F4F7FE] transition-all"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-[#1B2559] text-white px-7 py-3 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
                        >
                            Try it for free
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- Hero Section --- */}
            <section className="relative pt-48 pb-32 px-6 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-to-tr from-[#3965FF]/10 to-[#E9EDF7]/30 blur-[120px] -z-10 animate-pulse duration-[10s]" />
                <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-[#3965FF]/5 blur-[100px] -z-10" />

                <div className="max-w-5xl mx-auto text-center space-y-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4F7FE] border border-[#E9EDF7] rounded-full animate-in zoom-in duration-700">
                        <Sparkles size={14} className="text-[#3965FF]" />
                        <span className="text-[12px] font-extrabold text-[#3965FF] uppercase tracking-wider">AI Powered Lead Generation</span>
                    </div>

                    <h1 className="text-6xl md:text-[86px] font-black tracking-tight leading-[0.95] animate-in fade-in slide-in-from-bottom-10 duration-700 delay-100">
                        Your ultimate solution for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-tr from-[#3965FF] to-[#011559]">Business Automation</span>
                    </h1>

                    <p className="text-[#707EAE] text-xl font-medium max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
                        WebHunt eliminates repetitive tasks, integrates with your favorite tools, and boosts productivity—so you can do more in less time.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto px-10 py-5 bg-[#1B2559] text-white font-bold rounded-[1.5rem] hover:scale-105 transition-all shadow-2xl shadow-black/20"
                        >
                            Start your run
                        </button>
                        <button className="w-full sm:w-auto px-10 py-5 bg-white border border-[#E9EDF7] text-[#1B2559] font-bold rounded-[1.5rem] hover:bg-[#F4F7FE] transition-all shadow-sm">
                            Get a quick Demo
                        </button>
                    </div>

                    {/* Dashboard Mesh Preview */}
                    <div className="pt-20 relative animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-500">
                        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
                        <div className="relative group max-w-6xl mx-auto">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#3965FF] to-[#011559] rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-white border border-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                                    alt="Dashboard Preview"
                                    className="w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                                />
                                {/* Detail Overlays */}
                                <div className="absolute top-10 left-10 p-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-white shadow-lg animate-bounce duration-[4s]">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                            <Zap size={16} className="text-green-500" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-bold text-[#A3AED0] uppercase">Efficiency</p>
                                            <p className="text-sm font-black">+42% Growth</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Logo Cloud --- */}
            <div className="py-20 border-y border-[#F4F7FE]">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-sm font-bold text-[#A3AED0] uppercase tracking-widest mb-12">Trusted by visionaries worldwide</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
                        {['norton', 'bestsmile', 'endpoint', 'BARCLAYS', 'VISUAL STATEMENTS'].map((logo) => (
                            <span key={logo} className="text-2xl font-black tracking-tighter text-[#1B2559] italic">{logo}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Feature Hero --- */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <div className="inline-block px-4 py-1.5 bg-[#F4F7FE] border border-[#E9EDF7] rounded-lg">
                            <span className="text-[12px] font-extrabold text-[#707EAE] uppercase tracking-widest">About WebHunt</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black tracking-tight text-[#1B2559]">
                            AI-Driven Platform Designed to Automate Workflows
                        </h2>
                        <p className="text-[#707EAE] text-lg font-medium leading-relaxed">
                            All in one place! Whether you're a startup, an enterprise, or a freelancer, WebHunt helps you save time, reduce manual tasks, and boost efficiency.
                        </p>
                        <div className="flex items-center gap-4 pt-4">
                            <button className="px-8 py-4 bg-[#1B2559] text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-black/10">
                                What we propose
                            </button>
                            <button className="px-8 py-4 bg-white border border-[#E9EDF7] text-[#1B2559] font-bold rounded-2xl hover:bg-[#F4F7FE] transition-all">
                                Learn more
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-[#3965FF]/10 blur-[100px] -z-10" />
                        <div className="relative bg-gradient-to-br from-[#F4F7FE] to-white p-12 rounded-[3.5rem] border border-white shadow-2xl">
                            {/* Visual Representation of 3D Block */}
                            <div className="aspect-square relative flex items-center justify-center">
                                <div className="absolute w-[80%] h-[80%] bg-white rounded-3xl rotate-12 shadow-2xl border border-white/50" />
                                <div className="absolute w-[80%] h-[80%] bg-[#1B2559] rounded-3xl -rotate-6 shadow-2xl flex items-center justify-center">
                                    <Sparkles className="h-24 w-24 text-[#3965FF]" />
                                </div>

                                {/* Floating Stat Chips */}
                                <StatChip className="top-0 -right-4" icon={<Bot size={14} />} label="50+ App Integrations" color="bg-purple-100" text="text-purple-600" />
                                <StatChip className="top-1/4 -right-20" icon={<Zap size={14} />} label="2M+ Workflows Executed" color="bg-blue-100" text="text-blue-600" />
                                <StatChip className="bottom-1/4 -right-12" icon={<CheckCircle2 size={14} />} label="95% Satisfaction Rate" color="bg-green-100" text="text-green-600" />
                                <StatChip className="bottom-0 -right-4" icon={<BarChart3 size={14} />} label="10k+ Businesses Automated" color="bg-amber-100" text="text-amber-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Bento Benefits --- */}
            <section className="py-24 px-6 bg-[#F4F7FE]/30">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h4 className="text-[12px] font-extrabold text-[#3965FF] uppercase tracking-[0.2em]">Why WebHunt?</h4>
                        <h3 className="text-5xl font-black text-[#1B2559]">WebHunt is Built to Fix That</h3>
                        <p className="text-[#707EAE] font-medium max-w-lg mx-auto leading-relaxed">
                            If you're struggling with manual tasks and inefficient workflows, then WebHunt is for you!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[700px]">
                        <div className="md:col-span-12 lg:col-span-5 bg-white rounded-[2.5rem] border border-white shadow-sm overflow-hidden group">
                            <img
                                src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2669&auto=format&fit=crop"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                alt="Efficiency"
                            />
                        </div>

                        <div className="md:col-span-6 lg:col-span-4 bg-white p-10 rounded-[2.5rem] border border-white shadow-sm flex flex-col justify-between">
                            <div className="h-12 w-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h5 className="text-[10px] font-extrabold text-[#A3AED0] uppercase tracking-widest mb-4">Automate Repetitive Tasks</h5>
                                <p className="text-3xl font-black text-[#1B2559] leading-tight">Save maximum 10+ hours weekly</p>
                            </div>
                        </div>

                        <div className="md:col-span-6 lg:col-span-3 bg-[#1B2559] p-10 rounded-[2.5rem] shadow-2xl flex flex-col justify-between">
                            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#3965FF]">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h5 className="text-[10px] font-extrabold text-[#A3AED0] uppercase tracking-widest mb-4">No-code Setup</h5>
                                <p className="text-3xl font-black text-white leading-tight">Drag, drop, and automate effortlessly</p>
                            </div>
                        </div>

                        <div className="md:col-span-12 lg:col-span-7 bg-white p-10 rounded-[2.5rem] border border-white shadow-sm flex items-center justify-between group">
                            <div className="space-y-4">
                                <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#3965FF]">
                                    <Map size={20} />
                                </div>
                                <h5 className="text-[10px] font-extrabold text-[#A3AED0] uppercase tracking-widest">Seamless Integrations</h5>
                                <p className="text-4xl font-black text-[#1B2559]">Connect with Slack, Zapier, Notion, and more.</p>
                            </div>
                            <div className="hidden md:flex gap-4">
                                <div className="h-16 w-16 bg-[#F4F7FE] rounded-2xl border border-white shadow-sm flex items-center justify-center group-hover:animate-bounce">
                                    <Zap size={24} className="text-[#3965FF]" />
                                </div>
                                <div className="h-16 w-16 bg-[#F4F7FE] rounded-2xl border border-white shadow-sm flex items-center justify-center group-hover:animate-bounce delay-100">
                                    <Search size={24} className="text-[#3965FF]" />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-12 lg:col-span-5 bg-white p-10 rounded-[2.5rem] border border-[#34D399]/30 shadow-[0_20px_40px_-10px_rgba(52,211,153,0.1)] flex flex-col justify-center">
                            <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center text-[#34D399] mb-6">
                                <ShieldCheck size={24} />
                            </div>
                            <h5 className="text-[10px] font-extrabold text-[#34D399] uppercase tracking-widest mb-4">Enterprise-grade security</h5>
                            <p className="text-4xl font-black text-[#1B2559]">99.99% uptime and encrypted data.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Steps Section --- */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto bg-[#1B2559] rounded-[4rem] p-12 md:p-24 flex flex-col lg:flex-row gap-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#3965FF]/20 blur-[150px] pointer-events-none" />

                    <div className="flex-1 space-y-8 relative z-10">
                        <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                            <span className="text-[12px] font-extrabold text-white/50 uppercase tracking-widest">How WebHunt Works</span>
                        </div>
                        <h2 className="text-6xl md:text-7xl font-black text-white leading-tight">Automate In <br /> 3 Steps!</h2>
                        <p className="text-white/60 text-lg font-medium leading-relaxed max-w-md">
                            WebHunt makes automation effortless, allowing you to streamline tasks without coding. Here's how it works-
                        </p>
                        <div className="flex items-center gap-4 pt-4">
                            <button className="px-8 py-4 bg-[#3965FF] text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-[#3965FF]/20">
                                Start Now
                            </button>
                            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
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
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto space-y-20">
                    <div className="text-center space-y-6">
                        <div className="inline-block px-4 py-1.5 bg-[#F4F7FE] border border-[#E9EDF7] rounded-lg">
                            <span className="text-[12px] font-extrabold text-[#707EAE] uppercase tracking-widest">Toolbox</span>
                        </div>
                        <h2 className="text-6xl font-black text-[#1B2559]">Features That Set us Apart</h2>
                        <p className="text-[#707EAE] text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                            WebHunt goes beyond basic automation – our powerful AI-driven workflows, seamless integrations, and enterprise-grade security make automation effortless and efficient.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button className="px-8 py-4 bg-[#1B2559] text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-black/10">
                                Talk to expert
                            </button>
                            <button className="px-8 py-4 bg-white border border-[#E9EDF7] text-[#1B2559] font-bold rounded-2xl hover:bg-[#F4F7FE] transition-all">
                                Explore all features
                            </button>
                        </div>
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
                            img="https://images.unsplash.com/photo-1551288049-bbbda5366991?q=80&w=2670&auto=format&fit=crop"
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
                </div>
            </section>

            {/* --- Footer --- */}
            <footer className="py-20 px-6 border-t border-[#F4F7FE]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-black flex items-center justify-center">
                            <Crosshair className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-black">WebHunt</span>
                    </div>

                    <div className="flex items-center gap-10 text-sm font-bold text-[#707EAE]">
                        <a href="#" className="hover:text-[#1B2559]">Terms</a>
                        <a href="#" className="hover:text-[#1B2559]">Privacy</a>
                        <a href="#" className="hover:text-[#1B2559]">Contacts</a>
                    </div>

                    <p className="text-sm font-medium text-[#A3AED0]">© 2026 WebHunt Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

const StatChip = ({ className, icon, label, color, text }: any) => (
    <div className={cn("absolute px-6 py-4 rounded-2xl flex items-center gap-4 bg-white shadow-2xl border border-white/50 backdrop-blur-xl animate-in fade-in zoom-in slide-in-from-right-10 duration-1000", className)}>
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", color, text)}>
            {icon}
        </div>
        <p className="text-sm font-black whitespace-nowrap text-[#1B2559]">{label}</p>
    </div>
)

const WorkflowStep = ({ number, title, message }: { number: string, title: string, message: string }) => (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl group hover:bg-white/10 transition-all duration-500">
        <div className="flex items-start gap-6">
            <span className="px-3 py-1 bg-[#3965FF] text-white text-[10px] font-black rounded-lg uppercase tracking-widest">{number}</span>
            <div className="space-y-2">
                <h4 className="text-xl font-bold text-white">{title}</h4>
                <p className="text-white/40 text-sm leading-relaxed">{message}</p>
            </div>
        </div>
    </div>
)

const FeatureCard = ({ title, desc, img }: { title: string, desc: string, img: string }) => (
    <div className="bg-white border border-[#E9EDF7] rounded-[3rem] p-4 group transition-all duration-500 hover:shadow-2xl hover:shadow-black/5">
        <div className="aspect-[4/3] rounded-[2rem] overflow-hidden mb-6">
            <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt={title} />
        </div>
        <div className="px-6 pb-6 space-y-3">
            <h5 className="text-2xl font-black text-[#1B2559]">{title}</h5>
            <p className="text-sm font-medium text-[#707EAE] leading-relaxed">{desc}</p>
            <button className="flex items-center gap-2 text-sm font-bold text-[#3965FF] pt-2 hover:translate-x-1 transition-transform">
                Learn more <ArrowUpRight size={16} />
            </button>
        </div>
    </div>
)

export default Landing
