import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
        // Fetch mentors once when the component mounts
        fetchMentorsForContext().then(setActiveMentors);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setError(null);
        
        const newMessages = [...messages, { role: 'user', content: userMsg }];
        setMessages(newMessages);
        setLoading(true);

        try {
            // Filter out system messages or old context if needed, but for now just send the raw log
            const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
            const responseText = await generateAIChatResponse(apiMessages, activeMentors);
            
            setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
        } catch (err) {
            console.error("AI Error:", err);
            setError(err.message || "Something went wrong communicating with the AI.");
            // Remove the user message if it failed, or show an error state
        } finally {
            setLoading(false);
        }
    };

    const suggestedPrompts = [
        "Find me a mentor for React development",
        "How do I transition to Product Management?",
        "Review my career goals for 2026",
    ];

    const renderMessageContent = (content) => {
        const parts = content.split(/\[MENTOR_ID:\s*([^\]]+)\]/);
        
        if (parts.length === 1) {
             return <span className="whitespace-pre-wrap">{content}</span>;
        }

        return (
            <div className="whitespace-pre-wrap">
                {parts.map((part, index) => {
                    if (index % 2 === 0) {
                        return <span key={index}>{part}</span>;
                    } else {
                        const mentorId = part.trim();
                        const mentor = activeMentors.find(m => m.id === mentorId);
                        if (!mentor) return null;
                        
                        return (
                            <div key={index} className="my-4 p-4 rounded-xl bg-background border border-border/50 flex flex-col sm:flex-row items-center gap-4 shadow-sm w-full max-w-sm">
                                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 text-lg">
                                    {mentor.name[0]}
                                </div>
                                <div className="flex-1 text-center sm:text-left min-w-0">
                                    <h4 className="font-bold text-foreground truncate">{mentor.name}</h4>
                                    <p className="text-xs text-muted-foreground truncate">{mentor.headline || 'Mentor'}</p>
                                </div>
                                <Button 
                                    size="sm" 
                                    className="w-full sm:w-auto bg-primary text-primary-foreground shrink-0 shadow-lg shadow-primary/20"
                                    onClick={() => navigate('/mentors')}
                                >
                                    Connect
                                </Button>
                            </div>
                        );
                    }
                })}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl">
                    <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">AI Career Matchmaker</h1>
                    <p className="text-muted-foreground text-sm">Powered by Llama 3.1 & NVIDIA NIM</p>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-destructive">AI Error</p>
                        <p className="text-sm text-destructive/80 mt-1">{error}</p>
                        {error.includes('API key') && (
                            <p className="text-xs text-destructive/60 mt-2">Make sure you added VITE_NVIDIA_NIM_API_KEY to your .env file and restarted the dev server.</p>
                        )}
                    </div>
                </div>
            )}

            <div className="flex-1 bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden flex flex-col relative">
                
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={idx} 
                            className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>
                                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-secondary/50 text-foreground rounded-tl-sm'}`}>
                                <div className="text-sm leading-relaxed">
                                    {msg.role === 'user' ? (
                                        <span className="whitespace-pre-wrap">{msg.content}</span>
                                    ) : (
                                        renderMessageContent(msg.content)
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {loading && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-4 max-w-[85%]"
                        >
                            <div className="w-8 h-8 rounded-full bg-secondary text-foreground flex items-center justify-center shrink-0 mt-1">
                                <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                            <div className="p-4 rounded-2xl bg-secondary/50 text-foreground rounded-tl-sm flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" />
                                <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0.2s' }} />
                                <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0.4s' }} />
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-background border-t border-border/50">
                    {messages.length === 1 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {suggestedPrompts.map(prompt => (
                                <button 
                                    key={prompt}
                                    onClick={() => setInput(prompt)}
                                    className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors border border-border/50"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    )}
                    <form onSubmit={handleSend} className="flex gap-2">
                        <Input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask for career advice or mentor recommendations..."
                            className="flex-1 bg-secondary/30"
                            disabled={loading}
                        />
                        <Button type="submit" disabled={!input.trim() || loading} className="shrink-0 bg-primary text-primary-foreground w-12 h-10 p-0 rounded-xl">
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>

            </div>
        </div>
    );
}
