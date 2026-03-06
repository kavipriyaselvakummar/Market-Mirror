import {
    Chart as ChartJS, CategoryScale, LinearScale,
    PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function TrendSection({ trends }) {
    const datasets = trends.map((t, idx) => ({
        label: t.platform,
        data: t.prices,
        borderColor: `hsl(${idx * 45}, 70%, 50%)`,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 0,
    }))

    const chartData = {
        labels: trends[0]?.day_labels || [],
        datasets,
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#7a8ab0' } },
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#7a8ab0' } },
        },
        plugins: { legend: { labels: { color: '#7a8ab0' } } }
    }

    return (
        <div className="card">
            <h3 className="syne text-xl mb-6">7-Day Price Trends</h3>
            <div className="h-80 w-full mb-8">
                <Line data={chartData} options={chartOptions} />
            </div>

            {/* Trend Cards */}
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                {trends.map(t => {
                    const pct = ((t.price_change / (t.prices[0])) * 100).toFixed(1)
                    const emoji = t.trend === 'Increasing' ? '📈' : t.trend === 'Decreasing' ? '📉' : '↔️'
                    const colorClass = t.trend === 'Increasing' ? 'text-[var(--success)]' : t.trend === 'Decreasing' ? 'text-[var(--danger)]' : 'text-[var(--text-muted)]'
                    return (
                        <div key={t.platform} className="card min-w-[200px] flex-shrink-0 !py-3 !px-4">
                            <div className="text-xs font-bold text-[var(--text-muted)] uppercase mb-1">{t.platform}</div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold">{emoji} {t.trend}</span>
                                <span className={`text-xs ${colorClass}`}>{t.price_change > 0 ? '+' : ''}{pct}%</span>
                            </div>
                            <div className="text-[10px] text-[var(--text-muted)] leading-tight">{t.possible_reason}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
