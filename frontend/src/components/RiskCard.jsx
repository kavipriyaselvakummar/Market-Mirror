export default function RiskCard({ risk }) {
    const score = risk.competition_score
    const scoreColor = score > 65 ? '#ef4444' : score > 35 ? '#f59e0b' : '#10b981'
    const barClass = score > 65 ? 'bg-[var(--danger)]' : score > 35 ? 'bg-[var(--warning)]' : 'bg-[var(--success)]'

    return (
        <div className="card flex flex-col h-full">
            <h3 className="syne text-xl mb-6">Competition Risk</h3>
            <div className="space-y-6 flex-1">
                <div className="flex justify-between items-center">
                    <span className="text-[var(--text-muted)]">Active Sellers Tracked</span>
                    <span className="text-2xl font-bold">{risk.active_sellers}</span>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[var(--text-muted)]">Competition Level</span>
                        <span className="font-bold">{risk.competition_level}</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${barClass}`}
                            style={{ width: `${score}%` }}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center pt-4">
                    <span className="text-[var(--text-muted)] mb-2 text-center w-full">Price War Risk</span>
                    <div
                        className="relative w-48 h-24 overflow-hidden flex items-end justify-center rounded-t-full border-t-2 border-l-2 border-r-2 border-white/10"
                        style={{
                            background: `conic-gradient(from 180deg at 50% 100%, ${scoreColor} 0deg, ${scoreColor} ${score * 1.8}deg, rgba(255,255,255,0.05) 0deg)`
                        }}
                    >
                        <span className="text-xl font-extrabold pb-2">{risk.price_war_risk}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
