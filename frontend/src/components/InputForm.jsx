import { useState } from 'react'
import { addProduct } from '../api'

const PLATFORMS = ['Amazon', 'Flipkart', 'Croma', 'Reliance Digital', 'Snapdeal', 'Myntra']

export default function InputForm({ onProductCreated, showToast }) {
    const [fields, setFields] = useState({
        product_name: '', your_platform: '', your_price: '', min_margin: ''
    })
    const [selectedPlatforms, setSelectedPlatforms] = useState([])
    const [customPlatforms, setCustomPlatforms] = useState([])
    const [customInput, setCustomInput] = useState('')
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    const allPlatforms = [...PLATFORMS, ...customPlatforms]

    const validate = () => {
        const e = {}
        if (!fields.product_name) e.product_name = 'Please enter a product name'
        if (!fields.your_platform) e.your_platform = 'Select your platform'
        if (!fields.your_price || Number(fields.your_price) <= 0) e.your_price = 'Enter a valid price'
        if (!fields.min_margin || Number(fields.min_margin) < 1 || Number(fields.min_margin) > 90)
            e.min_margin = 'Enter margin (1–90%)'
        if (selectedPlatforms.length === 0) e.competitor_platforms = 'Select at least one competitor'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setSubmitting(true)
        try {
            const data = {
                product_name: fields.product_name,
                your_platform: fields.your_platform,
                your_price: parseFloat(fields.your_price),
                min_margin: parseFloat(fields.min_margin),
                competitor_platforms: selectedPlatforms,
            }
            const product = await addProduct(data)
            onProductCreated(product.id, data)
        } catch {
            showToast('Error connecting to server', 'error')
        } finally {
            setSubmitting(false)
        }
    }

    const togglePlatform = (p) => {
        setSelectedPlatforms(prev =>
            prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
        )
        setErrors(e => ({ ...e, competitor_platforms: undefined }))
    }

    const toggleAll = () => {
        setSelectedPlatforms(prev =>
            prev.length === allPlatforms.length ? [] : [...allPlatforms]
        )
    }

    const addCustomPlatform = () => {
        const val = customInput.trim()
        if (val && !allPlatforms.includes(val)) {
            setCustomPlatforms(prev => [...prev, val])
            setSelectedPlatforms(prev => [...prev, val])
            setCustomInput('')
        }
    }

    const handleChange = (field) => (e) => {
        setFields(prev => ({ ...prev, [field]: e.target.value }))
        setErrors(prev => ({ ...prev, [field]: undefined }))
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <div className="text-center mb-10 w-full max-w-2xl">
                <h1 className="syne text-5xl md:text-6xl mb-4 gradient-text font-extrabold tracking-tight">
                    ⬡ Market Mirror AI
                </h1>
                <p className="text-[var(--text-muted)] text-lg font-medium">
                    Smart Retail Intelligence for the Modern Seller
                </p>
            </div>

            <div className="card glass-form w-full max-w-2xl glow-card">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Name */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                            Product Name
                        </label>
                        <input
                            type="text"
                            value={fields.product_name}
                            onChange={handleChange('product_name')}
                            placeholder="E.g. Sony WH-1000XM5"
                            className="w-full px-4 py-3 rounded-lg"
                        />
                        {errors.product_name && <span className="text-red-500 text-xs">{errors.product_name}</span>}
                    </div>

                    {/* Platform + Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                                Your Selling Platform
                            </label>
                            <select
                                value={fields.your_platform}
                                onChange={handleChange('your_platform')}
                                className="w-full px-4 py-3 rounded-lg appearance-none"
                            >
                                <option value="">Select Platform</option>
                                {['Amazon', 'Flipkart', 'Croma', 'Reliance Digital', 'Other'].map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                            {errors.your_platform && <span className="text-red-500 text-xs">{errors.your_platform}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                                Your Current Price (₹)
                            </label>
                            <input
                                type="number"
                                value={fields.your_price}
                                onChange={handleChange('your_price')}
                                min="1"
                                placeholder="24999"
                                className="w-full px-4 py-3 rounded-lg"
                            />
                            {errors.your_price && <span className="text-red-500 text-xs">{errors.your_price}</span>}
                        </div>
                    </div>

                    {/* Min Margin */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                            Minimum Profit Margin (%)
                        </label>
                        <input
                            type="number"
                            value={fields.min_margin}
                            onChange={handleChange('min_margin')}
                            min="1" max="90"
                            placeholder="15"
                            className="w-full px-4 py-3 rounded-lg"
                        />
                        {errors.min_margin && <span className="text-red-500 text-xs">{errors.min_margin}</span>}
                    </div>

                    {/* Competitor Platforms */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                                Competitor Platforms
                            </label>
                            <button
                                type="button"
                                onClick={toggleAll}
                                className="text-xs text-[var(--accent)] hover:underline font-semibold uppercase tracking-tighter"
                            >
                                {selectedPlatforms.length === allPlatforms.length ? 'Deselect All' : 'Select All Platforms'}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {allPlatforms.map(p => (
                                <label key={p} className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={selectedPlatforms.includes(p)}
                                        onChange={() => togglePlatform(p)}
                                        className="w-5 h-5 rounded"
                                    />
                                    <span className="text-sm group-hover:text-[var(--accent)] transition-colors">{p}</span>
                                </label>
                            ))}
                        </div>
                        {errors.competitor_platforms && (
                            <span className="text-red-500 text-xs">{errors.competitor_platforms}</span>
                        )}

                        {/* Custom platform */}
                        <div className="flex space-x-2 mt-4">
                            <input
                                type="text"
                                value={customInput}
                                onChange={e => setCustomInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomPlatform())}
                                placeholder="Custom platform..."
                                className="flex-1 px-4 py-2 text-sm rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={addCustomPlatform}
                                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition-all"
                            >
                                + Add
                            </button>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-primary w-full text-lg py-4 group"
                        >
                            {submitting ? 'Analyzing...' : 'Analyze Market'}
                            <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
