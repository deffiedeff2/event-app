import React from 'react';
// import GlobalSearch from './GlobalSearch'; // Remove import

interface TopNavProps {
    logoSrc: string;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onLoginClick?: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ logoSrc, searchTerm, onSearchChange, onLoginClick }) => {

    // --- Replicated GlobalSearch SVG Icon --- 
    const inlineSvgIcon = React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 59 59",
        className: "global-search-svg", // Use the same class
        fill: "currentColor"
    }, [
        React.createElement('title', { key: 'title' }, 'search'),
        React.createElement('g', { key: 'g1', id: "Layer_2", "data-name": "Layer 2" }, [
            React.createElement('g', { key: 'g2', id: "Layer_1-2", "data-name": "Layer 1" }, [
                React.createElement('g', { key: 'g3', id: "search" }, [
                    React.createElement('path', { 
                        key: 'path1', 
                        d: "M23.5,47A23.5,23.5,0,1,1,47,23.5,23.52,23.52,0,0,1,23.5,47Zm0-42A18.5,18.5,0,1,0,42,23.5,18.52,18.52,0,0,0,23.5,5Z"
                    }),
                    React.createElement('path', { 
                        key: 'path2',
                        d: "M56.5,59a2.49,2.49,0,0,1-1.77-.73L36.58,40.12a2.5,2.5,0,1,1,3.54-3.54L58.27,54.73a2.52,2.52,0,0,1,0,3.54A2.49,2.49,0,0,1,56.5,59Z"
                    })
                ])
            ])
        ])
    ]);
    // --- End Replicated SVG Icon ---

    // Direct handler for input change
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(event.target.value);
    };

    return React.createElement('div', { className: 'top-nav-container' }, [
        // Left section for Logo
        React.createElement('div', { key: 'left', className: 'top-nav-left' }, [
            React.createElement('img', {
                key: 'app-logo',
                src: logoSrc,
                alt: 'App Logo',
                className: 'app-logo-top-nav' 
            })
        ]),
        // Center section for Search - Rebuilt Directly
        React.createElement('div', { key: 'center', className: 'top-nav-center' }, [
            // Container for the search bar elements
            React.createElement('div', { className: 'global-search-container' }, [
                // Icon wrapper
                React.createElement('div', { 
                    key: 'search-icon-wrapper', 
                    className: 'global-search-icon-wrapper' 
                }, inlineSvgIcon),
                // Input field
                React.createElement('input', {
                    key: 'search-input',
                    type: 'text',
                    placeholder: 'Search',
                    value: searchTerm,
                    onChange: handleInputChange,
                    className: 'global-search-input'
                })
            ])
        ]),
        // Right section - Login Button
        React.createElement('div', { key: 'right', className: 'top-nav-right' }, 
            onLoginClick && React.createElement('button', { 
                key: 'login-button',
                className: 'topnav-login-button', 
                onClick: onLoginClick 
            }, 'Log In / Sign Up')
        )
    ]);
};

export default TopNav; 