import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode; // Content to display inside the modal
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) {
        return null;
    }

    // Stop click propagation on the modal content itself
    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    // Close button SVG (simple 'X')
    const closeButtonSvg = React.createElement('svg', { 
        xmlns: "http://www.w3.org/2000/svg", 
        viewBox: "0 0 24 24", 
        fill: "currentColor", 
        width: "20px", 
        height: "20px" 
    }, 
        React.createElement('path', { 
            d: "M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
        })
    );

    return React.createElement('div', { className: 'modal-overlay', onClick: onClose },
        React.createElement('div', { className: 'modal-content', onClick: handleContentClick },
            React.createElement('div', { className: 'modal-header' },
                React.createElement('h2', { className: 'modal-title' }, title),
                React.createElement('button', { className: 'modal-close-button', onClick: onClose, 'aria-label': 'Close modal' },
                    closeButtonSvg
                )
            ),
            React.createElement('div', { className: 'modal-body' }, children)
        )
    );
};

export default Modal; 