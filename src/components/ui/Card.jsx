import React from 'react';
import './Card.css';

export const Card = ({ children, className = '', variant = 'default', interactive = false, ...props }) => {
    return (
        <div
            className={`card card-${variant} ${interactive ? 'card-interactive' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
