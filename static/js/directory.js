/**
 * Waystones Directory JavaScript
 * Handles the directory table, search functionality, and modal details
 */

class WaystonesDirectory {
    constructor() {
        this.loadingEl = document.getElementById('loading');
        this.errorEl = document.getElementById('error-message');
        this.contentEl = document.getElementById('directory-content');
        this.tableBody = document.getElementById('directory-table-body');
        this.searchInput = document.getElementById('search-input');
        
        this.directoryData = [];
        this.filteredData = [];
        
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadDirectoryData();
            this.setupEventHandlers();
        });
    }
    
    async loadDirectoryData() {
        try {
            const response = await fetch('/api/directory');
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            this.directoryData = data;
            this.filteredData = data;
            
            this.hideLoading();
            this.showContent();
            this.renderTable();
            
        } catch (error) {
            console.error('Error loading directory data:', error);
            this.showError(error.message);
        }
    }
    
    hideLoading() {
        this.loadingEl.style.display = 'none';
    }
    
    showContent() {
        this.contentEl.style.display = 'block';
    }
    
    showError(message) {
        this.loadingEl.style.display = 'none';
        this.errorEl.style.display = 'block';
        this.errorEl.innerHTML = `<strong>Error:</strong> ${message}`;
    }
    
    setupEventHandlers() {
        // Search functionality
        this.searchInput.addEventListener('input', (event) => {
            this.handleSearch(event.target.value);
        });
        
        // Make showDetails available globally for onclick handlers
        window.showDetails = (id) => this.showDetails(id);
    }
    
    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase();
        
        if (term === '') {
            this.filteredData = this.directoryData;
        } else {
            this.filteredData = this.directoryData.filter(item => 
                item.name.toLowerCase().includes(term) ||
                item.key.toLowerCase().includes(term) ||
                item.tooltip.toLowerCase().includes(term) ||
                item.popup.toLowerCase().includes(term)
            );
        }
        
        this.renderTable();
    }
    
    renderTable() {
        this.tableBody.innerHTML = '';
        
        this.filteredData.forEach(item => {
            const row = this.createTableRow(item);
            this.tableBody.appendChild(row);
        });
        
        this.updateTableInfo();
    }
    
    createTableRow(item) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="/static/images/${item.image}.png" 
                     alt="Waystone" 
                     style="width: 32px; height: 32px;">
            </td>
            <td>
                <strong>${item.name}</strong>
            </td>
            <td>
                <code style="font-size: 0.8em;">${item.key}</code>
            </td>
            <td>
                <small>X: ${item.coordinates.x}, Z: ${item.coordinates.z}</small>
            </td>
            <td>
                <span class="badge bg-danger">${item.type}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="showDetails('${item.id}')">
                    Details
                </button>
            </td>
        `;
        return row;
    }
    
    updateTableInfo() {
        const totalCount = this.filteredData.length;
        const tableInfo = document.querySelector('.table-responsive');
        
        if (!document.getElementById('table-info')) {
            const infoDiv = document.createElement('div');
            infoDiv.id = 'table-info';
            infoDiv.className = 'mt-2 text-muted small';
            tableInfo.appendChild(infoDiv);
        }
        
        document.getElementById('table-info').textContent = 
            `Showing ${totalCount} ${totalCount === 1 ? 'waystone' : 'waystones'}`;
    }
    
    showDetails(id) {
        const item = this.directoryData.find(d => d.id === id);
        if (!item) return;
        
        this.populateModal(item);
        this.showModal();
    }
    
    populateModal(item) {
        document.getElementById('modalTitle').textContent = item.name;
        document.getElementById('modalBody').innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <div class="text-center mb-3">
                        <img src="/static/images/${item.image}.png" 
                             alt="Waystone Marker" 
                             style="width: 64px; height: 64px;">
                    </div>
                    <h6>Waystone Information</h6>
                    <p><strong>Key:</strong> <code>${item.key}</code></p>
                    <p><strong>Type:</strong> <span class="badge bg-danger">${item.type}</span></p>
                    <p><strong>Tooltip:</strong> ${item.tooltip}</p>
                </div>
                <div class="col-md-6">
                    <h6>Location Information</h6>
                    <p><strong>Coordinates:</strong><br>X: ${item.coordinates.x}<br>Z: ${item.coordinates.z}</p>
                    <p><strong>Popup Content:</strong> ${item.popup}</p>
                    <p><strong>Image:</strong> ${item.image}.png</p>
                </div>
            </div>
        `;
        
        document.getElementById('viewOnMapBtn').href = `/?highlight=${item.id}`;
    }
    
    showModal() {
        const modal = new bootstrap.Modal(document.getElementById('detailModal'));
        modal.show();
    }
}

// Initialize the directory when the script loads
new WaystonesDirectory();
