import React from 'react';
import { GraduationCap, Briefcase } from 'lucide-react';

const timelineData = [
    {
        id: 2,
        type: 'education',
        title: 'M.S. in Info Systems & Digital Transformation',
        organization: 'National University of Science and Technology Politehnica Bucharest',
        date: '2025 - Present',
        description: 'Focusing on Digital Transformation in Materials Processing.',
        icon: GraduationCap,
        link: 'https://www.sim.upb.ro/',
        logo: 'https://www.google.com/s2/favicons?domain=www.sim.upb.ro&sz=128'
    },
    {
        id: 1,
        type: 'experience',
        title: 'Mobile Developer Internship',
        organization: 'Carpasoft',
        date: 'July 2023 - Oct 2023',
        description: 'Developed core features for a Pet Management Super-App, including social networking modules, a service marketplace, and an interactive map ecosystem for lost pets.',
        icon: Briefcase,
        link: 'https://carpasoft.com/',
        logo: 'https://www.google.com/s2/favicons?domain=carpasoft.com&sz=128'
    },
    {
        id: 3,
        type: 'education',
        title: 'B.S. in Automatic Control and Computer Engineering',
        organization: 'National University of Science and Technology Politehnica Bucharest',
        date: '2021 - 2025',
        description: 'Specialization in Systems Engineering. Thesis on Basketball Social Media & AI Shot Analysis App.',
        icon: GraduationCap,
        link: 'https://acs.pub.ro/',
        logo: '/acs_logo.png'
    },
];

const Timeline = () => {
    return (
        <div className="relative">
            <div className="mb-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional <span className="text-primary">Timeline</span></h2>
                <div className="w-20 h-1 bg-primary rounded-full mx-auto"></div>
            </div>

            <div className="relative max-w-4xl mx-auto">
                {/* Vertical Line */}
                <div className="absolute left-8 md:left-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20"></div>

                <div className="space-y-12">
                    {timelineData.map((item, index) => {
                        const isLeft = index % 2 === 0;
                        return (
                            <div key={item.id} className={`relative flex items-start md:items-center ${isLeft ? 'md:flex-row-reverse' : ''}`}>

                                {/* Icon Marker */}
                                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                                    <div className="w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                                        <item.icon className="w-5 h-5 text-primary" />
                                    </div>
                                </div>

                                {/* Spacer for layout */}
                                <div className="hidden md:block w-1/2" />

                                {/* Content Card */}
                                <div className="w-full md:w-1/2 pl-24 md:px-12">
                                    <div className={`bg-surface p-6 rounded-xl border border-white/5 hover:border-primary/30 transition-all relative overflow-hidden ${isLeft ? 'md:text-right' : 'text-left'}`}>

                                        {/* Logo Positioning */}
                                        {item.logo && (
                                            <div className={`absolute w-12 h-12 rounded-full overflow-hidden bg-white p-1 border border-gray-200 shadow-sm
                                                ${item.type === 'education'
                                                    ? 'top-4 left-4'
                                                    : 'top-4 left-4 md:left-auto md:right-4'}
                                            `}>
                                                <img src={item.logo} alt={item.organization} className="w-full h-full object-contain" />
                                            </div>
                                        )}

                                        {/* Content with conditional padding based on logo position */}
                                        <div className={`${item.logo ? (item.type === 'education' ? 'pl-14' : 'pl-14 md:pl-0 md:pr-14') : ''}`}>
                                            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                                                {item.date}
                                            </span>
                                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>

                                            <div className={`mb-4`}>
                                                {item.link ? (
                                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors hover:underline">
                                                        {item.organization}
                                                    </a>
                                                ) : (
                                                    <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{item.organization}</h4>
                                                )}
                                            </div>

                                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Timeline;
