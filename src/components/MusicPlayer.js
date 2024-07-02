import React, { useState, useEffect, useRef } from 'react';
import './MusicPlayer.css';
import MusicComponent from './MusicComponent';

export function MusicPlayer({ socket, shopId }) {
    const [currentTime, setCurrentTime] = useState(0);
    const [trackLength, setTrackLength] = useState(0);
    const [expanded, setExpanded] = useState(false); // State for expansion

    const backgroundImage = 'https://i.scdn.co/image/ab67616d0000b273c17b1ac99739729a2610e521';

    const [songName, setSongName] = useState('');
    const [debouncedSongName, setDebouncedSongName] = useState(songName);
    const [currentSong, setCurrentSong] = useState([]);
    const [songs, setSongs] = useState([]);
    const [queue, setQueue] = useState([]);
    const [paused, setPaused] = useState([]);

    useEffect(() => {
        if (!socket) return;

        socket.on('searchResponse', (response) => {
            console.log(response);
            setSongs(response);
        });

        socket.on('updateCurrentSong', (response) => {
            setCurrentSong(response);
            setCurrentTime(response.progress_ms / 1000); // Convert milliseconds to seconds
            setTrackLength(response.item.duration_ms / 1000);
        });

        socket.on('updateQueue', (response) => {
            setQueue(response);
            console.log(queue);
        });

        socket.on('updatePlayer', (response) => {
            setPaused(response.decision);
        });

        return () => {
            socket.off('searchResponse');
        };
    }, [socket]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSongName(songName);
        }, 300);

        // Cleanup function to clear the timeout if songName changes
        return () => {
            clearTimeout(handler);
        };
    }, [songName]);

    useEffect(() => {
        if (socket != null && debouncedSongName) {
            socket.emit('searchRequest', { shopId, songName: debouncedSongName });
        }
    }, [debouncedSongName, shopId, socket]);

    const handleInputChange = (event) => {
        setSongName(event.target.value);
    };

    const onRequest = (trackId) => {
        const token = localStorage.getItem("auth");
        if (socket != null && token) {
            socket.emit('songRequest', { token, shopId, trackId });
            setSongName("");
        }
    };

    const onDecision = (trackId, vote) => {
        const token = localStorage.getItem("auth");
        if (socket != null && token) socket.emit('songVote', { token, shopId, trackId, vote });
    };

    const handlePauseOrResume = (trackId, vote) => {
        const token = localStorage.getItem("auth");
        if (socket != null && token) {
            socket.emit('playOrPause', { token, shopId, action: paused ? "pause" : "resume" });
            console.log(paused);
            setPaused(!paused);
        }
    };

    const handleSpotifyLogin = () => {
        const token = localStorage.getItem("auth");
        const loginUrl = `http://localhost:5000/login?token=${token}`; // Construct the login URL with the token as a query parameter
        window.location.href = loginUrl; // Redirect the user to the login URL
    };

    const handleLogin = () => {
        // navigate(`/login/${shopId}`);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime((prevTime) => (prevTime < trackLength ? prevTime + 1 : prevTime));
        }, 1000);

        return () => clearInterval(interval);
    }, [trackLength]);

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
    
        // Ensure seconds and milliseconds are always displayed with two and three digits respectively
        const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    
        return `${minutes}:${formattedSeconds}`;
    };
    

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const expandableContainerRef = useRef(null);

    useEffect(() => {
        if (expanded && expandableContainerRef.current) {
            expandableContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [expanded]);

    return (
        <div className={`music-player ${expanded ? 'expanded' : ''}`}>
            <div
                className="current-bgr"
                style={{ backgroundImage: currentSong.item && currentSong.item.album && currentSong.item.album.images[0] && `url(${currentSong.item.album.images[0].url})` }}
            ></div>

            <div className='current-info'>
                <div className="current-name">
                    {currentSong.item && currentSong.item.name ? currentSong.item.name : 'Awaiting the next hit'}
                </div>
                <div className="current-artist">
                    {currentSong.item && currentSong.item.album && currentSong.item.album.images[0] && currentSong.item.artists[0].name ? currentSong.item.artists[0].name : 'Drop your hits below'}
                </div>
                <div className="progress-container">
                    <div className="current-time" style={{ visibility: currentSong.item ? 'visible' : 'hidden' }}>{formatTime(currentTime)}</div>
                    <input
                        type="range"
                        min="0"
                        max={trackLength}
                        value={currentTime}
                        className="progress-bar"
                        style={{ visibility: currentSong.item ? 'visible' : 'hidden' }}
                        disabled
                    />
                    <div className="track-length" style={{ visibility: currentSong.item ? 'visible' : 'hidden' }}>{formatTime(trackLength)}</div>
                </div>
            </div>
            <div className={`expandable-container ${expanded ? 'expanded' : ''}`} ref={expandableContainerRef}>
                <div className="search-box">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="search-icon"
                    >
                        <path
                            d="M10.533 1.27893C5.35215 1.27893 1.12598 5.41887 1.12598 10.5579C1.12598 15.697 5.35215 19.8369 10.533 19.8369C12.767 19.8369 14.8235 19.0671 16.4402 17.7794L20.7929 22.132C21.1834 22.5226 21.8166 22.5226 22.2071 22.132C22.5976 21.7415 22.5976 21.1083 22.2071 20.7178L17.8634 16.3741C19.1616 14.7849 19.94 12.7634 19.94 10.5579C19.94 5.41887 15.7138 1.27893 10.533 1.27893ZM3.12598 10.5579C3.12598 6.55226 6.42768 3.27893 10.533 3.27893C14.6383 3.27893 17.94 6.55226 17.94 10.5579C17.94 14.5636 14.6383 17.8369 10.533 17.8369C6.42768 17.8369 3.12598 14.5636 3.12598 10.5579Z"
                        />
                    </svg>
                    <input type="text" placeholder="Search..." value={songName} onChange={handleInputChange} />
                </div>
                <div className="search-box">
                    <button onClick={handleSpotifyLogin}>Login</button>
                </div>

                {songs.map((song, index) => (
                    <MusicComponent key={index} song={song} min={-100} max={100} />
                ))}
                {queue.map((song, index) => (
                    <MusicComponent key={index} song={song} min={-100} max={100} />
                ))}
            </div>
            <div className="expand-button" onClick={toggleExpand}><h5>{expanded ? 'collapse' : (currentSong.item && currentSong.item.album && currentSong.item.album.images[0] && currentSong.item.artists[0] ? 'expand' : 'request your song')}</h5></div>
        </div>
    );
}
