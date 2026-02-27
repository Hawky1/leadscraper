import React, { useState } from 'react'
import {
    ChevronRight,
    Target,
    Rocket,
    Building2,
    GraduationCap,
    Wallet,
    Clock,
    CheckCircle2,
    ArrowLeft,
    Sparkles,
    Lightbulb,
    Flag,
    PieChart,
    Users,
    Loader2
} from 'lucide-react'
import { supabase, isSupabaseConfigured, createNotification } from '@/lib/supabase'
import { cn } from '@/lib/utils'

type GoalType = 'quick-cash' | 'empire' | 'ground-up'

interface RoadmapForm {
    targetNiche: string
    goal: GoalType | ''
    experience: string
    budget: string
    timeCommitment: string
}

const Roadmap: React.FC = () => {
    const [step, setStep] = useState(1)
    const [form, setForm] = useState<RoadmapForm>({
        targetNiche: '',
        goal: '',
        experience: '',
        budget: '',
        timeCommitment: ''
    })
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedPlan, setGeneratedPlan] = useState<any>(null)

    const nextStep = () => setStep(s => s + 1)
    const prevStep = () => setStep(s => s - 1)

    const handleGoalSelect = (goal: GoalType) => {
        setForm(f => ({ ...f, goal }))
        nextStep()
    }

    const handleGenerate = async () => {
        setIsGenerating(true)

        // Simulating AI generation
        await new Promise(r => setTimeout(r, 2500))

        const mockPlan = {
            title: `AI Agency Growth Plan: ${form.targetNiche}`,
            phases: [
                {
                    title: 'Phase 1: Foundation & Lead Gen',
                    tasks: [
                        'Define core AI offer (e.g. Chatbot for Customer Support)',
                        'Build high-converting landing page for the niche',
                        'Setup automated outreach system (WebHunt integration)'
                    ]
                },
                {
                    title: 'Phase 2: Client Acquisition',
                    tasks: [
                        'Run first outbound campaign to 100 targets',
                        'Schedule 5 demo calls',
                        'Onboard first Beta client at 50% discount'
                    ]
                },
                {
                    title: 'Phase 3: Scaling & Retainers',
                    tasks: [
                        'Implement AI workflow for client #1',
                        'Gather case study and testimonials',
                        'Upgrade to high-ticket retainer $(2.5k+/mo)'
                    ]
                }
            ]
        }

        setGeneratedPlan(mockPlan)
        setIsGenerating(false)
        setStep(5)

        // Save to Supabase if configured
        if (isSupabaseConfigured) {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    await (supabase as any).from('roadmaps').insert([{
                        user_id: user.id,
                        target_niche: form.targetNiche,
                        goal: form.goal,
                        experience_level: form.experience,
                        budget: form.budget,
                        time_commitment: form.timeCommitment,
                        generated_plan: mockPlan
                    }])
                }
            } catch (err) {
                console.error('Error saving roadmap:', err)
            }
        }

        // Trigger notification
        createNotification({
            title: 'Roadmap Generated',
            message: `Your business plan for "${form.targetNiche}" is ready.`,
            type: 'success',
            link: '/roadmap'
        })
    }

    return (
        <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Progress Header */}
            {step < 5 && (
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#707EAE] uppercase tracking-wider">Step {step} of 4</span>
                        <span className="text-xs font-bold text-[#3965FF]">{Math.round((step / 4) * 100)}% Complete</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#3965FF] to-[#0031E3] transition-all duration-500 ease-out"
                            style={{ width: `${(step / 4) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Step 1: Niche */}
            {step === 1 && (
                <div className="bg-[#0A0F1C]/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-sm border border-white/10">
                    <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                        <Target className="h-8 w-8 text-[#FF5C8E]" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">What's your target niche?</h2>
                    <p className="text-gray-400 mb-8 font-medium">Entering a specific niche helps the AI generate a roadmap tailored to real market needs.</p>

                    <div className="relative group">
                        <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-[#3965FF] transition-colors" />
                        <input
                            type="text"
                            placeholder="e.g. Real Estate, Dentists, Lawyers..."
                            value={form.targetNiche}
                            onChange={e => setForm(f => ({ ...f, targetNiche: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 focus:border-[#3965FF] focus:bg-white/10 text-white rounded-2xl py-4 pl-14 pr-6 outline-none text-lg font-bold transition-all placeholder:text-gray-500"
                        />
                    </div>

                    <div className="mt-10 flex justify-end">
                        <button
                            disabled={!form.targetNiche.trim()}
                            onClick={nextStep}
                            className="flex items-center gap-2 bg-[#3965FF] text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-[#3965FF]/20"
                        >
                            Continue <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Goal Selection */}
            {step === 2 && (
                <div className="space-y-6">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-white">What's your primary goal?</h2>
                        <p className="text-gray-400 mt-2 font-medium">Choose the path that best fits your current stage.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <GoalCard
                            title="Quick Cash"
                            description="Fastest time to first dollars. Productized, minimal scope, low friction."
                            icon={<Rocket className="h-6 w-6 text-[#34D399]" />}
                            bg="bg-[#34D399]/10 border border-[#34D399]/20"
                            onClick={() => handleGoalSelect('quick-cash')}
                        />
                        <GoalCard
                            title="Build an Empire"
                            description="Recurring retainer, roadmap of automations, higher pricing, durability."
                            icon={<Building2 className="h-6 w-6 text-[#3965FF]" />}
                            bg="bg-[#3965FF]/10 border border-[#3965FF]/20"
                            onClick={() => handleGoalSelect('empire')}
                        />
                        <GoalCard
                            title="Start from Ground Up"
                            description="Ultra-beginner setup, lowest complexity, safe first client."
                            icon={<GraduationCap className="h-6 w-6 text-[#FEB2B2]" />}
                            bg="bg-[#FEB2B2]/10 border border-[#FEB2B2]/20"
                            onClick={() => handleGoalSelect('ground-up')}
                        />
                    </div>

                    <button onClick={prevStep} className="flex items-center gap-2 text-gray-400 font-bold hover:text-white transition-colors pt-4">
                        <ArrowLeft size={18} /> Go Back
                    </button>
                </div>
            )}

            {/* Step 3: Details */}
            {step === 3 && (
                <div className="bg-[#0A0F1C]/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-sm border border-white/10">
                    <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                        <Sparkles className="h-8 w-8 text-[#3965FF]" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Almost there!</h2>
                    <p className="text-gray-400 mb-10 font-medium">A few more details to calibrate your business plan.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold ml-1 text-white">Experience Level</label>
                            <div className="relative">
                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <select
                                    value={form.experience}
                                    onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none font-bold text-sm appearance-none focus:border-[#3965FF] text-white"
                                >
                                    <option value="" className="bg-[#0A0F1C] text-white">Select Level</option>
                                    <option value="beginner" className="bg-[#0A0F1C] text-white">Total Beginner</option>
                                    <option value="intermediate" className="bg-[#0A0F1C] text-white">Some Tech/Sales Skill</option>
                                    <option value="advanced" className="bg-[#0A0F1C] text-white">Expert / Agency Pro</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold ml-1 text-white">Initial Budget</label>
                            <div className="relative">
                                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <select
                                    value={form.budget}
                                    onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none font-bold text-sm appearance-none focus:border-[#3965FF] text-white"
                                >
                                    <option value="" className="bg-[#0A0F1C] text-white">Select Budget</option>
                                    <option value="zero" className="bg-[#0A0F1C] text-white">$0 (Sweat Equity)</option>
                                    <option value="low" className="bg-[#0A0F1C] text-white">Under $500</option>
                                    <option value="high" className="bg-[#0A0F1C] text-white">$500 - $2,000+</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3 md:col-span-2">
                            <label className="text-sm font-bold ml-1 text-white">Weekly Time Commitment</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <select
                                    value={form.timeCommitment}
                                    onChange={e => setForm(f => ({ ...f, timeCommitment: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none font-bold text-sm appearance-none focus:border-[#3965FF] text-white"
                                >
                                    <option value="" className="bg-[#0A0F1C] text-white">Select Hours</option>
                                    <option value="part-time" className="bg-[#0A0F1C] text-white">5-10 Hours (Side Hustle)</option>
                                    <option value="half-time" className="bg-[#0A0F1C] text-white">10-25 Hours</option>
                                    <option value="full-time" className="bg-[#0A0F1C] text-white">40+ Hours (Full Power)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex items-center justify-between">
                        <button onClick={prevStep} className="flex items-center gap-2 text-gray-400 font-bold hover:text-white transition-colors">
                            <ArrowLeft size={18} /> Go Back
                        </button>
                        <button
                            disabled={!form.experience || !form.budget || !form.timeCommitment}
                            onClick={nextStep}
                            className="bg-[#3965FF] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#0031E3] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-[#3965FF]/20"
                        >
                            Review & Generate
                        </button>
                    </div>
                </div>
            )}

            {/* Step 4: Summary & Generate */}
            {step === 4 && (
                <div className="bg-[#0A0F1C]/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-sm border border-white/10 text-center">
                    <div className="h-20 w-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                        <Rocket className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Launch?</h2>
                    <p className="text-gray-400 mb-10 max-w-md mx-auto font-medium">
                        You're starting an <span className="text-white font-bold capitalize">{form.goal?.replace('-', ' ')}</span> agency
                        for <span className="text-white font-bold">{form.targetNiche}</span>.
                    </p>

                    <div className="bg-white/5 p-6 rounded-2xl mb-10 inline-block text-left border border-white/10">
                        <div className="space-y-4">
                            <SummaryItem icon={<CheckCircle2 size={16} />} label="Niche" value={form.targetNiche} />
                            <SummaryItem icon={<CheckCircle2 size={16} />} label="Path" value={form.goal!} />
                            <SummaryItem icon={<CheckCircle2 size={16} />} label="Resources" value={`${form.experience} · ${form.budget}`} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full bg-gradient-to-r from-[#3965FF] to-[#0031E3] text-white py-5 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-[#3965FF]/30 flex items-center justify-center gap-3"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    Analyzing Market & Generating Roadmap...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    Generate AI Roadmap
                                </>
                            )}
                        </button>
                        {!isGenerating && (
                            <button onClick={prevStep} className="text-gray-400 font-bold py-2 hover:text-white transition-colors">
                                Change Details
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Step 5: Result (The Roadmap) */}
            {step === 5 && generatedPlan && (
                <div className="space-y-8 animate-in zoom-in-95 duration-700">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-extrabold text-white">Your Agency Roadmap</h2>
                        <button
                            onClick={() => setStep(1)}
                            className="bg-white/5 px-6 py-2.5 rounded-xl text-sm font-bold border border-white/10 text-white hover:bg-white/10 transition-all"
                        >
                            New Roadmap
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatBox icon={<Users className="text-[#3965FF]" />} label="Niche Focus" value={form.targetNiche} bg="bg-[#3965FF]/10 text-[#3965FF]" />
                        <StatBox icon={<PieChart className="text-[#34D399]" />} label="Agency Strategy" value={form.goal!} bg="bg-[#34D399]/10 text-[#34D399]" />
                        <StatBox icon={<Clock className="text-[#FFB81C]" />} label="Build Time" value="4-6 Weeks" bg="bg-[#FFB81C]/10 text-[#FFB81C]" />
                    </div>

                    <div className="space-y-6">
                        {generatedPlan.phases.map((phase: any, i: number) => (
                            <div key={i} className="bg-[#0A0F1C]/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-sm border border-white/10 flex flex-col md:flex-row gap-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 border border-white/10 rounded-full -mr-20 -mt-20 group-hover:bg-[#3965FF]/10 transition-colors" />

                                <div className="flex-shrink-0">
                                    <div className="h-14 w-14 bg-white/10 text-white rounded-2xl flex items-center justify-center text-xl font-bold border border-white/10 relative z-10">
                                        {i + 1}
                                    </div>
                                </div>

                                <div className="flex-1 relative z-10">
                                    <h3 className="text-xl font-extrabold text-white mb-6 flex items-center gap-2">
                                        <Lightbulb className="h-5 w-5 text-[#FFB81C]" />
                                        {phase.title}
                                    </h3>

                                    <div className="space-y-5">
                                        {phase.tasks.map((task: string, j: number) => (
                                            <div key={j} className="flex gap-4 items-start group/task">
                                                <div className="mt-1 flex-shrink-0">
                                                    <div className="h-5 w-5 rounded-full border-2 border-white/10 group-hover/task:border-[#3965FF] bg-white/5 flex items-center justify-center transition-all">
                                                        <div className="h-2 w-2 rounded-full bg-[#3965FF] opacity-0 group-hover/task:opacity-100" />
                                                    </div>
                                                </div>
                                                <p className="text-gray-400 font-medium leading-relaxed group-hover/task:text-white transition-colors">
                                                    {task}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-r from-[#1B2559] to-[#0B1539] p-10 rounded-[2.5rem] text-white flex flex-col items-center text-center shadow-2xl">
                        <Flag className="h-12 w-12 mb-6 text-[#3965FF]" />
                        <h3 className="text-2xl font-bold mb-3">Goal: First Client in 14 Days</h3>
                        <p className="text-[#A3AED0] max-w-lg mb-8 font-medium">
                            Following this roadmap using WebHunt for lead gen puts you ahead of 99% of agency owners who never start.
                        </p>
                        <div className="flex gap-4">
                            <button className="bg-[#3965FF] px-8 py-3.5 rounded-xl font-bold hover:bg-[#0031E3] transition-all shadow-lg shadow-[#3965FF]/20">
                                Export as PDF
                            </button>
                            <button className="bg-white/10 px-8 py-3.5 rounded-xl font-bold hover:bg-white/20 transition-all">
                                Share Roadmap
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const GoalCard = ({ title, description, icon, bg, onClick }: any) => (
    <button
        onClick={onClick}
        className="text-left bg-[#0A0F1C]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-[#3965FF] hover:translate-y-[-8px] group transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-[#3965FF]/10 h-full flex flex-col"
    >
        <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-6 shrink-0 group-hover:scale-110 transition-transform", bg)}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-sm font-medium text-gray-400 leading-relaxed flex-1">{description}</p>
        <div className="mt-6 flex items-center gap-2 text-[#3965FF] font-extrabold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            Select Plan <ChevronRight size={14} />
        </div>
    </button>
)

const SummaryItem = ({ icon, label, value }: any) => (
    <div className="flex items-center gap-3">
        <div className="text-[#34D399]">{icon}</div>
        <span className="text-xs font-bold text-gray-400 uppercase w-20">{label}:</span>
        <span className="text-xs font-bold text-white truncate max-w-[150px] capitalize">{value}</span>
    </div>
)

const StatBox = ({ icon, label, value, bg = "bg-white/10 border border-white/10" }: any) => (
    <div className="bg-[#0A0F1C]/80 backdrop-blur-sm p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center shadow-sm">
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shadow-sm mb-3", bg)}>
            {icon}
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</span>
        <span className="text-sm font-extrabold text-white capitalize">{value}</span>
    </div>
)

export default Roadmap
