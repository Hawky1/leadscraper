export const triggerN8nWebhook = async (searchData: { id: string, niche: string, location: string }) => {
    const WEBHOOK_URL = 'https://n8n.example.com/webhook/webhunt-orchestrator' // Placeholder URL

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchData),
        })

        if (!response.ok) {
            console.error('Failed to trigger n8n webhook')
        }
    } catch (error) {
        console.error('Error triggering n8n webhook:', error)
    }
}
