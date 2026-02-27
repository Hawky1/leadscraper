import React, { useState, useMemo, useCallback } from 'react'
import {
    Copy,
    Check,
    Sparkles,
    Layers,
    Palette,
    Database,
    Plug,
    Shield,
    BarChart3,
    CreditCard,
    Bell,
    Search,
    Upload,
    MessageSquare,
    Settings,
    Monitor,
    Smartphone,
    Globe,
    ShoppingCart,
    Building2,
    Store,
    Users,
    ChevronDown,
    ChevronUp,
    Hash,
    Zap
} from 'lucide-react'
import { toast } from 'sonner'

// ─── Types ──────────────────────────────────────────────────────────────────

interface FeatureToggle {
    id: string
    label: string
    icon: React.ReactNode
    enabled: boolean
}

// ─── Constants ──────────────────────────────────────────────────────────────

const APP_TYPES = [
    { id: 'saas', label: 'SaaS Platform', icon: <Globe size={16} /> },
    { id: 'dashboard', label: 'Admin Dashboard', icon: <Monitor size={16} /> },
    { id: 'ecommerce', label: 'E-Commerce Store', icon: <ShoppingCart size={16} /> },
    { id: 'mobile', label: 'Mobile App', icon: <Smartphone size={16} /> },
    { id: 'internal', label: 'Internal Tool', icon: <Building2 size={16} /> },
    { id: 'marketplace', label: 'Marketplace', icon: <Store size={16} /> },
    { id: 'social', label: 'Social Platform', icon: <Users size={16} /> },
]

const FRAMEWORKS = ['Next.js', 'React + Vite', 'Vue.js', 'Svelte', 'React Native', 'Flutter', 'Nuxt.js']
const STYLING = ['Tailwind CSS', 'CSS Modules', 'Styled Components', 'Vanilla CSS', 'shadcn/ui + Tailwind', 'Material UI']
const BACKENDS = ['Supabase', 'Firebase', 'Node.js + Express', 'Django', 'Ruby on Rails', 'Convex', 'Appwrite', 'None (Static)']

const INTEGRATIONS = [
    { id: 'stripe', label: 'Stripe (Payments)' },
    { id: 'openai', label: 'OpenAI API' },
    { id: 'twilio', label: 'Twilio (SMS)' },
    { id: 'sendgrid', label: 'SendGrid (Email)' },
    { id: 'google-maps', label: 'Google Maps' },
    { id: 'aws-s3', label: 'AWS S3 (Storage)' },
    { id: 'cloudinary', label: 'Cloudinary (Media)' },
    { id: 'algolia', label: 'Algolia (Search)' },
    { id: 'analytics', label: 'Google Analytics' },
    { id: 'resend', label: 'Resend (Email)' },
]

const DEFAULT_FEATURES: FeatureToggle[] = [
    { id: 'auth', label: 'Authentication', icon: <Shield size={14} />, enabled: true },
    { id: 'profiles', label: 'User Profiles', icon: <Users size={14} />, enabled: false },
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={14} />, enabled: true },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={14} />, enabled: false },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={14} />, enabled: false },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={14} />, enabled: false },
    { id: 'search', label: 'Search', icon: <Search size={14} />, enabled: false },
    { id: 'file-upload', label: 'File Upload', icon: <Upload size={14} />, enabled: false },
    { id: 'chat', label: 'Chat / Messaging', icon: <MessageSquare size={14} />, enabled: false },
    { id: 'admin', label: 'Admin Panel', icon: <Settings size={14} />, enabled: false },
    { id: 'api', label: 'REST/GraphQL API', icon: <Plug size={14} />, enabled: false },
    { id: 'multi-tenant', label: 'Multi-Tenant', icon: <Building2 size={14} />, enabled: false },
]

const DESIGN_STYLES = ['Minimal & Clean', 'Bold & Vibrant', 'Corporate & Professional', 'Playful & Creative', 'Dark Mode Premium', 'Glassmorphism', 'Brutalist']

// ─── Main Component ─────────────────────────────────────────────────────────

