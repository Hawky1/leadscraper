// ─── Types ───────────────────────────────────────────────────────────────────

export type DepartmentId = 'hr' | 'sales' | 'marketing' | 'support' | 'finance' | 'operations' | 'legal' | 'engineering' | 'product' | 'executive'

export interface DepartmentInfo {
    id: DepartmentId
    name: string
    icon: string
    description: string
    workflows: string
    challenges: string
    dataSources: string
}

export interface GptRecommendation {
    name: string
    purpose: string
    trainingData: string[]
    systemPromptPreview: string
    estimatedTimeSaved: string
    complexity: 'low' | 'medium' | 'high'
}

export interface DepartmentAudit {
    departmentId: DepartmentId
    departmentName: string
    automationScore: number
    aiReadinessScore: number
    riskLevel: 'low' | 'medium' | 'high'
    riskFlags: string[]
    workflowsAnalyzed: number
    automationOpportunities: string[]
    recommendedGpts: GptRecommendation[]
    priority: number
}

export interface AuditReport {
    companyName: string
    industry: string
    companySize: string
    analyzedAt: string
    overallReadinessScore: number
    totalGptsRecommended: number
    estimatedMonthlySavings: string
    departments: DepartmentAudit[]
    implementationPhases: ImplementationPhase[]
}

export interface ImplementationPhase {
    phase: number
    name: string
    duration: string
    departments: string[]
    description: string
}

// ─── Department Presets ───────────────────────────────────────────────────────

export const DEPARTMENT_PRESETS: Record<DepartmentId, { name: string; icon: string; defaultWorkflows: string; defaultChallenges: string; defaultDataSources: string }> = {
    hr: {
        name: 'Human Resources',
        icon: 'users',
        defaultWorkflows: 'Recruitment screening, onboarding, policy Q&A, leave management, performance reviews',
        defaultChallenges: 'High volume of repetitive queries, slow candidate screening, inconsistent policy interpretation',
        defaultDataSources: 'Employee handbook, HR policies, job descriptions, interview guides, benefits documentation',
    },
    sales: {
        name: 'Sales',
        icon: 'trending-up',
        defaultWorkflows: 'Lead qualification, proposal writing, CRM updates, follow-up emails, competitive analysis',
        defaultChallenges: 'Time spent on admin tasks, inconsistent messaging, slow proposal turnaround',
        defaultDataSources: 'Product catalogs, pricing sheets, case studies, CRM data, sales playbooks',
    },
    marketing: {
        name: 'Marketing',
        icon: 'megaphone',
        defaultWorkflows: 'Content creation, social media management, email campaigns, SEO optimization, analytics reporting',
        defaultChallenges: 'Content production bottlenecks, brand consistency, campaign ROI tracking',
        defaultDataSources: 'Brand guidelines, content library, campaign data, customer personas, competitor analysis',
    },
    support: {
        name: 'Customer Support',
        icon: 'headphones',
        defaultWorkflows: 'Ticket triage, FAQ responses, escalation routing, satisfaction surveys, knowledge base updates',
        defaultChallenges: 'Long response times, repeated questions, inconsistent answers across agents',
        defaultDataSources: 'Knowledge base articles, FAQ documents, ticket history, product documentation, SLAs',
    },
    finance: {
        name: 'Finance & Accounting',
        icon: 'dollar-sign',
        defaultWorkflows: 'Invoice processing, expense reports, financial reporting, budget forecasting, compliance checks',
        defaultChallenges: 'Manual data entry errors, slow reconciliation, complex regulatory requirements',
        defaultDataSources: 'Financial statements, tax documents, compliance regulations, budget templates, invoices',
    },
    operations: {
        name: 'Operations',
        icon: 'settings',
        defaultWorkflows: 'Process documentation, vendor management, inventory tracking, quality assurance, scheduling',
        defaultChallenges: 'Process inefficiencies, poor documentation, communication gaps between teams',
        defaultDataSources: 'SOPs, process maps, vendor contracts, inventory databases, quality checklists',
    },
    legal: {
        name: 'Legal & Compliance',
        icon: 'shield',
        defaultWorkflows: 'Contract review, compliance monitoring, policy drafting, legal research, NDA management',
        defaultChallenges: 'Contract review bottleneck, keeping up with regulatory changes, inconsistent templates',
        defaultDataSources: 'Contract templates, regulatory documents, company policies, legal precedents, NDAs',
    },
    engineering: {
        name: 'Engineering',
        icon: 'code',
        defaultWorkflows: 'Code review, documentation, bug triage, sprint planning, technical specs, CI/CD monitoring',
        defaultChallenges: 'Documentation debt, context switching, onboarding new developers',
        defaultDataSources: 'Codebase documentation, API specs, architecture diagrams, runbooks, incident reports',
    },
    product: {
        name: 'Product Management',
        icon: 'layout',
        defaultWorkflows: 'Feature prioritization, user research synthesis, PRD writing, roadmap updates, stakeholder comms',
        defaultChallenges: 'Information scattered across tools, slow research synthesis, stakeholder alignment',
        defaultDataSources: 'User research reports, feature requests, analytics data, competitor analysis, roadmaps',
    },
    executive: {
        name: 'Executive / Leadership',
        icon: 'briefcase',
        defaultWorkflows: 'Strategic planning, board reporting, KPI monitoring, market analysis, decision-making support',
        defaultChallenges: 'Information overload, slow reporting cycles, lacking real-time insights',
        defaultDataSources: 'Company KPIs, financial summaries, market reports, board decks, strategic plans',
    },
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i)
        hash |= 0
    }
    return Math.abs(hash)
}

