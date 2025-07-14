import { NextRequest, NextResponse } from 'next/server';
import { DeliveryResponse } from '@/types';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { warehouse, delivery, feePerKm } = body;

    if (!warehouse || !delivery || !feePerKm) {
      return NextResponse.json(
        { success: false, message: 'Warehouse, delivery locations, and feePerKm are required' },
        { status: 400 }
      );
    }

    // Call Google Directions API
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${warehouse.lat},${warehouse.lng}&destination=${delivery.lat},${delivery.lng}&key=${GOOGLE_MAPS_API_KEY}`;
    const directionsRes = await fetch(directionsUrl);
    const directionsData = await directionsRes.json();

    if (directionsData.status !== 'OK') {
      return NextResponse.json(
        { success: false, message: 'Failed to get directions from Google', details: directionsData },
        { status: 500 }
      );
    }

    const route = directionsData.routes[0];
    const leg = route.legs[0];
    const distanceKm = leg.distance.value / 1000;
    let price = Math.round(distanceKm * feePerKm);
    if (distanceKm < 5) price = 0;
    const directions = route.overview_polyline ? decodePolyline(route.overview_polyline.points) : [];

    const response: DeliveryResponse = {
      success: true,
      data: {
        price,
        directions,
        deliveryLocationName: delivery.name,
        warehouseLocationName: warehouse.name,
        timeToDestination: leg.duration.text,
        distance: leg.distance.text,
        feePerKm,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error calculating delivery:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Polyline decoding function
function decodePolyline(encoded: string) {
  const points = [];
  let index = 0;
  const len = encoded.length
  let lat = 0, lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }
  return points;
} 