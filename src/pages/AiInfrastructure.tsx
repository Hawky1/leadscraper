import React, { useState, useCallback } from 'react'
import {
    ArrowRight,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    Shield,
    Copy,
    Check,
    Users,
    TrendingUp,
    Megaphone,
    Headphones,
    DollarSign,
    Settings,
    ShieldCheck,
    Code,
    Layout,
    Briefcase,
    Sparkles,
    Bot,
    Clock,
    Zap,
    ChevronDown,
    ChevronUp,
    Building2,
    FileText,
    Target
} from 'lucide-react'
import {
    runAiAudit,
    DEPARTMENT_PRESETS,
    type DepartmentId,
    type DepartmentInfo,
    type AuditReport
} from '@/lib/aiAuditEngine'

// ─── Icon mapping ──────────────────────────────────────────────────────────

const DEPT_ICONS: Record<string, React.ReactNode> = {
    'users': <Users size={18} />,
    'trending-up': <TrendingUp size={18} />,
    'megaphone': <Megaphone size={18} />,
    'headphones': <Headphones size={18} />,
    'dollar-sign': <DollarSign size={18} />,
    'settings': <Settings size={18} />,
    'shield': <ShieldCheck size={18} />,
    'code': <Code size={18} />,
    'layout': <Layout size={18} />,
    'briefcase': <Briefcase size={18} />,
}

const ALL_DEPT_IDS: DepartmentId[] = ['hr', 'sales', 'marketing', 'support', 'finance', 'operations', 'legal', 'engineering', 'product', 'executive']

function scoreColor(score: number): string {
    if (score >= 80) return '#34D399'
    if (score >= 60) return '#FBBF24'
    if (score >= 40) return '#F97316'
    return '#EF4444'
}

function riskColor(risk: string): string {
    if (risk === 'low') return '#34D399'
    if (risk === 'medium') return '#FBBF24'
    return '#EF4444'
}

// ─── Score Gauge ────────────────────────────────────────────────────────────

const ScoreGauge: React.FC<{ score: number; size?: number; strokeWidth?: number; label?: string }> = ({
    score, size = 160, strokeWidth = 10, label
}) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (score / 100) * circumference
    const color = scoreColor(score)

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
                    strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                    className="transition-all duration-[1500ms] ease-out" />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-white">{score}</span>
                {label && <span className="text-[10px] font-semibold text-gray-400 mt-0.5">{label}</span>}
            </div>
        </div>
    )
}

// ─── Main Component ────────────────────────────────────────────────────────

