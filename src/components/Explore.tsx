import React, { useState, useEffect, useCallback } from 'react';
import BackgroundCanvas from './BackgroundCanvas';
import { Event, User } from '../types'; // Import User type
import { formatRelativeTime } from '../utils/timeUtils'; // Import the time formatter
import InteractionBar from './InteractionBar'; // Import the InteractionBar

interface ExploreProps { // Renamed interface
    onLogin: () => void;
    onViewEvent?: (eventId: number) => void;
    onViewProfile?: (userId: string) => void; // Add prop to handle profile navigation
}

// Define an interface for event data including creator info
interface PublicEventData extends Event {
    creatorDisplayName?: string;
    creatorProfileImageUrl?: string;
}

const Explore: React.FC<ExploreProps> = ({ onLogin, onViewEvent, onViewProfile }) => { // Renamed component
    const [publicEvents, setPublicEvents] = useState<PublicEventData[]>([]); // Use the new interface
    const [isLoading, setIsLoading] = useState(false);

    const loadEvents = useCallback(() => {
        setIsLoading(true);
        try {
            const allEvents = JSON.parse(localStorage.getItem('eventAppEvents') || '[]') as Event[];
            const users = JSON.parse(localStorage.getItem('eventAppUsers') || '{}') as Record<string, User>;
            
            const publicEventsList: PublicEventData[] = allEvents
                .filter(event => event.isPublic)
                .map(event => {
                    const creator = users[event.userId];
                    return {
                        ...event,
                        creatorDisplayName: creator?.displayName,
                        creatorProfileImageUrl: creator?.profileImageUrl
                    };
                });
                
            setPublicEvents(publicEventsList);
        } catch (error) {
            console.error("Error loading public events:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEvents();
        const intervalId = setInterval(loadEvents, 30000);
        return () => clearInterval(intervalId);
    }, [loadEvents]);

    const handleViewEvent = useCallback((eventId: number) => {
        if (onViewEvent) {
            onViewEvent(eventId);
        } else {
            console.warn('No onViewEvent handler provided');
        }
    }, [onViewEvent]);

    const handleViewCreatorProfile = useCallback((userId: string) => {
        if (onViewProfile) {
            onViewProfile(userId);
        } else {
            console.warn('No onViewProfile handler provided');
        }
    }, [onViewProfile]);

    return React.createElement(React.Fragment, null, [
        React.createElement(BackgroundCanvas, { key: 'canvas', pattern: 'particles' }),
        React.createElement('div', { key: 'content', className: 'landing-page-layout container' }, [
            
            // Left Column: Event Cards
            React.createElement('div', { key: 'left-column', className: 'left-column' }, 
                publicEvents.length === 0
                    ? React.createElement('div', {
                        key: 'no-events',
                        style: {
                            textAlign: 'center',
                            padding: 'var(--chakra-space-8)',
                            border: '1px solid var(--cyberpunk-border)',
                            borderRadius: 'var(--chakra-radii-md)',
                            backgroundColor: 'var(--cyberpunk-dark-gray)',
                            marginTop: 'var(--chakra-space-6)'
                        }
                    }, [
                        React.createElement('h3', {
                            key: 'no-events-title',
                            style: {
                                color: 'var(--cyberpunk-accent)',
                                marginBottom: 'var(--chakra-space-4)'
                            }
                        }, 'No public events available')
                    ])
                    : publicEvents.map(event => 
                        // New Wrapper Div for Creator Info + Card
                        React.createElement('div', {
                            key: `${event.id}-wrapper`,
                            className: 'event-card-wrapper' 
                        }, [
                            // Event Info Header (Creator + Time)
                            React.createElement('div', {
                                key: 'event-header',
                                className: 'event-header-info' // New class for flex layout
                            }, [
                                // Creator Info (Clickable)
                                React.createElement('div', {
                                    key: 'creator-info',
                                    className: 'event-creator-info',
                                    onClick: (e) => { 
                                        e.stopPropagation(); // Prevent card click
                                        handleViewCreatorProfile(event.userId); 
                                    },
                                    style: { cursor: 'pointer' } // Add pointer cursor
                                }, [
                                    event.creatorProfileImageUrl 
                                        ? React.createElement('img', {
                                            key: 'creator-img',
                                            src: event.creatorProfileImageUrl,
                                            alt: event.creatorDisplayName || event.userId,
                                            className: 'creator-profile-img'
                                        })
                                        : React.createElement('div', { 
                                            key: 'creator-placeholder',
                                            className: 'creator-profile-img placeholder'
                                        }, (event.creatorDisplayName || event.userId)[0]?.toUpperCase()),
                                    React.createElement('span', { 
                                        key: 'creator-name',
                                        className: 'creator-name'
                                    }, event.creatorDisplayName || event.userId)
                                ]),
                                // Relative Time Display - Always render the span
                                React.createElement('span', {
                                    key: 'event-time',
                                    className: 'event-relative-time'
                                }, formatRelativeTime(event.createdAt)) // Let the function handle null/undefined
                            ]),
                            
                            // Event Card (Image + Details)
                            React.createElement('div', {
                                key: event.id,
                                className: 'event-card',
                                onClick: () => handleViewEvent(event.id),
                                style: { cursor: 'pointer', width: '100%' } 
                            }, [
                                // Event Image
                                event.imageUrl && React.createElement('img', {
                                    key: 'event-image',
                                    src: event.imageUrl,
                                    alt: event.title,
                                    className: 'event-image'
                                }),
                                // ADD Interaction Bar Here
                                React.createElement(InteractionBar, { 
                                    key: 'interactions', 
                                    // Pass actual counts/handlers later if needed
                                }),
                                // Event Details
                                React.createElement('div', { key: 'event-details', className: 'event-card-details' }, [
                                    React.createElement('h3', {
                                        key: 'event-title',
                                        style: {
                                            fontSize: 'var(--chakra-fontSizes-lg)',
                                            marginBottom: 'var(--chakra-space-2)'
                                        }
                                    }, event.title),
                                    React.createElement('p', {
                                        key: 'event-desc',
                                        style: {
                                            fontSize: '0.9rem',
                                            opacity: 0.8,
                                            marginBottom: 'var(--chakra-space-2)'
                                        }
                                    }, event.description),
                                    React.createElement('p', {
                                        key: 'event-date',
                                        style: { 
                                            fontSize: '0.9rem', 
                                            opacity: 0.7 
                                        }
                                    }, [
                                        React.createElement('strong', { key: 'date-label' }, 'Date: '),
                                        event.date
                                    ])
                                ])
                            ])
                        ])
                    )
            ),

            // Right Column: Info and Controls
            React.createElement("div", { key: "right-column", className: "right-column" }, [
                React.createElement("h1", { key: "title", style: { textAlign: "left", marginBottom: "var(--chakra-space-2)"} }, "Event invite creator"),
                React.createElement("p", {
                    key: "subtitle",
                    style: { textAlign: "left", marginBottom: "var(--chakra-space-6)" },
                }, "Create and share your events with style"),
            ]),
        ])
    ]);
};

export default Explore; 