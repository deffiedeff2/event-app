import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Event } from '../types';
import BackgroundCanvas from './BackgroundCanvas';

interface EditEventProps {
    eventId: number;
    onSave: () => void;
    onCancel: () => void;
}

const EditEvent: React.FC<EditEventProps> = ({ eventId, onSave, onCancel }) => {
    const [event, setEvent] = useState<Event | null>(null);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null | undefined>(undefined); // State for image Data URL (undefined means not loaded yet)
    const [error, setError] = useState('');

    useEffect(() => {
        const loadEvent = () => {
            console.log('Loading event with ID:', eventId);
            const allEvents = JSON.parse(localStorage.getItem('eventAppEvents') || '[]') as Event[];
            const currentEvent = allEvents.find(e => e.id === eventId);
            
            console.log('Found event:', currentEvent);
            
            if (!currentEvent) {
                setError('Event not found');
                return;
            }

            // Verify user owns this event
            const currentUser = sessionStorage.getItem('eventAppSessionUser');
            console.log('Current user:', currentUser);
            console.log('Event user:', currentEvent.userId);
            
            if (currentEvent.userId !== currentUser) {
                setError('Unauthorized to edit this event');
                return;
            }

            setEvent(currentEvent);
            setTitle(currentEvent.title);
            setDate(currentEvent.date);
            setDescription(currentEvent.description);
            setIsPublic(currentEvent.isPublic);
            setImageUrl(currentEvent.imageUrl); // Load existing image URL
        };

        loadEvent();
    }, [eventId]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // Example size limit: 5MB
                setError('Image size must be less than 5MB');
                // Don't clear existing image on validation error, let user keep old or try again
                e.target.value = ''; 
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
                setError(''); 
            };
            reader.onerror = () => {
                setError('Failed to read image file.');
                // Don't clear existing image on error
            };
            reader.readAsDataURL(file);
        } else {
            // If user clears the file input, allow removing the image
            // Check if event originally had an image to prevent accidental removal on load
            if (event?.imageUrl) {
              setImageUrl(null); // Set to null to indicate removal
            }
            e.target.value = ''; // Ensure input is clear
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('Submitting edit form');

        if (!event) {
            console.log('No event data available');
            return;
        }

        const allEvents = JSON.parse(localStorage.getItem('eventAppEvents') || '[]') as Event[];
        const eventIndex = allEvents.findIndex(e => e.id === eventId);

        if (eventIndex === -1) {
            setError('Event not found');
            return;
        }

        const updatedEvent: Event = {
            ...event,
            title,
            date,
            description,
            isPublic,
            // If imageUrl is null, explicitly set undefined to remove. Otherwise use current state.
            imageUrl: imageUrl === null ? undefined : imageUrl 
        };

        console.log('Saving updated event:', updatedEvent);
        allEvents[eventIndex] = updatedEvent;
        localStorage.setItem('eventAppEvents', JSON.stringify(allEvents));
        onSave();
    };

    if (error && !event) { // Only show full error if event hasn't loaded
        return React.createElement('div', {
            style: {
                color: 'var(--cyberpunk-yellow)',
                textAlign: 'center',
                padding: 'var(--chakra-space-8)'
            }
        }, error);
    }

    if (!event && imageUrl === undefined) { // Show loading state or similar if needed
        return React.createElement('div', { style: { textAlign: 'center', padding: '2rem' } }, 'Loading event...');
    }

    return React.createElement(React.Fragment, null, [
        React.createElement(BackgroundCanvas, { key: 'canvas', pattern: event?.background || 'particles' }),
        React.createElement('div', {
            key: 'container',
            className: 'container'
        }, [
            React.createElement('h2', {
                key: 'title',
                style: { marginBottom: 'var(--chakra-space-6)' }
            }, 'Edit Event'),
            error && React.createElement('div', { key: 'form-error', className: 'error-message' }, error),
            React.createElement('form', {
                key: 'form',
                onSubmit: handleSubmit,
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--chakra-space-4)'
                }
            }, [
                React.createElement('div', { key: 'title-group' }, [
                    React.createElement('label', { key: 'title-label' }, 'Title'),
                    React.createElement('input', {
                        key: 'title-input',
                        type: 'text',
                        value: title,
                        onChange: (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value),
                        required: true
                    })
                ]),
                React.createElement('div', { key: 'date-group' }, [
                    React.createElement('label', { key: 'date-label' }, 'Date'),
                    React.createElement('input', {
                        key: 'date-input',
                        type: 'date',
                        value: date,
                        onChange: (e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value),
                        required: true
                    })
                ]),
                React.createElement('div', { key: 'description-group' }, [
                    React.createElement('label', { key: 'description-label' }, 'Description'),
                    React.createElement('textarea', {
                        key: 'description-input',
                        value: description,
                        onChange: (e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value),
                        required: true,
                        rows: 4
                    })
                ]),
                React.createElement('div', { key: 'image-group' }, [
                    React.createElement('label', { htmlFor: 'event-image' }, 'Event Image (Optional, < 5MB)'),
                    React.createElement('input', {
                        id: 'event-image',
                        type: 'file',
                        accept: 'image/png, image/jpeg, image/gif, image/webp',
                        onChange: handleImageChange,
                        style: { border: 'none', padding: '0.5rem 0' }
                    }),
                    imageUrl && React.createElement('img', {
                        key: 'image-preview',
                        src: imageUrl,
                        alt: 'Current event image preview',
                        style: { maxWidth: '100%', maxHeight: '200px', marginTop: 'var(--chakra-space-4)', objectFit: 'contain', borderRadius: 'var(--chakra-radii-md)' }
                    }),
                    imageUrl && React.createElement('button', {
                        key: 'remove-image',
                        type: 'button',
                        onClick: () => {
                            setImageUrl(null); // Set to null to mark for removal on save
                            const fileInput = document.getElementById('event-image') as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                        },
                        className: 'secondary',
                        style: { width: 'auto', padding: '0.25rem 0.75rem', fontSize: '0.8rem', marginTop: '0.5rem' }
                    }, 'Remove Image')
                ]),
                React.createElement('div', { key: 'public-group', style: { display: 'flex', gap: 'var(--chakra-space-2)', alignItems: 'center' } }, [
                    React.createElement('input', {
                        key: 'public-input',
                        type: 'checkbox',
                        checked: isPublic,
                        onChange: (e: ChangeEvent<HTMLInputElement>) => setIsPublic(e.target.checked),
                        id: 'isPublic'
                    }),
                    React.createElement('label', { key: 'public-label', htmlFor: 'isPublic' }, 'Make event public')
                ]),
                React.createElement('div', {
                    key: 'buttons',
                    style: {
                        display: 'flex',
                        gap: 'var(--chakra-space-4)',
                        marginTop: 'var(--chakra-space-4)'
                    }
                }, [
                    React.createElement('button', {
                        key: 'save',
                        type: 'submit'
                    }, 'Save Changes'),
                    React.createElement('button', {
                        key: 'cancel',
                        type: 'button',
                        onClick: onCancel,
                        style: {
                            backgroundColor: 'transparent',
                            border: '1px solid var(--cyberpunk-yellow)'
                        }
                    }, 'Cancel')
                ])
            ])
        ])
    ]);
};

export default EditEvent; 