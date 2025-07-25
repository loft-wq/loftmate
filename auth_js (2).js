/**
 * Authentication Module for Racing Pigeon Manager
 * Handles user authentication, registration, and session management
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.userDoc = null;
        this.authStateListeners = [];
        this.initialized = false;
    }

    /**
     * Initialize Firebase authentication
     */
    async initialize() {
        if (this.initialized) return;
        
        await this.waitForFirebase();
        this.setupAuthStateListener();
        this.initialized = true;
        console.log('🔐 Authentication module initialized');
    }

    /**
     * Wait for Firebase to be loaded
     */
    waitForFirebase() {
        return new Promise((resolve) => {
            const checkFirebase = () => {
                if (window.firebaseAuth && window.firebaseDb && window.firebaseAuthFunctions) {
                    resolve();
                } else {
                    setTimeout(checkFirebase, 100);
                }
            };
            checkFirebase();
        });
    }

    /**
     * Setup authentication state listener
     */
    setupAuthStateListener() {
        window.firebaseAuthFunctions.onAuthStateChanged(window.firebaseAuth, async (user) => {
            if (user) {
                await this.handleAuthSuccess(user);
            } else {
                this.handleAuthLogout();
            }
            
            // Notify all listeners
            this.authStateListeners.forEach(listener => listener(user));
        });
    }

    /**
     * Add authentication state listener
     */
    onAuthStateChanged(callback) {
        this.authStateListeners.push(callback);
        
        // Return unsubscribe function
        return () => {
            const index = this.authStateListeners.indexOf(callback);
            if (index > -1) {
                this.authStateListeners.splice(index, 1);
            }
        };
    }

    /**
     * Sign in with email and password
     */
    async signIn(email, password) {
        try {
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            const userCredential = await window.firebaseAuthFunctions.signInWithEmailAndPassword(
                window.firebaseAuth, email, password
            );
            
            return {
                success: true,
                user: userCredential.user,
                message: 'Successfully signed in!'
            };
        } catch (error) {
            console.error('Sign in error:', error);
            return {
                success: false,
                error: error.code,
                message: this.getErrorMessage(error.code)
            };
        }
    }

    /**
     * Register new user
     */
    async register(name, email, password, confirmPassword) {
        try {
            // Validation
            if (!name || !email || !password || !confirmPassword) {
                throw new Error('All fields are required');
            }

            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            // Create user account
            const userCredential = await window.firebaseAuthFunctions.createUserWithEmailAndPassword(
                window.firebaseAuth, email, password
            );

            // Update user profile
            await window.firebaseAuthFunctions.updateProfile(userCredential.user, {
                displayName: name
            });

            // Create user document in Firestore
            await this.createUserDocument(userCredential.user, name);

            return {
                success: true,
                user: userCredential.user,
                message: 'Account created successfully!'
            };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: error.code,
                message: this.getErrorMessage(error.code)
            };
        }
    }

    /**
     * Send password reset email
     */
    async resetPassword(email) {
        try {
            if (!email) {
                throw new Error('Email address is required');
            }

            await window.firebaseAuthFunctions.sendPasswordResetEmail(window.firebaseAuth, email);
            
            return {
                success: true,
                message: 'Password reset email sent! Check your inbox.'
            };
        } catch (error) {
            console.error('Password reset error:', error);
            return {
                success: false,
                error: error.code,
                message: this.getErrorMessage(error.code)
            };
        }
    }

    /**
     * Sign out current user
     */
    async signOut() {
        try {
            await window.firebaseAuthFunctions.signOut(window.firebaseAuth);
            return {
                success: true,
                message: 'Successfully signed out'
            };
        } catch (error) {
            console.error('Sign out error:', error);
            return {
                success: false,
                error: error.code,
                message: 'Error signing out'
            };
        }
    }

    /**
     * Handle successful authentication
     */
    async handleAuthSuccess(user) {
        this.currentUser = user;
        
        try {
            // Load user data from Firestore
            const docRef = window.firebaseDbFunctions.doc(window.firebaseDb, 'users', user.uid);
            const docSnap = await window.firebaseDbFunctions.getDoc(docRef);
            
            if (docSnap.exists()) {
                this.userDoc = docSnap.data();
            } else {
                // Create user document if it doesn't exist
                await this.createUserDocument(user);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            throw error;
        }
    }

    /**
     * Handle user logout
     */
    handleAuthLogout() {
        this.currentUser = null;
        this.userDoc = null;
    }

    /**
     * Create user document in Firestore
     */
    async createUserDocument(user, displayName = null) {
        const userData = {
            name: displayName || user.displayName || user.email.split('@')[0],
            email: user.email,
            uid: user.uid,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            pigeons: [],
            raceResults: [],
            settings: {
                theme: 'light',
                notifications: true,
                language: 'en'
            },
            statistics: {
                totalPigeons: 0,
                totalRaces: 0,
                wins: 0,
                avgPosition: 0
            }
        };

        await window.firebaseDbFunctions.setDoc(
            window.firebaseDbFunctions.doc(window.firebaseDb, 'users', user.uid),
            userData
        );

        this.userDoc = userData;
    }

    /**
     * Update user profile
     */
    async updateProfile(updates) {
        try {
            if (!this.currentUser) {
                throw new Error('No user signed in');
            }

            // Update Firebase Auth profile
            if (updates.displayName) {
                await window.firebaseAuthFunctions.updateProfile(this.currentUser, {
                    displayName: updates.displayName
                });
            }

            // Update Firestore document
            const docRef = window.firebaseDbFunctions.doc(window.firebaseDb, 'users', this.currentUser.uid);
            await window.firebaseDbFunctions.updateDoc(docRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            });

            // Update local userDoc
            this.userDoc = { ...this.userDoc, ...updates };

            return {
                success: true,
                message: 'Profile updated successfully'
            };
        } catch (error) {
            console.error('Error updating profile:', error);
            return {
                success: false,
                error: error.code,
                message: 'Error updating profile'
            };
        }
    }

    /**
     * Save user data to Firestore
     */
    async saveUserData(data = null) {
        try {
            if (!this.currentUser) {
                throw new Error('No user signed in');
            }

            const dataToSave = data || this.userDoc;
            const docRef = window.firebaseDbFunctions.doc(window.firebaseDb, 'users', this.currentUser.uid);
            
            await window.firebaseDbFunctions.updateDoc(docRef, {
                ...dataToSave,
                lastUpdated: new Date().toISOString()
            });

            if (!data) {
                this.userDoc.lastUpdated = new Date().toISOString();
            }

            return true;
        } catch (error) {
            console.error('Error saving user data:', error);
            return false;
        }
    }

    /**
     * Load user data from Firestore
     */
    async loadUserData() {
        try {
            if (!this.currentUser) {
                return false;
            }

            const docRef = window.firebaseDbFunctions.doc(window.firebaseDb, 'users', this.currentUser.uid);
            const docSnap = await window.firebaseDbFunctions.getDoc(docRef);
            
            if (docSnap.exists()) {
                this.userDoc = docSnap.data();
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error loading user data:', error);
            return false;
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.currentUser;
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Get user document
     */
    getUserDoc() {
        return this.userDoc;
    }

    /**
     * Require authentication - throws error if not authenticated
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            throw new Error('Authentication required');
        }
        return true;
    }

    /**
     * Get user display name
     */
    getUserDisplayName() {
        if (!this.currentUser) return '';
        
        return this.userDoc?.name || 
               this.currentUser.displayName || 
               this.currentUser.email.split('@')[0];
    }

    /**
     * Get user avatar initials
     */
    getUserAvatar() {
        const name = this.getUserDisplayName();
        return name.charAt(0).toUpperCase();
    }

    /**
     * Convert Firebase error codes to user-friendly messages
     */
    getErrorMessage(errorCode) {
        const errorMessages = {
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
            'auth/popup-closed-by-user': 'Authentication popup was closed.',
            'auth/cancelled-popup-request': 'Authentication was cancelled.',
            'auth/popup-blocked': 'Authentication popup was blocked by the browser.'
        };
        
        return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
    }

    /**
     * Update last login timestamp
     */
    async updateLastLogin() {
        if (this.currentUser && this.userDoc) {
            this.userDoc.lastLoginAt = new Date().toISOString();
            await this.saveUserData();
        }
    }

    /**
     * Delete user account and all associated data
     */
    async deleteAccount() {
        try {
            if (!this.currentUser) {
                throw new Error('No user signed in');
            }

            // Delete user document from Firestore
            const docRef = window.firebaseDbFunctions.doc(window.firebaseDb, 'users', this.currentUser.uid);
            await window.firebaseDbFunctions.deleteDoc(docRef);

            // Delete Firebase Auth account
            await this.currentUser.delete();

            return {
                success: true,
                message: 'Account deleted successfully'
            };
        } catch (error) {
            console.error('Error deleting account:', error);
            return {
                success: false,
                error: error.code,
                message: 'Error deleting account'
            };
        }
    }

    /**
     * Export user data
     */
    exportUserData() {
        if (!this.isAuthenticated()) {
            throw new Error('Authentication required');
        }

        return {
            user: {
                name: this.userDoc?.name,
                email: this.currentUser.email,
                uid: this.currentUser.uid
            },
            data: this.userDoc,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    /**
     * Start auto-save interval
     */
    startAutoSave(intervalMs = 300000) { // 5 minutes default
        this.autoSaveInterval = setInterval(async () => {
            if (this.isAuthenticated() && this.userDoc) {
                await this.saveUserData();
                console.log('Auto-save completed');
            }
        }, intervalMs);
    }

    /**
     * Stop auto-save interval
     */
    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }

    /**
     * Handle browser beforeunload event
     */
    handleBeforeUnload() {
        if (this.isAuthenticated() && this.userDoc) {
            // Note: This is synchronous and may not complete
            navigator.sendBeacon('/api/save-data', JSON.stringify(this.userDoc));
        }
    }
}

// Create and export singleton instance
const authManager = new AuthManager();

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        authManager.initialize();
    });
} else {
    authManager.initialize();
}

// Export for use in other modules
window.AuthManager = authManager;

export default authManager;