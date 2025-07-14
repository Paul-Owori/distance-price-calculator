'use client';

import React from 'react';
import { DeliveryResponse } from '@/types';

interface DeliveryResultsProps {
    data: DeliveryResponse['data'];
    onReset: () => void;
}

const DeliveryResults: React.FC<DeliveryResultsProps> = ({ data, onReset }) => {
    if (!data) return null;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#363636]">Delivery Route Calculated</h2>
                <button
                    onClick={onReset}
                    className="px-4 py-2 text-[#f51122] border border-[#f51122] rounded-lg hover:bg-[#f51122] hover:text-white transition-colors"
                >
                    New Route
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-[#363636] mb-2">Warehouse</h3>
                        <p className="text-gray-700">{data.warehouseLocationName}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-[#363636] mb-2">Delivery Location</h3>
                        <p className="text-gray-700">{data.deliveryLocationName}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-[#363636] mb-2">Distance</h3>
                        <p className="text-gray-700">{data.distance}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-[#363636] mb-2">Estimated Time</h3>
                        <p className="text-gray-700">{data.timeToDestination}</p>
                    </div>
                </div>
            </div>

            <div className={data.price === 0 ? "bg-[#22c55e] text-white p-6 rounded-lg text-center" : "bg-[#f51122] text-white p-6 rounded-lg text-center"}>
                <h3 className="text-xl font-bold mb-2">Delivery Cost</h3>
                {data.price === 0 ? (
                    <p className="text-3xl font-bold">FREE</p>
                ) : (
                    <p className="text-3xl font-bold">UGX {data.price.toLocaleString()}</p>
                )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-[#363636] mb-2">Route Information</h3>
                <p className="text-gray-700">
                    The optimal delivery route from the warehouse to the destination has been successfully calculated and is displayed on the map.
                </p>
            </div>
            {parseFloat(data.distance) > 15 && (
                <div className="mt-6 p-4 rounded-lg bg-yellow-100 text-yellow-800 text-center font-semibold">
                    This is further than 15 km, please use an alternative courier
                </div>
            )}
        </div>
    );
};

export default DeliveryResults; 