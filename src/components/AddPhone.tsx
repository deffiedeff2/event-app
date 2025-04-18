import React, { useState } from 'react';
import { User } from '../types';

interface AddPhoneProps {
    username: string;
    onPhoneAdded: () => void;
    onLogout: () => void;
}

const AddPhone: React.FC<AddPhoneProps> = ({ username, onPhoneAdded, onLogout }) => {
    const [phone, setPhone] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setError('');

        if (!phone) {
            setError('Phone number is required.');
            return;
        }

        // Basic phone number validation
        if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(phone)) {
            setError('Please enter a valid phone number format.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('eventAppUsers') || '{}') as Record<string, User>;
        if (users[username]) {
            users[username].hasPhone = true;
            users[username].phoneNumber = phone; // Store the actual number
            localStorage.setItem('eventAppUsers', JSON.stringify(users));
            onPhoneAdded();
        } else {
            setError('Error: Not logged in.');
            onLogout();
        }
    };

    return React.createElement('section', { className: 'container' }, [
        React.createElement('h1', { key: 'title' }, 'Add Phone Number'),
        React.createElement('p', {
            key: 'description',
            style: {
                textAlign: 'center',
                marginBottom: 'var(--chakra-space-4)'
            }
        }, 'Please add a phone number to create events.'),
        React.createElement('form', {
            key: 'form',
            onSubmit: handleSubmit
        }, [
            React.createElement('div', {
                key: 'phone-group',
                className: 'form-group'
            }, [
                React.createElement('label', {
                    key: 'phone-label',
                    htmlFor: 'phone-number'
                }, 'Phone Number'),
                React.createElement('input', {
                    key: 'phone-input',
                    type: 'tel',
                    id: 'phone-number',
                    value: phone,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value),
                    placeholder: 'e.g., 123-456-7890',
                    required: true
                })
            ]),
            error && React.createElement('div', {
                key: 'error',
                className: 'error-message'
            }, error),
            React.createElement('button', {
                key: 'submit',
                type: 'submit'
            }, 'Save Phone Number')
        ]),
        React.createElement('button', {
            key: 'logout',
            onClick: onLogout,
            className: 'secondary'
        }, 'Logout')
    ]);
};

export default AddPhone; 