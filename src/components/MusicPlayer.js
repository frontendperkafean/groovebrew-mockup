import React, { useState, useEffect, useRef } from 'react';
import './MusicPlayer.css';
import MusicComponent from './MusicComponent';

export function MusicPlayer() {
    const [currentTime, setCurrentTime] = useState(0);
    const [expanded, setExpanded] = useState(false); // State for expansion

    const trackLength = 240; // Example track length of 240 seconds
    const backgroundImage = 'https://i.scdn.co/image/ab67616d0000b273c17b1ac99739729a2610e521';

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime((prevTime) => (prevTime < trackLength ? prevTime + 1 : prevTime));
        }, 1000);

        return () => clearInterval(interval);
    }, [trackLength]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const expandableContainerRef = useRef(null);

    useEffect(() => {
        if (expanded && expandableContainerRef.current) {
            expandableContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [expanded == true]);

    return (
        <div className={`music-player ${expanded ? 'expanded' : ''}`}>
            <div className="current-bgr" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
            <div className='current-info'>
                <div className="current-name">Bendera</div>
                <div className="current-artist">Cokelat</div>
                <div className="progress-container">
                    <div className="current-time">{formatTime(currentTime)}</div>
                    <input
                        type="range"
                        min="0"
                        max={trackLength}
                        value={currentTime}
                        className="progress-bar"
                        onChange={(e) => setCurrentTime(Number(e.target.value))}
                    />
                    <div className="track-length">{formatTime(trackLength)}</div>
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
                    <input type="text" placeholder="Search..." />
                </div>

                <MusicComponent min={-100} max={100} />
                <MusicComponent min={-100} max={100} />
                <MusicComponent min={-100} max={100} />
                <MusicComponent min={-100} max={100} />
                <MusicComponent min={-100} max={100} />
                <MusicComponent min={-100} max={100} />
                <MusicComponent min={-100} max={100} />
            </div>
            <div className="expand-button" onClick={toggleExpand}>
                <h5>{expanded ? 'collapse' : 'expand'}</h5>
            </div>
        </div>
    );
}
