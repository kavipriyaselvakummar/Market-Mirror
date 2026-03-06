import { useEffect, useRef } from 'react'

function useCountUpPrice(target, duration = 2000) {
    const ref = useRef(null)
    useEffect(() => {
        if (!ref.current || target == null) return
        let startTimestamp = null
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp
            const progress = Math.min((timestamp - startTimestamp) / duration, 1)
            const current = Math.floor(progress * target)
            ref.current.textContent = `₹${current.toLocaleString()}`
            if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }, [target])
    return ref
}

export default function RecommendationCard({ rec, yourPrice }) {
    const suggestedRef = useCountUpPrice(rec.suggested_price)

    return (
        <div className="card glow-card flex flex-col justify-between h-full">
            <h3 className="syne text-xl mb-4 flex items-center">
                <span className="mr-2">✨</span> AI Prediction
            </h3>
            <div className="space-y-4 py-4">
                <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Market Avg</span>
                    <span className="font-bold">₹{rec.market_avg_price?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Your Price</span>
                    <span className="font-bold">₹{yourPrice?.toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t border-white/5 text-center">
                    <span className="text-xs text-[var(--text-muted)] uppercase font-bold block mb-1">Suggested Price</span>
                    <span ref={suggestedRef} className="text-4xl font-extrabold text-[var(--accent)]">
                        ₹0
                    </span>
                </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] text-center italic">
                {rec.reason}
            </p>
        </div>
    )
}
