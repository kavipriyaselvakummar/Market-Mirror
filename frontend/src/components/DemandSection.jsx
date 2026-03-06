import { useEffect, useRef } from 'react'

function useCountUp(target, duration = 1500) {
    const ref = useRef(null)
    useEffect(() => {
        if (!ref.current || target == null) return
        let startTimestamp = null
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp
            const progress = Math.min((timestamp - startTimestamp) / duration, 1)
            ref.current.textContent = Math.floor(progress * target).toLocaleString()
            if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }, [target])
    return ref
}

export default function DemandSection({ demand }) {
    const reviewsRef = useCountUp(demand.total_reviews)

    const stars = '★'.repeat(Math.round(demand.avg_rating)) + '☆'.repeat(5 - Math.round(demand.avg_rating))
    const levelColor = demand.demand_level === 'High'
        ? 'text-[var(--success)]'
        : demand.demand_level === 'Medium'
            ? 'text-[var(--warning)]'
            : 'text-[var(--text-muted)]'

    return (
        <div className="card h-full">
            <h3 className="syne text-xl mb-6">Demand Analytics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                    <span className="text-xs text-[var(--text-muted)] uppercase font-bold">Avg Rating</span>
                    <div className="text-2xl font-bold mt-1 text-amber-400">
                        {demand.avg_rating}
                        <span className="text-xs block font-normal opacity-50">{stars}</span>
                    </div>
                </div>
                <div className="text-center">
                    <span className="text-xs text-[var(--text-muted)] uppercase font-bold">Total Reviews</span>
                    <div ref={reviewsRef} className="text-2xl font-bold mt-1">0</div>
                </div>
                <div className="text-center">
                    <span className="text-xs text-[var(--text-muted)] uppercase font-bold">Monthly Growth</span>
                    <div className="text-2xl font-bold mt-1 text-[var(--success)]">{demand.monthly_growth}%</div>
                </div>
                <div className="text-center">
                    <span className="text-xs text-[var(--text-muted)] uppercase font-bold">Demand Level</span>
                    <div className="mt-1">
                        <span className={`badge ${levelColor} bg-white/5 border border-white/5`}>
                            {demand.demand_level} Demand
                        </span>
                    </div>
                </div>
            </div>
            <p className="text-[var(--text-muted)] italic border-l-2 border-[var(--accent)] pl-4 py-2 bg-[var(--accent)]/5 rounded-r-lg">
                {demand.summary}
            </p>
        </div>
    )
}
