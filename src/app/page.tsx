'use client';

import React, { useState } from 'react';
import GoogleMapComponent from '@/components/GoogleMap';
import DeliveryForm from '@/components/DeliveryForm';
import DeliveryResults from '@/components/DeliveryResults';
import { DeliveryRequest, DeliveryResponse, Location } from '@/types';

export default function Home() {
  const [warehouseLocation, setWarehouseLocation] = useState<Location | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<Location | null>(null);
  const [deliveryResponse, setDeliveryResponse] = useState<DeliveryResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  const handleFormSubmit = async (data: DeliveryRequest & { feePerKm: number }) => {
    setIsLoading(true);
    setWarehouseLocation(data.warehouse);
    setDeliveryLocation(data.delivery);

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/calculate-delivery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: DeliveryResponse = await response.json();

      if (result.success && result.data) {
        setDeliveryResponse(result.data);
        setShowResults(true);
      } else {
        // For demo purposes, create mock response
        const mockResponse: DeliveryResponse['data'] = {
          price: (result.data?.distance ? parseFloat(result.data.distance) : 10) * data.feePerKm,
          directions: [
            { latitude: data.warehouse.lat, longitude: data.warehouse.lng },
            { latitude: data.delivery.lat, longitude: data.delivery.lng },
          ],
          deliveryLocationName: data.delivery.name,
          warehouseLocationName: data.warehouse.name,
          timeToDestination: `${Math.floor(Math.random() * 60) + 15} minutes`,
          distance: `${(Math.random() * 20 + 5).toFixed(1)} km`,
          feePerKm: data.feePerKm,
        };
        setDeliveryResponse(mockResponse);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error calculating delivery:', error);
      // Fallback to mock response for demo
      const mockResponse: DeliveryResponse['data'] = {
        price: 10 * data.feePerKm,
        directions: [
          { latitude: data.warehouse.lat, longitude: data.warehouse.lng },
          { latitude: data.delivery.lat, longitude: data.delivery.lng },
        ],
        deliveryLocationName: data.delivery.name,
        warehouseLocationName: data.warehouse.name,
        timeToDestination: `${Math.floor(Math.random() * 60) + 15} minutes`,
        distance: `10 km`,
        feePerKm: data.feePerKm,
      };
      setDeliveryResponse(mockResponse);
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setWarehouseLocation(null);
    setDeliveryLocation(null);
    setDeliveryResponse(null);
    setShowResults(false);
    setMapKey(prev => prev + 1); // force map re-render
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#363636] mb-2">
            E-Store Delivery Route Calculator
          </h1>
          <p className="text-gray-600">
            Calculate optimal delivery routes from warehouse to destination
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-[#363636] mb-4">Route Map</h2>
            <GoogleMapComponent
              key={mapKey}
              warehouseLocation={warehouseLocation || undefined}
              deliveryLocation={deliveryLocation || undefined}
              directions={deliveryResponse?.directions}
            />
          </div>

          {/* Form/Results Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {!showResults ? (
              <>
                <h2 className="text-xl font-semibold text-[#363636] mb-4">Delivery Details</h2>
                <DeliveryForm onSubmit={handleFormSubmit} isLoading={isLoading} />
              </>
            ) : (
              <DeliveryResults data={deliveryResponse!} onReset={handleReset} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
