'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Location } from '@/types';

interface LocationAutocompleteProps {
    placeholder: string;
    onLocationSelect: (location: Location) => void;
    className?: string;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
    placeholder,
    onLocationSelect,
    className = '',
}) => {
    const [inputValue, setInputValue] = useState('');
    const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
    const [showPredictions, setShowPredictions] = useState(false);
    const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
    const placesService = useRef<google.maps.places.PlacesService | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.google && window.google.maps) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();

            if (inputRef.current) {
                placesService.current = new window.google.maps.places.PlacesService(inputRef.current);
            }
        }
    }, []);

    const handleInputChange = (value: string) => {
        setInputValue(value);

        if (!value.trim() || !autocompleteService.current) {
            setPredictions([]);
            setShowPredictions(false);
            return;
        }

        autocompleteService.current.getPlacePredictions(
            {
                input: value,
                componentRestrictions: { country: 'ug' }, // Restrict to Uganda
                types: ['establishment', 'geocode'],
            },
            (predictions, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                    setPredictions(predictions);
                    setShowPredictions(true);
                } else {
                    setPredictions([]);
                    setShowPredictions(false);
                }
            }
        );
    };

    const handlePredictionSelect = (prediction: google.maps.places.AutocompletePrediction) => {
        if (!placesService.current) return;

        placesService.current.getDetails(
            {
                placeId: prediction.place_id,
                fields: ['name', 'geometry', 'formatted_address'],
            },
            (place, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && place && place.geometry?.location) {
                    const location: Location = {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                        name: place.name || prediction.description,
                    };

                    setInputValue(place.name || prediction.description);
                    setShowPredictions(false);
                    onLocationSelect(location);
                }
            }
        );
    };

    return (
        <div className={`relative ${className}`}>
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f51122] focus:border-transparent placeholder:text-gray-700 text-black"
                onFocus={() => setShowPredictions(predictions.length > 0)}
                onBlur={() => setTimeout(() => setShowPredictions(false), 200)}
            />

            {showPredictions && predictions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {predictions.map((prediction) => (
                        <div
                            key={prediction.place_id}
                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => handlePredictionSelect(prediction)}
                        >
                            <div className="font-medium text-gray-900">{prediction.structured_formatting?.main_text}</div>
                            <div className="text-sm text-gray-500">{prediction.structured_formatting?.secondary_text}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LocationAutocomplete; 