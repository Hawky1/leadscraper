import React, { useState, useCallback } from 'react'
import {
    Search,
    Loader2,
    AlertTriangle,
    AlertCircle,
    Info,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Copy,
    Check,
    Tag,
    Heading,
    FileText,
    Link2,
    Image,
    Smartphone,
    Zap,
    Settings,
    ChevronDown,
    ChevronUp,
    Sparkles,
    TrendingUp,
    BarChart3,
    ExternalLink,
    Globe
} from 'lucide-react'
import { analyzeSeo, type SeoReport, type SeoCategory, type IssueSeverity } from '@/lib/seoAnalyzer'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    'tag': <Tag size={18} />,
    'heading': <Heading size={18} />,
    'file-text': <FileText size={18} />,
    'link': <Link2 size={18} />,
    'image': <Image size={18} />,
    'smartphone': <Smartphone size={18} />,
    'zap': <Zap size={18} />,
    'settings': <Settings size={18} />,
}

function scoreColor(score: number): string {
    if (score >= 80) return '#34D399'
    if (score >= 60) return '#FBBF24'
    if (score >= 40) return '#F97316'
    return '#EF4444'
}

function gradeColor(grade: string): string {
    if (grade.startsWith('A')) return '#34D399'
    if (grade === 'B') return '#FBBF24'
    if (grade === 'C') return '#F97316'
    return '#EF4444'
}

function severityConfig(severity: IssueSeverity) {
    switch (severity) {
        case 'critical': return { icon: <XCircle size={16} />, color: '#EF4444', bg: 'bg-red-500/10 border-red-500/20', label: 'Critical' }
        case 'warning': return { icon: <AlertTriangle size={16} />, color: '#FBBF24', bg: 'bg-yellow-500/10 border-yellow-500/20', label: 'Warning' }
        case 'info': return { icon: <Info size={16} />, color: '#60A5FA', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Info' }
    }
}

function impactBadge(impact: 'high' | 'medium' | 'low') {
    switch (impact) {
        case 'high': return { color: '#34D399', label: 'High Impact' }
        case 'medium': return { color: '#FBBF24', label: 'Medium Impact' }
        case 'low': return { color: '#60A5FA', label: 'Low Impact' }
    }
}

// ─── Score Gauge Component ──────────────────────────────────────────────────

const ScoreGauge: React.FC<{ score: number; size?: number; strokeWidth?: number; label?: string }> = ({
    score, size = 180, strokeWidth = 12, label
}) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (score / 100) * circumference
    const color = scoreColor(score)

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke={color} strokeWidth={strokeWidth}
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-[1500ms] ease-out"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-white">{score}</span>
                {label && <span className="text-xs font-semibold text-gray-400 mt-1">{label}</span>}
            </div>
        </div>
    )
}

// ─── Mini Score Bar ─────────────────────────────────────────────────────────

const MiniScoreBar: React.FC<{ score: number; maxScore: number }> = ({ score, maxScore }) => {
    const pct = (score / maxScore) * 100
    const color = scoreColor(pct)
    return (
        <div className="flex items-center gap-3 flex-1">
            <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-[1200ms] ease-out"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                />
            </div>
            <span className="text-sm font-bold tabular-nums" style={{ color }}>{score}</span>
        </div>
    )
}

// ─── Status Dot ─────────────────────────────────────────────────────────────

const StatusDot: React.FC<{ status: 'good' | 'warning' | 'error' }> = ({ status }) => {
    const color = status === 'good' ? '#34D399' : status === 'warning' ? '#FBBF24' : '#EF4444'
    const icon = status === 'good' ? <CheckCircle2 size={14} /> : status === 'warning' ? <AlertCircle size={14} /> : <XCircle size={14} />
    return <span style={{ color }}>{icon}</span>
}

// ─── Category Card ──────────────────────────────────────────────────────────

