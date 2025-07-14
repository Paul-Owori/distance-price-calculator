# E-Store Delivery POC

A Next.js application for calculating delivery routes from warehouse to destination locations using Google Maps integration.

## Features

- **Google Maps Integration**: Interactive map with markers and route visualization
- **Location Autocomplete**: Search for warehouse and delivery locations using Google Places API
- **Route Calculation**: Calculate optimal delivery routes with pricing
- **Responsive Design**: Modern UI with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Google Maps API with @react-google-maps/api
- **Places**: Google Places API for location autocomplete

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── calculate-delivery/
│   │       └── route.ts          # Mock API endpoint
│   ├── layout.tsx                # Root layout with MapProvider
│   ├── page.tsx                  # Main application page
│   └── globals.css               # Global styles
├── components/
│   ├── GoogleMap.tsx             # Google Maps component
│   ├── LocationAutocomplete.tsx  # Location search component
│   ├── DeliveryForm.tsx          # Delivery form
│   ├── DeliveryResults.tsx       # Results display
│   └── MapProvider.tsx           # Google Maps API provider
└── types/
    └── index.ts                  # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Maps API key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd e-store_delivery_poc
```

2. Install dependencies:

```bash
npm install
```

3. Set up Google Maps API:

   - Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the following APIs:
     - Maps JavaScript API
     - Places API
     - Directions API (for future route optimization)
   - The API key is currently hardcoded in `src/components/MapProvider.tsx` (replace with your own)

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Search for Warehouse Location**: Use the autocomplete field to search for and select a warehouse location
2. **Search for Delivery Location**: Use the autocomplete field to search for and select a delivery destination
3. **Calculate Route**: Click "Calculate Delivery Route" to get route information
4. **View Results**: See the calculated route on the map and pricing information
5. **Reset**: Click "New Route" to start over

## API Endpoints

### POST /api/calculate-delivery

Calculates delivery route and pricing.

**Request Body:**

```typescript
{
  warehouse: {
    lat: number;
    lng: number;
    name: string;
  }
  delivery: {
    lat: number;
    lng: number;
    name: string;
  }
}
```

**Response:**

```typescript
{
  success: boolean;
  data?: {
    price: number;
    directions: {
      latitude: number;
      longitude: number;
    }[];
    deliveryLocationName: string;
    warehouseLocationName: string;
    timeToDestination: string;
    distance: string;
  };
}
```

## Customization

### Colors

The application uses a custom color scheme defined in `tailwind.config.ts`:

- **Action Color**: `#f51122` (bright red for buttons and highlights)
- **Filler Color**: `#363636` (dark gray for text and backgrounds)
- **White Space**: White for clean backgrounds

### Google Maps Configuration

The Google Maps integration is configured in `src/components/MapProvider.tsx`. You can customize:

- API key
- Map options
- Default center location
- Zoom levels

## Future Enhancements

- [ ] Real route calculation using Google Directions API
- [ ] Multiple delivery stops
- [ ] Real-time traffic integration
- [ ] Delivery time windows
- [ ] Driver assignment
- [ ] Payment integration
- [ ] Order tracking
- [ ] Push notifications

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

## License

This project is for demonstration purposes only.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
