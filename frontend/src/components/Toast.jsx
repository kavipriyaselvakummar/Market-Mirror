export default function Toast({ message, type = 'success' }) {
    const border =
        type === 'error' ? 'border-l-4 border-red-500' :
            type === 'warning' ? 'border-l-4 border-amber-500' :
                'border-l-4 border-emerald-500'

    return (
        <div className={`toast-item card !py-3 !px-6 ${border} !backdrop-blur-xl`}>
            <span className="text-sm font-bold">{message}</span>
        </div>
    )
}
