// All API calls directly to the FastAPI backend
const BASE = 'http://127.0.0.1:8000'

export async function addProduct(data) {
    const res = await fetch(`${BASE}/api/add_product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to add product')
    return res.json()
}

export async function getPrices(productId) {
    const res = await fetch(`${BASE}/api/get_prices/${productId}`)
    return res.json()
}

export async function getDemand(productId) {
    const res = await fetch(`${BASE}/api/get_demand_metrics/${productId}`)
    return res.json()
}

export async function getTrends(productId) {
    const res = await fetch(`${BASE}/api/get_trends/${productId}`)
    return res.json()
}

export async function getRecommendation(productId) {
    const res = await fetch(`${BASE}/api/get_ai_recommendation/${productId}`)
    return res.json()
}

export async function getAlerts(productId) {
    const res = await fetch(`${BASE}/api/get_alerts/${productId}`)
    return res.json()
}

export async function getRisk(productId) {
    const res = await fetch(`${BASE}/api/get_risk/${productId}`)
    return res.json()
}

export async function queryMarket(productId, question) {
    const res = await fetch(`${BASE}/api/query_market`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, question }),
    })
    return res.json()
}

export async function refreshPrices(productId) {
    const res = await fetch(`${BASE}/api/refresh_prices/${productId}`, { method: 'POST' })
    if (!res.ok) throw new Error('Refresh failed')
    return res.json()
}
