import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import BackgroundCanvas from './BackgroundCanvas';
import { User } from '../types';

interface ProfileProps {
    username: string;
    onBack: () => void;
}

interface ProfileData {
    displayName: string;
    bio: string;
    profileImageUrl: string | null;
}

const Profile: React.FC<ProfileProps> = ({ username, onBack }) => {
    const [profileData, setProfileData] = useState<ProfileData>({
        displayName: '',
        bio: '',
        profileImageUrl: null
    });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Load existing profile data
        const users = JSON.parse(localStorage.getItem('eventAppUsers') || '{}') as Record<string, User>;
        const userData = users[username] || {};
        setProfileData({
            displayName: userData.displayName || username,
            bio: userData.bio || '',
            profileImageUrl: userData.profileImageUrl || null
        });
    }, [username]);

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        setError('');
        
        if (!file) return;

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setError('Please select a PNG or JPG image.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError('Image size must be less than 2MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === 'string') {
                setProfileData(prev => ({
                    ...prev,
                    profileImageUrl: result
                }));
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const users = JSON.parse(localStorage.getItem('eventAppUsers') || '{}') as Record<string, User>;
            
            // Ensure the user object exists
            if (!users[username]) {
                 users[username] = {} as User; // Create if doesn't exist, ensure type conformance
            }
            
            // Merge existing data with new profile data
            users[username] = {
                ...users[username],
                displayName: profileData.displayName,
                bio: profileData.bio, // Now correctly typed
                profileImageUrl: profileData.profileImageUrl ?? undefined // Convert null to undefined
            };
            
            localStorage.setItem('eventAppUsers', JSON.stringify(users));
            setSuccess('Profile updated successfully!');
            
            // Optionally: Refresh the profile data state to ensure UI consistency
            // setProfileData({ ...profileData }); // Or re-fetch from localStorage if needed

        } catch (err) {
            console.error("Error updating profile:", err);
            setError('Failed to update profile. Please try again.');
        }
    };

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof Omit<ProfileData, 'profileImageUrl'>
    ): void => {
        setProfileData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    return (
        <>
            <BackgroundCanvas pattern="particles" />
            <section className="container">
                <h1>Edit Profile</h1>
                <div className="profile-header">
                    <div className="profile-picture-container">
                        {profileData.profileImageUrl ? (
                            <img 
                                src={profileData.profileImageUrl}
                                alt="Profile" 
                                className="profile-picture"
                            />
                        ) : (
                            <div className="profile-picture-placeholder">
                                {profileData.displayName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="change-picture-button"
                        >
                            Change Picture
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/png,image/jpeg"
                            className="hidden"
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="displayName">Display Name</label>
                        <input
                            type="text"
                            id="displayName"
                            value={profileData.displayName}
                            onChange={(e) => handleInputChange(e, 'displayName')}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                            id="bio"
                            value={profileData.bio}
                            onChange={(e) => handleInputChange(e, 'bio')}
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button type="submit">Save Profile</button>
                </form>
                <button onClick={onBack} className="secondary">
                    Back to Dashboard
                </button>
            </section>
        </>
    );
};

export default Profile; 