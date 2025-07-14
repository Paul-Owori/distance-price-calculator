export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface DeliveryRequest {
  warehouse: Location;
  delivery: Location;
  feePerKm: number;
}

export interface DirectionPoint {
  latitude: number;
  longitude: number;
}

export interface DeliveryResponse {
  success: boolean;
  data?: {
    price: number;
    directions: DirectionPoint[];
    deliveryLocationName: string;
    warehouseLocationName: string;
    timeToDestination: string;
    distance: string;
    feePerKm: number;
  };
}

export interface MapCenterType {
  lat: number;
  lng: number;
} 