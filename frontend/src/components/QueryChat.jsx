import { useState, useRef, useEffect } from 'react'
import { queryMarket } from '../api'

export default function QueryChat({ productId, showToast }) {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([]) // [{ type: 'user' | 'bot', text: string }]
    const [typing, setTyping] = useState(false)
    const chatRef = useRef(null)

    useEffect(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
    }, [messages, typing])

    const handleSend = async () => {
        const val = input.trim()
        if (!val) return
        setInput('')
        setMessages(prev => [...prev, { type: 'user', text: val }])
        setTyping(true)

        try {
            const res = await queryMarket(productId, val)
            setTimeout(() => {
                setTyping(false)
                setMessages(prev => [...prev, { type: 'bot', text: res.answer }])
            }, 800)
        } catch {
            setTyping(false)
            showToast('Chat failed', 'error')
        }
    }

    return (
        <div className="card flex flex-col h-full min-h-[400px]">
            <h3 className="syne text-xl mb-6">Market Intelligence Coach</h3>

            <div ref={chatRef} className="flex-1 flex flex-col space-y-4 overflow-y-auto mb-4 p-2 custom-scrollbar">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 rounded-xl text-sm leading-relaxed max-w-[85%] ${m.type === 'user'
                                ? 'bg-[var(--accent)] text-black font-medium rounded-tr-sm'
                                : 'bg-white/5 border border-white/10 rounded-tl-sm'
                            }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {typing && (
                    <div className="flex justify-start">
                        <div className="bg-white/5 w-16 p-3 rounded-full flex justify-center items-center rounded-tl-sm">
                            <div className="typing-dots"><span /><span /><span /></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="relative mt-auto">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleSend())}
                    placeholder="Ask about your market..."
                    className="w-full px-4 py-4 pr-32 rounded-xl"
                />
                <button
                    onClick={handleSend}
                    disabled={typing}
                    className="absolute right-2 top-2 btn-primary px-4 py-2 text-sm h-[calc(100%-1rem)]"
                >
                    Ask AI →
                </button>
            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
        </div>
    )
}