function seededRandom(seed: number): () => number {
    let s = seed
    return () => {
        s = (s * 16807 + 0) % 2147483647
        return s / 2147483647
    }
}

// ─── GPT Templates per Department ────────────────────────────────────────────

const GPT_TEMPLATES: Record<DepartmentId, GptRecommendation[]> = {
    hr: [
        { name: 'HR Policy Assistant', purpose: 'Answer employee questions about company policies, benefits, and procedures using your internal HR documentation.', trainingData: ['Employee handbook', 'HR policy documents', 'Benefits guide', 'Company culture docs'], systemPromptPreview: 'You are an internal HR assistant for {company}. Answer employee questions about policies, benefits, leave, and procedures strictly based on the provided HR documentation. Never fabricate policies.', estimatedTimeSaved: '15-20 hrs/week', complexity: 'low' },
        { name: 'Resume Screener', purpose: 'Screen and rank incoming resumes against job descriptions, highlighting key qualifications and red flags.', trainingData: ['Job descriptions', 'Ideal candidate profiles', 'Past successful hire data', 'Skills taxonomy'], systemPromptPreview: 'You are a recruitment screening assistant for {company}. Analyze resumes against the provided job description and score candidates on fit, experience, and skills. Be objective and highlight both strengths and gaps.', estimatedTimeSaved: '10-15 hrs/week', complexity: 'medium' },
        { name: 'Onboarding Guide', purpose: 'Walk new hires through their first 90 days with personalized checklists, training schedules, and company orientation.', trainingData: ['Onboarding checklist', 'Training materials', 'Team structure docs', 'IT setup guides'], systemPromptPreview: 'You are an onboarding assistant for new employees at {company}. Guide them through their first 90 days, answer questions about setup, training, and company culture.', estimatedTimeSaved: '8-12 hrs/week', complexity: 'low' },
    ],
    sales: [
        { name: 'Sales Proposal Writer', purpose: 'Generate tailored proposals and pitch decks based on prospect needs and your product catalog.', trainingData: ['Product catalog', 'Pricing sheets', 'Past winning proposals', 'Case studies'], systemPromptPreview: 'You are a sales proposal assistant for {company}. Generate compelling proposals tailored to each prospect, using the product catalog and pricing info provided. Match features to the client\'s specific pain points.', estimatedTimeSaved: '12-18 hrs/week', complexity: 'medium' },
        { name: 'Competitive Intelligence Bot', purpose: 'Provide real-time competitive positioning and battle cards for sales conversations.', trainingData: ['Competitor analysis', 'Battle cards', 'Product comparison sheets', 'Win/loss reports'], systemPromptPreview: 'You are a competitive intelligence assistant for {company}\'s sales team. When asked about a competitor, provide positioning, strengths, weaknesses, and talking points from the loaded battle cards.', estimatedTimeSaved: '5-8 hrs/week', complexity: 'low' },
        { name: 'Follow-Up Email Generator', purpose: 'Draft personalized follow-up emails based on meeting notes and CRM context.', trainingData: ['Email templates', 'Meeting notes format', 'Product info', 'Brand voice guide'], systemPromptPreview: 'You are a sales email assistant for {company}. Write personalized follow-up emails based on the provided meeting notes. Match the brand voice and include relevant product info.', estimatedTimeSaved: '8-10 hrs/week', complexity: 'low' },
    ],
    marketing: [
        { name: 'Content Creator', purpose: 'Generate on-brand blog posts, social media content, and email copy aligned with your brand guidelines.', trainingData: ['Brand guidelines', 'Content calendar', 'Target personas', 'Past top-performing content'], systemPromptPreview: 'You are a content creation assistant for {company}. Generate marketing content that aligns with the brand guidelines, target personas, and current campaign themes provided.', estimatedTimeSaved: '15-25 hrs/week', complexity: 'medium' },
        { name: 'SEO Keyword Strategist', purpose: 'Research and recommend keyword strategies based on your niche, competitors, and content gaps.', trainingData: ['Current keyword rankings', 'Competitor domains', 'Content inventory', 'Industry trends'], systemPromptPreview: 'You are an SEO strategist for {company}. Analyze the provided keyword data and content inventory to recommend high-impact keyword opportunities and content strategies.', estimatedTimeSaved: '5-8 hrs/week', complexity: 'medium' },
    ],
    support: [
        { name: 'Customer Support Agent', purpose: 'Handle Tier-1 support tickets by answering common questions from your knowledge base.', trainingData: ['Knowledge base articles', 'FAQ documents', 'Product documentation', 'Troubleshooting guides'], systemPromptPreview: 'You are a customer support assistant for {company}. Answer customer questions using ONLY the provided knowledge base. If you cannot find an answer, escalate to a human agent. Never guess.', estimatedTimeSaved: '20-30 hrs/week', complexity: 'low' },
        { name: 'Ticket Triage Bot', purpose: 'Categorize, prioritize, and route incoming support tickets to the right team.', trainingData: ['Ticket categories', 'Routing rules', 'SLA documents', 'Team responsibilities'], systemPromptPreview: 'You are a ticket triage assistant for {company}. Classify incoming tickets by category, urgency, and route them to the appropriate team. Apply SLA rules for response time targets.', estimatedTimeSaved: '10-15 hrs/week', complexity: 'medium' },
    ],
    finance: [
        { name: 'Expense Report Processor', purpose: 'Review and validate expense reports against company policy, flagging anomalies.', trainingData: ['Expense policies', 'Approval workflows', 'Spending limits', 'Past reports'], systemPromptPreview: 'You are an expense review assistant for {company}. Validate submitted expenses against company policy. Flag any items that exceed limits or violate rules.', estimatedTimeSaved: '8-12 hrs/week', complexity: 'medium' },
        { name: 'Financial Query Assistant', purpose: 'Answer internal questions about budgets, forecasts, and financial procedures.', trainingData: ['Budget documents', 'Financial procedures', 'Reporting templates', 'Fiscal year plans'], systemPromptPreview: 'You are a financial information assistant for {company}. Answer questions about budgets, forecasts, and financial procedures using the provided documentation.', estimatedTimeSaved: '5-8 hrs/week', complexity: 'low' },
    ],
    operations: [
        { name: 'SOP Assistant', purpose: 'Help employees find and follow standard operating procedures for any process.', trainingData: ['SOPs', 'Process maps', 'Quality checklists', 'Workflow documentation'], systemPromptPreview: 'You are an operations assistant for {company}. Help employees find the right SOP and guide them step-by-step through any operational process.', estimatedTimeSaved: '10-15 hrs/week', complexity: 'low' },
        { name: 'Vendor Communication Bot', purpose: 'Draft vendor communications, track contract terms, and manage procurement queries.', trainingData: ['Vendor contracts', 'Procurement policies', 'Communication templates', 'Vendor database'], systemPromptPreview: 'You are a vendor management assistant for {company}. Help draft vendor communications, reference contract terms, and enforce procurement policies.', estimatedTimeSaved: '5-8 hrs/week', complexity: 'medium' },
    ],
    legal: [
        { name: 'Contract Review Assistant', purpose: 'Analyze contracts against your standard terms and flag deviations, risks, and missing clauses.', trainingData: ['Standard contract templates', 'Legal playbook', 'Risk assessment criteria', 'Compliance requirements'], systemPromptPreview: 'You are a legal contract review assistant for {company}. Analyze contracts against standard terms and flag risks, non-standard clauses, and missing protections. Always recommend human review for final approval.', estimatedTimeSaved: '15-20 hrs/week', complexity: 'high' },
        { name: 'Compliance Monitor', purpose: 'Track regulatory changes and check internal policies against current compliance requirements.', trainingData: ['Regulatory frameworks', 'Company policies', 'Audit reports', 'Compliance checklists'], systemPromptPreview: 'You are a compliance monitoring assistant for {company}. Cross-reference company policies against the latest regulatory requirements and flag gaps.', estimatedTimeSaved: '5-10 hrs/week', complexity: 'high' },
    ],
    engineering: [
        { name: 'Code Documentation Bot', purpose: 'Generate and maintain code documentation, API references, and architecture decision records.', trainingData: ['Codebase docs', 'API specifications', 'Architecture diagrams', 'Coding standards'], systemPromptPreview: 'You are a documentation assistant for {company}\'s engineering team. Generate clear, accurate documentation from code context and maintain consistency with existing documentation style.', estimatedTimeSaved: '8-12 hrs/week', complexity: 'medium' },
        { name: 'Incident Response Helper', purpose: 'Guide engineers through incident response runbooks and post-mortem analysis.', trainingData: ['Runbooks', 'Incident playbooks', 'Past post-mortems', 'System architecture docs'], systemPromptPreview: 'You are an incident response assistant for {company}. Guide engineers through the appropriate runbook based on the reported symptoms and help draft post-mortem reports.', estimatedTimeSaved: '5-8 hrs/week', complexity: 'medium' },
    ],
    product: [
        { name: 'PRD Writer', purpose: 'Draft product requirement documents from feature briefs and user research insights.', trainingData: ['PRD templates', 'User research reports', 'Feature request database', 'Product strategy docs'], systemPromptPreview: 'You are a product management assistant for {company}. Draft comprehensive PRDs from feature briefs, incorporating user research insights and technical constraints.', estimatedTimeSaved: '10-15 hrs/week', complexity: 'medium' },
        { name: 'Research Synthesizer', purpose: 'Analyze and summarize user research interviews, surveys, and feedback into actionable insights.', trainingData: ['Interview transcripts', 'Survey results', 'Customer feedback', 'Usage analytics'], systemPromptPreview: 'You are a user research assistant for {company}. Synthesize research data into clear themes, insights, and actionable recommendations for the product team.', estimatedTimeSaved: '8-12 hrs/week', complexity: 'medium' },
    ],
    executive: [
        { name: 'Executive Briefing Bot', purpose: 'Generate daily/weekly executive briefings from company KPIs, news, and team updates.', trainingData: ['KPI dashboards', 'Department reports', 'Industry news feeds', 'Strategic plans'], systemPromptPreview: 'You are an executive briefing assistant for {company}. Compile the latest KPIs, department updates, and industry developments into a concise briefing for leadership.', estimatedTimeSaved: '5-10 hrs/week', complexity: 'medium' },
        { name: 'Board Report Generator', purpose: 'Draft board-ready reports from financial data, operational metrics, and strategic updates.', trainingData: ['Past board decks', 'Financial reports', 'Strategic goals', 'Milestone trackers'], systemPromptPreview: 'You are a board reporting assistant for {company}. Generate professional board-ready reports from the provided data, following the established format and highlighting key decisions needed.', estimatedTimeSaved: '8-12 hrs/week', complexity: 'high' },
    ],
}

