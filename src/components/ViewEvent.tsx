import React, { useEffect, useState } from 'react';
import BackgroundCanvas from './BackgroundCanvas';
import InteractionBar from './InteractionBar';
import { Event, UserProfile } from '../types';

interface ViewEventProps {
    eventId: number;
    onBack: () => void;
    currentUser: string | null;
}

const getUserProfileData = (username: string | undefined): Partial<UserProfile> => {
    const defaultProfile: Partial<UserProfile> = { 
        profileImageUrl: `https://via.placeholder.com/40/3a3a3a/ffffff?text=${username ? username.charAt(0).toUpperCase() : '?'}`,
        displayName: username
    };
    if (!username) return defaultProfile;
    
    try {
        const users = JSON.parse(localStorage.getItem('eventAppUsers') || '{}');
        const userData = users[username]; 
        if (userData) {
            return {
                username: username,
                profileImageUrl: userData.profileImageUrl || defaultProfile.profileImageUrl,
                displayName: userData.displayName || username,
                bio: userData.bio
            };
        } else {
            return { ...defaultProfile, username: username };
        }
    } catch (error) {
        console.error("Error fetching user profile data:", error);
        return { ...defaultProfile, username: username };
    }
};

const ViewEvent: React.FC<ViewEventProps> = ({ eventId, onBack, currentUser }) => {
    const [event, setEvent] = useState<Event | null>(null);
    const [creatorProfile, setCreatorProfile] = useState<Partial<UserProfile>>({});
    const [error, setError] = useState<string>("");
    const [isRsvpProcessing, setIsRsvpProcessing] = useState(false);
    const [rsvpError, setRsvpError] = useState("");
    const [rsvps, setRsvps] = useState<string[]>([]);

    useEffect(() => {
        try {
            const allEvents = JSON.parse(localStorage.getItem("eventAppEvents") || "[]") as Event[];
            const foundEvent = allEvents.find((e) => e.id === eventId);
            if (foundEvent) {
                setEvent(foundEvent);
                setRsvps(foundEvent.rsvps || []);

                const usernameToFetch = foundEvent.creatorUsername || foundEvent.userId;
                if (usernameToFetch) {
                    setCreatorProfile(getUserProfileData(usernameToFetch));
                } else {
                    console.warn(`Event ${eventId} has no creatorUsername or userId.`);
                    setCreatorProfile(getUserProfileData(undefined));
                }
            } else {
                setError("Event not found.");
            }
        } catch (e) {
            console.error("Error loading event data:", e);
            setError("Failed to load event data.");
        }
    }, [eventId]);

    const handleRsvpClick = () => {
        if (!event || !currentUser) {
            setRsvpError("You must be logged in to RSVP.");
            return;
        }

        if (rsvps.includes(currentUser)) {
            setRsvpError("You have already RSVP'd to this event.");
            return;
        }

        setIsRsvpProcessing(true);
        setRsvpError("");

        try {
            const updatedRsvps = [...rsvps, currentUser];
            setRsvps(updatedRsvps);

            const allEvents = JSON.parse(localStorage.getItem("eventAppEvents") || "[]") as Event[];
            const eventIndex = allEvents.findIndex((e) => e.id === eventId);
            if (eventIndex !== -1) {
                allEvents[eventIndex] = { ...allEvents[eventIndex], rsvps: updatedRsvps };
                localStorage.setItem("eventAppEvents", JSON.stringify(allEvents));
                console.log(`User ${currentUser} RSVP'd to event ${eventId}`);
            } else {
                throw new Error("Event not found in localStorage during RSVP update.");
            }

            setTimeout(() => {
                setIsRsvpProcessing(false);
            }, 300);

        } catch (error) {
            console.error("Error saving RSVP:", error);
            setRsvpError("An error occurred while saving your RSVP. Please try again.");
            setRsvps(rsvps.filter(user => user !== currentUser));
            setIsRsvpProcessing(false);
        }
    };

    if (error) {
        return React.createElement('div', { className: 'container view-event-error' }, [
            React.createElement('p', { key: 'error-msg', className: 'error-message' }, error),
            React.createElement('button', { key: 'back-btn', onClick: onBack }, 'Back')
        ]);
    }

    if (!event) {
        return React.createElement('div', { className: 'loading-message' }, 'Loading event details...');
    }

    const leftColumn = React.createElement('div', { key: 'left-col', className: 'view-event-left-column' },
        event.imageUrl ? 
            React.createElement('img', { 
                src: event.imageUrl, 
                alt: `Visual for ${event.title}`, 
                className: 'view-event-image' 
            }) : 
            React.createElement('div', { className: 'view-event-image placeholder' }, 'No Image Provided')
    );

    const rightColumn = React.createElement('div', { key: 'right-col', className: 'view-event-right-column' }, [
        React.createElement('div', { key: 'creator-header', className: 'event-header-info view-event-header' }, [
            React.createElement('div', { key: 'creator', className: 'event-creator-info' }, [
                React.createElement('img', { 
                    key: 'creator-img', 
                    src: creatorProfile.profileImageUrl, 
                    alt: `${creatorProfile.displayName || 'User'}'s profile picture`,
                    className: 'creator-profile-img'
                }),
                React.createElement('span', { 
                    key: 'creator-name', 
                    className: 'creator-name'
                }, creatorProfile.displayName || event.creatorUsername || 'Unknown Creator')
            ]),
            React.createElement('span', { key: 'time', className: 'event-relative-time' }, /* Add time logic later, e.g., from event.createdAt */ ' ') 
        ]),
        React.createElement('h2', { key: 'title', className: 'view-event-title' }, event.title),
        React.createElement('p', { key: 'date', className: 'view-event-date' }, event.date),
        React.createElement('p', { key: 'description', className: 'view-event-description' }, event.description),
        React.createElement(InteractionBar, {
            key: 'interactions',
            eventId: String(event?.id ?? eventId),
            likeCount: 0,
            commentCount: 0,
            rsvpCount: rsvps.length,
        }),
        React.createElement("div", { key: "buttons", className: "view-event-button-container" }, [
            // Back Button
            React.createElement("button", { 
                key: "back-button", 
                onClick: onBack, 
                className: "view-event-back-button secondary"
            }, "Back"),
            // RSVP Button - Corrected syntax
            React.createElement("button", { 
                key: "rsvp-button", 
                onClick: handleRsvpClick, 
                // Correct template literal syntax for className
                className: `view-event-rsvp-button ${rsvps.includes(currentUser || "") ? "disabled-look" : ""}`,
                disabled: isRsvpProcessing || rsvps.includes(currentUser || "") // Disable if processing or already RSVP'd
            }, 
                // Correct ternary operator for button text
                isRsvpProcessing ? "Processing..." : (rsvps.includes(currentUser || "") ? "RSVP'd" : "RSVP")
            ),
        ]),
        rsvpError && React.createElement('p', { key: 'rsvp-error', className: 'error-message' }, rsvpError)
    ]);

    return React.createElement(React.Fragment, null, [
        React.createElement(BackgroundCanvas, { 
            key: 'canvas', 
            pattern: event.background 
        }),
        React.createElement('div', { 
            key: 'layout', 
            className: 'view-event-layout-container'
        }, [
            leftColumn,
            rightColumn
        ])
    ]);
};

export default ViewEvent; 