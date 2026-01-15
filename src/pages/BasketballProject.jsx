import { ArrowLeft, Smartphone, Layers, Github, Database } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import SEO from '../components/SEO';
import FeatureShowcase from '../components/FeatureShowcase';
import ScrollReveal from '../components/ScrollReveal';

const featureGroups = [
    {
        title: "1. Onboarding & Authentication",
        items: [
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/Iconita%20Aplicatie.png", caption: "App Icon" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/GetStartedScreen.png", caption: "Get Started Screen" },
            { type: 'video', src: "https://media.alexandrudabu.com/createAccount.mp4", caption: "Account Creation Flow" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/WelcomeBackScreen.png", caption: "Welcome Back" },
        ]
    },
    {
        title: "2. Profile Management",
        items: [
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/CreateProfilePage.png", caption: "Create Profile" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/editProfilePage.png", caption: "Edit Details" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/ProfilePage.png", caption: "User Profile" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/AllUsersPage.png", caption: "Community Browser" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/SearchForUser.png", caption: "Search Users" },
        ]
    },
    {
        title: "3. Navigation & Dashboard",
        items: [
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/HomeScreen.png", caption: "Home Dashboard" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/Sidebar.png", caption: "Navigation Drawer" },
            { type: 'video', src: "https://media.alexandrudabu.com/lightMode.mp4", caption: "Light/Dark Mode Toggle" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/lightMode.png", caption: "Light Mode UI" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/darkMode.png", caption: "Dark Mode UI" },
        ]
    },
    {
        title: "4. Map & Events Ecosystem",
        items: [
            { type: 'video', src: "https://media.alexandrudabu.com/Map.mp4", caption: "Interactive Map Demo" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/googleMapsSearch.png", caption: "Location Search" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/mapPage.png", caption: "Full Map View" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/mapPage2.png", caption: "Court Details" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/MapMarkers.png", caption: "Location Markers" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/eventsPage.png", caption: "Events Hub" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/createEventPage.png", caption: "Host an Event" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/eventDetails.png", caption: "Event Details" },
        ]
    },
    {
        title: "5. Social Feed",
        items: [
            { type: 'video', src: "https://media.alexandrudabu.com/EnterAppandInteractwithPosts.mp4", caption: "Feed Interaction" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/CreatePostPage.png", caption: "Create Post" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/createpost2.png", caption: "Post Editor" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/postDetailsPage.png", caption: "Post View" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/commentoptions.png", caption: "Comments Interface" },
        ]
    },
    {
        title: "6. Communication Hub",
        items: [
            { type: 'video', src: "https://media.alexandrudabu.com/chat2persons.mp4", caption: "Real-time Messaging", aspectRatio: 'aspect-[1400/1288]', width: '500px' },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/allchatsPage.png", caption: "Inbox" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/chat.png", caption: "Chat Interface" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/groupChat.png", caption: "Group Chats" },
            { type: 'video', src: "https://media.alexandrudabu.com/chatGPT.mp4", caption: "AI Assistant (ChatGPT)" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/askChatGptPage1.png", caption: "Ask AI" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/askchatGpt2.png", caption: "AI Conversation" },
        ]
    },
    {
        title: "7. AI Shot Analysis (Core Feature)",
        items: [
            { type: 'video', src: "https://media.alexandrudabu.com/VideoAnalysis.mp4", caption: "Analysis Process" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/videoAnalysis.png", caption: "Tracking Overlay & Object Detection", aspectRatio: 'aspect-video', width: '500px' },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/AIBasketballPage.png", caption: "AI Dashboard" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/AIresults.png", caption: "Mobile Results" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/AIresultsWeb.png", caption: "Detailed Stats", aspectRatio: 'aspect-video', width: '500px' },
        ]
    },
    {
        title: "8. System & Settings",
        items: [
            { type: 'video', src: "https://media.alexandrudabu.com/Notifications.mp4", caption: "Push Notifications" },
            { type: 'image', src: "/Basketball%20Media/Poze%20simulator%20aplicatie%20baschet/notificationsPage.png", caption: "Notification Center" },
            { type: 'video', src: "https://media.alexandrudabu.com/connectGoogle.mp4", caption: "Google Integration", objectFit: 'object-cover' },
        ]
    }
];

