export default function AlertsSection({ alerts }) {
    return (
        <div className="card h-full">
            <h3 className="syne text-xl mb-6">Critical Market Alerts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alerts.map((a, i) => {
                    const borderClass =
                        a.risk_level === 'High' ? 'border-l-4 border-[var(--danger)]' :
                            a.risk_level === 'Medium' ? 'border-l-4 border-[var(--warning)]' :
                                'border-l-4 border-[var(--success)]'

                    const textClass =
                        a.risk_level === 'High' ? 'text-[var(--danger)]' : 'text-[var(--text-muted)]'

                    return (
                        <div key={i} className={`bg-white/5 p-4 rounded-lg flex flex-col justify-between ${borderClass}`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                    {a.platform}
                                </span>
                                <span className={`text-[10px] font-bold uppercase ${textClass}`}>
                                    {a.risk_level} Priority
                                </span>
                            </div>
                            <div className="text-sm font-bold mb-1">
                                Difference: ₹{a.price_difference} ({a.price_difference_pct}%)
                            </div>
                            <div className="text-[11px] text-[var(--text-muted)] mb-3">
                                {a.customer_shift_risk}
                            </div>
                            <div className="text-[11px] font-medium text-[var(--accent)]">
                                AI Action: {a.recommended_action}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
