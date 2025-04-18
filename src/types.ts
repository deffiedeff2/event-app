export interface Event {
    id: number;
    userId: string;
    title: string;
    date: string;
    description: string;
    background: 'particles' | 'lines';
    isPublic: boolean;
    imageUrl?: string;
    createdAt?: string;
    creatorUsername?: string;
    rsvps?: string[];
}

export interface User {
    hasPhone: boolean;
    phoneNumber: string;
    username: string;
    displayName?: string;
    password?: string;
    profileImageUrl?: string;
    bio?: string;
}

export interface UserProfile {
    username: string;
    displayName?: string;
    profileImageUrl?: string;
    bio?: string;
}

export type ViewType = 'profile' | 'dashboard' | 'createEvent' | 'explore' | 'auth' | 'addPhone' | 'viewEvent' | 'editEvent' | 'publicProfile'; 