const AiInfrastructure: React.FC = () => {
    const [step, setStep] = useState(1)
    const [companyName, setCompanyName] = useState('')
    const [industry, setIndustry] = useState('')
    const [companySize, setCompanySize] = useState('')
    const [selectedDepts, setSelectedDepts] = useState<Set<DepartmentId>>(new Set())
    const [deptDetails, setDeptDetails] = useState<Record<DepartmentId, { workflows: string; challenges: string; dataSources: string }>>({} as any)
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState({ dept: '', pct: 0 })
    const [report, setReport] = useState<AuditReport | null>(null)
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [expandedDept, setExpandedDept] = useState<string | null>(null)
    const [expandedGpt, setExpandedGpt] = useState<string | null>(null)

    const toggleDept = (id: DepartmentId) => {
        const next = new Set(selectedDepts)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setSelectedDepts(next)
    }

    const handleCopy = useCallback((text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }, [])

    const goToStep2 = () => {
        if (!companyName.trim() || !industry.trim() || selectedDepts.size === 0) return
        // Pre-fill defaults
        const details: any = {}
        selectedDepts.forEach(id => {
            const preset = DEPARTMENT_PRESETS[id]
            details[id] = deptDetails[id] || {
                workflows: preset.defaultWorkflows,
                challenges: preset.defaultChallenges,
                dataSources: preset.defaultDataSources,
            }
        })
        setDeptDetails(details)
        setStep(2)
    }

    const runAudit = async () => {
        setLoading(true)
        setStep(3)

        const departments: DepartmentInfo[] = Array.from(selectedDepts).map(id => ({
            id,
            name: DEPARTMENT_PRESETS[id].name,
            icon: DEPARTMENT_PRESETS[id].icon,
            description: '',
            workflows: deptDetails[id]?.workflows || '',
            challenges: deptDetails[id]?.challenges || '',
            dataSources: deptDetails[id]?.dataSources || '',
        }))

        const result = await runAiAudit(
            companyName, industry, companySize, departments,
            (dept, pct) => setProgress({ dept, pct })
        )

        setReport(result)
        setLoading(false)
        setStep(4)
    }

    const handleCopyFullReport = () => {
        if (!report) return
        const lines = [
            `AI INFRASTRUCTURE AUDIT REPORT`,
            `Company: ${report.companyName}`,
            `Industry: ${report.industry} | Size: ${report.companySize}`,
            `Date: ${new Date(report.analyzedAt).toLocaleString()}`,
            `Overall AI Readiness: ${report.overallReadinessScore}/100`,
            `GPTs Recommended: ${report.totalGptsRecommended}`,
            `Est. Monthly Savings: ${report.estimatedMonthlySavings}`,
            '',
            '═══ DEPARTMENT ANALYSIS ═══',
            ...report.departments.flatMap(d => [
                `\n▸ ${d.departmentName} (Priority #${d.priority})`,
                `  Automation Score: ${d.automationScore}/100`,
                `  AI Readiness: ${d.aiReadinessScore}/100`,
                `  Risk: ${d.riskLevel.toUpperCase()}`,
                `  Recommended GPTs:`,
                ...d.recommendedGpts.map(g => `    - ${g.name}: ${g.purpose}`),
            ]),
            '',
            '═══ IMPLEMENTATION PHASES ═══',
            ...report.implementationPhases.map(p => `  Phase ${p.phase}: ${p.name} (${p.duration})\n    ${p.departments.join(', ')}\n    ${p.description}`),
        ]
        handleCopy(lines.join('\n'), 'full')
    }

    const stepLabels = ['Business Profile', 'Department Details', 'Analyzing', 'Audit Report']

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ─── Progress Bar ────────────────────────────────────────── */}
            <div className="bg-[#0A0F1C]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step {Math.min(step, 4)} of 4</p>
                    <p className="text-xs font-bold" style={{ color: '#3965FF' }}>
                        {stepLabels[Math.min(step, 4) - 1]}
                    </p>
                </div>
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} className="flex-1 h-2 rounded-full overflow-hidden bg-white/5">
                            <div
                                className="h-full rounded-full transition-all duration-700 ease-out"
                                style={{
                                    width: step >= s ? '100%' : step === s - 1 && loading ? `${progress.pct}%` : '0%',
                                    backgroundColor: step >= s ? '#3965FF' : 'transparent',
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── Step 1: Business Profile ─────────────────────────────── */}
            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-[#0A0F1C]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#3965FF] to-purple-500 flex items-center justify-center">
                                <Building2 size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Business Profile</h2>
                                <p className="text-sm text-gray-400">Tell us about the company you're auditing</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Company Name</label>
                                <input
                                    value={companyName}
                                    onChange={e => setCompanyName(e.target.value)}
                                    placeholder="e.g. Acme Corp"
                                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#3965FF]/30 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Industry</label>
                                <input
                                    value={industry}
                                    onChange={e => setIndustry(e.target.value)}
                                    placeholder="e.g. SaaS, Real Estate, Healthcare"
                                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#3965FF]/30 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Company Size</label>
                                <select
                                    value={companySize}
                                    onChange={e => setCompanySize(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-[#3965FF]/30 transition-all appearance-none"
                                >
                                    <option value="" className="bg-[#0A0F1C]">Select size...</option>
                                    <option value="1-10" className="bg-[#0A0F1C]">1-10 employees</option>
                                    <option value="11-50" className="bg-[#0A0F1C]">11-50 employees</option>
                                    <option value="51-200" className="bg-[#0A0F1C]">51-200 employees</option>
                                    <option value="201-500" className="bg-[#0A0F1C]">201-500 employees</option>
                                    <option value="500+" className="bg-[#0A0F1C]">500+ employees</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Select Departments to Audit</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                {ALL_DEPT_IDS.map(id => {
                                    const preset = DEPARTMENT_PRESETS[id]
                                    const selected = selectedDepts.has(id)
                                    return (
                                        <button
                                            key={id}
                                            onClick={() => toggleDept(id)}
                                            className={`p-4 rounded-2xl border text-left transition-all duration-200 ${selected
                                                ? 'bg-[#3965FF]/10 border-[#3965FF]/50 ring-1 ring-[#3965FF]/30'
                                                : 'bg-white/[0.02] border-white/10 hover:bg-white/5 hover:border-white/20'
                                                }`}
                                        >
                                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-2 ${selected ? 'bg-[#3965FF]/20 text-[#3965FF]' : 'bg-white/5 text-gray-400'}`}>
                                                {DEPT_ICONS[preset.icon]}
                                            </div>
                                            <p className={`text-xs font-bold ${selected ? 'text-white' : 'text-gray-400'}`}>{preset.name}</p>
                                        </button>
                                    )
                                })}
                            </div>
                            {selectedDepts.size > 0 && (
                                <p className="text-xs text-gray-500 mt-3">{selectedDepts.size} department{selectedDepts.size > 1 ? 's' : ''} selected</p>
                            )}
                        </div>

                        <div className="flex justify-end mt-8">
                            <button
                                onClick={goToStep2}
                                disabled={!companyName.trim() || !industry.trim() || selectedDepts.size === 0}
                                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#3965FF] to-[#0031E3] text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-[#3965FF]/20 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Continue <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Step 2: Department Details ──────────────────────────── */}
            {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-[#0A0F1C]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center">
                                <FileText size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Department Workflows</h2>
                                <p className="text-sm text-gray-400">Review and customize the details for each department (pre-filled with common workflows)</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {Array.from(selectedDepts).map(id => {
                                const preset = DEPARTMENT_PRESETS[id]
                                const detail = deptDetails[id] || {}
                                const isExpanded = expandedDept === id
                                return (
                                    <div key={id} className="border border-white/10 rounded-2xl overflow-hidden">
                                        <button
                                            onClick={() => setExpandedDept(isExpanded ? null : id)}
                                            className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
                                        >
                                            <div className="h-9 w-9 rounded-lg bg-[#3965FF]/10 text-[#3965FF] flex items-center justify-center shrink-0">
                                                {DEPT_ICONS[preset.icon]}
                                            </div>
                                            <span className="flex-1 text-sm font-bold text-white">{preset.name}</span>
                                            {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                                        </button>
                                        {isExpanded && (
                                            <div className="px-4 pb-4 space-y-3 animate-in fade-in duration-200">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Current Workflows</label>
                                                    <textarea
                                                        value={detail.workflows || ''}
                                                        onChange={e => setDeptDetails(prev => ({ ...prev, [id]: { ...prev[id], workflows: e.target.value } }))}
                                                        rows={2}
                                                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-gray-500 outline-none focus:ring-1 focus:ring-[#3965FF]/30 resize-none transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Main Challenges</label>
                                                    <textarea
                                                        value={detail.challenges || ''}
                                                        onChange={e => setDeptDetails(prev => ({ ...prev, [id]: { ...prev[id], challenges: e.target.value } }))}
                                                        rows={2}
                                                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-gray-500 outline-none focus:ring-1 focus:ring-[#3965FF]/30 resize-none transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Available Data Sources</label>
                                                    <textarea
                                                        value={detail.dataSources || ''}
                                                        onChange={e => setDeptDetails(prev => ({ ...prev, [id]: { ...prev[id], dataSources: e.target.value } }))}
                                                        rows={2}
                                                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-gray-500 outline-none focus:ring-1 focus:ring-[#3965FF]/30 resize-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex items-center justify-between mt-8">
                            <button
                                onClick={() => setStep(1)}
                                className="flex items-center gap-2 px-6 py-3.5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                            >
                                <ArrowLeft size={16} /> Back
                            </button>
                            <button
                                onClick={runAudit}
                                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#3965FF] to-[#0031E3] text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-[#3965FF]/20"
                            >
                                <Sparkles size={18} /> Run AI Audit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Step 3: Analyzing ──────────────────────────────────── */}
            {step === 3 && loading && (
                <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-500">
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#3965FF]/20 rounded-full blur-[60px] animate-pulse" />
                        <div className="relative h-24 w-24 rounded-full bg-[#0A0F1C] border border-white/10 flex items-center justify-center">
                            <Loader2 size={36} className="text-[#3965FF] animate-spin" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-8">Running AI Audit</h3>
                    <p className="text-gray-400 text-sm mt-2">
                        {progress.dept ? `Analyzing ${progress.dept}...` : 'Initializing audit engine...'}
                    </p>
                    <div className="w-64 mt-6">
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-[#3965FF] to-purple-500 transition-all duration-500"
                                style={{ width: `${progress.pct}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-2">{Math.round(progress.pct)}% complete</p>
                    </div>
                </div>
            )}

            {/* ─── Step 4: Audit Report ─────────────────────────────── */}
            {step === 4 && report && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    {/* Overview Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-4 bg-[#0A0F1C]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center">
                            <ScoreGauge score={report.overallReadinessScore} label="AI Readiness" />
                            <h3 className="text-lg font-bold text-white mt-4">{report.companyName}</h3>
                            <p className="text-xs text-gray-400">{report.industry} • {report.companySize} employees</p>
                            <div className="grid grid-cols-2 gap-3 mt-5 w-full">
                                <div className="text-center p-3 rounded-xl bg-white/5">
                                    <p className="text-xl font-black text-[#3965FF]">{report.totalGptsRecommended}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">GPTs</p>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-white/5">
                                    <p className="text-xl font-black text-[#34D399]">{report.estimatedMonthlySavings}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Monthly Savings</p>
                                </div>
                            </div>
                            <button
                                onClick={handleCopyFullReport}
                                className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-gray-300 hover:bg-white/10 transition-all w-full justify-center"
                            >
                                {copiedId === 'full' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                {copiedId === 'full' ? 'Copied!' : 'Export Full Report'}
                            </button>
                        </div>

                        {/* Quick stats */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Department priority cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {report.departments.map(dept => {
                                    const preset = DEPARTMENT_PRESETS[dept.departmentId]
                                    const isOpen = expandedDept === dept.departmentId
                                    return (
                                        <div key={dept.departmentId} className="bg-[#0A0F1C]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                                            <button
                                                onClick={() => setExpandedDept(isOpen ? null : dept.departmentId)}
                                                className="w-full p-5 text-left hover:bg-white/[0.02] transition-colors"
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="h-9 w-9 rounded-lg bg-[#3965FF]/10 text-[#3965FF] flex items-center justify-center shrink-0">
                                                        {DEPT_ICONS[preset.icon]}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-sm font-bold text-white truncate">{dept.departmentName}</h4>
                                                            <span className="text-[9px] font-extrabold bg-[#3965FF]/20 text-[#3965FF] px-1.5 py-0.5 rounded-full">#{dept.priority}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-gray-400 shrink-0">
                                                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between text-[10px] mb-1">
                                                            <span className="text-gray-500 font-bold">Automation</span>
                                                            <span className="font-bold" style={{ color: scoreColor(dept.automationScore) }}>{dept.automationScore}%</span>
                                                        </div>
                                                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${dept.automationScore}%`, backgroundColor: scoreColor(dept.automationScore) }} />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Shield size={12} style={{ color: riskColor(dept.riskLevel) }} />
                                                        <span className="text-[10px] font-bold capitalize" style={{ color: riskColor(dept.riskLevel) }}>{dept.riskLevel}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Bot size={12} className="text-[#3965FF]" />
                                                        <span className="text-[10px] font-bold text-gray-300">{dept.recommendedGpts.length}</span>
                                                    </div>
                                                </div>
                                            </button>

                                            {isOpen && (
                                                <div className="px-5 pb-5 space-y-3 animate-in fade-in duration-200">
                                                    <div className="h-px bg-white/5" />
                                                    {/* Risk flags */}
                                                    {dept.riskFlags.length > 0 && (
                                                        <div className="space-y-1.5">
                                                            {dept.riskFlags.map((flag, i) => (
                                                                <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-red-500/5 border border-red-500/10">
                                                                    <AlertTriangle size={12} className="text-red-400 mt-0.5 shrink-0" />
                                                                    <p className="text-[10px] text-red-300">{flag}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {/* GPT recommendations */}
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Recommended Custom GPTs</p>
                                                    {dept.recommendedGpts.map((gpt, gi) => {
                                                        const gptKey = `${dept.departmentId}-${gi}`
                                                        const gptOpen = expandedGpt === gptKey
                                                        return (
                                                            <div key={gi} className="border border-white/5 rounded-xl overflow-hidden">
                                                                <button
                                                                    onClick={() => setExpandedGpt(gptOpen ? null : gptKey)}
                                                                    className="w-full p-3 text-left flex items-center gap-3 hover:bg-white/[0.02] transition-colors"
                                                                >
                                                                    <Bot size={14} className="text-purple-400 shrink-0" />
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-xs font-bold text-white truncate">{gpt.name}</p>
                                                                        <p className="text-[10px] text-gray-500 truncate">{gpt.purpose}</p>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 shrink-0">
                                                                        <span className="flex items-center gap-1 text-[9px] font-bold text-gray-400">
                                                                            <Clock size={10} /> {gpt.estimatedTimeSaved}
                                                                        </span>
                                                                    </div>
                                                                </button>
                                                                {gptOpen && (
                                                                    <div className="px-3 pb-3 space-y-2 animate-in fade-in duration-200">
                                                                        <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                                                                            <p className="text-[10px] font-bold text-gray-500 mb-1">System Prompt Template</p>
                                                                            <p className="text-[10px] text-gray-300 font-mono leading-relaxed">{gpt.systemPromptPreview}</p>
                                                                            <button
                                                                                onClick={() => handleCopy(gpt.systemPromptPreview, gptKey)}
                                                                                className="mt-2 flex items-center gap-1 text-[9px] font-bold text-gray-500 hover:text-white transition-colors"
                                                                            >
                                                                                {copiedId === gptKey ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                                                                                {copiedId === gptKey ? 'Copied!' : 'Copy prompt'}
                                                                            </button>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-[10px] font-bold text-gray-500 mb-1">Training Data Needed</p>
                                                                            <div className="flex flex-wrap gap-1">
                                                                                {gpt.trainingData.map((d, di) => (
                                                                                    <span key={di} className="text-[9px] font-bold text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">{d}</span>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Implementation Phases */}
                    <div className="bg-[#0A0F1C]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center">
                                <Target size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Implementation Roadmap</h3>
                                <p className="text-xs text-gray-400">Recommended phased deployment plan</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {report.implementationPhases.map(phase => (
                                <div key={phase.phase} className="relative p-5 rounded-2xl bg-white/[0.02] border border-white/10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="h-7 w-7 rounded-lg bg-[#3965FF]/20 text-[#3965FF] flex items-center justify-center text-xs font-black">{phase.phase}</span>
                                        <div>
                                            <p className="text-xs font-bold text-white">{phase.name}</p>
                                            <p className="text-[10px] text-gray-500">{phase.duration}</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 leading-relaxed mb-3">{phase.description}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {phase.departments.map((d, i) => (
                                            <span key={i} className="text-[9px] font-bold text-[#3965FF] bg-[#3965FF]/10 px-2 py-0.5 rounded-full">{d}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => { setStep(1); setReport(null) }}
                            className="flex items-center gap-2 px-6 py-3.5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                        >
                            <ArrowLeft size={16} /> New Audit
                        </button>
                        <button
                            onClick={handleCopyFullReport}
                            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#3965FF] to-[#0031E3] text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-[#3965FF]/20"
                        >
                            {copiedId === 'full' ? <Check size={18} className="text-green-300" /> : <Copy size={18} />}
                            {copiedId === 'full' ? 'Report Copied!' : 'Export Full Report'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AiInfrastructure
