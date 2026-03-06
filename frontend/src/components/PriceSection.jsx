import { useEffect, useRef } from 'react'
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement,
    Title, Tooltip, Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function PriceSection({ prices, yourPrice }) {
    const sorted = [...prices].sort((a, b) => a.price - b.price)
    const cheapest = sorted[0]?.platform
    const highest = sorted[sorted.length - 1]?.platform

    const chartData = {
        labels: prices.map(p => p.platform),
        datasets: [{
            label: 'Price ₹',
            data: prices.map(p => p.price),
            backgroundColor: prices.map(p => p.difference < 0 ? 'rgba(239,68,68,0.4)' : 'rgba(0,229,255,0.4)'),
            borderColor: prices.map(p => p.difference < 0 ? '#ef4444' : '#00e5ff'),
            borderWidth: 1,
        }]
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { beginAtZero: false, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#7a8ab0' } },
            x: { grid: { display: false }, ticks: { color: '#7a8ab0' } }
        },
        plugins: { legend: { display: false } }
    }

    return (
        <div className="card flex flex-col h-full">
            <h3 className="syne text-xl mb-6">Market Price Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-[var(--text-muted)] uppercase text-xs border-b border-white/10">
                            <tr>
                                <th className="pb-3">Platform</th>
                                <th className="pb-3 text-right">Price ₹</th>
                                <th className="pb-3 text-right">vs Yours</th>
                                <th className="pb-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {prices.map(p => {
                                const isLowest = p.platform === cheapest
                                const isHighest = p.platform === highest
                                const rowBorder = isLowest ? 'border-l-4 border-cyan-500 pl-2' : isHighest ? 'border-l-4 border-amber-500 pl-2' : ''
                                const statusStyle = p.status === 'Cheaper'
                                    ? 'bg-red-500/20 text-red-400'
                                    : p.status === 'Higher'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-white/10 text-[var(--text-muted)]'
                                return (
                                    <tr key={p.platform}>
                                        <td className={`py-4 font-medium ${rowBorder}`}>{p.platform}</td>
                                        <td className="py-4 text-right font-bold">₹{p.price.toLocaleString()}</td>
                                        <td className={`py-4 text-right font-medium ${p.difference < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                            {p.difference > 0 ? '+' : ''}{p.difference}
                                        </td>
                                        <td className="py-4 text-center">
                                            <span className={`badge ${statusStyle}`}>{p.status}</span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="h-64 md:h-full min-h-[250px]">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    )
}
