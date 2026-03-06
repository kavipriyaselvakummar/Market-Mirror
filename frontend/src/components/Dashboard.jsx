import { useEffect, useState } from 'react'
import { getPrices, getDemand, getTrends, getRecommendation, getAlerts, getRisk, refreshPrices } from '../api'
import PriceSection from './PriceSection'
import TrendSection from './TrendSection'
import DemandSection from './DemandSection'
import RecommendationCard from './RecommendationCard'
import AlertsSection from './AlertsSection'
import RiskCard from './RiskCard'
import QueryChat from './QueryChat'

export default function Dashboard({ productId, formData, onNewAnalysis, showToast }) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [marketPosition, setMarketPosition] = useState(null)

    const loadAll = async () => {
        setLoading(true)
        try {
            const [prices, demand, trends, rec, alerts, risk] = await Promise.all([
                getPrices(productId),
                getDemand(productId),
                getTrends(productId),
                getRecommendation(productId),
                getAlerts(productId),
                getRisk(productId),
            ])
            setData({ prices, demand, trends, rec, alerts, risk })
            setMarketPosition(rec.your_price > rec.market_avg_price ? 'Above Market' : 'Competitive')
        } catch {
            showToast('Failed to load dashboard data', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadAll() }, [productId])

    const handleSimulate = async () => {
        try {
            await refreshPrices(productId)
            await loadAll()
            showToast('✅ Market data refreshed and re-analyzed')
        } catch {
            showToast('Refresh failed', 'error')
        }
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div className="flex items-center space-x-4">
                    <span className="syne text-2xl font-extrabold text-[var(--accent)]">⬡ Market Mirror AI</span>
                    <div className="h-8 w-px bg-white/10 hidden md:block" />
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                        <h2 className="text-xl font-bold">{formData.product_name}</h2>
                        <span className="badge bg-white/10 text-xs text-[var(--text-muted)]">{formData.your_platform}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <button
                        onClick={onNewAnalysis}
                        className="flex-1 md:flex-none border border-white/10 hover:bg-white/5 px-4 py-2 rounded-lg text-sm transition-all bg-transparent text-white cursor-pointer"
                    >
                        New Analysis
                    </button>
                    <button onClick={handleSimulate} className="flex-1 md:flex-none btn-primary py-2 text-sm">
                        Simulate New Data
                    </button>
                </div>
            </header>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-12 gap-6">

                {/* Summary Cards */}
                <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Product', value: formData.product_name },
                        { label: 'Platform', value: formData.your_platform },
                        {
                            label: 'Your Price',
                            value: <span className="text-2xl font-bold text-[var(--accent)]">₹{formData.your_price?.toLocaleString()}</span>,
                            extra: marketPosition && (
                                <span className={`badge text-xs ${marketPosition === 'Above Market' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                    {marketPosition}
                                </span>
                            )
                        },
                        { label: 'Target Margin', value: <span className="text-2xl font-bold text-[var(--success)]">{formData.min_margin}%</span> }
                    ].map((c, i) => (
                        <div key={i} className={`card flex flex-col justify-between ${loading ? 'opacity-40' : ''} transition-opacity`}>
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">{c.label}</span>
                                {c.extra}
                            </div>
                            <div className="text-lg font-bold mt-2">{c.value || '--'}</div>
                        </div>
                    ))}
                </div>

                {/* Price Comparison */}
                <div className="col-span-12 lg:col-span-8">
                    {loading ? <div className="card opacity-40 h-64 skeleton" /> : data && (
                        <PriceSection prices={data.prices} yourPrice={formData.your_price} />
                    )}
                </div>

                {/* Risk */}
                <div className="col-span-12 lg:col-span-4">
                    {loading ? <div className="card opacity-40 h-64 skeleton" /> : data && (
                        <RiskCard risk={data.risk} />
                    )}
                </div>

                {/* Trends */}
                <div className="col-span-12">
                    {loading ? <div className="card opacity-40 h-80 skeleton" /> : data && (
                        <TrendSection trends={data.trends} />
                    )}
                </div>

                {/* Demand + Recommendation */}
                <div className="col-span-12 flex flex-col md:grid md:grid-cols-12 gap-6">
                    <div className="md:col-span-8">
                        {loading ? <div className="card opacity-40 h-48 skeleton" /> : data && (
                            <DemandSection demand={data.demand} />
                        )}
                    </div>
                    <div className="md:col-span-4">
                        {loading ? <div className="card opacity-40 h-48 skeleton" /> : data && (
                            <RecommendationCard rec={data.rec} yourPrice={formData.your_price} />
                        )}
                    </div>
                </div>

                {/* Alerts + Query Chat */}
                <div className="col-span-12 lg:col-span-7">
                    {loading ? <div className="card opacity-40 h-48 skeleton" /> : data && (
                        <AlertsSection alerts={data.alerts} />
                    )}
                </div>
                <div className="col-span-12 lg:col-span-5">
                    <QueryChat productId={productId} showToast={showToast} />
                </div>

            </div>
        </div>
    )
}
