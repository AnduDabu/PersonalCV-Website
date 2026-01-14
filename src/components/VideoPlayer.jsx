import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Maximize, Minimize, Settings } from 'lucide-react';

const VideoPlayer = ({ src, poster, aspectRatio = 'aspect-video', objectFit = 'object-contain' }) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);

    const playbackSpeeds = [0.5, 1, 1.25, 1.5, 2];

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateTime = () => {
            setCurrentTime(video.currentTime);
            setProgress((video.currentTime / video.duration) * 100);
        };

        const updateDuration = () => {
            setDuration(video.duration);
        }

        video.addEventListener('timeupdate', updateTime);
        video.addEventListener('loadedmetadata', updateDuration);

        return () => {
            video.removeEventListener('timeupdate', updateTime);
            video.removeEventListener('loadedmetadata', updateDuration);
        };
    }, []);

    const togglePlay = (e) => {
        e.stopPropagation();
        if (showSpeedMenu) setShowSpeedMenu(false);
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSeek = (e) => {
        e.stopPropagation();
        const newTime = (e.target.value / 100) * duration;
        videoRef.current.currentTime = newTime;
        setProgress(e.target.value);
    };

    const toggleFullscreen = (e) => {
        e.stopPropagation();
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const changePlaybackSpeed = (e, speed) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.playbackRate = speed;
            setPlaybackRate(speed);
            setShowSpeedMenu(false);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div
            ref={containerRef}
            className={`relative group rounded-xl overflow-hidden bg-black ${aspectRatio} shadow-lg border border-surface/50`}
            onClick={togglePlay}
        >
            <video
                ref={videoRef}
                className={`w-full h-full ${objectFit}`}
                src={src}
                poster={poster}
                onEnded={() => setIsPlaying(false)}
                playsInline
            />

            {/* Overlay controls - appear on hover or when paused */}
            <div className={`absolute inset-0 bg-black/40 flex flex-col justify-end transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>

                {/* Center Play Button (Only when paused) */}
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-white/10 backdrop-blur-sm p-5 rounded-full ring-1 ring-white/20 shadow-2xl">
                            <Play className="w-10 h-10 text-white fill-white" />
                        </div>
                    </div>
                )}

                {/* Bottom Controls Bar */}
                <div
                    className="p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Scrubber */}
                    <div className="relative h-1 bg-white/30 rounded-full cursor-pointer group/scrubber">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress || 0}
                            onChange={handleSeek}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div
                            className="h-full bg-primary rounded-full relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow scale-0 group-hover/scrubber:scale-100 transition-transform" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <button onClick={togglePlay} className="hover:text-primary transition-colors">
                                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                            </button>
                            <span className="text-xs font-medium font-mono">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Playback Speed Control */}
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSpeedMenu(!showSpeedMenu);
                                    }}
                                    className="hover:text-primary transition-colors text-xs font-bold w-8"
                                >
                                    {playbackRate}x
                                </button>
                                {showSpeedMenu && (
                                    <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-md rounded-lg overflow-hidden border border-white/10 shadow-xl min-w-[80px]">
                                        {playbackSpeeds.map((speed) => (
                                            <button
                                                key={speed}
                                                onClick={(e) => changePlaybackSpeed(e, speed)}
                                                className={`block w-full text-left px-3 py-2 text-xs hover:bg-white/20 transition-colors ${playbackRate === speed ? 'text-primary font-bold' : 'text-white'}`}
                                            >
                                                {speed}x
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button onClick={toggleFullscreen} className="hover:text-primary transition-colors">
                                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
