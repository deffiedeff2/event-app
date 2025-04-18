export interface User {
    username: string;
    hasPhone?: boolean;
    phoneNumber?: string;
    displayName?: string;
    bio?: string;
    profilePicture?: string | null;
}

export interface Event {
    id: number;
    userId: string;
    title: string;
    date: string;
    description: string;
    background: 'particles' | 'lines';
    isPublic: boolean;
}

export interface ProfileData {
    displayName: string;
    bio: string;
    profilePicture: string | null;
}

export interface ComponentBaseProps {
    username: string;
    onBack?: () => void;
    onLogout?: () => void;
}

export interface NavProps extends Pick<ComponentBaseProps, 'username'> {
    onNavigate: (view: ViewType) => void;
    onLogout: () => void;
}

export interface AuthProps {
    onLogin: (username: string) => void;
}

export interface AddPhoneProps extends Pick<ComponentBaseProps, 'username' | 'onLogout'> {
    onPhoneAdded: () => void;
}

export interface DashboardProps extends ComponentBaseProps {
    onCreateEvent: () => void;
    onViewEvent: (eventId: number) => void;
}

export interface CreateEventProps extends Pick<ComponentBaseProps, 'username'> {
    onEventCreated: (eventId: number) => void;
    onBack: () => void;
}

export interface ViewEventProps {
    eventId: number;
    onBack: () => void;
    onLogout: () => void;
}

export interface LandingPageProps {
    onLogin: () => void;
}

export interface ProfileProps extends Pick<ComponentBaseProps, 'username' | 'onBack'> {}

export type ViewType = 'landing' | 'auth' | 'addPhone' | 'dashboard' | 'createEvent' | 'viewEvent' | 'profile'; 