import React from 'react';
import './Input.css';

export const Input = ({ label, icon, error, className = '', ...props }) => {
    return (
        <div className={`input-wrapper ${className}`}>
            {label && <label className="input-label">{label}</label>}
            <div className="input-container">
                {icon && <span className="input-icon">{icon}</span>}
                <input
                    className={`input-field ${icon ? 'has-icon' : ''} ${error ? 'has-error' : ''}`}
                    {...props}
                />
            </div>
            {error && <span className="input-error">{error}</span>}
        </div>
    );
};
