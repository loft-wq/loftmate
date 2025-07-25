/**
 * Utility Functions for Racing Pigeon Manager
 * Common helper functions, formatters, validators, and UI utilities
 */

class Utils {
    constructor() {
        this.notifications = [];
        this.modalStack = [];
        this.loadingStates = new Map();
    }

    /**
     * Get browser info
     */
    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        let browserName = "Unknown";
        
        if (userAgent.includes("Chrome")) browserName = "Chrome";
        else if (userAgent.includes("Firefox")) browserName = "Firefox";
        else if (userAgent.includes("Safari")) browserName = "Safari";
        else if (userAgent.includes("Edge")) browserName = "Edge";
        else if (userAgent.includes("Opera")) browserName = "Opera";
        
        return {
            name: browserName,
            userAgent: userAgent,
            isMobile: this.isMobile()
        };
    }

    /**
     * Download file
     */
    downloadFile(data, filename, type = 'application/json') {
        const blob = new Blob([data], { type });
        const url = URL.createObjectURL(blob);
        
        const element = document.createElement('a');
        element.setAttribute('href', url);
        element.setAttribute('download', filename);
        element.style.display = 'none';
        
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        URL.revokeObjectURL(url);
    }

    /**
     * Read file as text
     */
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'absolute';
                textArea.style.left = '-999999px';
                
                document.body.prepend(textArea);
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    return true;
                } catch (error) {
                    console.error('Copy failed:', error);
                    return false;
                } finally {
                    textArea.remove();
                }
            }
        } catch (error) {
            console.error('Copy to clipboard failed:', error);
            return false;
        }
    }

    /**
     * Format number with locale
     */
    formatNumber(number, options = {}) {
        const defaults = {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        };
        
        return new Intl.NumberFormat('en-US', { ...defaults, ...options }).format(number);
    }

    /**
     * Parse CSV data
     */
    parseCSV(csvText, delimiter = ',') {
        const lines = csvText.split('\n');
        const headers = lines[0].split(delimiter).map(h => h.trim().replace(/"/g, ''));
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(delimiter).map(v => v.trim().replace(/"/g, ''));
            const row = {};
            
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            
            data.push(row);
        }
        
        return { headers, data };
    }

    /**
     * Convert data to CSV
     */
    toCSV(data, headers = null) {
        if (!data || data.length === 0) return '';
        
        const csvHeaders = headers || Object.keys(data[0]);
        const csvRows = data.map(row => {
            return csvHeaders.map(header => {
                const value = row[header] || '';
                // Escape quotes and wrap in quotes if contains comma or quote
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',');
        });
        
        return [csvHeaders.join(','), ...csvRows].join('\n');
    }

    /**
     * Validate form data
     */
    validateForm(formData, validationRules) {
        const errors = {};
        
        for (const [field, rules] of Object.entries(validationRules)) {
            const value = formData[field];
            const fieldErrors = [];
            
            for (const rule of rules) {
                switch (rule.type) {
                    case 'required':
                        if (!value || (typeof value === 'string' && !value.trim())) {
                            fieldErrors.push(rule.message || `${this.formatFieldName(field)} is required`);
                        }
                        break;
                        
                    case 'email':
                        if (value && !this.validateEmail(value)) {
                            fieldErrors.push(rule.message || 'Please enter a valid email address');
                        }
                        break;
                        
                    case 'minLength':
                        if (value && value.length < rule.value) {
                            fieldErrors.push(rule.message || `${this.formatFieldName(field)} must be at least ${rule.value} characters`);
                        }
                        break;
                        
                    case 'maxLength':
                        if (value && value.length > rule.value) {
                            fieldErrors.push(rule.message || `${this.formatFieldName(field)} must be no more than ${rule.value} characters`);
                        }
                        break;
                        
                    case 'min':
                        if (value && parseFloat(value) < rule.value) {
                            fieldErrors.push(rule.message || `${this.formatFieldName(field)} must be at least ${rule.value}`);
                        }
                        break;
                        
                    case 'max':
                        if (value && parseFloat(value) > rule.value) {
                            fieldErrors.push(rule.message || `${this.formatFieldName(field)} must be no more than ${rule.value}`);
                        }
                        break;
                        
                    case 'pattern':
                        if (value && !rule.value.test(value)) {
                            fieldErrors.push(rule.message || `${this.formatFieldName(field)} format is invalid`);
                        }
                        break;
                        
                    case 'custom':
                        if (value && rule.validator && !rule.validator(value, formData)) {
                            fieldErrors.push(rule.message || `${this.formatFieldName(field)} is invalid`);
                        }
                        break;
                }
            }
            
            if (fieldErrors.length > 0) {
                errors[field] = fieldErrors;
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Show form validation errors
     */
    showFormErrors(formId, errors) {
        // Clear existing errors
        const form = document.getElementById(formId);
        if (!form) return;
        
        form.querySelectorAll('.error-message').forEach(el => el.remove());
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        
        // Show new errors
        for (const [field, fieldErrors] of Object.entries(errors)) {
            const input = form.querySelector(`[name="${field}"], #${field}`);
            if (!input) continue;
            
            input.classList.add('error');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = fieldErrors[0]; // Show first error
            
            input.parentNode.appendChild(errorDiv);
        }
    }

    /**
     * Clear form
     */
    clearForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        form.reset();
        form.querySelectorAll('.error-message').forEach(el => el.remove());
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }

    /**
     * Get form data as object
     */
    getFormData(formId) {
        const form = document.getElementById(formId);
        if (!form) return {};
        
        const formData = new FormData(form);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values (checkboxes, etc.)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        return data;
    }

    /**
     * Populate form with data
     */
    populateForm(formId, data) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        for (const [key, value] of Object.entries(data)) {
            const element = form.querySelector(`[name="${key}"], #${key}`);
            if (!element) continue;
            
            if (element.type === 'checkbox' || element.type === 'radio') {
                element.checked = Boolean(value);
            } else {
                element.value = value || '';
            }
        }
    }

    /**
     * Animate element
     */
    animate(element, animation, duration = 300) {
        return new Promise((resolve) => {
            if (typeof element === 'string') {
                element = document.getElementById(element);
            }
            
            if (!element) {
                resolve();
                return;
            }
            
            element.style.animation = `${animation} ${duration}ms ease-in-out`;
            
            setTimeout(() => {
                element.style.animation = '';
                resolve();
            }, duration);
        });
    }

    /**
     * Scroll to element
     */
    scrollToElement(elementId, behavior = 'smooth') {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior, block: 'start' });
        }
    }

    /**
     * Check if element is in viewport
     */
    isInViewport(element) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Theme management
     */
    setTheme(theme) {
        if (theme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    }

    /**
     * Get current theme
     */
    getTheme() {
        return localStorage.getItem('theme') || 'light';
    }

    /**
     * Toggle theme
     */
    toggleTheme() {
        const currentTheme = this.getTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Update theme toggle button
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        }
        
        return newTheme;
    }

    /**
     * Local storage helpers
     */
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    getFromStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    }

    removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }

    /**
     * URL helpers
     */
    getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    }

    setUrlParam(key, value) {
        const url = new URL(window.location);
        url.searchParams.set(key, value);
        window.history.replaceState({}, '', url);
    }

    removeUrlParam(key) {
        const url = new URL(window.location);
        url.searchParams.delete(key);
        window.history.replaceState({}, '', url);
    }

    /**
     * Format phone number
     */
    formatPhoneNumber(phoneNumber) {
        const cleaned = phoneNumber.replace(/\D/g, '');
        
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (cleaned.length === 11) {
            return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4');
        }
        
        return phoneNumber;
    }

    /**
     * Color utilities
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    /**
     * Initialize utility functions
     */
    init() {
        // Set initial theme
        const savedTheme = this.getTheme();
        this.setTheme(savedTheme);
        
        // Add global event listeners
        this.addGlobalEventListeners();
        
        console.log('🛠️ Utils initialized');
    }

    /**
     * Add global event listeners
     */
    addGlobalEventListeners() {
        // Close modals when clicking outside
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                this.hideModal();
            }
        });
        
        // Handle form submissions
        document.addEventListener('submit', (event) => {
            const form = event.target;
            if (form.hasAttribute('data-validate')) {
                event.preventDefault();
                // Custom form validation logic here
            }
        });
        
        // Handle file uploads
        document.addEventListener('change', (event) => {
            if (event.target.type === 'file') {
                this.handleFileUpload(event);
            }
        });
    }

    /**
     * Handle file upload
     */
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            this.showNotification('File size must be less than 10MB', 'error');
            event.target.value = '';
            return;
        }
        
        // You can add more file validation here
        console.log('File selected:', file.name, this.formatFileSize(file.size));
    }
}

