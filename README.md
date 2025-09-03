# Waystones Network Visualization

A Flask-based web application that visualizes waystone networks as both an interactive map and searchable directory using Sigma.js.

## Features

- **Interactive Map View**: Network visualization using Sigma.js with clickable waystone nodes
- **Directory Listing**: Searchable table view of all waystones with detailed information
- **API Integration**: Configurable to work with your waystone API endpoint
- **Responsive Design**: Bootstrap-powered responsive UI with waystone-themed styling
- **Real-time Search**: Filter waystones in directory view in real-time
- **Sample Data**: Built-in demo data when API is not configured

## Setup & Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd smp-online-transport
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure your API endpoint (optional):
   ```bash
   cp config_example.py config.py
   # Edit config.py with your waystone API URL
   ```

5. Place waystone marker images in the project root:
   ```
   smptransport_waystone_markers.png
   ```

6. Run the application:
   ```bash
   python main.py
   ```

7. Open your browser and navigate to `http://localhost:5000`

## Configuration

### API Endpoint Setup
Create a `config.py` file from the example:
```python
# Your waystones API endpoint URL  
WAYSTONES_API_URL = "https://your-server.com/api/waystones"

# Optional settings
COORDINATE_SCALE = 100  # Scaling factor for coordinates
MAX_CONNECTION_DISTANCE = 5000  # Max distance for auto-connections
```

### Expected API Format
Your API should return JSON in this format:
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

## Project Structure

```
smp-online-transport/
├── main.py                              # Flask application
├── config_example.py                    # Configuration template  
├── config.py                           # Your configuration (create from example)
├── requirements.txt                     # Python dependencies
├── api.md                              # API documentation
├── README.md                           # This file
├── smptransport_waystone_markers.png   # Waystone marker image
├── templates/                          # HTML templates
│   ├── base.html                       # Base template
│   ├── index.html                      # Map view
│   └── directory.html                  # Directory view
└── static/                             # Static assets (CSS, JS, images)
```

## API Endpoints

- `GET /` - Main waystone map view
- `GET /directory` - Waystone directory listing view  
- `GET /api/waystones` - JSON data for map visualization
- `GET /api/directory` - JSON data for directory listing
- `GET /static/images/<filename>` - Serve waystone marker images

See `api.md` for detailed API documentation.

## Customization

### Data Source
1. Update `WAYSTONES_API_URL` in `config.py` with your API endpoint
2. Ensure your API returns data in the expected format (see api.md)
3. Place waystone marker images (PNG format) in the project root

### Map Visualization
- **Coordinate Scaling**: Adjust `COORDINATE_SCALE` in config.py (default: 100)
- **Auto-connections**: Modify `MAX_CONNECTION_DISTANCE` for waystone connections
- **Styling**: Customize colors and sizes in the `/api/waystones` endpoint
- **Sigma.js**: Advanced configuration in `templates/index.html`

### UI Customization
- **Bootstrap**: Modify Bootstrap classes in templates for different styling
- **Colors**: Waystone theme uses red (#e74c3c) for consistency
- **Icons**: Replace `smptransport_waystone_markers.png` with your own icon

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Visualization**: Sigma.js with Graphology
- **UI Framework**: Bootstrap 5
- **Data**: RESTful API integration with configurable endpoints

## Demo Data

When no API endpoint is configured, the application shows sample waystones:
- The Den (X: -7582, Z: -8382)
- Crystal Valley (X: -6500, Z: -7200)
- Mountain Peak (X: -8000, Z: -9000)
- Forest Grove (X: -7000, Z: -8000)

## Notes

- Coordinates are automatically scaled for better visualization
- Waystone connections are generated based on proximity
- Error handling gracefully falls back to sample data
- All waystone data includes unique keys, coordinates, and tooltip information