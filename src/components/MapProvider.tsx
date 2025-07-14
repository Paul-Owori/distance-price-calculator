'use client';

import React, { ReactNode } from 'react';
import { LoadScript } from '@react-google-maps/api';

interface MapProviderProps {
    children: ReactNode;
}

export default function MapProvider({ children }: MapProviderProps) {
    return (
        <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            libraries={['places']}
        >
            {children}
        </LoadScript>
    );
} 