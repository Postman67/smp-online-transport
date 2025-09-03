from flask import Flask, render_template, jsonify, send_from_directory
import requests
import json
import os

app = Flask(__name__)

# Try to load configuration from config.py, fall back to defaults
try:
    import config
    WAYSTONES_API_URL = getattr(config, 'WAYSTONES_API_URL', "YOUR_API_ENDPOINT_HERE")
    COORDINATE_SCALE = getattr(config, 'COORDINATE_SCALE', 100)
    MAX_CONNECTION_DISTANCE = getattr(config, 'MAX_CONNECTION_DISTANCE', 5000)
except ImportError:
    # Default configuration if config.py doesn't exist
    WAYSTONES_API_URL = "YOUR_API_ENDPOINT_HERE"  # Replace this with your actual API endpoint
    COORDINATE_SCALE = 100
    MAX_CONNECTION_DISTANCE = 5000

# Fallback to sample data for demo if no API URL is provided
SAMPLE_API_URL = "https://jsonplaceholder.typicode.com/users"

@app.route('/static/images/<filename>')
def serve_waystone_image(filename):
    """Serve waystone marker images"""
    return send_from_directory('.', filename)

@app.route('/')
def index():
    """Main page with directory and map"""
    return render_template('index.html')

@app.route('/api/waystones')
def get_waystones_data():
    """API endpoint to fetch waystone data for the map"""
    try:
        # Check if we have a real API URL or use sample data
        if WAYSTONES_API_URL == "YOUR_API_ENDPOINT_HERE":
            return get_sample_waystone_data()
        
        # Fetch data from actual Waystones API
        response = requests.get(WAYSTONES_API_URL)
        waystones = response.json()
        
        # Transform data for sigma.js format
        nodes = []
        edges = []
        
        for i, waystone in enumerate(waystones):
            if waystone.get('type') == 'icon' and waystone.get('data'):
                data = waystone['data']
                point = data.get('point', {})
                options = waystone.get('options', {})
                tooltip = options.get('tooltip', {})
                popup = options.get('popup', {})
                
                # Create node from waystone data
                nodes.append({
                    "id": data.get('key', f"waystone_{i}"),
                    "label": tooltip.get('content', popup.get('content', f"Waystone {i+1}")),
                    "x": float(point.get('x', 0)) / COORDINATE_SCALE,  # Scale coordinates for better visualization
                    "y": float(point.get('z', 0)) / COORDINATE_SCALE,  # Using z as y coordinate
                    "size": 15,
                    "color": "#e74c3c",  # Red color for waystones
                    "info": {
                        "key": data.get('key'),
                        "coordinates": f"X: {point.get('x', 0)}, Z: {point.get('z', 0)}",
                        "image": data.get('image', 'smptransport_waystone_markers'),
                        "tooltip": tooltip.get('content', 'Unknown'),
                        "popup": popup.get('content', 'Unknown')
                    }
                })
                
                # Create connections between nearby waystones (optional)
                if i > 0 and len(nodes) > 1:
                    # Connect to previous waystone if within reasonable distance
                    prev_node = nodes[i-1]
                    distance = ((float(point.get('x', 0)) - float(prev_node["x"]*COORDINATE_SCALE))**2 + 
                               (float(point.get('z', 0)) - float(prev_node["y"]*COORDINATE_SCALE))**2)**0.5
                    
                    if distance < MAX_CONNECTION_DISTANCE:  # Connect if within reasonable distance
                        edges.append({
                            "id": f"e{i}",
                            "source": nodes[i]["id"],
                            "target": nodes[i-1]["id"],
                            "color": "#95a5a6",
                            "size": 1
                        })
        
        return jsonify({
            "waystones": {
                "nodes": nodes,
                "edges": edges,
                "metadata": {
                    "total_waystones": len(nodes),
                    "data_source": "waystones_api",
                    "coordinate_scale": COORDINATE_SCALE,
                    "max_connection_distance": MAX_CONNECTION_DISTANCE
                }
            },
            "success": True,
            "timestamp": __import__('datetime').datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Error fetching waystone data: {e}")
        return jsonify({
            "error": str(e),
            "success": False,
            "timestamp": __import__('datetime').datetime.now().isoformat(),
            "fallback_to_sample": True
        }), 500

def get_sample_waystone_data():
    """Generate sample waystone data for demo purposes"""
    sample_waystones = [
        {
            "type": "icon",
            "data": {
                "key": "public_waystone_sample_1",
                "point": {"x": -7582, "z": -8382},
                "image": "smptransport_waystone_markers"
            },
            "options": {
                "tooltip": {"content": "The Den"},
                "popup": {"content": "The Den"}
            }
        },
        {
            "type": "icon", 
            "data": {
                "key": "public_waystone_sample_2",
                "point": {"x": -6500, "z": -7200},
                "image": "smptransport_waystone_markers"
            },
            "options": {
                "tooltip": {"content": "Crystal Valley"},
                "popup": {"content": "Crystal Valley"}
            }
        },
        {
            "type": "icon",
            "data": {
                "key": "public_waystone_sample_3", 
                "point": {"x": -8000, "z": -9000},
                "image": "smptransport_waystone_markers"
            },
            "options": {
                "tooltip": {"content": "Mountain Peak"},
                "popup": {"content": "Mountain Peak"}
            }
        },
        {
            "type": "icon",
            "data": {
                "key": "public_waystone_sample_4",
                "point": {"x": -7000, "z": -8000},
                "image": "smptransport_waystone_markers"
            },
            "options": {
                "tooltip": {"content": "Forest Grove"},
                "popup": {"content": "Forest Grove"}
            }
        }
    ]
    
    # Process sample data same way as real API data
    nodes = []
    edges = []
    
    for i, waystone in enumerate(sample_waystones):
        data = waystone['data']
        point = data['point']
        options = waystone['options']
        tooltip = options['tooltip']
        
        nodes.append({
            "id": data['key'],
            "label": tooltip['content'],
            "x": float(point['x']) / COORDINATE_SCALE,
            "y": float(point['z']) / COORDINATE_SCALE,
            "size": 15,
            "color": "#e74c3c",
            "info": {
                "key": data['key'],
                "coordinates": f"X: {point['x']}, Z: {point['z']}",
                "image": data['image'],
                "tooltip": tooltip['content'],
                "popup": options['popup']['content']
            }
        })
        
        # Add some sample connections
        if i > 0:
            edges.append({
                "id": f"e{i}",
                "source": nodes[i]["id"],
                "target": nodes[i-1]["id"],
                "color": "#95a5a6",
                "size": 1
            })
    
    return jsonify({
        "waystones": {
            "nodes": nodes,
            "edges": edges,
            "metadata": {
                "total_waystones": len(nodes),
                "data_source": "sample_data",
                "coordinate_scale": COORDINATE_SCALE,
                "max_connection_distance": MAX_CONNECTION_DISTANCE
            }
        },
        "success": True,
        "timestamp": __import__('datetime').datetime.now().isoformat()
    })

@app.route('/directory')
def directory():
    """Directory page showing list view of waystones"""
    return render_template('directory.html')

@app.route('/api/directory')
def get_directory_data():
    """API endpoint to fetch waystone directory data"""
    try:
        # Check if we have a real API URL or use sample data
        if WAYSTONES_API_URL == "YOUR_API_ENDPOINT_HERE":
            return get_sample_directory_data()
        
        # Fetch data from actual Waystones API
        response = requests.get(WAYSTONES_API_URL)
        waystones = response.json()
        
        # Format data for directory listing
        directory_data = []
        for waystone in waystones:
            if waystone.get('type') == 'icon' and waystone.get('data'):
                data = waystone['data']
                point = data.get('point', {})
                options = waystone.get('options', {})
                tooltip = options.get('tooltip', {})
                popup = options.get('popup', {})
                
                directory_data.append({
                    "id": data.get('key', 'unknown'),
                    "name": tooltip.get('content', popup.get('content', 'Unknown Waystone')),
                    "key": data.get('key', 'unknown'),
                    "coordinates": {
                        "x": point.get('x', 0),
                        "z": point.get('z', 0)
                    },
                    "image": data.get('image', 'smptransport_waystone_markers'),
                    "tooltip": tooltip.get('content', 'No tooltip'),
                    "popup": popup.get('content', 'No popup content'),
                    "type": "waystone"
                })
        
        return jsonify({
            "waystones": directory_data,
            "success": True,
            "total_count": len(directory_data),
            "timestamp": __import__('datetime').datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Error fetching directory data: {e}")
        return jsonify({
            "error": str(e),
            "success": False,
            "timestamp": __import__('datetime').datetime.now().isoformat(),
            "fallback_to_sample": True
        }), 500

def get_sample_directory_data():
    """Generate sample directory data for demo purposes"""
    sample_data = [
        {
            "id": "public_waystone_sample_1",
            "name": "The Den",
            "key": "public_waystone_sample_1",
            "coordinates": {"x": -7582, "z": -8382},
            "image": "smptransport_waystone_markers",
            "tooltip": "The Den",
            "popup": "The Den",
            "type": "waystone"
        },
        {
            "id": "public_waystone_sample_2",
            "name": "Crystal Valley",
            "key": "public_waystone_sample_2", 
            "coordinates": {"x": -6500, "z": -7200},
            "image": "smptransport_waystone_markers",
            "tooltip": "Crystal Valley",
            "popup": "Crystal Valley",
            "type": "waystone"
        },
        {
            "id": "public_waystone_sample_3",
            "name": "Mountain Peak",
            "key": "public_waystone_sample_3",
            "coordinates": {"x": -8000, "z": -9000},
            "image": "smptransport_waystone_markers",
            "tooltip": "Mountain Peak", 
            "popup": "Mountain Peak",
            "type": "waystone"
        },
        {
            "id": "public_waystone_sample_4",
            "name": "Forest Grove",
            "key": "public_waystone_sample_4",
            "coordinates": {"x": -7000, "z": -8000},
            "image": "smptransport_waystone_markers",
            "tooltip": "Forest Grove",
            "popup": "Forest Grove",
            "type": "waystone"
        }
    ]
    
    return jsonify({
        "waystones": sample_data,
        "success": True,
        "total_count": len(sample_data),
        "timestamp": __import__('datetime').datetime.now().isoformat()
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)