const AppBuilderPrompt: React.FC = () => {
    const [appName, setAppName] = useState('')
    const [appDescription, setAppDescription] = useState('')
    const [appType, setAppType] = useState('')
    const [framework, setFramework] = useState('')
    const [styling, setStyling] = useState('')
    const [backend, setBackend] = useState('')
    const [features, setFeatures] = useState<FeatureToggle[]>(DEFAULT_FEATURES)
    const [dbModels, setDbModels] = useState('')
    const [selectedIntegrations, setSelectedIntegrations] = useState<Set<string>>(new Set())
    const [designStyle, setDesignStyle] = useState('')
    const [colorScheme, setColorScheme] = useState('')
    const [inspirationUrl, setInspirationUrl] = useState('')
    const [additionalNotes, setAdditionalNotes] = useState('')
    const [copiedPrompt, setCopiedPrompt] = useState(false)

    // Collapsible sections
    const [openSections, setOpenSections] = useState<Set<string>>(new Set(['overview', 'stack', 'features']))

    const toggleSection = (id: string) => {
        const next = new Set(openSections)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setOpenSections(next)
    }

    const toggleFeature = (id: string) => {
        setFeatures(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f))
    }

    const toggleIntegration = (id: string) => {
        const next = new Set(selectedIntegrations)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setSelectedIntegrations(next)
    }

    // ─── Prompt Generation ──────────────────────────────────────────────────

    const generatedPrompt = useMemo(() => {
        const lines: string[] = []

        lines.push('# App Development Prompt')
        lines.push('')

        // Overview
        if (appName || appDescription || appType) {
            lines.push('## Project Overview')
            if (appName) lines.push(`**App Name:** ${appName}`)
            if (appType) {
                const typeLabel = APP_TYPES.find(t => t.id === appType)?.label || appType
                lines.push(`**App Type:** ${typeLabel}`)
            }
            if (appDescription) lines.push(`**Description:** ${appDescription}`)
            lines.push('')
        }

        // Tech Stack
        if (framework || styling || backend) {
            lines.push('## Tech Stack')
            if (framework) lines.push(`- **Frontend Framework:** ${framework}`)
            if (styling) lines.push(`- **Styling:** ${styling}`)
            if (backend) lines.push(`- **Backend / BaaS:** ${backend}`)
            lines.push('')
        }

        // Features
        const enabledFeatures = features.filter(f => f.enabled)
        if (enabledFeatures.length > 0) {
            lines.push('## Core Features')
            lines.push('Implement the following features:')
            enabledFeatures.forEach(f => {
                lines.push(`- **${f.label}**: Fully functional ${f.label.toLowerCase()} system`)
            })
            lines.push('')
        }

        // Database
        if (dbModels.trim()) {
            lines.push('## Database Schema')
            lines.push('Design the database with the following key models/tables:')
            lines.push(dbModels)
            lines.push('')
        }

        // Integrations
        if (selectedIntegrations.size > 0) {
            lines.push('## API & Integrations')
            lines.push('Integrate the following external services:')
            INTEGRATIONS.filter(i => selectedIntegrations.has(i.id)).forEach(i => {
                lines.push(`- ${i.label}`)
            })
            lines.push('')
        }

        // Design
        if (designStyle || colorScheme || inspirationUrl) {
            lines.push('## UI/UX Design')
            if (designStyle) lines.push(`- **Design Style:** ${designStyle}`)
            if (colorScheme) lines.push(`- **Color Scheme:** ${colorScheme}`)
            if (inspirationUrl) lines.push(`- **Inspiration:** ${inspirationUrl}`)
            lines.push('')
        }

        // Additional notes
        if (additionalNotes.trim()) {
            lines.push('## Additional Requirements')
            lines.push(additionalNotes)
            lines.push('')
        }

        // Instructions footer
        lines.push('## Development Guidelines')
        lines.push('- Write clean, well-structured, production-ready code')
        lines.push('- Include proper TypeScript types and interfaces')
        lines.push('- Implement responsive design for all screen sizes')
        lines.push('- Add proper error handling and loading states')
        lines.push('- Follow best practices for the chosen tech stack')
        if (enabledFeatures.some(f => f.id === 'auth')) {
            lines.push('- Implement secure authentication with proper session management')
        }
        if (enabledFeatures.some(f => f.id === 'payments')) {
            lines.push('- Handle payment flows securely with proper error recovery')
        }

        return lines.join('\n')
    }, [appName, appDescription, appType, framework, styling, backend, features, dbModels, selectedIntegrations, designStyle, colorScheme, inspirationUrl, additionalNotes])

    const tokenEstimate = useMemo(() => Math.ceil(generatedPrompt.length / 4), [generatedPrompt])

    const copyToClipboard = useCallback(() => {
        navigator.clipboard.writeText(generatedPrompt)
        setCopiedPrompt(true)
        toast.success('Prompt copied to clipboard!')
        setTimeout(() => setCopiedPrompt(false), 2000)
    }, [generatedPrompt])

    // ─── Section Component ──────────────────────────────────────────────

    const Section: React.FC<{ id: string; title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ id, title, icon, children }) => {
        const isOpen = openSections.has(id)
        return (
            <div className="border border-white/10 rounded-2xl overflow-hidden">
                <button
                    onClick={() => toggleSection(id)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                    <div className="h-8 w-8 rounded-lg bg-[#3965FF]/10 text-[#3965FF] flex items-center justify-center shrink-0">
                        {icon}
                    </div>
                    <span className="flex-1 text-sm font-bold text-white">{title}</span>
                    {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>
                {isOpen && (
                    <div className="px-4 pb-4 space-y-4 animate-in fade-in duration-200">
                        {children}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ─── Left: Configuration ─────────────────────────────────── */}
            <div className="lg:col-span-5 space-y-4">
                <div className="bg-[#0A0F1C]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#3965FF] to-purple-500 flex items-center justify-center">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">App Configuration</h2>
                            <p className="text-xs text-gray-400">Define your app and watch the prompt build</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {/* Overview */}
                        <Section id="overview" title="App Overview" icon={<Layers size={16} />}>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">App Name</label>
                                <input
                                    value={appName}
                                    onChange={e => setAppName(e.target.value)}
                                    placeholder="e.g. TaskFlow, ShopHub, DataPulse"
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-gray-500 outline-none focus:ring-1 focus:ring-[#3965FF]/30 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">App Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {APP_TYPES.map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => setAppType(appType === type.id ? '' : type.id)}
                                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${appType === type.id
                                                ? 'bg-[#3965FF]/10 border-[#3965FF]/50 text-white'
                                                : 'bg-white/[0.02] border-white/10 text-gray-400 hover:bg-white/5'
                                                }`}
                                        >
                                            {type.icon}
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                                <textarea
                                    value={appDescription}
                                    onChange={e => setAppDescription(e.target.value)}
                                    placeholder="Describe what the app does, its target users, and core value proposition..."
                                    rows={3}
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-gray-500 outline-none focus:ring-1 focus:ring-[#3965FF]/30 resize-none transition-all"
                                />
                            </div>
                        </Section>

                        {/* Tech Stack */}
                        <Section id="stack" title="Tech Stack" icon={<Zap size={16} />}>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Framework</label>
                                <select
                                    value={framework}
                                    onChange={e => setFramework(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs outline-none focus:ring-1 focus:ring-[#3965FF]/30 appearance-none transition-all"
                                >
                                    <option value="" className="bg-[#0A0F1C]">Select framework...</option>
                                    {FRAMEWORKS.map(f => <option key={f} value={f} className="bg-[#0A0F1C]">{f}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Styling</label>
                                <select
                                    value={styling}
                                    onChange={e => setStyling(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs outline-none focus:ring-1 focus:ring-[#3965FF]/30 appearance-none transition-all"
                                >
                                    <option value="" className="bg-[#0A0F1C]">Select styling...</option>
                                    {STYLING.map(s => <option key={s} value={s} className="bg-[#0A0F1C]">{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Backend / BaaS</label>
                                <select
                                    value={backend}
                                    onChange={e => setBackend(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs outline-none focus:ring-1 focus:ring-[#3965FF]/30 appearance-none transition-all"
                                >
                                    <option value="" className="bg-[#0A0F1C]">Select backend...</option>
                                    {BACKENDS.map(b => <option key={b} value={b} className="bg-[#0A0F1C]">{b}</option>)}
                                </select>
                            </div>
                        </Section>

                        {/* Features */}
                        <Section id="features" title="Core Features" icon={<Settings size={16} />}>
                            <div className="grid grid-cols-2 gap-2">
                                {features.map(feat => (
                                    <button
                                        key={feat.id}
                                        onClick={() => toggleFeature(feat.id)}
                                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-[11px] font-bold transition-all ${feat.enabled
                                            ? 'bg-[#3965FF]/10 border-[#3965FF]/50 text-white'
                                            : 'bg-white/[0.02] border-white/10 text-gray-500 hover:bg-white/5'
                                            }`}
                                    >
                                        <span className={feat.enabled ? 'text-[#3965FF]' : 'text-gray-600'}>{feat.icon}</span>
                                        {feat.label}
                                    </button>
                                ))}
                            </div>
                        </Section>

                        {/* Database */}
                        <Section id="database" title="Database Schema" icon={<Database size={16} />}>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Key Models / Tables</label>
                                <textarea
                                    value={dbModels}
                                    onChange={e => setDbModels(e.target.value)}
                                    placeholder={"e.g.\n- Users (id, email, name, role, avatar, createdAt)\n- Projects (id, title, ownerId, status, createdAt)\n- Tasks (id, projectId, title, assignee, priority, dueDate)"}
                                    rows={5}
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-gray-500 outline-none focus:ring-1 focus:ring-[#3965FF]/30 resize-none transition-all font-mono"
                                />
                            </div>
                        </Section>

                        {/* Integrations */}
                        <Section id="integrations" title="API & Integrations" icon={<Plug size={16} />}>
                            <div className="grid grid-cols-2 gap-2">
                                {INTEGRATIONS.map(integ => (
                                    <button
                                        key={integ.id}
                                        onClick={() => toggleIntegration(integ.id)}
                                        className={`p-2.5 rounded-xl border text-[11px] font-bold text-left transition-all ${selectedIntegrations.has(integ.id)
                                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
                                            : 'bg-white/[0.02] border-white/10 text-gray-500 hover:bg-white/5'
                                            }`}
                                    >
                                        {integ.label}
                                    </button>
                                ))}
                            </div>
                        </Section>

                        {/* Design */}
                        <Section id="design" title="Design Preferences" icon={<Palette size={16} />}>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Design Style</label>
                                <div className="flex flex-wrap gap-2">
                                    {DESIGN_STYLES.map(style => (
                                        <button
                                            key={style}
                                            onClick={() => setDesignStyle(designStyle === style ? '' : style)}
                                            className={`px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all ${designStyle === style
                                                ? 'bg-purple-500/10 border-purple-500/50 text-purple-300'
                                                : 'bg-white/[0.02] border-white/10 text-gray-500 hover:bg-white/5'
                                                }`}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Color Scheme</label>
                                <input
                                    value={colorScheme}
                                    onChange={e => setColorScheme(e.target.value)}
                                    placeholder="e.g. Deep navy + electric blue accents, or minimal black & white"
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-gray-500 outline-none focus:ring-1 focus:ring-[#3965FF]/30 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Inspiration URL</label>
                                <input
                                    value={inspirationUrl}
                                    onChange={e => setInspirationUrl(e.target.value)}
                                    placeholder="e.g. linear.app, vercel.com/dashboard"
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-gray-500 outline-none focus:ring-1 focus:ring-[#3965FF]/30 transition-all"
                                />
                            </div>
                        </Section>

                        {/* Additional Notes */}
                        <Section id="notes" title="Additional Notes" icon={<Hash size={16} />}>
                            <textarea
                                value={additionalNotes}
                                onChange={e => setAdditionalNotes(e.target.value)}
                                placeholder="Any other requirements, constraints, or context for the AI builder..."
                                rows={4}
                                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-gray-500 outline-none focus:ring-1 focus:ring-[#3965FF]/30 resize-none transition-all"
                            />
                        </Section>
                    </div>
                </div>
            </div>

            {/* ─── Right: Prompt Output ────────────────────────────────── */}
            <div className="lg:col-span-7">
                <div className="bg-[#0A0F1C]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 sticky top-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center">
                                <Monitor size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Generated Prompt</h2>
                                <p className="text-xs text-gray-400">
                                    ~{tokenEstimate.toLocaleString()} tokens • Updates in real-time
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#3965FF] to-[#0031E3] text-white font-bold text-xs rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-[#3965FF]/20"
                        >
                            {copiedPrompt ? <Check size={14} className="text-green-300" /> : <Copy size={14} />}
                            {copiedPrompt ? 'Copied!' : 'Copy Prompt'}
                        </button>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 max-h-[calc(100vh-200px)] overflow-y-auto">
                        <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">
                            {generatedPrompt}
                        </pre>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-4 gap-3 mt-4">
                        <div className="text-center p-2.5 rounded-xl bg-white/[0.03]">
                            <p className="text-sm font-black text-[#3965FF]">{features.filter(f => f.enabled).length}</p>
                            <p className="text-[9px] text-gray-500 font-bold uppercase">Features</p>
                        </div>
                        <div className="text-center p-2.5 rounded-xl bg-white/[0.03]">
                            <p className="text-sm font-black text-emerald-400">{selectedIntegrations.size}</p>
                            <p className="text-[9px] text-gray-500 font-bold uppercase">Integrations</p>
                        </div>
                        <div className="text-center p-2.5 rounded-xl bg-white/[0.03]">
                            <p className="text-sm font-black text-purple-400">{framework ? '1' : '0'}</p>
                            <p className="text-[9px] text-gray-500 font-bold uppercase">Framework</p>
                        </div>
                        <div className="text-center p-2.5 rounded-xl bg-white/[0.03]">
                            <p className="text-sm font-black text-amber-400">{tokenEstimate.toLocaleString()}</p>
                            <p className="text-[9px] text-gray-500 font-bold uppercase">Tokens</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppBuilderPrompt
