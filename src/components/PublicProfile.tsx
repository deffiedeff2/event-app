import React, { useState, useEffect, useCallback } from 'react';
import BackgroundCanvas from './BackgroundCanvas';
import { Event, User } from '../types';

interface PublicProfileProps {
    userId: string; // The ID of the user whose profile we are viewing
    onViewEvent?: (eventId: number) => void;
    onBack?: () => void; // Optional: function to go back to the previous view
}

// Define an interface for event data including creator info (though redundant here, keeps consistency)
interface ProfileEventData extends Event {
    creatorDisplayName?: string;
    creatorProfileImageUrl?: string;
}

const PublicProfile: React.FC<PublicProfileProps> = ({ userId, onViewEvent, onBack }) => {
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [userEvents, setUserEvents] = useState<ProfileEventData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');

    const loadProfileData = useCallback(() => {
        setIsLoading(true);
        setError('');
        try {
            const allUsers = JSON.parse(localStorage.getItem('eventAppUsers') || '{}') as Record<string, User>;
            const targetUser = allUsers[userId];

            if (!targetUser) {
                setError('User not found.');
                setProfileUser(null);
                setUserEvents([]);
                return;
            }
            setProfileUser(targetUser);

            const allEvents = JSON.parse(localStorage.getItem('eventAppEvents') || '[]') as Event[];
            const filteredEvents = allEvents
                .filter(event => event.userId === userId && event.isPublic) // Only public events by this user
                .map(event => ({
                    ...event,
                    creatorDisplayName: targetUser.displayName || userId,
                    creatorProfileImageUrl: targetUser.profileImageUrl
                }));
            setUserEvents(filteredEvents);

        } catch (err) {
            console.error("Error loading profile data:", err);
            setError('Failed to load profile data.');
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        loadProfileData();
    }, [loadProfileData]);

    const handleViewEvent = useCallback((eventId: number) => {
        if (onViewEvent) {
            onViewEvent(eventId);
        } else {
            console.warn('No onViewEvent handler provided for PublicProfile');
        }
    }, [onViewEvent]);
    
    const renderProfilePicture = (user: User | null) => {
        if (user?.profileImageUrl) {
            return React.createElement('img', {
                key: 'profile-pic',
                src: user.profileImageUrl,
                alt: user.displayName || userId,
                className: 'public-profile-picture' // Use a specific class
            });
        }
        return React.createElement('div', {
            key: 'profile-placeholder',
            className: 'public-profile-picture placeholder' // Use a specific class
        }, (user?.displayName || userId)[0]?.toUpperCase());
    };

    return React.createElement(React.Fragment, null, [
        React.createElement(BackgroundCanvas, { key: 'canvas', pattern: 'particles' }),
        React.createElement('div', { key: 'content', className: 'public-profile-layout container' }, [
            
            // Left Column: User's Event Cards
            React.createElement('div', { key: 'left-column', className: 'left-column' }, 
                isLoading
                    ? React.createElement('p', null, 'Loading events...')
                    : error && !profileUser // Show error only if user truly not found
                        ? React.createElement('p', { className: 'error-message' }, error)
                        : userEvents.length === 0
                            ? React.createElement('div', {
                                key: 'no-events',
                                style: { /* Style for no events */ }
                            }, 'This user has no public events.')
                            : userEvents.map(event => 
                                // Wrapper Div (consistent with Explore)
                                React.createElement('div', {
                                    key: `${event.id}-wrapper`,
                                    className: 'event-card-wrapper',
                                    onClick: () => handleViewEvent(event.id),
                                }, [
                                    // Creator Info (Optional here, but keeps structure - hidden by CSS)
                                    React.createElement('div', { className: 'event-creator-info' }, [
                                        React.createElement('img', { src: event.creatorProfileImageUrl || '', alt: '', className: 'creator-profile-img' }),
                                        React.createElement('span', { className: 'creator-name' }, event.creatorDisplayName)
                                    ]),
                                    // Event Card (Now just holds the image, click handled by wrapper)
                                    React.createElement('div', {
                                        key: event.id,
                                        className: 'event-card',
                                    }, [
                                        event.imageUrl && React.createElement('img', { key: 'img', src: event.imageUrl, className: 'event-image' }),
                                        // Details Div (hidden by CSS)
                                        React.createElement('div', { key: 'details', className: 'event-card-details' }, [
                                            React.createElement('h3', null, event.title),
                                            React.createElement('p', null, `Date: ${event.date}`),
                                            React.createElement('p', null, event.description)
                                        ])
                                    ])
                                ])
                            )
            ),

            // Right Column: Profile Info
            React.createElement('div', { key: 'right-column', className: 'right-column public-profile-info' }, 
                isLoading
                    ? React.createElement('p', null, 'Loading profile...')
                    : error 
                        ? React.createElement('p', { className: 'error-message' }, error)
                        : profileUser ? [
                            renderProfilePicture(profileUser), // Render profile pic/placeholder
                            React.createElement('h1', {
                                key: 'display-name',
                                className: 'public-profile-display-name'
                            }, profileUser.displayName || userId),
                            profileUser.bio && React.createElement('p', {
                                key: 'bio',
                                className: 'public-profile-bio'
                            }, profileUser.bio),
                            // Optional: Add Back button if needed
                            onBack && React.createElement('button', { 
                                key: 'back', 
                                onClick: onBack, 
                                className: 'secondary',
                                style: { marginTop: 'var(--chakra-space-6)' }
                            }, 'Back')
                        ] : null // Should not happen if no error, but good practice
            )
        ])
    ]);
};

export default PublicProfile; 