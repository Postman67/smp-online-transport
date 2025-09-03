# Configuration file for Waystones Network
# Copy this file to config.py and update with your settings

# Your waystones API endpoint URL
# Replace this with your actual API endpoint that returns waystone data
WAYSTONES_API_URL = "https://callmecarson.live/subserver/map/tiles/world/markers/smptransport_waystone_markers.json"

# Example:
# WAYSTONES_API_URL = "https://your-minecraft-server.com/api/waystones"

# Application settings
DEBUG = True
HOST = "0.0.0.0"
PORT = 5000

# Coordinate scaling factor for map visualization
# Divides X/Z coordinates by this factor for better display
COORDINATE_SCALE = 100

# Maximum distance between waystones to create automatic connections
MAX_CONNECTION_DISTANCE = 5000
