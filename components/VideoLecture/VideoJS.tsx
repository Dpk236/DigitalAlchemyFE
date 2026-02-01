import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

interface VideoJSProps {
    videoUrl: string;
    vttUrl: string;
    assetId?: string;
    JWTToken?: string;
    onReady?: (player: Player) => void;
}

const VideoJS: React.FC<VideoJSProps> = ({
    videoUrl,
    vttUrl,
    onReady
}) => {
    const videoRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<Player | null>(null);

    useEffect(() => {
        // Make sure Video.js player is only initialized once
        if (!playerRef.current && videoRef.current) {
            const videoElement = document.createElement("video-js");

            videoElement.classList.add("vjs-big-play-centered");
            videoRef.current.appendChild(videoElement);

            playerRef.current = videojs(videoElement, {
                controls: false, // Turn off default controls
                bigPlayButton: false, // Hide default play button
                responsive: true,
                fluid: true,
                preload: "auto",
                playbackRates: [0.5, 1, 1.25, 1.5, 2],
                html5: {
                    vhs: {
                        overrideNative: true
                    },
                    nativeAudioTracks: false,
                    nativeVideoTracks: false
                },
                sources: [
                    {
                        src: videoUrl,
                        type: videoUrl.endsWith('.m3u8') ? 'application/x-mpegURL' : 'video/mp4',
                    },
                ],
                tracks: [
                    {
                        kind: "subtitles",
                        src: vttUrl,
                        srclang: "en",
                        label: "English",
                        default: true,
                    },
                ],
            });

            // Handle network errors with auto-retry
            playerRef.current.on("error", () => {
                const player = playerRef.current;
                if (!player) return;

                const error = player.error();
                if (error && error.code === 2) { // MEDIA_ERR_NETWORK
                    console.warn("VideoJS: Network error detected. Attempting to recover...");
                    const currentTime = player.currentTime();

                    // Reset error and reload
                    player.error(null);
                    player.src({ src: videoUrl, type: videoUrl.endsWith('.m3u8') ? 'application/x-mpegURL' : 'video/mp4' });
                    player.load();

                    // Resume from previous position
                    player.one("loadedmetadata", () => {
                        player.currentTime(currentTime);
                        player.play().catch(e => console.error("VideoJS: Play failed after recovery", e));
                    });
                }
            });

            if (onReady) {
                onReady(playerRef.current);
            }
        }
    }, [videoRef, onReady]);

    // Update source when videoUrl changes
    useEffect(() => {
        const player = playerRef.current;
        if (player && videoUrl) {
            player.src({
                src: videoUrl,
                type: videoUrl.endsWith('.m3u8') ? 'application/x-mpegURL' : 'video/mp4',
            });
            player.load();
        }
    }, [videoUrl]);

    // Dispose the player on unmount
    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    return (
        <div data-vjs-player>
            <div ref={videoRef} />
        </div>
    );
};

export default VideoJS;
