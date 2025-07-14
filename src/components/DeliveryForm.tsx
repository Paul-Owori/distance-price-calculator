'use client';

import React, { useState } from 'react';
import LocationAutocomplete from './LocationAutocomplete';
import { Location, DeliveryRequest } from '@/types';

interface DeliveryFormProps {
    onSubmit: (data: DeliveryRequest & { feePerKm: number }) => void;
    isLoading?: boolean;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({ onSubmit, isLoading = false }) => {
    const [warehouseLocation, setWarehouseLocation] = useState<Location | null>(null);
    const [deliveryLocation, setDeliveryLocation] = useState<Location | null>(null);
    const [feePerKm, setFeePerKm] = useState<number>(2000);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (warehouseLocation && deliveryLocation && feePerKm > 0) {
            onSubmit({
                warehouse: warehouseLocation,
                delivery: deliveryLocation,
                feePerKm,
            });
        }
    };

    const isFormValid = warehouseLocation && deliveryLocation && feePerKm > 0;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700 mb-2">
                    Warehouse Location
                </label>
                <LocationAutocomplete
                    placeholder="Search for warehouse location..."
                    onLocationSelect={setWarehouseLocation}
                    className="mb-2"
                />
                {warehouseLocation && (
                    <div className="text-sm text-green-600">
                        Selected: {warehouseLocation.name}
                    </div>
                )}
            </div>

            <div>
                <label htmlFor="delivery" className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Location
                </label>
                <LocationAutocomplete
                    placeholder="Search for delivery location..."
                    onLocationSelect={setDeliveryLocation}
                    className="mb-2"
                />
                {deliveryLocation && (
                    <div className="text-sm text-green-600">
                        Selected: {deliveryLocation.name}
                    </div>
                )}
            </div>

            <div>
                <label htmlFor="feePerKm" className="block text-sm font-medium text-[#363636] mb-2">
                    Fee per km (UGX)
                </label>
                <input
                    id="feePerKm"
                    type="number"
                    min={1}
                    value={feePerKm}
                    onChange={e => setFeePerKm(Number(e.target.value))}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f51122] focus:border-transparent placeholder:text-gray-700 text-black"
                    placeholder="Enter fee per km"
                />
            </div>

            <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${isFormValid && !isLoading
                    ? 'bg-[#f51122] hover:bg-red-700 cursor-pointer'
                    : 'bg-gray-400 cursor-not-allowed'
                    }`}
            >
                {isLoading ? 'Calculating Route...' : 'Calculate Delivery Route'}
            </button>
        </form>
    );
};

export default DeliveryForm; 