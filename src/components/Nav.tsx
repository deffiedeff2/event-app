import React, { useState, useEffect } from 'react';
import { NavProps, User, ViewType } from '../types';

interface NavState {
    displayName: string;
    profilePicture: string | null;
}

const Nav: React.FC<NavProps> = ({ username, onNavigate, onLogout }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [showClose, setShowClose] = useState<boolean>(false);
    const [profileData, setProfileData] = useState<NavState>({
        displayName: username,
        profilePicture: null
    });

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isOpen) {
            timer = setTimeout(() => {
                setShowClose(true);
            }, 300);
        } else {
            setShowClose(false);
        }
        return () => clearTimeout(timer);
    }, [isOpen]);

    useEffect(() => {
        // Load profile data
        const users = JSON.parse(localStorage.getItem('eventAppUsers') || '{}') as Record<string, User>;
        const userData = users[username] || {};
        setProfileData({
            displayName: userData.displayName || username,
            profilePicture: userData.profilePicture || null
        });
    }, [username]);

    const toggleNav = (): void => {
        setIsOpen(!isOpen);
    };

    const handleNavClick = (view: ViewType): void => {
        onNavigate(view);
        setIsOpen(false);
    };

    return React.createElement(React.Fragment, null, [
        React.createElement('button', {
            key: 'hamburger',
            className: `hamburger-button ${isOpen ? 'fade-out' : ''}`,
            onClick: toggleNav,
            'aria-label': 'Toggle navigation'
        }, React.createElement('div', {
            className: 'hamburger'
        }, [
            React.createElement('span', { key: '1' }),
            React.createElement('span', { key: '2' }),
            React.createElement('span', { key: '3' })
        ])),

        React.createElement('nav', {
            key: 'nav',
            className: `sidebar ${isOpen ? 'open' : ''}`
        }, [
            showClose && React.createElement('button', {
                key: 'close',
                className: 'close-button',
                onClick: toggleNav,
                'aria-label': 'Close navigation'
            }, React.createElement('div', {
                className: 'close-icon'
            }, [
                React.createElement('span', { key: '1' }),
                React.createElement('span', { key: '2' })
            ])),

            React.createElement('div', {
                key: 'header',
                className: 'nav-header'
            }, React.createElement('div', {
                className: 'profile-info'
            }, [
                profileData.profilePicture
                    ? React.createElement('img', {
                        key: 'profile-img',
                        src: profileData.profilePicture,
                        alt: 'Profile',
                        className: 'nav-profile-picture'
                    })
                    : React.createElement('div', {
                        key: 'profile-placeholder',
                        className: 'nav-profile-picture-placeholder'
                    }, profileData.displayName.charAt(0).toUpperCase()),
                React.createElement('h3', {
                    key: 'display-name'
                }, profileData.displayName)
            ])),

            React.createElement('ul', {
                key: 'nav-links',
                className: 'nav-links'
            }, [
                React.createElement('li', { key: 'profile' },
                    React.createElement('button', {
                        onClick: () => handleNavClick('profile')
                    }, 'Edit Profile')
                ),
                React.createElement('li', { key: 'dashboard' },
                    React.createElement('button', {
                        onClick: () => handleNavClick('dashboard')
                    }, 'Dashboard')
                ),
                React.createElement('li', { key: 'create' },
                    React.createElement('button', {
                        onClick: () => handleNavClick('createEvent')
                    }, 'Create Event')
                ),
                React.createElement('li', { key: 'public' },
                    React.createElement('button', {
                        onClick: () => handleNavClick('landing')
                    }, 'Public Events')
                ),
                React.createElement('li', { key: 'logout' },
                    React.createElement('button', {
                        onClick: onLogout,
                        className: 'logout-button'
                    }, 'Logout')
                )
            ])
        ]),

        isOpen && React.createElement('div', {
            key: 'overlay',
            className: 'nav-overlay',
            onClick: () => setIsOpen(false)
        })
    ]);
};

export default Nav; 