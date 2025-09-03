/**
 * Waystones Network Utilities
 * Common utilities and helper functions used across the application
 */

class WaystonesUtils {
    /**
     * Format coordinates for display
     */
    static formatCoordinates(x, z) {
        return `X: ${x}, Z: ${z}`;
    }
    
    /**
     * Create waystone image element
     */
    static createWaystoneImage(imageName, alt = 'Waystone', width = 32, height = 32) {
        const img = document.createElement('img');
        img.src = `/static/images/${imageName}.png`;
        img.alt = alt;
        img.style.width = `${width}px`;
        img.style.height = `${height}px`;
        return img;
    }
    
    /**
     * Show loading state
     */
    static showLoading(element) {
        if (element) {
            element.style.display = 'block';
        }
    }
    
    /**
     * Hide loading state
     */
    static hideLoading(element) {
        if (element) {
            element.style.display = 'none';
        }
    }
    
    /**
     * Show error message
     */
    static showError(element, message) {
        if (element) {
            element.style.display = 'block';
            element.innerHTML = `<strong>Error:</strong> ${message}`;
        }
    }
    
    /**
     * Generate waystone badge HTML
     */
    static createWaystoneBadge(type = 'waystone') {
        return `<span class="badge bg-danger">${type}</span>`;
    }
    
    /**
     * Debounce function for search input
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Calculate distance between two waystone coordinates
     */
    static calculateDistance(x1, z1, x2, z2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2));
    }
    
    /**
     * Format waystone key for display
     */
    static formatKey(key) {
        return key.replace(/^public_waystone_/, '').substring(0, 8) + '...';
    }
    
    /**
     * Copy text to clipboard
     */
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    }
    
    /**
     * Show toast notification
     */
    static showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '1055';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast
        const toastId = 'toast-' + Date.now();
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `toast align-items-center text-white bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Initialize and show toast
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Remove toast element after it's hidden
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
}

// Make utilities available globally
window.WaystonesUtils = WaystonesUtils;
