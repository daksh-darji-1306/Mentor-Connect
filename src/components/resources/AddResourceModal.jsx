import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { X, BookOpen, Video, Link as LinkIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../context/AuthContext';

export default function AddResourceModal({ isOpen, onClose, onResourceAdded }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url: '',
        type: 'Article',
        category: 'General',
    });

    if (!isOpen) return null;

    const resourceTypes = [
        { name: 'Article', icon: FileText },
        { name: 'Video', icon: Video },
        { name: 'Course', icon: BookOpen },
        { name: 'Link', icon: LinkIcon },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const newResource = {
                ...formData,
                mentor_id: user.id,
                mentor_name: user.full_name || user.fullName || user.email?.split('@')?.[0] || 'Mentor',
                created_at: serverTimestamp(),
            };

            await addDoc(collection(db, 'resources'), newResource);
            if (onResourceAdded) onResourceAdded();
            
            // Reset form
            setFormData({
                title: '',
                description: '',
                url: '',
                type: 'Article',
                category: 'General',
            });
            onClose();
        } catch (error) {
            console.error("Error adding resource: ", error);
            alert("Failed to add resource. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                    <h2 className="text-lg font-bold">Share Resource</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-8 h-8">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">Title</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Complete React Guide"
                            className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">URL (Link)</label>
                        <input
                            type="url"
                            required
                            placeholder="https://..."
                            className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                            value={formData.url}
                            onChange={e => setFormData({ ...formData, url: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">Description (Optional)</label>
                        <textarea
                            rows={2}
                            placeholder="Briefly describe why this is helpful..."
                            className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground">Type</label>
                            <select
                                className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                {resourceTypes.map(rt => (
                                    <option key={rt.name} value={rt.name}>{rt.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground">Category</label>
                            <input
                                type="text"
                                placeholder="e.g. Frontend, Career"
                                className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground">
                            {loading ? 'Sharing...' : 'Share Resource'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
