import React from 'react'
import { Sparkles, Timer, Rocket, Bell, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ComingSoon: React.FC = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-[60vh] flex items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="max-w-2xl w-full text-center space-y-8">
                {/* Visual Ornament */}
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#3965FF] to-[#0031E3] blur-3xl opacity-20 animate-pulse" />
                    <div className="relative bg-[#0A0F1C]/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl border border-white/10 flex items-center justify-center">
                        <Timer className="h-16 w-16 text-[#3965FF]" />
                    </div>
                    <div className="absolute -top-4 -right-4 h-12 w-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-4xl font-extrabold text-white tracking-tight">Feature Coming Soon</h2>
                    <p className="text-gray-400 text-lg font-medium max-w-md mx-auto leading-relaxed">
                        We're currently polishing the AI engine for this module. Our team is working hard to bring you the best experience!
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all shadow-sm"
                    >
                        <ArrowLeft size={18} /> Go Back
                    </button>
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#3965FF] text-white font-bold rounded-2xl hover:bg-[#3965FF]/80 transition-all shadow-xl shadow-[#3965FF]/20">
                        <Bell size={18} /> Notify Me
                    </button>
                </div>

                {/* Road Map Preview */}
                <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-4 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-default">
                    <ProgressStage icon={<Rocket size={16} />} label="Development" status="In Progress" />
                    <ProgressStage icon={<Sparkles size={16} />} label="AI Training" status="Queued" />
                    <ProgressStage icon={<Bell size={16} />} label="Public Beta" status="April 2026" />
                </div>
            </div>
        </div>
    )
}

const ProgressStage = ({ icon, label, status }: { icon: React.ReactNode, label: string, status: string }) => (
    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-left">
        <div className="flex items-center gap-2 text-[#3965FF] mb-1">
            {icon}
            <span className="text-[10px] font-extrabold uppercase tracking-widest">{label}</span>
        </div>
        <p className="text-sm font-bold text-white">{status}</p>
    </div>
)

export default ComingSoon
