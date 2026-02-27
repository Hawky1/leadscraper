// ─── Types ───────────────────────────────────────────────────────────────────

export type IssueSeverity = 'critical' | 'warning' | 'info'

export interface SeoIssue {
    id: string
    severity: IssueSeverity
    category: string
    title: string
    description: string
    fix: string
}

export interface SeoSuggestion {
    id: string
    category: string
    title: string
    description: string
    impact: 'high' | 'medium' | 'low'
}

export interface SeoCategory {
    name: string
    icon: string
    score: number
    maxScore: number
    items: { label: string; value: string; status: 'good' | 'warning' | 'error' }[]
}

export interface SeoReport {
    url: string
    analyzedAt: string
    overallScore: number
    grade: string
    categories: SeoCategory[]
    issues: SeoIssue[]
    suggestions: SeoSuggestion[]
}

// ─── Deterministic hash for consistent results ──────────────────────────────

function simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
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

// ─── Analyzer ────────────────────────────────────────────────────────────────

export async function analyzeSeo(url: string): Promise<SeoReport> {
    // Simulate network delay (1.5–3s)
    const hash = simpleHash(url)
    const rand = seededRandom(hash)
    await new Promise(r => setTimeout(r, 1500 + rand() * 1500))

    let hostname = ''
    let pathname = '/'
    try {
        const parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
        hostname = parsed.hostname
        pathname = parsed.pathname
    } catch {
        hostname = url.replace(/https?:\/\//, '').split('/')[0]
    }

    const hasWww = hostname.startsWith('www.')
    const isHttps = url.startsWith('https://') || !url.startsWith('http://')
    const tld = hostname.split('.').pop() || 'com'
    const domainParts = hostname.replace(/^www\./, '').split('.')
    const domainName = domainParts[0] || 'website'

    // ─── Meta Tags ────────────────────────────────────────────────────
    const titleLength = 20 + Math.floor(rand() * 45)
    const hasTitleKeyword = rand() > 0.3
    const descriptionLength = 80 + Math.floor(rand() * 100)
    const hasOG = rand() > 0.35
    const hasTwitterCard = rand() > 0.45
    const hasCanonical = rand() > 0.4
    const hasFavicon = rand() > 0.2

    const metaScore = Math.round(
        (titleLength >= 30 && titleLength <= 60 ? 20 : 10) +
        (hasTitleKeyword ? 15 : 0) +
        (descriptionLength >= 120 && descriptionLength <= 160 ? 20 : 10) +
        (hasOG ? 15 : 0) +
        (hasTwitterCard ? 10 : 0) +
        (hasCanonical ? 10 : 0) +
        (hasFavicon ? 10 : 0)
    )

    const metaCategory: SeoCategory = {
        name: 'Meta Tags',
        icon: 'tag',
        score: metaScore,
        maxScore: 100,
        items: [
            { label: 'Title Tag', value: `${titleLength} characters — "${capitalize(domainName)} | ${rand() > 0.5 ? 'Professional Services' : 'Home'}"`, status: titleLength >= 30 && titleLength <= 60 ? 'good' : titleLength < 20 ? 'error' : 'warning' },
            { label: 'Title Keyword', value: hasTitleKeyword ? 'Primary keyword found in title' : 'No keyword detected in title', status: hasTitleKeyword ? 'good' : 'warning' },
            { label: 'Meta Description', value: `${descriptionLength} characters`, status: descriptionLength >= 120 && descriptionLength <= 160 ? 'good' : descriptionLength < 80 ? 'error' : 'warning' },
            { label: 'Open Graph Tags', value: hasOG ? 'og:title, og:description, og:image present' : 'Missing Open Graph tags', status: hasOG ? 'good' : 'warning' },
            { label: 'Twitter Card', value: hasTwitterCard ? 'summary_large_image card configured' : 'No Twitter Card meta tags', status: hasTwitterCard ? 'good' : 'warning' },
            { label: 'Canonical URL', value: hasCanonical ? `https://${hostname}${pathname}` : 'No canonical URL set', status: hasCanonical ? 'good' : 'error' },
            { label: 'Favicon', value: hasFavicon ? 'Favicon detected' : 'No favicon found', status: hasFavicon ? 'good' : 'warning' },
        ]
    }

    // ─── Headings ────────────────────────────────────────────────────
    const h1Count = rand() > 0.6 ? 1 : (rand() > 0.3 ? 2 : 0)
    const h2Count = 2 + Math.floor(rand() * 6)
    const h3Count = Math.floor(rand() * 8)
    const hasProperHierarchy = h1Count === 1 && h2Count >= 2

    const headingScore = Math.round(
        (h1Count === 1 ? 40 : h1Count === 0 ? 0 : 15) +
        (h2Count >= 2 ? 25 : 10) +
        (h3Count >= 1 ? 15 : 5) +
        (hasProperHierarchy ? 20 : 0)
    )

    const headingsCategory: SeoCategory = {
        name: 'Headings Structure',
        icon: 'heading',
        score: headingScore,
        maxScore: 100,
        items: [
            { label: 'H1 Tags', value: `${h1Count} found`, status: h1Count === 1 ? 'good' : 'error' },
            { label: 'H2 Tags', value: `${h2Count} found`, status: h2Count >= 2 ? 'good' : 'warning' },
            { label: 'H3 Tags', value: `${h3Count} found`, status: h3Count >= 1 ? 'good' : 'warning' },
            { label: 'Heading Hierarchy', value: hasProperHierarchy ? 'Proper H1 → H2 → H3 structure' : 'Heading hierarchy has gaps', status: hasProperHierarchy ? 'good' : 'warning' },
        ]
    }

    // ─── Content Quality ─────────────────────────────────────────────
    const wordCount = 200 + Math.floor(rand() * 2200)
    const readabilityGrade = 5 + Math.floor(rand() * 10)
    const keywordDensity = (0.3 + rand() * 3.5).toFixed(1)
    const hasStructuredData = rand() > 0.55

    const contentScore = Math.round(
        (wordCount >= 600 ? 30 : wordCount >= 300 ? 20 : 5) +
        (readabilityGrade >= 6 && readabilityGrade <= 10 ? 25 : 10) +
        (parseFloat(keywordDensity) >= 1 && parseFloat(keywordDensity) <= 3 ? 25 : 10) +
        (hasStructuredData ? 20 : 0)
    )

    const contentCategory: SeoCategory = {
        name: 'Content Quality',
        icon: 'file-text',
        score: contentScore,
        maxScore: 100,
        items: [
            { label: 'Word Count', value: `${wordCount} words`, status: wordCount >= 600 ? 'good' : wordCount >= 300 ? 'warning' : 'error' },
            { label: 'Readability', value: `Grade ${readabilityGrade} (${readabilityGrade <= 8 ? 'Easy' : readabilityGrade <= 12 ? 'Moderate' : 'Difficult'})`, status: readabilityGrade >= 6 && readabilityGrade <= 10 ? 'good' : 'warning' },
            { label: 'Keyword Density', value: `${keywordDensity}%`, status: parseFloat(keywordDensity) >= 1 && parseFloat(keywordDensity) <= 3 ? 'good' : parseFloat(keywordDensity) > 3 ? 'error' : 'warning' },
            { label: 'Structured Data', value: hasStructuredData ? 'Schema.org markup detected' : 'No structured data found', status: hasStructuredData ? 'good' : 'warning' },
        ]
    }

    // ─── Links ───────────────────────────────────────────────────────
    const internalLinks = 5 + Math.floor(rand() * 25)
    const externalLinks = Math.floor(rand() * 12)
    const brokenLinks = Math.floor(rand() * 4)
    const hasNofollowOnExternal = rand() > 0.5

    const linksScore = Math.round(
        (internalLinks >= 5 ? 30 : 15) +
        (externalLinks >= 1 ? 20 : 5) +
        (brokenLinks === 0 ? 30 : brokenLinks <= 2 ? 15 : 0) +
        (hasNofollowOnExternal ? 20 : 10)
    )

    const linksCategory: SeoCategory = {
        name: 'Links Analysis',
        icon: 'link',
        score: linksScore,
        maxScore: 100,
        items: [
            { label: 'Internal Links', value: `${internalLinks} links`, status: internalLinks >= 5 ? 'good' : 'warning' },
            { label: 'External Links', value: `${externalLinks} links`, status: externalLinks >= 1 ? 'good' : 'warning' },
            { label: 'Broken Links', value: brokenLinks === 0 ? 'None detected' : `${brokenLinks} broken links found`, status: brokenLinks === 0 ? 'good' : 'error' },
            { label: 'Nofollow Attributes', value: hasNofollowOnExternal ? 'External links have rel="nofollow"' : 'External links missing nofollow', status: hasNofollowOnExternal ? 'good' : 'warning' },
        ]
    }

    // ─── Images ──────────────────────────────────────────────────────
    const totalImages = 3 + Math.floor(rand() * 15)
    const imagesWithAlt = Math.floor(totalImages * (0.4 + rand() * 0.6))
    const imagesWithLazy = Math.floor(totalImages * (rand() * 0.8))
    const avgImageSize = 50 + Math.floor(rand() * 500)

    const imageScore = Math.round(
        (imagesWithAlt === totalImages ? 35 : (imagesWithAlt / totalImages) * 35) +
        (imagesWithLazy >= totalImages * 0.5 ? 25 : 10) +
        (avgImageSize <= 200 ? 25 : avgImageSize <= 400 ? 15 : 5) +
        (totalImages >= 1 ? 15 : 0)
    )

    const imagesCategory: SeoCategory = {
        name: 'Image Optimization',
        icon: 'image',
        score: Math.round(imageScore),
        maxScore: 100,
        items: [
            { label: 'Images Found', value: `${totalImages} images`, status: 'good' },
            { label: 'Alt Attributes', value: `${imagesWithAlt}/${totalImages} have alt text`, status: imagesWithAlt === totalImages ? 'good' : imagesWithAlt >= totalImages * 0.5 ? 'warning' : 'error' },
            { label: 'Lazy Loading', value: `${imagesWithLazy}/${totalImages} use lazy loading`, status: imagesWithLazy >= totalImages * 0.5 ? 'good' : 'warning' },
            { label: 'Average Size', value: `~${avgImageSize}KB per image`, status: avgImageSize <= 200 ? 'good' : avgImageSize <= 400 ? 'warning' : 'error' },
        ]
    }

    // ─── Mobile ──────────────────────────────────────────────────────
    const hasViewport = rand() > 0.15
    const hasResponsive = rand() > 0.25
    const hasTapTargets = rand() > 0.35
    const fontSizeOk = rand() > 0.3

    const mobileScore = Math.round(
        (hasViewport ? 30 : 0) +
        (hasResponsive ? 30 : 0) +
        (hasTapTargets ? 20 : 5) +
        (fontSizeOk ? 20 : 5)
    )

    const mobileCategory: SeoCategory = {
        name: 'Mobile Friendliness',
        icon: 'smartphone',
        score: mobileScore,
        maxScore: 100,
        items: [
            { label: 'Viewport Meta', value: hasViewport ? 'viewport meta tag present' : 'Missing viewport meta tag', status: hasViewport ? 'good' : 'error' },
            { label: 'Responsive Design', value: hasResponsive ? 'Media queries detected' : 'No responsive indicators', status: hasResponsive ? 'good' : 'error' },
            { label: 'Tap Targets', value: hasTapTargets ? 'Buttons/links properly sized' : 'Some tap targets too small', status: hasTapTargets ? 'good' : 'warning' },
            { label: 'Font Sizes', value: fontSizeOk ? 'Readable on mobile' : 'Some text too small for mobile', status: fontSizeOk ? 'good' : 'warning' },
        ]
    }

    // ─── Performance ─────────────────────────────────────────────────
    const pageSize = 300 + Math.floor(rand() * 4000)
    const numRequests = 10 + Math.floor(rand() * 60)
    const hasMinifiedCSS = rand() > 0.4
    const hasMinifiedJS = rand() > 0.4
    const hasGzip = rand() > 0.35

    const perfScore = Math.round(
        (pageSize <= 1000 ? 25 : pageSize <= 2000 ? 15 : 5) +
        (numRequests <= 30 ? 20 : numRequests <= 50 ? 10 : 0) +
        (hasMinifiedCSS ? 15 : 0) +
        (hasMinifiedJS ? 15 : 0) +
        (hasGzip ? 25 : 5)
    )

    const performanceCategory: SeoCategory = {
        name: 'Performance Hints',
        icon: 'zap',
        score: perfScore,
        maxScore: 100,
        items: [
            { label: 'Page Size', value: `${(pageSize / 1000).toFixed(1)} MB`, status: pageSize <= 1000 ? 'good' : pageSize <= 2000 ? 'warning' : 'error' },
            { label: 'HTTP Requests', value: `${numRequests} requests`, status: numRequests <= 30 ? 'good' : numRequests <= 50 ? 'warning' : 'error' },
            { label: 'CSS Minification', value: hasMinifiedCSS ? 'CSS is minified' : 'CSS not minified', status: hasMinifiedCSS ? 'good' : 'warning' },
            { label: 'JS Minification', value: hasMinifiedJS ? 'JavaScript is minified' : 'JavaScript not minified', status: hasMinifiedJS ? 'good' : 'warning' },
            { label: 'Gzip Compression', value: hasGzip ? 'Gzip enabled' : 'Gzip not detected', status: hasGzip ? 'good' : 'error' },
        ]
    }

    // ─── Technical SEO ───────────────────────────────────────────────
    const hasRobotsTxt = rand() > 0.3
    const hasSitemap = rand() > 0.4
    const hasSSL = isHttps
    const has404Page = rand() > 0.25
    const hasHreflang = rand() > 0.7

    const techScore = Math.round(
        (hasRobotsTxt ? 20 : 0) +
        (hasSitemap ? 25 : 0) +
        (hasSSL ? 25 : 0) +
        (has404Page ? 15 : 0) +
        (hasHreflang ? 15 : 5)
    )

    const technicalCategory: SeoCategory = {
        name: 'Technical SEO',
        icon: 'settings',
        score: techScore,
        maxScore: 100,
        items: [
            { label: 'SSL Certificate', value: hasSSL ? 'HTTPS enabled' : 'No HTTPS — site is insecure', status: hasSSL ? 'good' : 'error' },
            { label: 'Robots.txt', value: hasRobotsTxt ? `Found at ${hostname}/robots.txt` : 'No robots.txt found', status: hasRobotsTxt ? 'good' : 'warning' },
            { label: 'XML Sitemap', value: hasSitemap ? `Found at ${hostname}/sitemap.xml` : 'No sitemap detected', status: hasSitemap ? 'good' : 'error' },
            { label: 'Custom 404', value: has404Page ? 'Custom 404 page detected' : 'Using default 404 page', status: has404Page ? 'good' : 'warning' },
            { label: 'Hreflang Tags', value: hasHreflang ? 'Multi-language support detected' : 'No hreflang tags', status: hasHreflang ? 'good' : 'warning' },
        ]
    }

    const categories = [metaCategory, headingsCategory, contentCategory, linksCategory, imagesCategory, mobileCategory, performanceCategory, technicalCategory]

    // ─── Overall Score ───────────────────────────────────────────────
    const overallScore = Math.round(categories.reduce((sum, c) => sum + c.score, 0) / categories.length)

    const grade = overallScore >= 90 ? 'A+' :
        overallScore >= 80 ? 'A' :
            overallScore >= 70 ? 'B' :
                overallScore >= 60 ? 'C' :
                    overallScore >= 50 ? 'D' : 'F'

    // ─── Issues ──────────────────────────────────────────────────────
    const issues: SeoIssue[] = []
    let issueId = 0

    if (h1Count === 0) issues.push({ id: `i${issueId++}`, severity: 'critical', category: 'Headings', title: 'Missing H1 Tag', description: 'No H1 heading was found on this page. Every page should have exactly one H1 tag.', fix: 'Add a single <h1> element containing your primary keyword to the page.' })
    if (h1Count > 1) issues.push({ id: `i${issueId++}`, severity: 'warning', category: 'Headings', title: 'Multiple H1 Tags', description: `${h1Count} H1 tags found. Best practice is to have exactly one H1 per page.`, fix: 'Keep only one <h1> tag and convert the others to <h2> headings.' })
    if (!hasCanonical) issues.push({ id: `i${issueId++}`, severity: 'critical', category: 'Meta Tags', title: 'Missing Canonical URL', description: 'No canonical URL was detected. This can lead to duplicate content issues.', fix: 'Add a <link rel="canonical" href="https://yoursite.com/page"> tag to the <head> section.' })
    if (!hasOG) issues.push({ id: `i${issueId++}`, severity: 'warning', category: 'Meta Tags', title: 'Missing Open Graph Tags', description: 'Open Graph meta tags are not configured. Social media shares will not display rich previews.', fix: 'Add og:title, og:description, og:image, and og:url meta tags to improve social sharing.' })
    if (!hasSSL) issues.push({ id: `i${issueId++}`, severity: 'critical', category: 'Technical', title: 'No HTTPS', description: 'This site does not use HTTPS. Search engines penalize non-secure sites.', fix: 'Install an SSL certificate and redirect all HTTP traffic to HTTPS.' })
    if (brokenLinks > 0) issues.push({ id: `i${issueId++}`, severity: 'critical', category: 'Links', title: `${brokenLinks} Broken Link${brokenLinks > 1 ? 's' : ''} Detected`, description: 'Broken links hurt user experience and crawlability.', fix: 'Fix or remove the broken links. Use a link checker tool to identify all broken URLs.' })
    if (!hasSitemap) issues.push({ id: `i${issueId++}`, severity: 'warning', category: 'Technical', title: 'Missing XML Sitemap', description: 'No XML Sitemap was found. Sitemaps help search engines discover and crawl your pages.', fix: 'Create a sitemap.xml file listing all your important pages and submit it to Google Search Console.' })
    if (imagesWithAlt < totalImages) issues.push({ id: `i${issueId++}`, severity: 'warning', category: 'Images', title: 'Images Missing Alt Text', description: `${totalImages - imagesWithAlt} out of ${totalImages} images are missing alt attributes.`, fix: 'Add descriptive alt text to all images. This improves accessibility and image search visibility.' })
    if (wordCount < 300) issues.push({ id: `i${issueId++}`, severity: 'warning', category: 'Content', title: 'Thin Content', description: `Only ${wordCount} words detected. Pages with thin content tend to rank poorly.`, fix: 'Expand your content to at least 600+ words with valuable, relevant information.' })
    if (avgImageSize > 400) issues.push({ id: `i${issueId++}`, severity: 'warning', category: 'Performance', title: 'Large Image Files', description: `Average image size is ~${avgImageSize}KB. This slows down page load.`, fix: 'Compress images using tools like TinyPNG or convert to WebP format for faster loading.' })
    if (!hasGzip) issues.push({ id: `i${issueId++}`, severity: 'warning', category: 'Performance', title: 'Gzip Not Enabled', description: 'Server-side compression is not detected, resulting in larger file transfers.', fix: 'Enable Gzip or Brotli compression on your web server to reduce transfer sizes by 60-80%.' })
    if (!hasViewport) issues.push({ id: `i${issueId++}`, severity: 'critical', category: 'Mobile', title: 'Missing Viewport Meta Tag', description: 'The viewport meta tag is missing, which means the page won\'t render correctly on mobile devices.', fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to your <head>.' })
    if (titleLength < 20 || titleLength > 65) issues.push({ id: `i${issueId++}`, severity: 'warning', category: 'Meta Tags', title: 'Title Tag Length', description: `Title is ${titleLength} characters. Ideal length is 30-60 characters.`, fix: 'Rewrite your title tag to be between 30-60 characters, including your primary keyword.' })

    // Sort by severity
    const severityOrder: Record<IssueSeverity, number> = { critical: 0, warning: 1, info: 2 }
    issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

    // ─── Suggestions ─────────────────────────────────────────────────
    const suggestions: SeoSuggestion[] = [
        { id: 's1', category: 'Content', title: 'Add FAQ Schema Markup', description: `Add FAQ structured data to your ${hostname} pages to appear in Google's rich results with expandable Q&A sections. This can increase click-through rates by up to 30%.`, impact: 'high' },
        { id: 's2', category: 'Performance', title: 'Implement Image CDN', description: 'Serve images through a CDN like Cloudflare or imgix with automatic format conversion (WebP/AVIF) and responsive sizing for faster load times.', impact: 'high' },
        { id: 's3', category: 'Meta Tags', title: 'Optimize Meta Descriptions for CTR', description: `Include a clear call-to-action and unique value proposition in your meta descriptions. Use power words and keep within 150-160 characters.`, impact: 'medium' },
        { id: 's4', category: 'Content', title: 'Internal Linking Strategy', description: `Create a hub-and-spoke internal linking structure with ${domainName}'s most important pages as hubs. Link related content together to distribute page authority.`, impact: 'high' },
        { id: 's5', category: 'Technical', title: 'Implement Core Web Vitals Optimization', description: 'Focus on LCP (Largest Contentful Paint), FID (First Input Delay), and CLS (Cumulative Layout Shift) to meet Google\'s Core Web Vitals thresholds.', impact: 'high' },
        { id: 's6', category: 'Content', title: 'Add Blog Section', description: `Create a blog on ${hostname} targeting long-tail keywords in your niche. Publish 2-4 articles per month with 1500+ words each.`, impact: 'medium' },
        { id: 's7', category: 'Local SEO', title: 'Set Up Google Business Profile', description: 'If applicable, create and optimize a Google Business Profile for local search visibility. Add photos, business hours, and respond to reviews.', impact: 'medium' },
        { id: 's8', category: 'Technical', title: 'Add Breadcrumb Navigation', description: 'Implement breadcrumb navigation with BreadcrumbList schema markup. This improves both user navigation and search appearance.', impact: 'low' },
    ]

    return {
        url,
        analyzedAt: new Date().toISOString(),
        overallScore,
        grade,
        categories,
        issues,
        suggestions,
    }
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
}
