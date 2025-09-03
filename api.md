# Waystones Network API Documentation

This document describes the API endpoints available in the Waystones Network Flask application.

## Base URL
```
http://localhost:5000
```

## Endpoints

### 1. GET `/api/waystones`
Retrieves waystone data formatted for Sigma.js network visualization.

**Response Format:**
```json
{
  "waystones": {
    "nodes": [
      {
        "id": "public_waystone_ad2c8c14-3f3f-43c1-b0ed-3efd8ce9b792",
        "label": "The Den",
        "x": -75.82,
        "y": -83.82,
        "size": 15,
        "color": "#e74c3c",
        "info": {
          "key": "public_waystone_ad2c8c14-3f3f-43c1-b0ed-3efd8ce9b792",
          "coordinates": "X: -7582, Z: -8382",
          "image": "smptransport_waystone_markers",
          "tooltip": "The Den",
          "popup": "The Den"
        }
      }
    ],
    "edges": [
      {
        "id": "e1",
        "source": "waystone_1",
        "target": "waystone_2",
        "color": "#95a5a6",
        "size": 1
      }
    ],
    "metadata": {
      "total_waystones": 4,
      "data_source": "waystones_api",
      "coordinate_scale": 100,
      "max_connection_distance": 5000
    }
  },
  "success": true,
  "timestamp": "2025-09-03T14:30:00"
}
```

**Parameters:**
- None

**Usage:**
- Used by the map view to render interactive network visualization
- Coordinates are scaled down by factor of 100 for better visualization
- Connections between nearby waystones are automatically generated

### 2. GET `/api/directory`
Retrieves waystone data formatted for directory listing.

**Response Format:**
```json
{
  "waystones": [
    {
      "id": "public_waystone_ad2c8c14-3f3f-43c1-b0ed-3efd8ce9b792",
      "name": "The Den",
      "key": "public_waystone_ad2c8c14-3f3f-43c1-b0ed-3efd8ce9b792",
      "coordinates": {
        "x": -7582,
        "z": -8382
      },
      "image": "smptransport_waystone_markers",
      "tooltip": "The Den",
      "popup": "The Den",
      "type": "waystone"
    }
  ],
  "success": true,
  "total_count": 4,
  "timestamp": "2025-09-03T14:30:00"
}
```

**Parameters:**
- None

**Usage:**
- Used by the directory view to populate searchable table
- Provides detailed waystone information for modal displays

### 3. GET `/static/images/<filename>`
Serves waystone marker images.

**Parameters:**
- `filename`: Name of the image file (e.g., "smptransport_waystone_markers.png")

**Usage:**
- Displays waystone icons in the directory and detail views
- Images should be placed in the project root directory

## Configuration

### Setting Your API Endpoint
To connect to your actual waystones API, update the `WAYSTONES_API_URL` variable in `main.py`:

```python
WAYSTONES_API_URL = "https://your-api-endpoint.com/waystones"
```

### Expected Input Format
The application expects your API to return JSON data in this format:

```json
[
  {
    "type": "icon",
    "data": {
      "key": "public_waystone_ad2c8c14-3f3f-43c1-b0ed-3efd8ce9b792",
      "point": {
        "x": -7582,
        "z": -8382
      },
      "image": "smptransport_waystone_markers"
    },
    "options": {
      "tooltip": {
        "content": "The Den"
      },
      "popup": {
        "content": "The Den"
      }
    }
  }
]
```

## Data Transformation

The application automatically transforms your waystone data:

1. **Coordinates**: X/Z coordinates are scaled down by 100 for visualization
2. **Connections**: Automatic edge generation between waystones within 5000 units
3. **Colors**: All waystones use red color (`#e74c3c`) for consistency
4. **Icons**: Uses the `smptransport_waystone_markers.png` image

## Error Handling

If the API endpoint is not configured or returns an error, the application falls back to sample data to demonstrate functionality.

**Error Response:**
```json
{
  "error": "Error message here",
  "success": false,
  "timestamp": "2025-09-03T14:30:00",
  "fallback_to_sample": true
}
```

## Enhanced API Features

### Response Structure Benefits
- **Wrapper Objects**: All responses are wrapped in objects instead of returning raw arrays
- **Future Extensibility**: Easy to add pagination, filtering, or metadata without breaking changes
- **Success Indicators**: Clear success/failure status in all responses
- **Timestamps**: All responses include generation timestamps
- **Error Handling**: Consistent error response format across all endpoints

## Sample Data

When `WAYSTONES_API_URL` is not configured, the application uses sample waystone data:
- The Den (X: -7582, Z: -8382)
- Crystal Valley (X: -6500, Z: -7200)  
- Mountain Peak (X: -8000, Z: -9000)
- Forest Grove (X: -7000, Z: -8000)

## Frontend Integration

### Map View (`/`)
- Fetches data from `/api/waystones`
- Renders using Sigma.js library
- Click nodes for detailed information
- Hover for highlighting effects

### Directory View (`/directory`)
- Fetches data from `/api/directory`
- Displays searchable table
- Modal popups for detailed waystone information
- Real-time search filtering

## Technical Notes

- **Scaling**: Coordinates are divided by 100 for better map visualization
- **Connections**: Edges are created between waystones within 5000 units distance
- **Images**: Place `.png` files in project root, reference by filename without extension
- **Caching**: No caching implemented - data is fetched fresh on each request
