import React, { useState, useEffect, useCallback, useMemo, ChangeEvent } from 'react';
import { Event, User, ViewType } from '../types';

interface DashboardProps {
    username: string;
    onCreateEvent: () => void;
    onViewEvent: (eventId: number) => void;
    onEditEvent: (eventId: number) => void;
    onNavigate: (view: ViewType) => void;
    onLogout: () => void;
    globalSearchTerm?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ username, onCreateEvent, onViewEvent, onEditEvent, onNavigate, onLogout, globalSearchTerm }) => {
    const [userEvents, setUserEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [needsPhone, setNeedsPhone] = useState<boolean>(false);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'title'>('newest');
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError('');
        setNeedsPhone(false);
        try {
            const allEvents = JSON.parse(localStorage.getItem('eventAppEvents') || '[]') as Event[];
            const userEvents = allEvents.filter(event => event.userId === username);
            setUserEvents(userEvents);
            console.log('Loaded user events:', userEvents);

            const users = JSON.parse(localStorage.getItem('eventAppUsers') || '{}') as Record<string, User>;
            const user = users[username];
            if (!user || !user.hasPhone) {
                setNeedsPhone(true);
            }
        } catch (err) {
            console.error("Failed to load dashboard data:", err);
            setError("Failed to load data. Please refresh.");
        } finally {
            setIsLoading(false);
        }
    }, [username]);

    const filteredAndSortedEvents = useMemo(() => {
        let filtered = [...userEvents];

        if (globalSearchTerm) {
            const lowerCaseSearch = globalSearchTerm.toLowerCase();
            filtered = filtered.filter(event => 
                event.title.toLowerCase().includes(lowerCaseSearch) ||
                event.description.toLowerCase().includes(lowerCaseSearch)
            );
        }

        filtered.sort((a, b) => {
            switch (sortOrder) {
                case 'newest':
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case 'oldest':
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'title':
                    return a.title.localeCompare(b.title);
            }
        });

        return filtered;
    }, [userEvents, globalSearchTerm, sortOrder]);

    const handleCreateEvent = useCallback((): void => {
        if (needsPhone) return;
        onCreateEvent();
    }, [needsPhone, onCreateEvent]);

    const handleEditEvent = useCallback((eventId: number): void => {
        console.log('Attempting to edit event:', eventId);
        if (typeof onEditEvent !== 'function') {
            console.error('onEditEvent is not a function!');
            setError('Unable to edit event at this time.');
            return;
        }
        onEditEvent(eventId);
    }, [onEditEvent]);

    const handleDeleteEvent = useCallback((eventId: number): void => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const currentEvents = JSON.parse(localStorage.getItem('eventAppEvents') || '[]') as Event[];
                const updatedEvents = currentEvents.filter(event => event.id !== eventId);
                localStorage.setItem('eventAppEvents', JSON.stringify(updatedEvents));
                setUserEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
            } catch (err) {
                console.error("Failed to delete event:", err);
                setError("Could not delete the event. Please try again.");
            }
        }
    }, []);

    if (isLoading) {
        return React.createElement('section', { className: 'container', style: { textAlign: 'center' } }, 'Loading dashboard...');
    }

    return React.createElement('section', { className: 'container' }, [
        React.createElement('h1', { key: 'title' }, 'Dashboard'),
        React.createElement('p', {
            key: 'welcome',
            style: { textAlign: 'center', marginBottom: 'var(--chakra-space-6)' }
        }, `Welcome, ${username}!`),
        error && React.createElement('div', { key: 'error', className: 'error-message' }, error),
        needsPhone && React.createElement('div', {
            key: 'phone-error',
            className: 'error-message phone-prompt'
        }, [
            'Please add a phone number to your profile to create events. ',
            React.createElement('button', {
                key: 'goto-profile',
                className: 'link-button',
                onClick: () => onNavigate('profile'),
                style: { display: 'inline', padding: '0', margin: '0', verticalAlign: 'baseline' }
            }, 'Go to profile')
        ]),
        React.createElement('button', {
            key: 'create-button',
            onClick: handleCreateEvent,
            disabled: needsPhone,
            style: needsPhone ? { opacity: 0.5, cursor: 'not-allowed' } : {}
        }, 'Create new event'),
        React.createElement('div', {
            key: 'controls-section',
            className: 'dashboard-controls'
        }, [
            React.createElement('select', {
                key: 'sort',
                value: sortOrder,
                onChange: (e: ChangeEvent<HTMLSelectElement>) => setSortOrder(e.target.value as typeof sortOrder),
                className: 'dashboard-sort'
            }, [
                React.createElement('option', { value: 'newest' }, 'Sort by: Newest'),
                React.createElement('option', { value: 'oldest' }, 'Sort by: Oldest'),
                React.createElement('option', { value: 'title' }, 'Sort by: Title')
            ]),
        ]),
        React.createElement('div', {
            key: 'events-section',
            style: { marginTop: 'var(--chakra-space-6)' }
        }, [
            React.createElement('h2', { key: 'events-title' }, 'Your events'),
            filteredAndSortedEvents.length === 0
                ? React.createElement('p', { key: 'no-events', style: { marginTop: 'var(--chakra-space-4)' } }, 
                    globalSearchTerm ? 'No events match your search.' : 'No events created yet.'
                )
                : React.createElement('ul', {
                    key: 'events-list',
                    className: 'dashboard-event-list'
                }, filteredAndSortedEvents.map(event =>
                    React.createElement('li', {
                        key: event.id,
                        className: 'dashboard-event-item'
                    }, [
                        event.imageUrl && React.createElement('img', {
                            key: 'event-thumb',
                            src: event.imageUrl,
                            alt: '',
                            className: 'event-item-thumbnail'
                        }),
                        React.createElement('div', { key: 'event-info', className: 'event-item-info' }, [
                            React.createElement('span', { key: 'event-title', className: 'event-item-title' }, event.title),
                            React.createElement('span', { key: 'event-date', className: 'event-item-date' }, `- ${event.date}`),
                            React.createElement('span', {
                                key: 'event-status',
                                className: `event-item-status ${event.isPublic ? 'public' : 'private'}`
                            }, event.isPublic ? '(Public)' : '(Private)')
                        ]),
                        React.createElement('div', { key: 'event-actions', className: 'event-item-actions' }, [
                            React.createElement('button', {
                                key: 'view-button',
                                className: 'link-button',
                                onClick: () => onViewEvent(event.id),
                                title: 'View event'
                            }, 'View'),
                            React.createElement('button', {
                                key: 'edit-button',
                                className: 'link-button',
                                onClick: () => handleEditEvent(event.id),
                                title: 'Edit event'
                            }, 'Edit'),
                            React.createElement('button', {
                                key: 'delete-button',
                                className: 'link-button delete-button',
                                onClick: () => handleDeleteEvent(event.id),
                                title: 'Delete event'
                            }, 'Delete')
                        ])
                    ])
                ))
        ]),
        React.createElement('button', {
            key: 'logout',
            onClick: onLogout,
            className: 'secondary',
            style: { marginTop: 'var(--chakra-space-8)' }
        }, 'Logout')
    ]);
};

export default Dashboard; 