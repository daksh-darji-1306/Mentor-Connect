import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LinkCard({ title, description, details, imageUrl, href, className }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const isExternal = href.startsWith('http');

    const handleExpand = (e) => {
        e.preventDefault(); // Prevent navigation when clicking the expand button
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    const CardContent = (
        <div
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card text-card-foreground shadow-sm transition-all hover:shadow-lg hover:border-primary/20 block h-fit",
                className
            )}
        >
            {/* Image Section */}
            <div className="relative h-48 w-full overflow-hidden bg-muted">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
                )}

                {/* Expand Toggle Button (Replaces the static arrow) */}
                <button
                    onClick={handleExpand}
                    className="absolute top-4 right-4 rounded-full bg-background/80 p-2 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 hover:bg-background z-20 cursor-pointer"
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                    {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-foreground" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-foreground" />
                    )}
                </button>
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col p-6 space-y-2">
                <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors flex justify-between items-center">
                    {title}

                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                </p>

                {/* Expanded Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 mt-4 border-t border-border/50 text-sm text-foreground/80 leading-relaxed">
                                {details}
                                <div className="mt-4">
                                    <a
                                        href={href}
                                        target={isExternal ? "_blank" : undefined}
                                        rel={isExternal ? "noopener noreferrer" : undefined}
                                        className="inline-flex items-center text-primary hover:underline font-medium text-xs"
                                    >
                                        Learn more <ArrowUpRight className="ml-1 h-3 w-3" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );

    return CardContent;
}
