import React, { useState } from 'react';
import Modal from './Modal'; // Import the Modal component

interface InteractionBarProps {
    likeCount?: number;
    commentCount?: number;
    rsvpCount?: number;
    // We might still need these for performing actions, but modal logic is separate
    // onLikeClick?: () => void;
    // onCommentClick?: () => void;
    // onRsvpClick?: () => void;
    // Add identifiers if needed to fetch data for the modal
    eventId?: string; 
}

const InteractionBar: React.FC<InteractionBarProps> = ({
    likeCount = 0,
    commentCount = 0,
    rsvpCount = 0,
    eventId // Assuming we need eventId to fetch data later
}) => {

    // --- Modal State ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);

    // --- Modal Control Functions ---
    const openModal = (title: string, content: React.ReactNode) => {
        setModalTitle(title);
        setModalContent(content);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalTitle('');
        setModalContent(null);
    };

    // --- Placeholder Content Fetchers (Replace with actual logic) ---
    const showLikes = (e: React.MouseEvent) => {
        e.stopPropagation(); // Stop event from bubbling up
        // TODO: Fetch actual likers based on eventId
        const content = React.createElement('p', null, `List of ${likeCount} users who liked will go here.`);
        openModal('Likes', content);
    };

    const showComments = (e: React.MouseEvent) => {
        e.stopPropagation(); // Stop event from bubbling up
        // TODO: Fetch actual comments based on eventId
        // Example structure using the CSS classes we added
        const commentsPlaceholder = React.createElement('div', null, [
             React.createElement('div', { key: 'c1', className: 'comment-item' }, [
                 React.createElement('img', { src: 'https://via.placeholder.com/40', alt: 'User Avatar', className: 'comment-avatar' }),
                 React.createElement('div', { className: 'comment-content' }, [
                     React.createElement('p', null, [React.createElement('span', { className: 'comment-user' }, 'UserOne'), 'This is a sample comment.']),
                     React.createElement('div', { className: 'comment-meta' }, [
                         React.createElement('span', null, '1h ago'),
                         React.createElement('button', { className: 'comment-reply-button' }, 'Reply')
                     ])
                 ])
             ]),
             React.createElement('div', { key: 'c2', className: 'comment-item' }, [
                React.createElement('img', { src: 'https://via.placeholder.com/40', alt: 'User Avatar', className: 'comment-avatar' }),
                React.createElement('div', { className: 'comment-content' }, [
                    React.createElement('p', null, [React.createElement('span', { className: 'comment-user' }, 'UserTwo'), 'Another insightful comment here.']),
                    React.createElement('div', { className: 'comment-meta' }, [
                        React.createElement('span', null, '2h ago'),
                        React.createElement('button', { className: 'comment-reply-button' }, 'Reply')
                    ])
                ])
            ]),
             // Add more comments or a loading state here
        ]);
        openModal('Comments', commentsPlaceholder);
    };

    const showRsvps = (e: React.MouseEvent) => {
        e.stopPropagation(); // Stop event from bubbling up
        // TODO: Fetch actual RSVPs based on eventId
        const content = React.createElement('p', null, `List of ${rsvpCount} users who RSVP'd will go here.`);
        openModal('RSVPs', content);
    };

    // Define SVGs (using React.createElement for consistency)
    const likeSvg = React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 58.49 53.34", className: "interaction-icon-svg", fill: "currentColor" }, 
        React.createElement('g', { id: "Layer_2", "data-name": "Layer 2" }, 
            React.createElement('g', { id: "Layer_1-2", "data-name": "Layer 1" }, 
                React.createElement('g', { id: "like" }, [
                    React.createElement('path', { d: "M43.79,53.34H25.48a13.21,13.21,0,0,1-7.64-2.42L13.1,47.57H6.15A6.16,6.16,0,0,1,0,41.42V30A6.16,6.16,0,0,1,6.15,23.8h6.57l6.65-8.55a1.74,1.74,0,0,0,.37-1.07V4.25A4.26,4.26,0,0,1,24,0,11.14,11.14,0,0,1,35.12,11.13v7.46H50.48A8,8,0,0,1,58,29.3L51.34,48A8,8,0,0,1,43.79,53.34ZM6.15,28.3A1.65,1.65,0,0,0,4.5,30V41.42a1.65,1.65,0,0,0,1.65,1.65h7.67a2.3,2.3,0,0,1,1.29.41l5.32,3.76a8.71,8.71,0,0,0,5.05,1.6H43.79a3.53,3.53,0,0,0,3.31-2.33l6.69-18.72a3.52,3.52,0,0,0-3.31-4.7H32.87a2.25,2.25,0,0,1-2.25-2.25V11.13A6.65,6.65,0,0,0,24.24,4.5v9.68A6.31,6.31,0,0,1,22.92,18l-7.33,9.41a2.23,2.23,0,0,1-1.77.87Z" }),
                    React.createElement('path', { d: "M13.82,47.57a2.25,2.25,0,0,1-2.25-2.25V26.05a2.25,2.25,0,0,1,4.5,0V45.32A2.25,2.25,0,0,1,13.82,47.57Z" })
                ])
            )
        )
    );

    // REPLACE commentSvg with message.svg content
    const commentSvg = React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 59 54.44", className: "interaction-icon-svg", fill: "currentColor" }, 
        React.createElement('g', { id: "Layer_2", "data-name": "Layer 2" }, 
            React.createElement('g', { id: "Layer_1-2", "data-name": "Layer 1" }, 
                React.createElement('g', { id: "message-" }, [
                    React.createElement('path', { d: "M55.67,54.44a2.51,2.51,0,0,1-.76-.12L41.53,50a2.5,2.5,0,1,1,1.53-4.76l8.8,2.83-2.32-7.48a2.5,2.5,0,0,1,4.78-1.49L58.06,51.2a2.46,2.46,0,0,1-.63,2.51A2.5,2.5,0,0,1,55.67,54.44Z" }),
                    React.createElement('path', { d: "M29.5,53C13.23,53,0,41.11,0,26.5S13.23,0,29.5,0,59,11.89,59,26.5a24.53,24.53,0,0,1-5.08,14.87,2.5,2.5,0,0,1-4-3A19.57,19.57,0,0,0,54,26.5C54,14.64,43,5,29.5,5S5,14.64,5,26.5,16,48,29.5,48a27.25,27.25,0,0,0,11.71-2.61,2.5,2.5,0,1,1,2.16,4.51A32.31,32.31,0,0,1,29.5,53Z" })
                ])
            )
        )
    );

    const rsvpSvg = React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 57.85 59", className: "interaction-icon-svg", fill: "currentColor" }, 
        React.createElement('g', { id: "Layer_2", "data-name": "Layer 2" }, 
            React.createElement('g', { id: "Layer_1-2", "data-name": "Layer 1" }, 
                React.createElement('g', { id: "ticket" }, [
                    React.createElement('path', { d: "M34,59a2.5,2.5,0,0,1-2.5-2.5V23.22a2.5,2.5,0,0,1,5,0V56.5A2.5,2.5,0,0,1,34,59Z" }),
                    React.createElement('path', { d: "M55.35,51.17a11.31,11.31,0,0,1,0-22.62,2.5,2.5,0,1,1,0,5,6.31,6.31,0,0,0,0,12.62,2.5,2.5,0,1,1,0,5Z" }),
                    React.createElement('path', { d: "M2.5,51.17a2.5,2.5,0,0,1,0-5,6.31,6.31,0,0,0,0-12.62,2.5,2.5,0,1,1,0-5,11.31,11.31,0,0,1,0,22.62Z" }),
                    React.createElement('path', { d: "M55.35,33.55a2.5,2.5,0,0,1-2.5-2.5V25.72H5v5.33a2.5,2.5,0,0,1-5,0V23.22a2.5,2.5,0,0,1,2.5-2.5H55.35a2.49,2.49,0,0,1,2.5,2.5v7.83A2.49,2.49,0,0,1,55.35,33.55Z" }),
                    React.createElement('path', { d: "M55.35,59H2.5A2.5,2.5,0,0,1,0,56.5V48.67a2.5,2.5,0,0,1,5,0V54H52.85V48.67a2.5,2.5,0,0,1,5,0V56.5A2.49,2.49,0,0,1,55.35,59Z" }),
                    React.createElement('path', { d: "M36.75,25.72a2.51,2.51,0,0,1-2.3-1.52L29.2,11.82a2.5,2.5,0,1,1,4.6-2l5.25,12.38a2.5,2.5,0,0,1-1.32,3.28A2.42,2.42,0,0,1,36.75,25.72Z" }),
                    React.createElement('path', { d: "M50.7,25.73a2.48,2.48,0,0,1-2-1A11.28,11.28,0,0,1,53.24,7.41,2.5,2.5,0,0,1,55.19,12a6.31,6.31,0,0,0-3.34,8.27,6,6,0,0,0,.82,1.41,2.5,2.5,0,0,1-2,4Z" }),
                    React.createElement('path', { d: "M2.5,25.65a2.5,2.5,0,0,1-1-4.8L50.18,.2a2.49,2.49,0,0,1,3.27,1.32l3.06,7.21a2.5,2.5,0,1,1-4.6,1.95l-2.08-4.9L3.48,25.45A2.42,2.42,0,0,1,2.5,25.65Z" })
                ])
            )
        )
    );

    // Helper to create an icon + count element
    const createInteractionElement = (key: string, svg: React.ReactElement, count: number, onClickModal: (e: React.MouseEvent) => void) => {
        // Always attach the modal click handler
        return React.createElement('div', { 
            key: key, 
            className: 'interaction-item clickable', // Add clickable class
            onClick: onClickModal // Pass the event object to the handler
        }, [
            React.createElement('div', { key: 'icon', className: 'interaction-icon-wrapper' }, svg),
            React.createElement('span', { key: 'count', className: 'interaction-count' }, count)
        ]);
    };

    return React.createElement(React.Fragment, null, [
        React.createElement('div', { key: 'bar', className: 'interaction-bar-container' }, [
            createInteractionElement('likes', likeSvg, likeCount, showLikes),
            createInteractionElement('comments', commentSvg, commentCount, showComments),
            createInteractionElement('rsvps', rsvpSvg, rsvpCount, showRsvps)
        ]),
        // Render the Modal conditionally
        React.createElement(Modal, {
            key: 'modal',
            isOpen: isModalOpen,
            onClose: closeModal,
            title: modalTitle,
            children: modalContent
        })
    ]);
};

export default InteractionBar; 