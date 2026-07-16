import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2, AlertCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { fetchMentorsForContext, generateAIChatResponse } from '../lib/aiService';

export default function AICareerAssistant() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your AI Career Guide. I can help you figure out your next career steps, and recommend the best mentors on the platform to help you achieve them. What are your goals?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeMentors, setActiveMentors] = useState([]);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMentorsForContext().then(setActiveMentors);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e, overrideInput) => {
        e?.preventDefault();
        const text = (overrideInput || input).trim();
        if (!text || loading) return;

        setInput('');
        setError(null);
        const newMessages = [...messages, { role: 'user', content: text }];
        setMessages(newMessages);
        setLoading(true);

        try {
            const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
            const responseText = await generateAIChatResponse(apiMessages, activeMentors);
            setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
        } catch (err) {
            console.error('AI Error:', err);
            setError(err.message || 'Something went wrong communicating with the AI.');
        } finally {
            setLoading(false);
        }
    };

    const suggestedPrompts = [
        { label: '🚀 Find React mentor', value: 'Find me a mentor for React development' },
        { label: '📊 Switch to Product Management', value: 'How do I transition to Product Management?' },
        { label: '🎯 Review my 2026 career goals', value: 'Review my career goals for 2026' },
    ];

    const renderMessageContent = (content) => {
        const parts = content.split(/\[MENTOR_ID:\s*([^\]]+)\]/);
        if (parts.length === 1) return <span className="whitespace-pre-wrap">{content}</span>;

        return (
            <div className="whitespace-pre-wrap space-y-3">
                {parts.map((part, index) => {
                    if (index % 2 === 0) return <span key={index}>{part}</span>;
                    const mentorId = part.trim();
                    const mentor = activeMentors.find(m => m.id === mentorId);
                    if (!mentor) return null;
                    return (
                        <div key={index} className="my-3 p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 flex items-center gap-4 w-full max-w-sm backdrop-blur-sm">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 font-bold flex items-center justify-center shrink-0 text-white text-base shadow-lg shadow-violet-500/30">
                                {mentor.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-foreground text-sm truncate">{mentor.name}</h4>
                                <p className="text-xs text-muted-foreground truncate">{mentor.headline || 'Mentor'}</p>
                            </div>
                            <Button
                                size="sm"
                                className="shrink-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/20 text-xs px-3"
                                onClick={() => navigate('/mentors')}
                            >
                                Connect
                            </Button>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-4">

            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30">
                    <Sparkles className="w-6 h-6 text-white" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-background animate-pulse" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                        AI Career Matchmaker
                    </h1>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <Zap className="w-3 h-3 text-emerald-400" />
                        <p className="text-muted-foreground text-xs">Powered by Llama 3.1 &amp; NVIDIA NIM</p>
                    </div>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                >
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-red-400">AI Error</p>
                        <p className="text-sm text-red-400/80 mt-0.5">{error}</p>
                    </div>
                </motion.div>
            )}

            {/* Chat Window */}
            <div className="flex-1 rounded-2xl border border-border/50 overflow-hidden flex flex-col bg-card/60 backdrop-blur-sm shadow-xl">

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25 }}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse ml-auto max-w-[80%]' : 'max-w-[85%]'}`}
                            >
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-md ${
                                    msg.role === 'user'
                                        ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-violet-500/30'
                                        : 'bg-gradient-to-br from-slate-700 to-slate-600 text-violet-300 shadow-black/20'
                                }`}>
                                    {msg.role === 'user'
                                        ? <User className="w-4 h-4" />
                                        : <Bot className="w-4 h-4" />
                                    }
                                </div>

                                {/* Bubble */}
                                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    msg.role === 'user'
                                        ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm shadow-violet-500/20'
                                        : 'bg-slate-800/80 border border-slate-700/50 text-slate-100 rounded-tl-sm'
                                }`}>
                                    {msg.role === 'user'
                                        ? <span className="whitespace-pre-wrap">{msg.content}</span>
                                        : renderMessageContent(msg.content)
                                    }
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Loading dots */}
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3 max-w-[85%]"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 text-violet-300 flex items-center justify-center shrink-0 mt-1">
                                <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                            <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-slate-800/80 border border-slate-700/50 flex items-center gap-1.5">
                                {[0, 0.15, 0.3].map((delay, i) => (
                                    <div
                                        key={i}
                                        className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
                                        style={{ animationDelay: `${delay}s` }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
                    {/* Suggested Prompts */}
                    {messages.length === 1 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {suggestedPrompts.map(prompt => (
                                <button
                                    key={prompt.value}
                                    onClick={() => handleSend(null, prompt.value)}
                                    className="text-xs px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 hover:border-violet-400/50 transition-all duration-200 font-medium"
                                >
                                    {prompt.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Row */}
                    <form onSubmit={handleSend} className="flex gap-2">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask for career advice or mentor recommendations..."
                            disabled={loading}
                            className="flex-1 bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder:text-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="w-11 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shrink-0 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-violet-500/20"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
