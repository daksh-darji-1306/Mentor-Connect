import React, { useState } from 'react';
import { Search, Filter, MapPin, Briefcase, Star, ChevronDown, Check } from 'lucide-react';
import { Card } from '../components/dashboard/DashboardWidgets';
import { Button } from "@/components/ui/button";

const MentorsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const mentors = [
        {
            id: 1,
            name: "Dr. Maria Khan",
            role: "Senior Data Scientist",
            company: "Google",
            rating: 4.9,
            reviews: 120,
            specialties: ["Machine Learning", "Python", "Leadership"],
            availability: "Available Today",
            image: "https://i.pravatar.cc/150?u=1",
            color: "bg-blue-500"
        },
        {
            id: 2,
            name: "Sarah Connor",
            role: "Product Manager",
            company: "Uber",
            rating: 4.8,
            reviews: 85,
            specialties: ["Product Strategy", "Agile", "User Research"],
            availability: "Available Tomorrow",
            image: "https://i.pravatar.cc/150?u=2",
            color: "bg-purple-500"
        },
        {
            id: 3,
            name: "David Chen",
            role: "Staff Engineer",
            company: "Airbnb",
            rating: 5.0,
            reviews: 42,
            specialties: ["System Design", "Go", "Microservices"],
            availability: "Next Week",
            image: "https://i.pravatar.cc/150?u=3",
            color: "bg-green-500"
        },
        {
            id: 4,
            name: "Emily Blunt",
            role: "UX Designer",
            company: "Apple",
            rating: 4.9,
            reviews: 94,
            specialties: ["Figma", "Design Systems", "Prototyping"],
            availability: "Available Today",
            image: "https://i.pravatar.cc/150?u=4",
            color: "bg-pink-500"
        },
        {
            id: 5,
            name: "James Smith",
            role: "Backend Lead",
            company: "Netflix",
            rating: 4.7,
            reviews: 63,
            specialties: ["Java", "Spring Boot", "AWS"],
            availability: "Available Tomorrow",
            image: "https://i.pravatar.cc/150?u=5",
            color: "bg-orange-500"
        },
        {
            id: 6,
            name: "Linda Wu",
            role: "VP of Engineering",
            company: "Spotify",
            rating: 5.0,
            reviews: 210,
            specialties: ["Management", "Scaling", "Culture"],
            availability: "Next Week",
            image: "https://i.pravatar.cc/150?u=6",
            color: "bg-indigo-500"
        }
    ];

    const filteredMentors = mentors.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Find your Mentor</h1>
                    <p className="text-muted-foreground mt-1">Connect with industry experts who've been there.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name, role, or company..."
                            className="w-full bg-background border border-border/60 rounded-lg pl-9 pr-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="gap-2 hidden md:flex">
                        <Filter className="w-4 h-4" /> Filters
                    </Button>
                </div>
            </div>

            {/* Filter Tags (Mobile/Desktop) */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                {['All', 'Engineering', 'Product', 'Design', 'Data Science', 'Marketing'].map((tag, i) => (
                    <button
                        key={tag}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === 0
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                            }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Mentors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMentors.map((mentor) => (
                    <Card key={mentor.id} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex gap-4">
                                <div className="relative">
                                    <div className={`w-14 h-14 rounded-full ${mentor.color} flex items-center justify-center text-white text-lg font-bold`}>
                                        {mentor.name.charAt(0)}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                                        <div className="bg-green-500 w-3 h-3 rounded-full border-2 border-background"></div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground text-lg leading-tight group-hover:text-primary transition-colors">{mentor.name}</h3>
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                                        <Briefcase className="w-3.5 h-3.5" />
                                        <span>{mentor.role} at {mentor.company}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6 flex-1">
                            <div className="flex items-center gap-1.5 text-sm mb-3">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="font-bold text-foreground">{mentor.rating}</span>
                                <span className="text-muted-foreground">({mentor.reviews} reviews)</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {mentor.specialties.slice(0, 3).map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-secondary/40 rounded-md text-xs text-secondary-foreground font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border/50 flex items-center justify-between mt-auto">
                            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                                {mentor.availability}
                            </span>
                            <Button size="sm" className="font-semibold">
                                Book Session
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default MentorsPage;
