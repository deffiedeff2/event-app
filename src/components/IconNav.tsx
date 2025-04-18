import React from 'react';
import { ViewType } from '../types';
import { User } from '../types'; // Assuming User type is defined here or import appropriately

// Import SVGs as React components - using available filenames
import HomeIcon from '../assets/icons/home.svg?react';
// import PlusIcon from '../assets/icons/plus.svg?react'; // File not found
import CreateEventIcon from '../assets/icons/addevent.svg?react'; // Tentative replacement for plus
import SearchIcon from '../assets/icons/search.svg?react';
// import ProfileIcon from '../assets/icons/user.svg?react'; // File not found
import ProfileIcon from '../assets/icons/account.svg?react'; // Using account.svg instead
import LogoutIcon from '../assets/icons/logout.svg?react';

interface IconNavProps {
    currentView: ViewType;
    onNavigate: (view: ViewType) => void;
    onLogout: () => void;
    currentUser: User | null; // Add currentUser prop
}

const IconNav: React.FC<IconNavProps> = ({ currentView, onNavigate, onLogout, currentUser }) => { // Destructure currentUser
    
    // Define navigation items using imported components
    const navItems: { view: ViewType, IconComponent: React.FC<React.SVGProps<SVGSVGElement>>, label: string }[] = [
        { view: 'dashboard', IconComponent: HomeIcon, label: 'Dashboard (Home)' },
        { view: 'createEvent', IconComponent: CreateEventIcon, label: 'Create event' }, // Using tentative replacement
        { view: 'explore', IconComponent: SearchIcon, label: 'Explore' }, // Updated view type from 'landing' to 'explore'
        { view: 'profile', IconComponent: ProfileIcon, label: 'Profile' }, // Using account icon
    ];

    // Prepare elements to render - Explicitly type the array
    const elements: React.ReactNode[] = [
        // Map navigation items to buttons
        ...navItems.map(item => 
            React.createElement('button', {
                key: item.view,
                className: `icon-nav-button ${currentView === item.view ? 'active' : ''}`,
                onClick: () => onNavigate(item.view),
                title: item.label // Tooltip for accessibility
            }, 
            // Use the imported SVG component directly
            React.createElement(item.IconComponent, { width: 24, height: 24, 'aria-label': item.label })
            )
        )
    ];

    // Conditionally add logout button
    if (currentUser) {
        elements.push(
            React.createElement('button', {
                key: 'logout',
                className: 'icon-nav-button logout-button',
                onClick: onLogout,
                title: 'Logout'
            },
            // Use the imported SVG component directly
            React.createElement(LogoutIcon, { width: 24, height: 24, 'aria-label': 'Logout' })
            )
        );
    }

    return React.createElement('nav', { className: 'icon-nav-container' }, elements);
};

export default IconNav; 