import React, { useState } from 'react'
import { Copy, Sparkles, Wand2, Layout, SlidersHorizontal, Settings2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const WebsitePromptBuilder: React.FC = () => {
    const [businessDetails, setBusinessDetails] = useState({
        industry: '',
        targetAudience: '',
        coreOffering: '',
        uniqueValue: ''
    })

    const [designPrefs, setDesignPrefs] = useState({
        theme: 'light',
        primaryColor: '',
        style: 'modern',
        inspirationUrls: ''
    })

    const [sections, setSections] = useState<Record<string, boolean>>({
        hero: true,
        features: true,
        howItWorks: false,
        testimonials: false,
        pricing: false,
        faq: false,
        contact: true
    })

    const generatePrompt = () => {
        const selectedSections = Object.entries(sections)
            .filter(([_, isSelected]) => isSelected)
            .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim())
            .join(', ')

        return `Act as an expert UI/UX designer and frontend developer. Please design and build a modern, high-converting landing page for a business with the following profile:

**Business Profile**
- Industry: ${businessDetails.industry || '[Specify Industry]'}
- Target Audience: ${businessDetails.targetAudience || '[Specify Target Audience]'}
- Core Offering: ${businessDetails.coreOffering || '[Specify Core Offering]'}
- Unique Value Proposition: ${businessDetails.uniqueValue || '[Specify UVP]'}

**Design Preferences**
- Preferred Theme: ${designPrefs.theme} mode
- Primary Color/Vibe: ${designPrefs.primaryColor || '[Specify Color]'}
- Overall Style: ${designPrefs.style}
${designPrefs.inspirationUrls ? `- Inspiration URLs: ${designPrefs.inspirationUrls}` : ''}

**Required Sections (Top to Bottom)**
Please include the following sections in your design:
${selectedSections}

**Technical Requirements**
- Use modern semantic HTML5 and accessible markup.
- Ensure the layout is fully responsive (mobile-first approach).
- Use Tailwind CSS for styling (or specify your preferred framework).
- Incorporate subtle micro-animations for interactive elements (buttons, cards) to make the site feel premium.
- Use a clean, modern sans-serif font (like Inter or Roboto).

Please provide the complete code, separating HTML structure and any necessary custom CSS/JS logic. Include placeholder images from Unsplash where appropriate.`
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatePrompt())
            toast.success('Prompt copied to clipboard!')
        } catch (err) {
            toast.error('Failed to copy prompt')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Website Prompt Builder</h1>
                <p className="text-gray-400 max-w-2xl">
                    Generate highly optimized, detailed prompts to build your next landing page using AI coding tools. Fill in the details below to construct your perfect prompt.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[calc(100vh-220px)]">
                {/* --- Left Column: Inputs --- */}
                <div className="xl:col-span-5 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar pb-10">

                    {/* Business Details */}
                    <Card className="p-6 bg-[#0A0F1C]/80 backdrop-blur-xl border border-white/10 shadow-sm rounded-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-[#3965FF]/10 rounded-lg text-[#3965FF]">
                                <Layout size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-white">Business Details</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-white font-medium">Industry / Niche</Label>
                                <Input
                                    placeholder="e.g. AI SaaS, Plumber, E-commerce..."
                                    value={businessDetails.industry}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusinessDetails({ ...businessDetails, industry: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white focus:border-[#3965FF] focus:ring-[#3965FF]/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white font-medium">Target Audience</Label>
                                <Input
                                    placeholder="e.g. Small business owners, Teens..."
                                    value={businessDetails.targetAudience}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusinessDetails({ ...businessDetails, targetAudience: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white focus:border-[#3965FF]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white font-medium">Core Offering</Label>
                                <Textarea
                                    placeholder="What exactly are you selling or offering?"
                                    value={businessDetails.coreOffering}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBusinessDetails({ ...businessDetails, coreOffering: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white focus:border-[#3965FF] min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white font-medium">Unique Value Proposition</Label>
                                <Textarea
                                    placeholder="Why should they choose you over competitors?"
                                    value={businessDetails.uniqueValue}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBusinessDetails({ ...businessDetails, uniqueValue: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white focus:border-[#3965FF] min-h-[80px]"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Design Preferences */}
                    <Card className="p-6 bg-[#0A0F1C]/80 backdrop-blur-xl border border-white/10 shadow-sm rounded-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-[#9333EA]/10 rounded-lg text-[#A855F7]">
                                <SlidersHorizontal size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-white">Design Preferences</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-white font-medium">Theme</Label>
                                    <Select
                                        value={designPrefs.theme}
                                        onValueChange={(val: string) => setDesignPrefs({ ...designPrefs, theme: val })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">Light Mode</SelectItem>
                                            <SelectItem value="dark">Dark Mode</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white font-medium">Style Vibe</Label>
                                    <Select
                                        value={designPrefs.style}
                                        onValueChange={(val: string) => setDesignPrefs({ ...designPrefs, style: val })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="modern">Modern & Clean</SelectItem>
                                            <SelectItem value="playful">Playful & Colorful</SelectItem>
                                            <SelectItem value="corporate">Corporate & Professional</SelectItem>
                                            <SelectItem value="minimalist">Minimalist</SelectItem>
                                            <SelectItem value="brutalism">Neo-Brutalism</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white font-medium">Primary Color</Label>
                                <Input
                                    placeholder="e.g. Indigo, Emerald, #3965FF..."
                                    value={designPrefs.primaryColor}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDesignPrefs({ ...designPrefs, primaryColor: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white focus:border-[#3965FF]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white font-medium">Inspiration URLs (Optional)</Label>
                                <Input
                                    placeholder="comma separated links..."
                                    value={designPrefs.inspirationUrls}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDesignPrefs({ ...designPrefs, inspirationUrls: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white focus:border-[#3965FF]"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Section Builder */}
                    <Card className="p-6 bg-[#0A0F1C]/80 backdrop-blur-xl border border-white/10 shadow-sm rounded-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#34D399]">
                                <Settings2 size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-white">Sections to Include</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                            {Object.entries(sections).map(([key, value]) => {
                                const formattedLabel = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()
                                return (
                                    <div key={key} className="flex items-center justify-between">
                                        <Label htmlFor={key} className="text-sm font-medium text-gray-300 cursor-pointer">{formattedLabel}</Label>
                                        <Switch
                                            id={key}
                                            checked={value}
                                            onCheckedChange={(checked: boolean) => setSections({ ...sections, [key]: checked })}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </Card>
                </div>

                {/* --- Right Column: Output --- */}
                <div className="xl:col-span-7 h-full flex flex-col">
                    <Card className="flex-1 flex flex-col border-white/10 shadow-sm rounded-2xl overflow-hidden bg-[#0A0F1C]">
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-2 text-white">
                                <Sparkles size={18} className="text-[#3965FF]" />
                                <h3 className="font-bold">Generated AI Prompt</h3>
                            </div>
                            <Button
                                onClick={copyToClipboard}
                                size="sm"
                                className="bg-[#3965FF] hover:bg-blue-600 text-white gap-2 font-bold rounded-lg"
                            >
                                <Copy size={14} /> Copy Prompt
                            </Button>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                            <pre className="text-sm text-white/80 font-mono whitespace-pre-wrap leading-relaxed outline-none focus:outline-none bg-transparent">
                                {generatePrompt()}
                            </pre>
                        </div>
                        <div className="p-4 bg-white/5 border-t border-white/10 flex items-center gap-3 text-sm text-gray-400">
                            <Wand2 size={16} />
                            <p>Paste this prompt into Claude 3.5 Sonnet, ChatGPT, or v0.dev to generate your UI.</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default WebsitePromptBuilder
