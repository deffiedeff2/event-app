import React, { useState, ChangeEvent, FormEvent, DragEvent, useRef } from 'react';
import BackgroundCanvas from './BackgroundCanvas';
import { Event } from '../types';
import ImageIcon from '../assets/icons/image.svg?react';

interface CreateEventProps {
    username: string;
    onEventCreated: (eventId: number) => void;
    onBack: () => void;
}

const CreateEvent: React.FC<CreateEventProps> = ({ username, onEventCreated, onBack }) => {
    const [title, setTitle] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [background, setBackground] = useState<'particles' | 'lines'>('particles');
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string>('');
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB');
            setImageUrl(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }
        
        if (!file.type.match('image.*')) {
            setError('Please select an image file');
            setImageUrl(null);
            return;
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageUrl(reader.result as string);
            setError('');
        };
        reader.onerror = () => {
            setError('Failed to read image file.');
            setImageUrl(null);
        };
        reader.readAsDataURL(file);
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setError('');

        if (!title || !date || !description) {
            setError('All fields are required.');
            return;
        }

        if (!username) {
            setError('Error: Not logged in.');
            return;
        }

        const newEvent: Event = {
            id: Date.now(),
            userId: username,
            creatorUsername: username,
            title,
            date,
            description,
            background,
            isPublic,
            imageUrl: imageUrl ?? undefined,
            createdAt: new Date().toISOString()
        };

        const events: Event[] = JSON.parse(localStorage.getItem('eventAppEvents') || '[]');
        events.push(newEvent);
        localStorage.setItem('eventAppEvents', JSON.stringify(events));
        
        onEventCreated(newEvent.id);
    };

    return React.createElement(React.Fragment, null, [
        React.createElement(BackgroundCanvas, { key: 'canvas', pattern: background }),
        React.createElement('div', { key: 'container', className: 'container' }, [
            React.createElement('h2', { key: 'title', style: { marginBottom: 'var(--chakra-space-6)' } }, 'Create New Event'),
            React.createElement('form', { 
                key: 'form',
                onSubmit: handleSubmit,
                style: { display: 'flex', flexDirection: 'column', gap: 'var(--chakra-space-4)' }
            }, [
                React.createElement('div', { key: 'image-group' }, [
                    React.createElement('label', { htmlFor: 'event-image' }, 'Event image'),
                    React.createElement('div', {
                        className: `image-upload-area ${isDragging ? 'dragging' : ''}`,
                        onDragOver: handleDragOver,
                        onDragLeave: handleDragLeave,
                        onDrop: handleDrop,
                        onClick: triggerFileInput,
                        style: {
                            height: '200px',
                            border: `2px dashed ${isDragging ? 'var(--cyberpunk-yellow)' : 'var(--cyberpunk-border)'}`,
                            borderRadius: 'var(--chakra-radii-md)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            backgroundColor: 'rgba(26, 26, 26, 0.3)',
                            transition: 'all 0.2s ease-in-out',
                            marginBottom: 'var(--chakra-space-4)',
                            position: 'relative'
                        }
                    }, imageUrl ? [
                        React.createElement('img', {
                            key: 'image-preview',
                            src: imageUrl,
                            alt: 'Selected event image preview',
                            style: {
                                maxWidth: '100%',
                                maxHeight: '180px',
                                objectFit: 'contain',
                                borderRadius: 'var(--chakra-radii-md)'
                            }
                        }),
                        React.createElement('div', {
                            key: 'overlay',
                            style: {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                borderRadius: 'var(--chakra-radii-md)',
                                color: 'var(--cyberpunk-accent)'
                            }
                        }, [
                            React.createElement(ImageIcon, {
                                key: 'change-icon',
                                style: {
                                    width: '32px',
                                    height: '32px',
                                    marginBottom: 'var(--chakra-space-2)',
                                    fill: 'var(--cyberpunk-accent)'
                                }
                            }),
                            React.createElement('p', { key: 'change-text' }, 'Change Image')
                        ]),
                    ] : [
                        React.createElement(ImageIcon, {
                            key: 'upload-icon',
                            style: {
                                width: '48px',
                                height: '48px',
                                marginBottom: 'var(--chakra-space-2)',
                                fill: 'var(--cyberpunk-accent)'
                            }
                        }),
                        React.createElement('p', { key: 'drag-text' }, 'Drag & Drop Image Here'),
                        React.createElement('p', { 
                            key: 'click-text',
                            style: { fontSize: '0.9rem', opacity: 0.7 }
                        }, 'or Click to Browse (< 5MB)')
                    ]),
                    React.createElement('input', {
                        ref: fileInputRef,
                        id: 'event-image',
                        type: 'file',
                        accept: 'image/png, image/jpeg, image/gif, image/webp',
                        onChange: handleImageChange,
                        style: {
                            display: 'none'
                        }
                    })
                ]),
                React.createElement('div', { key: 'title-group' }, [
                    React.createElement('label', { htmlFor: 'event-title' }, 'Title'),
                    React.createElement('input', {
                        id: 'event-title',
                        type: 'text',
                        value: title,
                        onChange: (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value),
                        required: true
                    })
                ]),
                React.createElement('div', { key: 'date-group' }, [
                    React.createElement('label', { htmlFor: 'event-date' }, 'Date'),
                    React.createElement('input', {
                        id: 'event-date',
                        type: 'date',
                        value: date,
                        onChange: (e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value),
                        required: true
                    })
                ]),
                React.createElement('div', { key: 'description-group' }, [
                    React.createElement('label', { htmlFor: 'event-description' }, 'Description'),
                    React.createElement('textarea', {
                        id: 'event-description',
                        value: description,
                        onChange: (e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value),
                        required: true,
                        rows: 4
                    })
                ]),
                React.createElement('div', { key: 'background-group' }, [
                    React.createElement('label', { htmlFor: 'event-background' }, 'Background style'),
                    React.createElement('select', {
                        id: 'event-background',
                        value: background,
                        onChange: (e: ChangeEvent<HTMLSelectElement>) => setBackground(e.target.value as 'particles' | 'lines'),
                        required: true
                    }, [
                        React.createElement('option', { key: 'particles', value: 'particles' }, 'Particles'),
                        React.createElement('option', { key: 'lines', value: 'lines' }, 'Lines')
                    ])
                ]),
                React.createElement('div', { key: 'public-group', style: { display: 'flex', gap: 'var(--chakra-space-2)', alignItems: 'center' } }, [
                    React.createElement('input', {
                        id: 'isPublic',
                        type: 'checkbox',
                        checked: isPublic,
                        onChange: (e: ChangeEvent<HTMLInputElement>) => setIsPublic(e.target.checked)
                    }),
                    React.createElement('label', { htmlFor: 'isPublic', style: { marginBottom: 0 } }, 'Make event public')
                ]),
                error && React.createElement('div', { key: 'error', className: 'error-message' }, error),
                React.createElement('div', { key: 'buttons', style: { display: 'flex', gap: 'var(--chakra-space-4)', marginTop: 'var(--chakra-space-4)' } }, [
                    React.createElement('button', { key: 'create', type: 'submit' }, 'Create event'),
                    React.createElement('button', { key: 'back', type: 'button', onClick: onBack, className: 'secondary' }, 'Back to dashboard')
                ])
            ])
        ])
    ]);
};

export default CreateEvent; 