// ─── Main Audit Function ─────────────────────────────────────────────────────

export async function runAiAudit(
    companyName: string,
    industry: string,
    companySize: string,
    departments: DepartmentInfo[],
    onProgress?: (dept: string, pct: number) => void
): Promise<AuditReport> {
    const seed = simpleHash(companyName + industry + departments.map(d => d.id).join(''))
    const rand = seededRandom(seed)

    const departmentAudits: DepartmentAudit[] = []
    let totalGpts = 0

    for (let i = 0; i < departments.length; i++) {
        const dept = departments[i]
        const preset = DEPARTMENT_PRESETS[dept.id]

        if (onProgress) onProgress(preset.name, ((i + 1) / departments.length) * 100)
        await new Promise(r => setTimeout(r, 600 + rand() * 800))

        const gpts = GPT_TEMPLATES[dept.id] || []
        totalGpts += gpts.length

        const automationScore = Math.round(45 + rand() * 50)
        const aiReadinessScore = Math.round(35 + rand() * 55)

        const riskLevel: 'low' | 'medium' | 'high' =
            dept.id === 'legal' || dept.id === 'finance' ? 'high' :
                dept.id === 'hr' || dept.id === 'executive' ? 'medium' : 'low'

        const riskFlags: string[] = []
        if (riskLevel === 'high') {
            riskFlags.push('Contains sensitive/regulated data — requires strict access controls')
            riskFlags.push('AI outputs must be reviewed by qualified personnel before action')
        }
        if (riskLevel === 'medium') {
            riskFlags.push('Contains personal employee data — ensure GDPR/privacy compliance')
        }
        if (dept.id === 'support') riskFlags.push('Customer-facing AI requires quality assurance protocols')
        if (dept.id === 'sales') riskFlags.push('Ensure pricing accuracy — human review required for quotes')

        const automationOpportunities = [
            `Automate ${Math.floor(rand() * 40 + 30)}% of repetitive ${preset.name.toLowerCase()} queries`,
            `Reduce response time by ${Math.floor(rand() * 50 + 30)}% with AI-assisted processing`,
            `Save ${gpts.reduce((sum, g) => { const m = g.estimatedTimeSaved.match(/(\d+)/); return sum + (m ? parseInt(m[1]) : 5) }, 0)}+ hours/week across ${gpts.length} AI agents`,
        ]

        departmentAudits.push({
            departmentId: dept.id,
            departmentName: preset.name,
            automationScore,
            aiReadinessScore,
            riskLevel,
            riskFlags,
            workflowsAnalyzed: 3 + Math.floor(rand() * 5),
            automationOpportunities,
            recommendedGpts: gpts.map(g => ({
                ...g,
                systemPromptPreview: g.systemPromptPreview.replace(/{company}/g, companyName),
            })),
            priority: i + 1,
        })
    }

    // Sort by automation score (highest first) and re-assign priority
    departmentAudits.sort((a, b) => b.automationScore - a.automationScore)
    departmentAudits.forEach((d, i) => { d.priority = i + 1 })

    const overallReadinessScore = Math.round(
        departmentAudits.reduce((s, d) => s + d.aiReadinessScore, 0) / departmentAudits.length
    )

    // Generate implementation phases
    const phases: ImplementationPhase[] = []
    const sortedDepts = [...departmentAudits]

    if (sortedDepts.length >= 1) {
        phases.push({
            phase: 1,
            name: 'Quick Wins',
            duration: '2-3 weeks',
            departments: sortedDepts.slice(0, Math.min(2, sortedDepts.length)).map(d => d.departmentName),
            description: 'Deploy low-complexity, high-impact GPTs in departments with the highest automation scores. Focus on FAQ bots and document assistants.',
        })
    }
    if (sortedDepts.length >= 3) {
        phases.push({
            phase: 2,
            name: 'Expansion',
            duration: '4-6 weeks',
            departments: sortedDepts.slice(2, Math.min(5, sortedDepts.length)).map(d => d.departmentName),
            description: 'Roll out medium-complexity agents. Begin training agents on department-specific data and integrate with existing tools.',
        })
    }
    if (sortedDepts.length >= 5) {
        phases.push({
            phase: 3,
            name: 'Advanced Deployment',
            duration: '6-8 weeks',
            departments: sortedDepts.slice(5).map(d => d.departmentName),
            description: 'Deploy advanced agents with higher complexity, requiring more robust training data and compliance reviews.',
        })
    }
    phases.push({
        phase: phases.length + 1,
        name: 'Optimization & Scaling',
        duration: 'Ongoing',
        departments: ['All Departments'],
        description: 'Monitor agent performance, refine training data, expand capabilities, and measure ROI against baseline metrics.',
    })

    const monthlySavings = Math.round(totalGpts * (1500 + rand() * 3000))

    return {
        companyName,
        industry,
        companySize,
        analyzedAt: new Date().toISOString(),
        overallReadinessScore,
        totalGptsRecommended: totalGpts,
        estimatedMonthlySavings: `$${monthlySavings.toLocaleString()}`,
        departments: departmentAudits,
        implementationPhases: phases,
    }
}
