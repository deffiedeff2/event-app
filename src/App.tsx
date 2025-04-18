import React, { useState, useEffect, useCallback } from 'react'
import './App.css'
import Auth from './components/Auth'
import AddPhone from './components/AddPhone'
import Dashboard from './components/Dashboard'
import CreateEvent from './components/CreateEvent'
import ViewEvent from './components/ViewEvent'
import EditEvent from './components/EditEvent'
import Explore from './components/Explore'
import PublicProfile from './components/PublicProfile'
import IconNav from './components/IconNav'
import Profile from './components/Profile'
import GlobalSearch from './components/GlobalSearch'
import TopNav from './components/TopNav'
import { ViewType, User } from './types'
import logoSrc from './assets/heds/hedswhite2.png'; // Update path to be relative

function App() {
    const [currentUser, setCurrentUser] = useState<string | null>(null)
    const [currentUserData, setCurrentUserData] = useState<User | null>(null)
    const [currentView, setCurrentView] = useState<ViewType>('explore')
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
    const [viewingUserId, setViewingUserId] = useState<string | null>(null)
    const [globalSearchTerm, setGlobalSearchTerm] = useState<string>('')

    useEffect(() => {
        if (currentUser) {
            const users = JSON.parse(localStorage.getItem('eventAppUsers') || '{}') as Record<string, User>
            const userData = users[currentUser]
            if (userData) {
                setCurrentUserData(userData)
            } else {
                console.error("Could not find user data for:", currentUser)
                setCurrentUserData(null)
            }
        } else {
            setCurrentUserData(null)
        }
    }, [currentUser])

    useEffect(() => {
        // Check for existing session
        const sessionUser = sessionStorage.getItem('eventAppSessionUser')
        if (sessionUser) {
            // Validate existing user data
            const users = JSON.parse(localStorage.getItem('eventAppUsers') || '{}') as Record<string, User>
            // Check if this is an old user without a password
            if (users[sessionUser] && !users[sessionUser].password) {
                // For existing users without passwords, set a temporary password they'll need to change later
                users[sessionUser].password = 'changeme'
                localStorage.setItem('eventAppUsers', JSON.stringify(users))
                console.log('Added temporary password for existing user:', sessionUser)
            }
            
            setCurrentUser(sessionUser)
            checkPhoneAndProceed(sessionUser)
        }
    }, [])

    const handleLogin = useCallback((username: string): void => {
        setCurrentUser(username)
        sessionStorage.setItem('eventAppSessionUser', username)
        checkPhoneAndProceed(username)
    }, [])

    const handleLogout = useCallback((): void => {
        setCurrentUser(null)
        sessionStorage.removeItem('eventAppSessionUser')
        setCurrentView('explore')
        setViewingUserId(null)
    }, [])

    const showLoginPage = useCallback((): void => {
        setCurrentView('auth')
        setViewingUserId(null)
    }, [])

    const handleNavigate = useCallback((view: ViewType): void => {
        setCurrentView(view)
        setSelectedEventId(null)
        setViewingUserId(null)
    }, [])

    const checkPhoneAndProceed = useCallback((username: string): void => {
        const users = JSON.parse(localStorage.getItem('eventAppUsers') || '{}') as Record<string, User>
        const user = users[username]
        if (user && !user.hasPhone) {
            setCurrentView('addPhone')
        } else {
            setCurrentView('dashboard')
        }
    }, [])

    const handlePhoneAdded = useCallback((): void => {
        setCurrentView('dashboard')
    }, [])

    const handleCreateEvent = useCallback((): void => {
        setCurrentView('createEvent')
    }, [])

    const handleEventCreated = useCallback((eventId: number): void => {
        setSelectedEventId(eventId)
        setCurrentView('viewEvent')
    }, [])

    const handleViewEvent = useCallback((eventId: number): void => {
        setSelectedEventId(eventId)
        setCurrentView('viewEvent')
        setViewingUserId(null)
    }, [])

    const handleBackToDashboard = useCallback((): void => {
        setCurrentView('dashboard')
        setSelectedEventId(null)
        setViewingUserId(null)
    }, [])

    const handleBackToExplore = useCallback((): void => {
        setCurrentView('explore')
        setSelectedEventId(null)
        setViewingUserId(null)
    }, [])

    const handleEditEvent = useCallback((eventId: number): void => {
        console.log('App: Handling edit event for ID:', eventId);
        setSelectedEventId(eventId)
        setCurrentView('editEvent')
        setViewingUserId(null)
    }, [])

    // Add log here to confirm function definition
    console.log('[App Component Body] Type of handleEditEvent:', typeof handleEditEvent);

    const handleEventUpdated = useCallback((): void => {
        console.log('App: Event updated, returning to dashboard');
        setCurrentView('dashboard')
        setSelectedEventId(null)
        setViewingUserId(null)
    }, [])

    const handleViewPublicProfile = useCallback((userId: string): void => {
        setViewingUserId(userId)
        setCurrentView('publicProfile')
        setSelectedEventId(null)
    }, [])

    const handleGlobalSearchChange = useCallback((term: string) => {
        setGlobalSearchTerm(term);
    }, []);

    return (
        <div className="app">
            {/* Top Nav: Render conditionally based on login status and view */}
            {currentView !== 'auth' && (
                 React.createElement(TopNav, { 
                    key: 'top-nav', 
                    logoSrc: logoSrc, 
                    searchTerm: globalSearchTerm, 
                    onSearchChange: handleGlobalSearchChange,
                    // Pass login handler only if user is NOT logged in
                    onLoginClick: !currentUser ? showLoginPage : undefined 
                })
            )}

            {/* Icon Nav: Render only if view is not auth/addPhone */}
            {currentView !== 'auth' && currentView !== 'addPhone' && (
                <IconNav 
                    currentView={currentView}
                    onNavigate={handleNavigate}
                    onLogout={handleLogout}
                    currentUser={currentUserData}
                />
            )}

            {/* Main content area needs padding-top to avoid overlap */}
            <main className="main-content">
                {currentView === 'explore' && (
                    <Explore 
                        onLogin={showLoginPage}
                        onViewEvent={handleViewEvent}
                        onViewProfile={handleViewPublicProfile}
                    />
                )}

                {currentView === 'auth' && (
                    <Auth onLogin={handleLogin} />
                )}

                {currentView === 'addPhone' && currentUser && (
                    <AddPhone
                        username={currentUser}
                        onPhoneAdded={handlePhoneAdded}
                        onLogout={handleLogout}
                    />
                )}

                {currentView === 'dashboard' && currentUser && (
                    <Dashboard
                        username={currentUser}
                        onCreateEvent={handleCreateEvent}
                        onViewEvent={handleViewEvent}
                        onEditEvent={handleEditEvent}
                        onNavigate={handleNavigate}
                        onLogout={handleLogout}
                        globalSearchTerm={globalSearchTerm}
                    />
                )}

                {currentView === 'createEvent' && currentUser && (
                    <CreateEvent
                        username={currentUser}
                        onEventCreated={handleEventCreated}
                        onBack={handleBackToDashboard}
                    />
                )}

                {currentView === 'editEvent' && selectedEventId && (
                    <EditEvent
                        eventId={selectedEventId}
                        onSave={handleEventUpdated}
                        onCancel={handleBackToDashboard}
                    />
                )}

                {currentView === 'viewEvent' && selectedEventId && (
                    <ViewEvent
                        eventId={selectedEventId}
                        onBack={currentUser ? handleBackToDashboard : handleBackToExplore}
                        currentUser={currentUser}
                    />
                )}

                {currentView === 'profile' && currentUser && (
                    <Profile
                        username={currentUser}
                        onBack={handleBackToDashboard}
                    />
                )}

                {currentView === 'publicProfile' && viewingUserId && (
                    <PublicProfile
                        userId={viewingUserId}
                        onViewEvent={handleViewEvent}
                        onBack={handleBackToExplore}
                    />
                )}
            </main>
        </div>
    )
}

export default App 