// Create and initialize utils instance
const utils = new Utils();

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        utils.init();
    });
} else {
    utils.init();
}

// Make utils available globally
window.utils = utils;

// Export for modules
export default utils;
     * Generate unique ID
     */
    generateId(length = 12) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Format date to readable string
     */
    formatDate(date, format = 'short') {
        if (!date) return '';
        
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';

        const options = {
            short: { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            },
            long: { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            },
            time: {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }
        };

        return d.toLocaleDateString('en-US', options[format] || options.short);
    }

    /**
     * Format time duration
     */
    formatTime(timeString) {
        if (!timeString) return '';
        
        // Handle different time formats
        const parts = timeString.split(':');
        if (parts.length === 2) {
            return `${parts[0]}:${parts[1].padStart(2, '0')}`;
        } else if (parts.length === 3) {
            return `${parts[0]}:${parts[1].padStart(2, '0')}:${parts[2].padStart(2, '0')}`;
        }
        
        return timeString;
    }

    /**
     * Format distance with units
     */
    formatDistance(distance, unit = 'km') {
        if (!distance && distance !== 0) return '';
        
        const num = parseFloat(distance);
        if (isNaN(num)) return distance;
        
        return `${num.toLocaleString()} ${unit}`;
    }

    /**
     * Format speed
     */
    formatSpeed(speed, unit = 'm/min') {
        if (!speed && speed !== 0) return '';
        
        const num = parseFloat(speed);
        if (isNaN(num)) return speed;
        
        return `${Math.round(num).toLocaleString()} ${unit}`;
    }

    /**
     * Calculate age from birth year
     */
    calculateAge(birthYear) {
        const currentYear = new Date().getFullYear();
        return currentYear - parseInt(birthYear);
    }

    /**
     * Validate email address
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate ring number format
     */
    validateRing(ring) {
        if (!ring || typeof ring !== 'string') return false;
        
        // Basic validation - can be customized based on specific ring format requirements
        const ringRegex = /^[A-Z0-9\-\/]+$/i;
        return ringRegex.test(ring.trim()) && ring.trim().length >= 3;
    }

    /**
     * Validate required fields
     */
    validateRequired(data, requiredFields) {
        const errors = [];
        
        for (const field of requiredFields) {
            if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
                errors.push(`${this.formatFieldName(field)} is required`);
            }
        }
        
        return errors;
    }

    /**
     * Format field name for display
     */
    formatFieldName(fieldName) {
        return fieldName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info', duration = 4000) {
        // Remove existing notifications of the same type
        this.hideNotifications(type);
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.className = 'notification-close';
        closeBtn.onclick = () => this.hideNotification(notification);
        notification.appendChild(closeBtn);
        
        document.body.appendChild(notification);
        this.notifications.push(notification);
        
        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => {
                this.hideNotification(notification);
            }, duration);
        }
        
        return notification;
    }

    /**
     * Hide specific notification
     */
    hideNotification(notification) {
        if (!notification || !notification.parentNode) return;
        
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }

    /**
     * Hide all notifications or notifications of specific type
     */
    hideNotifications(type = null) {
        const notificationsToHide = type 
            ? this.notifications.filter(n => n.classList.contains(type))
            : [...this.notifications];
            
        notificationsToHide.forEach(notification => {
            this.hideNotification(notification);
        });
    }

    /**
     * Show loading state
     */
    setLoading(elementId, isLoading, loadingText = 'Loading...') {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        if (isLoading) {
            // Store original content
            if (!this.loadingStates.has(elementId)) {
                this.loadingStates.set(elementId, {
                    originalHTML: element.innerHTML,
                    originalDisabled: element.disabled
                });
            }
            
            // Show loading state
            element.disabled = true;
            element.innerHTML = `<span class="loading"></span>${loadingText}`;
        } else {
            // Restore original state
            const savedState = this.loadingStates.get(elementId);
            if (savedState) {
                element.innerHTML = savedState.originalHTML;
                element.disabled = savedState.originalDisabled;
                this.loadingStates.delete(elementId);
            }
        }
    }

    /**
     * Show modal
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return false;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        this.modalStack.push(modalId);
        
        // Add escape key listener
        this.addEscapeKeyListener();
        
        return true;
    }

    /**
     * Hide modal
     */
    hideModal(modalId = null) {
        const targetModalId = modalId || this.modalStack[this.modalStack.length - 1];
        if (!targetModalId) return;
        
        const modal = document.getElementById(targetModalId);
        if (modal) {
            modal.style.display = 'none';
        }
        
        // Remove from stack
        const index = this.modalStack.indexOf(targetModalId);
        if (index > -1) {
            this.modalStack.splice(index, 1);
        }
        
        // Restore body scroll if no modals are open
        if (this.modalStack.length === 0) {
            document.body.style.overflow = '';
            this.removeEscapeKeyListener();
        }
    }

    /**
     * Hide all modals
     */
    hideAllModals() {
        [...this.modalStack].forEach(modalId => {
            this.hideModal(modalId);
        });
    }

    /**
     * Add escape key listener for modals
     */
    addEscapeKeyListener() {
        if (this.escapeKeyListener) return;
        
        this.escapeKeyListener = (event) => {
            if (event.key === 'Escape') {
                this.hideModal();
            }
        };
        
        document.addEventListener('keydown', this.escapeKeyListener);
    }

    /**
     * Remove escape key listener
     */
    removeEscapeKeyListener() {
        if (this.escapeKeyListener) {
            document.removeEventListener('keydown', this.escapeKeyListener);
            this.escapeKeyListener = null;
        }
    }

    /**
     * Confirm dialog
     */
    confirm(message, title = 'Confirm') {
        return new Promise((resolve) => {
            const modal = this.createConfirmModal(message, title, resolve);
            document.body.appendChild(modal);
            this.showModal(modal.id);
        });
    }

    /**
     * Create confirm modal
     */
    createConfirmModal(message, title, callback) {
        const modalId = `confirm-modal-${this.generateId(8)}`;
        
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <span class="close" onclick="utils.hideModal('${modalId}')">&times;</span>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="utils.handleConfirm('${modalId}', false)">Cancel</button>
                    <button class="btn btn-danger" onclick="utils.handleConfirm('${modalId}', true)">Confirm</button>
                </div>
            </div>
        `;
        
        // Store callback
        modal._callback = callback;
        
        return modal;
    }

    /**
     * Handle confirm modal response
     */
    handleConfirm(modalId, result) {
        const modal = document.getElementById(modalId);
        if (modal && modal._callback) {
            modal._callback(result);
            this.hideModal(modalId);
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }
    }

    /**
     * Debounce function
     */
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    /**
     * Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Deep copy object
     */
    deepCopy(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepCopy(item));
        if (obj instanceof Object) {
            const copy = {};
            Object.keys(obj).forEach(key => {
                copy[key] = this.deepCopy(obj[key]);
            });
            return copy;
        }
    }

    /**
     * Sort array by multiple criteria
     */
    multiSort(array, sortBy) {
        return array.sort((a, b) => {
            for (const { key, order = 'asc' } of sortBy) {
                let aVal = this.getNestedValue(a, key);
                let bVal = this.getNestedValue(b, key);
                
                // Handle null/undefined values
                if (aVal == null && bVal == null) continue;
                if (aVal == null) return order === 'asc' ? 1 : -1;
                if (bVal == null) return order === 'asc' ? -1 : 1;
                
                // Convert to comparable values
                if (typeof aVal === 'string') aVal = aVal.toLowerCase();
                if (typeof bVal === 'string') bVal = bVal.toLowerCase();
                
                if (aVal !== bVal) {
                    const result = aVal > bVal ? 1 : -1;
                    return order === 'asc' ? result : -result;
                }
            }
            return 0;
        });
    }

    /**
     * Get nested object value by dot notation
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    /**
     * Set nested object value by dot notation
     */
    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((current, key) => {
            if (!(key in current)) current[key] = {};
            return current[key];
        }, obj);
        target[lastKey] = value;
    }

    /**
     * Filter array by multiple criteria
     */
    multiFilter(array, filters) {
        return array.filter(item => {
            return filters.every(filter => {
                const { key, value, operator = 'equals' } = filter;
                const itemValue = this.getNestedValue(item, key);
                
                switch (operator) {
                    case 'equals':
                        return itemValue === value;
                    case 'contains':
                        return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
                    case 'gt':
                        return parseFloat(itemValue) > parseFloat(value);
                    case 'lt':
                        return parseFloat(itemValue) < parseFloat(value);
                    case 'gte':
                        return parseFloat(itemValue) >= parseFloat(value);
                    case 'lte':
                        return parseFloat(itemValue) <= parseFloat(value);
                    case 'startsWith':
                        return String(itemValue).toLowerCase().startsWith(String(value).toLowerCase());
                    case 'endsWith':
                        return String(itemValue).toLowerCase().endsWith(String(value).toLowerCase());
                    default:
                        return true;
                }
            });
        });
    }

    /**
     * Format file size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Check if device is mobile
     */
    isMobile() {
        return window.innerWidth <= 768;
    }

    /**