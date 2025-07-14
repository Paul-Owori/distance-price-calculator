'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
    GoogleMap,
    Marker,
    Polyline,
    InfoWindow,
} from '@react-google-maps/api';
import { MapCenterType, DirectionPoint } from '@/types';

const defaultContainerStyle = {
    width: '100%',
    height: '600px',
};

const defaultCenter: MapCenterType = {
    lat: 0.3476,
    lng: 32.5825,
};

interface GoogleMapComponentProps {
    center?: MapCenterType;
    warehouseLocation?: MapCenterType & { name: string };
    deliveryLocation?: MapCenterType & { name: string };
    directions?: DirectionPoint[];
    onMapClick?: (location: MapCenterType) => void;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
    center,
    warehouseLocation,
    deliveryLocation,
    directions,
    onMapClick,
}) => {
    const mapRef = useRef<google.maps.Map | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

    const isGoogleMapsLoaded =
        typeof window !== 'undefined' && window.google && window.google.maps;

    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    const getMapCenter = (): MapCenterType => {
        if (center) return center;
        if (warehouseLocation) return warehouseLocation;
        if (deliveryLocation) return deliveryLocation;
        return defaultCenter;
    };

    if (!isGoogleMapsLoaded) {
        return (
            <div
                style={{
                    ...defaultContainerStyle,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                        Loading map...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={defaultContainerStyle}
            center={getMapCenter()}
            zoom={12}
            onLoad={onMapLoad}
            onClick={(e) => {
                const clickValues = e.latLng?.toJSON();
                if (clickValues && onMapClick) {
                    onMapClick({
                        lat: parseFloat(clickValues.lat.toFixed(6)),
                        lng: parseFloat(clickValues.lng.toFixed(6)),
                    });
                }
            }}
        >
            {warehouseLocation && (
                <React.Fragment key="warehouse">
                    <Marker
                        position={{ lat: warehouseLocation.lat, lng: warehouseLocation.lng }}
                        icon={{
                            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                            scaledSize: new window.google.maps.Size(32, 32),
                            anchor: new window.google.maps.Point(16, 16),
                        }}
                        onMouseOver={() => setSelectedMarker('warehouse')}
                        onMouseOut={() => setSelectedMarker(null)}
                    />
                    {selectedMarker === 'warehouse' && (
                        <InfoWindow position={{ lat: warehouseLocation.lat, lng: warehouseLocation.lng }}>
                            <div className="p-2 text-sm">
                                <strong>Warehouse: {warehouseLocation.name}</strong>
                            </div>
                        </InfoWindow>
                    )}
                </React.Fragment>
            )}

            {deliveryLocation && (
                <React.Fragment key="delivery">
                    <Marker
                        position={{ lat: deliveryLocation.lat, lng: deliveryLocation.lng }}
                        icon={{
                            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                            scaledSize: new window.google.maps.Size(32, 32),
                            anchor: new window.google.maps.Point(16, 16),
                        }}
                        onMouseOver={() => setSelectedMarker('delivery')}
                        onMouseOut={() => setSelectedMarker(null)}
                    />
                    {selectedMarker === 'delivery' && (
                        <InfoWindow position={{ lat: deliveryLocation.lat, lng: deliveryLocation.lng }}>
                            <div className="p-2 text-sm">
                                <strong>Delivery: {deliveryLocation.name}</strong>
                            </div>
                        </InfoWindow>
                    )}
                </React.Fragment>
            )}

            {directions && directions.length > 0 && (
                <Polyline
                    path={directions.map(wp => ({ lat: wp.latitude, lng: wp.longitude }))}
                    options={{
                        strokeColor: '#f51122',
                        strokeOpacity: 0.8,
                        strokeWeight: 4,
                    }}
                />
            )}
        </GoogleMap>
    );
};

export default GoogleMapComponent; 