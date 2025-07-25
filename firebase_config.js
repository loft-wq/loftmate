// Firebase Configuration and Initialization
// تكوين وتهيئة Firebase

// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    sendPasswordResetEmail, 
    updateProfile 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    collection, 
    query, 
    where, 
    getDocs,
    deleteDoc,
    orderBy,
    limit
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase configuration
// Replace these values with your actual Firebase config
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id-here",
    measurementId: "your-measurement-id" // Optional
};

// Initialize Firebase
let app;
let auth;
let db;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    console.log('🔥 Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    
    // Show user-friendly error message
    setTimeout(() => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'notification error';
        errorDiv.textContent = 'Firebase configuration error. Please check your settings.';
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }, 1000);
}

// Make Firebase services available globally
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;

// Export authentication functions
window.firebaseAuthFunctions = {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile
};

// Export Firestore functions
window.firebaseDbFunctions = {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
    orderBy,
    limit
};

// Firebase Security Rules Helper
class FirebaseSecurityHelper {
    
    // Check if user can access document
    static canAccessDocument(userId, documentUserId) {
        return userId === documentUserId;
    }
    
    // Validate data before saving
    static validatePigeonData(data) {
        const requiredFields = ['ringNumber', 'name', 'userId'];
        const errors = [];
        
        requiredFields.forEach(field => {
            if (!data[field] || data[field].toString().trim() === '') {
                errors.push(`${field} is required`);
            }
        });
        
        // Validate ring number format
        if (data.ringNumber && !/^\d{2}-\d{5}$/.test(data.ringNumber)) {
            errors.push('Ring number must be in format: XX-XXXXX');
        }
        
        // Validate year
        if (data.year && (data.year < 1900 || data.year > new Date().getFullYear() + 1)) {
            errors.push('Invalid year');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    // Sanitize user input
    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .trim()
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .substring(0, 500); // Limit length
    }
    
    // Rate limiting helper
    static rateLimiter = {
        requests: new Map(),
        
        canMakeRequest(userId, action, limitPerMinute = 10) {
            const key = `${userId}_${action}`;
            const now = Date.now();
            const minute = 60 * 1000;
            
            if (!this.requests.has(key)) {
                this.requests.set(key, []);
            }
            
            const userRequests = this.requests.get(key);
            
            // Remove old requests
            const validRequests = userRequests.filter(time => now - time < minute);
            this.requests.set(key, validRequests);
            
            if (validRequests.length >= limitPerMinute) {
                return false;
            }
            
            validRequests.push(now);
            return true;
        }
    };
}

// Export security helper
window.FirebaseSecurityHelper = FirebaseSecurityHelper;

// Connection status monitoring
class ConnectionMonitor {
    constructor() {
        this.isOnline = navigator.onLine;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.handleOnline();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.handleOffline();
        });
    }
    
    handleOnline() {
        console.log('🌐 Connection restored');
        
        // Show notification
        if (window.showNotification) {
            window.showNotification('Connection restored. Syncing data...', 'success');
        }
        
        // Trigger data sync if pigeon manager exists
        if (window.pigeonManager && window.pigeonManager.currentUser) {
            window.pigeonManager.syncDataAfterReconnection();
        }
    }
    
    handleOffline() {
        console.log('📡 Connection lost');
        
        // Show notification
        if (window.showNotification) {
            window.showNotification('You are offline. Changes will sync when connection is restored.', 'info');
        }
    }
    
    getStatus() {
        return this.isOnline;
    }
}

// Initialize connection monitor
const connectionMonitor = new ConnectionMonitor();
window.connectionMonitor = connectionMonitor;

// Firebase Error Handler
class FirebaseErrorHandler {
    