const BasketballProject = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-text">
            <SEO
                title="Basketball AI App"
                description="AI-powered Basketball Social Media App with shot analysis and real-time feedback."
            />

            {/* Project Hero */}
            <section className="relative h-[40vh] pt-24 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background/95 z-10" />
                <div className="absolute inset-0 bg-surface z-0">
                    <div className="w-full h-full opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
                </div>

                <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Basketball Social Media & <span className="text-primary block mt-2">AI Shot Analysis</span>
                    </h1>
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {['Flutter', 'Python', 'Computer Vision', 'YOLOv8', 'Firebase', 'Google Maps'].map((tech) => (
                            <span key={tech} className="px-4 py-1.5 bg-surface/50 border border-white/10 rounded-full text-sm font-medium text-primary backdrop-blur-sm">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <ScrollReveal>
                    <Link
                        to="/#projects"
                        className="inline-flex items-center gap-2 text-primary hover:text-secondary mb-12 transition-colors font-medium no-underline cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Portfolio
                    </Link>

                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-primary">Project Overview</h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            A comprehensive cross-platform mobile application that bridges the gap between social networking and professional sports analytics.
                            Developed as a B.Sc. Thesis, this project aims to democratize access to advanced basketball shot analysis for amateur players.
                        </p>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            The app combines a robust social ecosystem—featuring real-time messaging, map-based court discovery, and event organization—with a cutting-edge Computer Vision module.
                            Users can record their shooting sessions, and the AI (powered by YOLOv8) automatically tracks accuracy, shot distribution, and player movement in real-time.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                            <div className="bg-surface/30 p-8 rounded-2xl border border-white/5">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                    <Smartphone className="w-5 h-5 text-primary" /> Key Features
                                </h3>
                                <ul className="space-y-3 text-gray-700 dark:text-gray-400">
                                    <li>• <strong>AI-Powered Shot Tracking:</strong> Automated real-time accuracy and distribution stats.</li>
                                    <li>• <strong>Social Ecosystem:</strong> Events, posts, and real-time messaging implementation.</li>
                                    <li>• <strong>Interactive Map:</strong> Google Maps integration for finding local courts and games.</li>
                                    <li>• <strong>Cross-Platform:</strong> Seamless experience on both iOS and Android via Flutter.</li>
                                </ul>
                            </div>
                            <div className="bg-surface/30 p-8 rounded-2xl border border-white/5">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                    <Layers className="w-5 h-5 text-primary" /> Technical Stack
                                </h3>
                                <ul className="space-y-3 text-gray-700 dark:text-gray-400">
                                    <li>• <strong>Mobile Framework:</strong> Flutter (Dart) with Provider for state management.</li>
                                    <li>• <strong>Backend:</strong> Firebase (Auth, Firestore, Cloud Functions).</li>
                                    <li>• <strong>Computer Vision:</strong> Python, YOLOv8, OpenCV, NumPy.</li>
                                    <li>• <strong>APIs:</strong> Google Maps API, OpenAI API for coaching feedback.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Feature Showcase */}
                    <div className="mb-24">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-1 h-12 bg-primary rounded-full"></div>
                            <h2 className="text-3xl font-bold">App Feature Tour</h2>
                        </div>
                        <FeatureShowcase groups={featureGroups} />
                    </div>

                    {/* Official Demo */}
                    <div className="mb-24">
                        <div className="bg-surface rounded-2xl overflow-hidden border border-white/5 shadow-2xl hover:border-primary hover:shadow-primary/30 transition-all duration-300">
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full"
                                    src="https://www.youtube.com/embed/1sgGy72bJwo"
                                    title="Basketball Social App - Full Demo"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                        <p className="text-center text-gray-600 dark:text-gray-500 mt-4 text-sm font-medium tracking-wide uppercase">Official Project Demo</p>
                    </div>
                </ScrollReveal>
            </section>
        </div>
    );
};

export default BasketballProject;
