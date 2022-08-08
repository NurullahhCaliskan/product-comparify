import React from 'react';
import serviceImage from '../../assets/maintenance.png';

export function ServiceUnavailable() {
    return (
        <img
            alt=""
            width="100%"
            height="100%"
            style={{
                objectFit: 'cover',
                objectPosition: 'center',
            }}
            src={serviceImage}
        />
    );
}