    static getErrorMessage(errorCode) {
        const errorMessages = {
            // Authentication errors
            'auth/user-not-found': 'No account found with this email address.',
            'auth/wrong-password': 'Incorrect password.',
            'auth/email-already-in-use': 'An account already exists with this email address.',
            'auth/weak-password': 'Password should be at least 6 characters.',
            'auth/invalid-email': 'Please enter a valid email address.',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
            'auth/user-disabled': 'This account has been disabled.',
            'auth/operation-not-allowed': 'This operation is not allowed.',
            'auth/invalid-credential': 'Invalid login credentials.',
            'auth/network-request-failed': 'Network error. Please check your connection.',
            'auth/requires-recent-login': 'Please sign in again to complete this action.',
            
            // Firestore errors
            'firestore/permission-denied': 'You do not have permission to access this data.',
            'firestore/unavailable': 'Firestore service is temporarily unavailable.',
            'firestore/deadline-exceeded': 'Request timeout. Please try again.',
            'firestore/resource-exhausted': 'Too many requests. Please try again later.',
            'firestore/failed-precondition': 'Operation failed due to invalid conditions.',
            'firestore/aborted': 'Operation was aborted. Please try again.',
            'firestore/out-of-range': 'Invalid data range.',
            'firestore/unimplemented': 'This operation is not supported.',
            'firestore/internal': 'Internal server error.',
            'firestore/data-loss': 'Data corruption detected.',
            
            // Custom errors
            'custom/rate-limit-exceeded': 'Too many requests. Please wait before trying again.',
            'custom/invalid-data': 'Invalid data format.',
            'custom/duplicate-entry': 'This entry already exists.',
        };
        
        return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
    }
    
    static handleError(error, context = '') {
        console.error(`Firebase Error ${context}:`, error);
        
        let errorMessage;
        
        if (error.code) {
            errorMessage = this.getErrorMessage(error.code);
        } else if (error.message) {
            errorMessage = error.message;
        } else {
            errorMessage = 'An unexpected error occurred.';
        }
        
        // Show user-friendly error message
        if (window.showNotification) {
            window.showNotification(errorMessage, 'error');
        }
        
        // Log to analytics if available
        if (window.gtag) {
            window.gtag('event', 'firebase_error', {
                error_code: error.code || 'unknown',
                error_message: error.message || 'unknown',
                context: context
            });
        }
        
        return errorMessage;
    }
}

// Export error handler
window.FirebaseErrorHandler = FirebaseErrorHandler;

// Performance monitoring
class FirebasePerformanceMonitor {
    constructor() {
        this.metrics = {
            authTime: [],
            firestoreReadTime: [],
            firestoreWriteTime: []
        };
    }
    
    startTimer(operation) {
        return {
            operation,
            startTime: performance.now(),
            end: () => {
                const endTime = performance.now();
                const duration = endTime - this.startTime;
                this.recordMetric(operation, duration);
                return duration;
            }
        };
    }
    
    recordMetric(operation, duration) {
        if (this.metrics[operation]) {
            this.metrics[operation].push(duration);
            
            // Keep only last 100 measurements
            if (this.metrics[operation].length > 100) {
                this.metrics[operation].shift();
            }
        }
        
        console.log(`⚡ ${operation}: ${duration.toFixed(2)}ms`);
    }
    
    getAverageTime(operation) {
        const times = this.metrics[operation];
        if (!times || times.length === 0) return 0;
        
        const sum = times.reduce((a, b) => a + b, 0);
        return sum / times.length;
    }
    
    getMetrics() {
        const metrics = {};
        
        Object.keys(this.metrics).forEach(operation => {
            metrics[operation] = {
                average: this.getAverageTime(operation),
                count: this.metrics[operation].length,
                latest: this.metrics[operation][this.metrics[operation].length - 1] || 0
            };
        });
        
        return metrics;
    }
}

// Initialize performance monitor
const performanceMonitor = new FirebasePerformanceMonitor();
window.performanceMonitor = performanceMonitor;

// Data backup and sync utilities
class DataSyncManager {
    constructor() {
        this.pendingOperations = [];
        this.isOnline = connectionMonitor.getStatus();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.processPendingOperations();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }
    
    // Add operation to pending queue if offline
    addPendingOperation(operation) {
        if (!this.isOnline) {
            this.pendingOperations.push({
                ...operation,
                timestamp: Date.now()
            });
            
            // Store in localStorage as backup
            try {
                localStorage.setItem('pendingOperations', JSON.stringify(this.pendingOperations));
            } catch (e) {
                console.warn('Could not save pending operations to localStorage');
            }
            
            return false; // Operation not executed
        }
        
        return true; // Operation can be executed
    }
    