const CategoryCard: React.FC<{ category: SeoCategory }> = ({ category }) => {
    const [expanded, setExpanded] = useState(false)
    const score = Math.round((category.score / category.maxScore) * 100)

    return (
        <div className="bg-[#0A0F1C]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-4 p-5 text-left transition-colors hover:bg-white/[0.02]"
            >
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-[#3965FF] shrink-0">
                    {CATEGORY_ICONS[category.icon] || <Settings size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{category.name}</h4>
                    <MiniScoreBar score={category.score} maxScore={category.maxScore} />
                </div>
                <div className="text-gray-400 shrink-0">
                    {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
            </button>
            {expanded && (
                <div className="px-5 pb-5 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="h-px bg-white/5 mb-3" />
                    {category.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02]">
                            <StatusDot status={item.status} />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-300">{item.label}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ─── Main SEO Analyzer Component ─────────────────────────────────────────────

const SeoAnalyzer: React.FC = () => {
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState<SeoReport | null>(null)
    const [error, setError] = useState('')
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'suggestions'>('overview')
    const [progress, setProgress] = useState(0)

    const handleAnalyze = useCallback(async () => {
        const trimmedUrl = url.trim()
        if (!trimmedUrl) {
            setError('Please enter a website URL')
            return
        }

        // Basic URL validation
        const urlPattern = /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/
        if (!urlPattern.test(trimmedUrl)) {
            setError('Please enter a valid URL (e.g. example.com or https://example.com)')
            return
        }

        setError('')
        setLoading(true)
        setReport(null)
        setProgress(0)

        // Simulate progress
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) return prev
                return prev + Math.random() * 15
            })
        }, 300)

        try {
            const result = await analyzeSeo(trimmedUrl)
            setProgress(100)
            setTimeout(() => {
                setReport(result)
                setLoading(false)
                setActiveTab('overview')
            }, 400)
        } catch (err) {
            setError('Analysis failed. Please try again.')
            setLoading(false)
        } finally {
            clearInterval(progressInterval)
        }
    }, [url])

    const handleCopy = useCallback((text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }, [])

    const handleCopyFullReport = useCallback(() => {
        if (!report) return
        const lines: string[] = [
            `SEO Analysis Report for ${report.url}`,
            `Analyzed: ${new Date(report.analyzedAt).toLocaleString()}`,
            `Overall Score: ${report.overallScore}/100 (${report.grade})`,
            '',
            '═══ CATEGORY SCORES ═══',
            ...report.categories.map(c => `  ${c.name}: ${c.score}/${c.maxScore}`),
            '',
            '═══ ISSUES ═══',
            ...report.issues.map(i => `  [${i.severity.toUpperCase()}] ${i.title}\n    ${i.description}\n    Fix: ${i.fix}`),
            '',
            '═══ SUGGESTIONS ═══',
            ...report.suggestions.map(s => `  [${s.impact.toUpperCase()} IMPACT] ${s.title}\n    ${s.description}`),
        ]
        handleCopy(lines.join('\n'), 'full-report')
    }, [report, handleCopy])

    const criticalCount = report?.issues.filter(i => i.severity === 'critical').length || 0
    const warningCount = report?.issues.filter(i => i.severity === 'warning').length || 0

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ─── Hero Input Section ──────────────────────────────────────── */}
            <div className="relative overflow-hidden bg-[#0A0F1C]/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/10">
                {/* Decorative glow */}
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#3965FF]/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#3965FF] to-purple-500 flex items-center justify-center shadow-lg shadow-[#3965FF]/20">
                            <BarChart3 size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">AI SEO Analyzer</h2>
                            <p className="text-gray-400 text-sm font-medium">Enter a website URL to generate a comprehensive SEO report</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                        <div className="relative flex-1">
                            <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => { setUrl(e.target.value); setError('') }}
                                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                                placeholder="e.g. example.com or https://mywebsite.com"
                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-medium placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#3965FF]/30 focus:border-[#3965FF]/50 transition-all"
                                disabled={loading}
                            />
                        </div>
                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#3965FF] to-[#0031E3] text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-[#3965FF]/20 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Search size={18} />
                                    Analyze SEO
                                </>
                            )}
                        </button>
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm font-medium mt-3 flex items-center gap-2">
                            <AlertCircle size={14} /> {error}
                        </p>
                    )}

                    {/* Loading progress */}
                    {loading && (
                        <div className="mt-6 space-y-3 animate-in fade-in duration-300">
                            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-[#3965FF] to-purple-500 transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                                <span className="flex items-center gap-2">
                                    <Sparkles size={12} className="text-[#3965FF] animate-pulse" />
                                    {progress < 30 ? 'Crawling website...' :
                                        progress < 60 ? 'Analyzing meta tags & content...' :
                                            progress < 85 ? 'Checking technical SEO...' :
                                                'Generating report...'}
                                </span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ─── Report Section ─────────────────────────────────────────── */}
            {report && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    {/* Score Overview Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Main Score */}
                        <div className="lg:col-span-4 bg-[#0A0F1C]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center">
                            <ScoreGauge score={report.overallScore} label="Overall SEO Score" />
                            <div className="mt-4 flex items-center gap-3">
                                <span
                                    className="text-3xl font-black"
                                    style={{ color: gradeColor(report.grade) }}
                                >
                                    {report.grade}
                                </span>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-white">{report.url}</p>
                                    <p className="text-xs text-gray-500">{new Date(report.analyzedAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleCopyFullReport}
                                className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                            >
                                {copiedId === 'full-report' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                {copiedId === 'full-report' ? 'Copied!' : 'Copy Full Report'}
                            </button>
                        </div>

                        {/* Quick Stats */}
                        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <QuickStat label="Categories" value="8" sub="Analyzed" icon={<BarChart3 size={18} />} color="#3965FF" />
                            <QuickStat label="Issues Found" value={String(report.issues.length)} sub={`${criticalCount} critical`} icon={<AlertTriangle size={18} />} color="#EF4444" />
                            <QuickStat label="Warnings" value={String(warningCount)} sub="Need attention" icon={<AlertCircle size={18} />} color="#FBBF24" />
                            <QuickStat label="Suggestions" value={String(report.suggestions.length)} sub="Improvements" icon={<TrendingUp size={18} />} color="#34D399" />
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 bg-[#0A0F1C]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
                        {(['overview', 'issues', 'suggestions'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === tab
                                    ? 'bg-[#3965FF] text-white shadow-lg shadow-[#3965FF]/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab === 'overview' ? '📊 Category Breakdown' :
                                    tab === 'issues' ? `🚨 Issues (${report.issues.length})` :
                                        `💡 Suggestions (${report.suggestions.length})`}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                            {report.categories.map((cat, i) => (
                                <CategoryCard key={i} category={cat} />
                            ))}
                        </div>
                    )}

                    {activeTab === 'issues' && (
                        <div className="space-y-3 animate-in fade-in duration-300">
                            {report.issues.length === 0 ? (
                                <div className="text-center py-16 bg-[#0A0F1C]/80 backdrop-blur-xl border border-white/10 rounded-2xl">
                                    <CheckCircle2 size={48} className="mx-auto text-green-400 mb-4" />
                                    <h3 className="text-lg font-bold text-white">No Issues Found!</h3>
                                    <p className="text-gray-400 text-sm mt-1">This website has excellent SEO health.</p>
                                </div>
                            ) : (
                                report.issues.map(issue => {
                                    const config = severityConfig(issue.severity)
                                    return (
                                        <div key={issue.id} className={`p-5 rounded-2xl border ${config.bg} transition-all hover:bg-opacity-20`}>
                                            <div className="flex items-start gap-3">
                                                <span style={{ color: config.color }} className="mt-0.5 shrink-0">{config.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="text-sm font-bold text-white">{issue.title}</h4>
                                                        <span
                                                            className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full"
                                                            style={{ color: config.color, backgroundColor: `${config.color}15` }}
                                                        >
                                                            {config.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 leading-relaxed">{issue.description}</p>
                                                    <div className="mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-xs text-gray-300">
                                                                <span className="font-bold text-[#3965FF]">Fix: </span>
                                                                {issue.fix}
                                                            </p>
                                                            <button
                                                                onClick={() => handleCopy(issue.fix, issue.id)}
                                                                className="ml-3 p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors shrink-0"
                                                                title="Copy fix"
                                                            >
                                                                {copiedId === issue.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    )}

                    {activeTab === 'suggestions' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                            {report.suggestions.map(suggestion => {
                                const badge = impactBadge(suggestion.impact)
                                return (
                                    <div key={suggestion.id} className="group p-5 rounded-2xl bg-[#0A0F1C]/80 backdrop-blur-xl border border-white/10 hover:border-[#3965FF]/30 transition-all">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span
                                                className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full"
                                                style={{ color: badge.color, backgroundColor: `${badge.color}15` }}
                                            >
                                                {badge.label}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{suggestion.category}</span>
                                        </div>
                                        <h4 className="text-sm font-bold text-white mb-2">{suggestion.title}</h4>
                                        <p className="text-xs text-gray-400 leading-relaxed">{suggestion.description}</p>
                                        <button
                                            onClick={() => handleCopy(
                                                `${suggestion.title}\n${suggestion.description}`,
                                                suggestion.id
                                            )}
                                            className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-gray-500 hover:text-white transition-colors"
                                        >
                                            {copiedId === suggestion.id ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                                            {copiedId === suggestion.id ? 'Copied!' : 'Copy suggestion'}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// ─── Sub Components ─────────────────────────────────────────────────────────

const QuickStat: React.FC<{
    label: string; value: string; sub: string; icon: React.ReactNode; color: string
}> = ({ label, value, sub, icon, color }) => (
    <div className="bg-[#0A0F1C]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{label}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>
        </div>
    </div>
)

export default SeoAnalyzer
