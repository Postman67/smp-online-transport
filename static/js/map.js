/**
 * Waystones Network Map JavaScript
 * Handles the interactive map visualization using Sigma.js
 */

class WaystonesMap {
    constructor() {
        this.loadingEl = document.getElementById('loading');
        this.errorEl = document.getElementById('error-message');
        this.mapContainer = document.getElementById('map-container');
        this.nodeInfoEl = document.getElementById('node-info');
        this.sigma = null;
        this.graph = null;
        
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadMapData();
        });
    }
    
    async loadMapData() {
        try {
            const response = await fetch('/api/waystones');
            const data = await response.json();
            
            if (data.error || !data.success) {
                throw new Error(data.error || 'Failed to load waystone data');
            }
            
            this.hideLoading();
            this.showMap();
            this.createGraph(data.waystones);
            this.displayMetadata(data.waystones.metadata);
            
        } catch (error) {
            console.error('Error loading map data:', error);
            this.showError(error.message);
        }
    }
    
    hideLoading() {
        this.loadingEl.style.display = 'none';
    }
    
    showMap() {
        this.mapContainer.style.display = 'block';
    }
    
    showError(message) {
        this.loadingEl.style.display = 'none';
        this.errorEl.style.display = 'block';
        this.errorEl.innerHTML = `<strong>Error:</strong> ${message}`;
    }
    
    createGraph(data) {
        // Create graph
        this.graph = new graphology.Graph();
        
        // Add nodes (waystones)
        data.nodes.forEach(node => {
            this.graph.addNode(node.id, {
                x: node.x,
                y: node.y,
                size: node.size,
                color: node.color,
                label: node.label,
                info: node.info
            });
        });
        
        // Add edges (connections)
        data.edges.forEach(edge => {
            this.graph.addEdge(edge.source, edge.target, {
                color: edge.color,
                size: edge.size
            });
        });
        
        this.initializeSigma();
    }
    
    initializeSigma() {
        // Initialize Sigma
        this.sigma = new Sigma(this.graph, this.mapContainer, {
            renderLabels: true,
            labelRenderedSizeThreshold: 8,
            labelSize: 14,
            labelColor: { color: '#000' },
            defaultNodeColor: '#e74c3c',
            defaultEdgeColor: '#95a5a6'
        });
        
        this.setupEventHandlers();
    }
    
    setupEventHandlers() {
        // Add waystone click interaction
        this.sigma.on('clickNode', (event) => {
            const nodeId = event.node;
            const nodeData = this.graph.getNodeAttributes(nodeId);
            this.displayNodeInfo(nodeData);
        });
        
        // Enhanced hover effects for waystones
        this.sigma.on('enterNode', (event) => {
            const nodeId = event.node;
            this.graph.setNodeAttribute(nodeId, 'highlighted', true);
            this.graph.setNodeAttribute(nodeId, 'size', 10); // Bigger on hover
            this.sigma.refresh();
        });
        
        this.sigma.on('leaveNode', (event) => {
            const nodeId = event.node;
            this.graph.setNodeAttribute(nodeId, 'highlighted', false);
            this.graph.setNodeAttribute(nodeId, 'size', 5); // Back to normal
            this.sigma.refresh();
        });
    }
    
    displayNodeInfo(nodeData) {
        const infoHtml = `
            <h5>${nodeData.label}</h5>
            <div class="row">
                <div class="col-md-6">
                    <img src="/static/images/${nodeData.info.image}.png" 
                         alt="Waystone Marker" 
                         style="width: 64px; height: 64px; margin-bottom: 10px;">
                    <br>
                    <strong>Key:</strong> <code>${nodeData.info.key}</code><br>
                    <strong>Type:</strong> Waystone<br>
                </div>
                <div class="col-md-6">
                    <strong>Coordinates:</strong> ${nodeData.info.coordinates}<br>
                    <strong>Tooltip:</strong> ${nodeData.info.tooltip}<br>
                    <strong>Popup:</strong> ${nodeData.info.popup}
                </div>
            </div>
        `;
        
        this.nodeInfoEl.innerHTML = infoHtml;
    }
    
    displayMetadata(metadata) {
        if (metadata) {
            const metadataHtml = `
                <div class="alert alert-info mt-3">
                    <strong>Map Info:</strong> ${metadata.total_waystones} waystones loaded 
                    (Source: ${metadata.data_source})
                </div>
            `;
            document.querySelector('.col-12').insertAdjacentHTML('beforeend', metadataHtml);
        }
    }
}

// Initialize the map when the script loads
new WaystonesMap();