    // Process pending operations when back online
    async processPendingOperations() {
        if (this.pendingOperations.length === 0) return;
        
        console.log(`🔄 Processing ${this.pendingOperations.length} pending operations`);
        
        const operations = [...this.pendingOperations];
        this.pendingOperations = [];
        
        for (const operation of operations) {
            try {
                await this.executeOperation(operation);
            } catch (error) {
                console.error('Failed to execute pending operation:', error);
                // Re-add to queue if it fails
                this.pendingOperations.push(operation);
            }
        }
        
        // Update localStorage
        try {
            localStorage.setItem('pendingOperations', JSON.stringify(this.pendingOperations));
        } catch (e) {
            console.warn('Could not update pending operations in localStorage');
        }
        
        if (window.showNotification) {
            window.showNotification(`Synced ${operations.length - this.pendingOperations.length} operations`, 'success');
        }
    }
    
    async executeOperation(operation) {
        const timer = performanceMonitor.startTimer('firestoreWriteTime');
        
        try {
            switch (operation.type) {
                case 'create':
                    await setDoc(doc(db, operation.collection, operation.id), operation.data);
                    break;
                case 'update':
                    await updateDoc(doc(db, operation.collection, operation.id), operation.data);
                    break;
                case 'delete':
                    await deleteDoc(doc(db, operation.collection, operation.id));
                    break;
                default:
                    throw new Error(`Unknown operation type: ${operation.type}`);
            }
        } finally {
            timer.end();
        }
    }
    
    // Load pending operations from localStorage on startup
    loadPendingOperations() {
        try {
            const stored = localStorage.getItem('pendingOperations');
            if (stored) {
                this.pendingOperations = JSON.parse(stored);
                console.log(`📋 Loaded ${this.pendingOperations.length} pending operations from storage`);
            }
        } catch (e) {
            console.warn('Could not load pending operations from localStorage');
            this.pendingOperations = [];
        }
    }
}

// Initialize data sync manager
const dataSyncManager = new DataSyncManager();
window.dataSyncManager = dataSyncManager;

// Load pending operations on startup
dataSyncManager.loadPendingOperations();

// Auto-process pending operations when online
if (connectionMonitor.getStatus()) {
    setTimeout(() => {
        dataSyncManager.processPendingOperations();
    }, 2000);
}

// Firebase Analytics Helper (optional)
class FirebaseAnalytics {
    static logEvent(eventName, parameters = {}) {
        try {
            if (window.gtag) {
                window.gtag('event', eventName, {
                    ...parameters,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            console.warn('Analytics event failed:', error);
        }
    }
    
    static logUserAction(action, details = {}) {
        this.logEvent('user_action', {
            action: action,
            ...details
        });
    }
    
    static logPerformance(metric, value) {
        this.logEvent('performance_metric', {
            metric: metric,
            value: value,
            user_agent: navigator.userAgent
        });
    }
}

// Export analytics helper
window.FirebaseAnalytics = FirebaseAnalytics;

// Configuration validation
function validateFirebaseConfig() {
    const requiredFields = ['apiKey', 'authDomain', 'projectId'];
    const missingFields = [];
    
    requiredFields.forEach(field => {
        if (!firebaseConfig[field] || firebaseConfig[field].includes('your-')) {
            missingFields.push(field);
        }
    });
    
    if (missingFields.length > 0) {
        console.warn('⚠️ Firebase configuration incomplete. Missing or placeholder values for:', missingFields);
        
        // Show setup instructions
        setTimeout(() => {
            if (window.showNotification) {
                window.showNotification('Firebase setup required. Check console for details.', 'info');
            }
        }, 1000);
        
        return false;
    }
    
    return true;
}

// Run configuration validation
const isConfigValid = validateFirebaseConfig();

// Export configuration status
window.firebaseConfigStatus = {
    isValid: isConfigValid,
    config: firebaseConfig
};

// Development helpers
if (process?.env?.NODE_ENV === 'development') {
    // Enable Firebase debugging
    window.firebaseDebug = {
        auth,
        db,
        performanceMonitor,
        dataSyncManager,
        connectionMonitor
    };
    
    console.log('🔧 Firebase debug mode enabled');
    console.log('Available debug tools:', Object.keys(window.firebaseDebug));
}

// Export main Firebase objects for backward compatibility
export { app, auth, db };

console.log('✅ Firebase configuration loaded successfully');
console.log(`📊 Performance monitoring: ${performanceMonitor ? 'Enabled' : 'Disabled'}`);
console.log(`🔄 Data sync manager: ${dataSyncManager ? 'Enabled' : 'Disabled'}`);
console.log(`🌐 Connection monitoring: ${connectionMonitor ? 'Enabled' : 'Disabled'}`);
