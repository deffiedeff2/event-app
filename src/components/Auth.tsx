import React, { useState } from 'react';
import BackgroundCanvas from './BackgroundCanvas';
import { User } from '../types';

interface AuthProps {
    onLogin: (username: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [isResetMode, setIsResetMode] = useState<boolean>(false);
    const [resetUsername, setResetUsername] = useState<string>('');
    const [resetPassword, setResetPassword] = useState<string>('');
    const [confirmResetPassword, setConfirmResetPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (!username.trim()) {
            setError('Username is required');
            return;
        }
        if (!password) {
            setError('Password is required');
            return;
        }
        setError(''); // Clear previous errors

        // Check if username exists in localStorage
        const users = JSON.parse(localStorage.getItem('eventAppUsers') || '{}') as Record<string, User>;
        
        if (isLogin) {
            // Login path
            if (!users[username]) {
                setError('Username not found. Please sign up instead.');
                return;
            }

            // Verify password
            if (users[username].password !== password) {
                setError('Incorrect password');
                return;
            }

            console.log('User authenticated, logging in:', username);
            onLogin(username);
        } else {
            // Sign up path
            if (users[username]) {
                setError('Username already exists. Please log in instead.');
                return;
            }

            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            if (password.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }

            console.log('Creating new account:', username);
            users[username] = {
                hasPhone: false,
                phoneNumber: '',
                displayName: username,
                password: password
            };
            localStorage.setItem('eventAppUsers', JSON.stringify(users));
            onLogin(username);
        }
    };

    const handleResetPassword = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (!resetUsername.trim()) {
            setError('Username is required');
            return;
        }
        
        if (!resetPassword) {
            setError('New password is required');
            return;
        }
        
        if (resetPassword !== confirmResetPassword) {
            setError('Passwords do not match');
            return;
        }
        
        if (resetPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        
        // Check if username exists in localStorage
        const users = JSON.parse(localStorage.getItem('eventAppUsers') || '{}') as Record<string, User>;
        
        if (!users[resetUsername]) {
            setError('Username not found');
            return;
        }
        
        // Update the password
        users[resetUsername].password = resetPassword;
        localStorage.setItem('eventAppUsers', JSON.stringify(users));
        
        setSuccess('Password reset successful! You can now login with your new password.');
        
        // Clear the form
        setResetUsername('');
        setResetPassword('');
        setConfirmResetPassword('');
        
        // After 3 seconds, go back to login
        setTimeout(() => {
            setIsResetMode(false);
            setSuccess('');
        }, 3000);
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setError('');
    };
    
    const toggleResetMode = () => {
        setIsResetMode(!isResetMode);
        setError('');
        setSuccess('');
    };

    if (isResetMode) {
        return React.createElement(React.Fragment, null, [
            React.createElement(BackgroundCanvas, { 
                key: 'canvas',
                pattern: 'particles' 
            }),
            React.createElement('section', { 
                key: 'content',
                className: 'container' 
            }, [
                React.createElement('h1', { key: 'title' }, 'Reset password'),
                
                success && React.createElement('div', { 
                    key: 'success',
                    className: 'success-message',
                    style: { 
                        marginBottom: 'var(--chakra-space-4)',
                        color: '#00cc00',
                        textAlign: 'center',
                        padding: 'var(--chakra-space-2)',
                        backgroundColor: 'rgba(0, 204, 0, 0.1)',
                        borderRadius: 'var(--chakra-radii-md)',
                        fontWeight: 'bold'
                    }
                }, success),
                
                React.createElement('form', { 
                    key: 'form',
                    onSubmit: handleResetPassword 
                }, [
                    // Username field
                    React.createElement('div', { 
                        key: 'username-group',
                        className: 'form-group'
                    }, [
                        React.createElement('label', {
                            key: 'username-label',
                            htmlFor: 'reset-username'
                        }, 'Username'),
                        React.createElement('input', {
                            key: 'username-input',
                            type: 'text',
                            id: 'reset-username',
                            value: resetUsername,
                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setResetUsername(e.target.value),
                            placeholder: 'Enter your username',
                            required: true
                        })
                    ]),
                    
                    // New Password field
                    React.createElement('div', { 
                        key: 'new-password-group',
                        className: 'form-group'
                    }, [
                        React.createElement('label', {
                            key: 'new-password-label',
                            htmlFor: 'reset-password'
                        }, 'New password'),
                        React.createElement('input', {
                            key: 'new-password-input',
                            type: 'password',
                            id: 'reset-password',
                            value: resetPassword,
                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setResetPassword(e.target.value),
                            placeholder: 'Enter new password',
                            required: true
                        })
                    ]),
                    
                    // Confirm New Password field
                    React.createElement('div', { 
                        key: 'confirm-new-password-group',
                        className: 'form-group'
                    }, [
                        React.createElement('label', {
                            key: 'confirm-new-password-label',
                            htmlFor: 'confirm-reset-password'
                        }, 'Confirm new password'),
                        React.createElement('input', {
                            key: 'confirm-new-password-input',
                            type: 'password',
                            id: 'confirm-reset-password',
                            value: confirmResetPassword,
                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setConfirmResetPassword(e.target.value),
                            placeholder: 'Confirm new password',
                            required: true
                        })
                    ]),
                    
                    // Error message
                    error && React.createElement('div', { 
                        key: 'error',
                        className: 'error-message' 
                    }, error),
                    
                    // Submit button
                    React.createElement('button', { 
                        key: 'submit',
                        type: 'submit'
                    }, 'Reset password'),
                    
                    // Back to login link
                    React.createElement('p', {
                        key: 'back-to-login',
                        className: 'auth-toggle'
                    }, [
                        'Remember your password? ',
                        React.createElement('button', {
                            key: 'back-button',
                            type: 'button',
                            onClick: toggleResetMode,
                            className: 'link-button',
                            style: { marginTop: 0 }
                        }, 'Back to login')
                    ])
                ])
            ])
        ]);
    }

    return React.createElement(React.Fragment, null, [
        React.createElement(BackgroundCanvas, { 
            key: 'canvas',
            pattern: 'particles' 
        }),
        React.createElement('section', { 
            key: 'content',
            className: 'container' 
        }, [
            React.createElement('h1', { key: 'title' }, isLogin ? 'Login' : 'Sign up'),
            React.createElement('form', { 
                key: 'form',
                onSubmit: handleSubmit 
            }, [
                // Username field
                React.createElement('div', { 
                    key: 'username-group',
                    className: 'form-group'
                }, [
                    React.createElement('label', {
                        key: 'username-label',
                        htmlFor: 'username'
                    }, 'Username'),
                    React.createElement('input', {
                        key: 'username-input',
                        type: 'text',
                        id: 'username',
                        value: username,
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value),
                        placeholder: 'Enter your username',
                        required: true
                    })
                ]),
                
                // Password field
                React.createElement('div', { 
                    key: 'password-group',
                    className: 'form-group'
                }, [
                    React.createElement('label', {
                        key: 'password-label',
                        htmlFor: 'password'
                    }, 'Password'),
                    React.createElement('input', {
                        key: 'password-input',
                        type: 'password',
                        id: 'password',
                        value: password,
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
                        placeholder: 'Enter your password',
                        required: true
                    })
                ]),
                
                // Confirm Password field (only for signup)
                !isLogin && React.createElement('div', { 
                    key: 'confirm-password-group',
                    className: 'form-group'
                }, [
                    React.createElement('label', {
                        key: 'confirm-password-label',
                        htmlFor: 'confirm-password'
                    }, 'Confirm password'),
                    React.createElement('input', {
                        key: 'confirm-password-input',
                        type: 'password',
                        id: 'confirm-password',
                        value: confirmPassword,
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value),
                        placeholder: 'Confirm your password',
                        required: !isLogin
                    })
                ]),
                
                // Error message
                error && React.createElement('div', { 
                    key: 'error',
                    className: 'error-message' 
                }, error),
                
                // Submit button
                React.createElement('button', { 
                    key: 'submit',
                    type: 'submit'
                }, isLogin ? 'Login' : 'Create account'),
                
                // Forgot password link (only for login)
                isLogin && React.createElement('p', {
                    key: 'forgot-password',
                    className: 'auth-toggle',
                    style: { marginTop: 'var(--chakra-space-2)' }
                }, [
                    'Forgot your password? ',
                    React.createElement('button', {
                        key: 'reset-button',
                        type: 'button',
                        onClick: toggleResetMode,
                        className: 'link-button',
                        style: { marginTop: 0 }
                    }, 'Reset password')
                ]),
                
                // Toggle login/signup
                React.createElement('p', {
                    key: 'toggle-text',
                    className: 'auth-toggle'
                }, [
                    isLogin ? 'Don\'t have an account? ' : 'Already have an account? ',
                    React.createElement('button', {
                        key: 'toggle-button',
                        type: 'button',
                        onClick: toggleAuthMode,
                        className: 'link-button',
                        style: { marginTop: 0 }
                    }, isLogin ? 'Sign up' : 'Login')
                ])
            ])
        ])
    ]);
};

export default Auth; 