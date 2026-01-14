import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import VideoPlayer from './VideoPlayer';

const projects = [
    {
        id: 1,
        title: "Basketball Social Media & AI Shot Analysis App",
        tech: ["Python", "YOLOv8", "Flutter", "Flask"],
        description: "Automated shot detection and analysis system integrating computer vision with a mobile app for real-time feedback.",
        mediaType: "slideshow",
        mediaSrc: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/videoAnalysis.png",
        slides: [
            "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/WelcomeBackScreen.png",
            "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/postDetailsPage.png",
            "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/mapPage2.png",
            "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/notificationsPage.png",
            "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/HomeScreen.png",
            "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/GetStartedScreen.png",
            "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/eventsPage.png",
            "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/askChatGptPage1.png",
            "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/askchatGpt2.png",
            "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/AIBasketballPage.png",
            "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/AIresults.png",
            "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/chat.png",
            "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/createEventPage.png"
        ],
        link: "/basketball-app"
    },
    {
        id: 2,
        title: "Multi-Agent Formation Control",
        tech: ["Python", "Control Theory", "Consensus Algorithms"],
        description: "Decentralized control for robust formation maintenance in multi-agent systems.",
        mediaType: "image",
        mediaSrc: "/formation-control-media/image.png",
        link: "/formation-control",
        videoHoverSrc: "https://pub-c9add4fb2a554c62867fd1ad02e30165.r2.dev/4Agents.mp4"
    },
    {
        id: 3,
        title: "Path Planning in Dangerous Environments",
        tech: ["Python", "A*", "RRT", "Optimization"],
        description: "Advanced pathfinding algorithms for autonomous navigation in radioactive zones.",
        mediaType: "image",
        mediaSrc: "/path-planning/output.png",
        link: "/path-planning",
        videoHoverSrc: "https://pub-c9add4fb2a554c62867fd1ad02e30165.r2.dev/pathplanning.mp4",
        videoSettings: { startTime: 8, playbackRate: 1.5 }
    }
];

const ProjectMedia = ({ type, src, slides, videoHoverSrc, videoSettings, isHovered }) => {
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const videoRef = React.useRef(null);
    const hoverVideoRef = React.useRef(null);

    React.useEffect(() => {
        if (type === 'slideshow' && isHovered) {
            const interval = setInterval(() => {
                setCurrentSlide(prev => (prev + 1) % slides.length);
            }, 1000);
            return () => clearInterval(interval);
        } else if (!isHovered) {
            setCurrentSlide(0);
        }
    }, [type, isHovered, slides]);

    React.useEffect(() => {
        if (type === 'video' && videoRef.current) {
            if (isHovered) {
                videoRef.current.play().catch(e => console.log("Play failed", e));
            } else {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        }
    }, [type, isHovered]);

    React.useEffect(() => {
        if (videoHoverSrc && hoverVideoRef.current) {
            if (isHovered) {
                const video = hoverVideoRef.current;
                video.currentTime = videoSettings?.startTime || 0;
                video.playbackRate = videoSettings?.playbackRate || 1;
                video.play().catch(e => console.log("Hover video play failed", e));
            } else {
                if (hoverVideoRef.current) {
                    hoverVideoRef.current.pause();
                }
            }
        }
    }, [isHovered, videoHoverSrc, videoSettings]);

    return (
        <div className="w-full h-full relative">
            {type === 'video' ? (
                <video
                    ref={videoRef}
                    src={src}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                />
            ) : (
                <img
                    src={src}
                    alt="Project Preview"
                    className="w-full h-full object-cover"
                />
            )}

            {videoHoverSrc && isHovered && (
                <div className="absolute inset-0 bg-black transition-opacity duration-300">
                    <video
                        ref={hoverVideoRef}
                        src={videoHoverSrc}
                        className="w-full h-full object-cover animate-in fade-in duration-300"
                        muted
                        loop
                        playsInline
                    />
                </div>
            )}

            {type === 'slideshow' && isHovered && (
                <div className="absolute inset-0 bg-black transition-opacity duration-300">
                    <img
                        src={slides[currentSlide]}
                        alt="Slide"
                        className="w-full h-full object-cover animate-in fade-in duration-300"
                        key={currentSlide}
                    />
                </div>
            )}
        </div>
    );
};

const ProjectCard = ({ project }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <div
            className="group bg-surface/50 backdrop-blur-md rounded-2xl p-4 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 border border-white/5 hover:border-primary flex flex-col hover:bg-surface/80"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Media Container */}
            <motion.div
                layout
                className="mb-5 overflow-hidden rounded-xl bg-black/20 mx-auto"
                initial={{ aspectRatio: "16/9", width: "100%" }}
                animate={{
                    aspectRatio: isHovered && project.mediaType === 'slideshow' ? "9/16" : "16/9",
                    width: isHovered && project.mediaType === 'slideshow' ? "60%" : "100%",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <ProjectMedia
                    type={project.mediaType}
                    src={project.mediaSrc}
                    slides={project.slides}
                    videoHoverSrc={project.videoHoverSrc}
                    videoSettings={project.videoSettings}
                    isHovered={isHovered}
                />
            </motion.div>

            {/* Content */}
            <div className="flex-grow">
                {project.link ? (
                    <Link to={project.link}>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors cursor-pointer hover:underline">{project.title}</h3>
                    </Link>
                ) : (
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                        <span key={tech} className="text-xs font-medium px-2 py-1 rounded bg-surface border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                            {tech}
                        </span>
                    ))}
                </div>

                <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed transition-colors">
                    {project.description}
                </p>

                {project.link && (
                    <Link to={project.link} className="inline-block mt-4 text-primary text-sm font-semibold hover:text-white transition-colors">
                        View Case Study →
                    </Link>
                )}
            </div>
        </div>
    );
};

const ProjectGallery = () => {
    return (
        <div>
            <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Personal <span className="text-primary">Projects</span></h2>
                <div className="w-20 h-1 bg-primary rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
};

export default ProjectGallery;
