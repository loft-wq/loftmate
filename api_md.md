# Racing Pigeon Manager - API Documentation

## 📋 Overview

This document describes the JavaScript API and methods available in the Racing Pigeon Manager application. The application is built with a modular architecture consisting of three main modules: Authentication, Pigeon Management, and Utilities.

## 🔐 Authentication API (`auth.js`)

### AuthManager Class

The `AuthManager` class handles all authentication-related operations.

#### Initialization

```javascript
// The AuthManager is automatically initialized
const authManager = window.AuthManager;

// Manual initialization (if needed)
await authManager.initialize();
```

#### Methods

##### `signIn(email, password)`
Sign in a user with email and password.

```javascript
const result = await authManager.signIn('user@example.com', 'password123');

// Response format
{
  success: true|false,
  user: FirebaseUser|null,
  message: "Success/error message",
  error: "error_code" // Only present if success is false
}
```

##### `register(name, email, password, confirmPassword)`
Register a new user account.

```javascript
const result = await authManager.register(
  'John Doe',
  'john@example.com', 
  'password123',
  'password123'
);

// Response format
{
  success: true|false,
  user: FirebaseUser|null,
  message: "Success/error message",
  error: "error_code" // Only present if success is false
}
```

##### `resetPassword(email)`
Send password reset email.

```javascript
const result = await authManager.resetPassword('user@example.com');

// Response format
{
  success: true|false,
  message: "Success/error message",
  error: "error_code" // Only present if success is false
}
```

##### `signOut()`
Sign out the current user.

```javascript
const result = await authManager.signOut();
```

##### `onAuthStateChanged(callback)`
Listen for authentication state changes.

```javascript
const unsubscribe = authManager.onAuthStateChanged((user) => {
  if (user) {
    console.log('User signed in:', user.email);
  } else {
    console.log('User signed out');
  }
});

// Unsubscribe when no longer needed
unsubscribe();
```

##### `getCurrentUser()`
Get the currently authenticated user.

```javascript
const user = authManager.getCurrentUser();
// Returns Firebase User object or null
```

##### `getUserDoc()`
Get the current user's document data.

```javascript
const userDoc = authManager.getUserDoc();
// Returns user document object or null
```

##### `isAuthenticated()`
Check if user is currently authenticated.

```javascript
const isAuth = authManager.isAuthenticated();
// Returns boolean
```

##### `requireAuth()`
Throws error if user is not authenticated.

```javascript
try {
  authManager.requireAuth();
  // User is authenticated, proceed
} catch (error) {
  // User not authenticated
}
```

##### `saveUserData(data)`
Save user data to Firestore.

```javascript
const success = await authManager.saveUserData({
  pigeons: [...],
  raceResults: [...]
});
// Returns boolean
```

##### `updateProfile(updates)`
Update user profile information.

```javascript
const result = await authManager.updateProfile({
  name: 'New Name',
  settings: { theme: 'dark' }
});
```

## 🐦 Pigeon Management API (`pigeon-manager.js`)

### PigeonManager Class

The `PigeonManager` class handles all pigeon and race result operations.

```javascript
// Access the global instance
const pigeonManager = window.PigeonManager;
```

#### Pigeon Operations

##### `addPigeon(pigeonData)`
Add a new pigeon to the collection.

```javascript
const pigeonData = {
  ring: 'GB24-A12345',
  name: 'Lightning',
  gender: 'Cock',
  color: 'Blue',
  year: 2024,
  sire: 'Champion Blue', // optional
  dam: 'Swift Queen',    // optional
  notes: 'Excellent bloodline' // optional
};

const result = await pigeonManager.addPigeon(pigeonData);

// Response format
{
  success: true|false,
  pigeon: PigeonObject|null,
  message: "Success/error message"
}
```

##### `updatePigeon(pigeonId, updates)`
Update an existing pigeon.

```javascript
const result = await pigeonManager.updatePigeon('pigeon123', {
  name: 'New Name',
  status: 'retired',
  notes: 'Updated notes'
});
```

##### `deletePigeon(pigeonId)`
Delete a pigeon and all associated race results.

```javascript
const result = await pigeonManager.deletePigeon('pigeon123');
```

##### `getPigeon(pigeonId)`
Get a pigeon by ID.

```javascript
const pigeon = pigeonManager.getPigeon('pigeon123');
// Returns pigeon object or undefined
```

##### `getPigeonByRing(ring)`
Get a pigeon by ring number.

```javascript
const pigeon = pigeonManager.getPigeonByRing('GB24-A12345');
// Returns pigeon object or undefined
```

#### Race Result Operations

##### `addRaceResult(raceData)`
Add a race result for a pigeon.

```javascript
const raceData = {
  pigeonId: 'pigeon123',
  raceName: 'Spring Classic 2024',
  raceDate: '2024-04-15',
  distance: '500', // kilometers
  position: 1,
  timeFlown: '8:45:30', // HH:MM:SS format
  totalBirds: 450, // optional
  weather: 'Clear, 15°C', // optional
  notes: 'Excellent performance' // optional
};

const result = await pigeonManager.addRaceResult(raceData);

// Response format
{
  success: true|false,
  result: RaceResultObject|null,
  message: "Success/error message"
}
```

##### `getPigeonRaces(pigeonId)`
Get all race results for a specific pigeon.

```javascript
const races = pigeonManager.getPigeonRaces('pigeon123');
// Returns array of race result objects
```

#### Filtering and Searching

##### `setFilters(filters)`
Set filters for pigeon display.

```javascript
pigeonManager.setFilters({
  gender: 'Cock', // 'all', 'Cock', 'Hen'
  year: '2024',   // 'all' or specific year
  status: 'active', // 'all', 'active', 'retired'
  search: 'lightning' // search term
});
```

##### `setSorting(sortBy, sortOrder)`
Set sorting criteria.

```javascript
pigeonManager.setSorting('name', 'asc');
// sortBy: 'ring', 'name', 'year', 'totalRaces', 'wins'
// sortOrder: 'asc', 'desc'
```

##### `getFilteredPigeons()`
Get filtered and sorted pigeons.

```javascript
const filteredPigeons = pigeonManager.getFilteredPigeons();
// Returns array of pigeon objects
```

##### `searchPigeons(searchTerm)`
Search pigeons by various criteria.

```javascript
const results = pigeonManager.searchPigeons('lightning');
// Searches ring, name, color, sire, dam fields
```

#### Statistics

##### `getStatistics()`
Get comprehensive statistics.

```javascript
const stats = pigeonManager.getStatistics();

// Returns object:
{
  total: 25,        // Total pigeons
  males: 15,        // Male pigeons  
  females: 10,      // Female pigeons
  young: 8,         // Current year birds
  active: 20,       // Active birds
  retired: 5,       // Retired birds
  totalRaces: 150,  // Total race entries
  wins: 35,         // Total wins
  winRate: 23       // Overall win percentage
}
```

##### `getTopPerformers(limit)`
Get top performing pigeons.

```javascript
const topPerformers = pigeonManager.getTopPerformers(10);
// Returns array of pigeon objects sorted by win rate
```

##### `getRecentRaces(limit)`
Get recent race results.

```javascript
const recentRaces = pigeonManager.getRecentRaces(10);
// Returns array of recent race results with pigeon info
```

#### Data Management

##### `exportData()`
Export all pigeon data.

```javascript
const result = pigeonManager.exportData();
// Downloads JSON file with all data
```

##### `importData(file)`
Import pigeon data from file.

```javascript
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];
const result = await pigeonManager.importData(file);
```

##### `backupData()`
Create a backup of current data.

```javascript
const result = await pigeonManager.backupData();
// Stores backup in user document
```

##### `restoreFromBackup(backupIndex)`
Restore data from a backup.

```javascript
const result = await pigeonManager.restoreFromBackup(0);
// Restores from the most recent backup
```

#### Breeding Management

##### `addBreedingRecord(pairData)`
Add a breeding record.

```javascript
const pairData = {
  sireId: 'pigeon123',
  damId: 'pigeon456',
  pairingDate: '2024-02-01',
  expectedHatchDate: '2024-02-19',
  notes: 'Excellent pairing'
};

const result = await pigeonManager.addBreedingRecord(pairData);
```

##### `getBreedingPairs()`
Get available breeding pairs.

```javascript
const { males, females } = pigeonManager.getBreedingPairs();
// Returns active male and female pigeons
```

#### Utility Methods

##### `calculateSpeed(distance, timeFlown)`
Calculate flight speed.

```javascript
const speed = pigeonManager.calculateSpeed('500', '8:45:30');
// Returns speed in meters per minute
```

##### `generateReport(type)`
Generate performance report.

```javascript
const report = pigeonManager.generateReport('summary');
// Returns comprehensive report object
```

## 🛠️ Utilities API (`utils.js`)

### Utils Class

The `Utils` class provides common utility functions.

```javascript
// Access the global instance
const utils = window.utils;
```

#### Notifications

##### `showNotification(message, type, duration)`
Display notification to user.

```javascript
utils.showNotification('Pigeon added successfully!', 'success', 4000);
// Types: 'success', 'error', 'info', 'warning'
```

##### `hideNotification(notification)`
Hide specific notification.

```javascript
const notification = utils.showNotification('Message', 'info');
utils.hideNotification(notification);
```

##### `hideNotifications(type)`
Hide all notifications or specific type.

```javascript
utils.hideNotifications('error'); // Hide all error notifications
utils.hideNotifications(); // Hide all notifications
```

#### Modal Management

##### `showModal(modalId)`
Show a modal dialog.

```javascript
utils.showModal('editPigeonModal');
```

##### `hideModal(modalId)`
Hide a modal dialog.

```javascript
utils.hideModal('editPigeonModal');
```

##### `confirm(message, title)`
Show confirmation dialog.

```javascript
const confirmed = await utils.confirm('Delete this pigeon?', 'Confirm Delete');
if (confirmed) {
  // User confirmed
}
```

#### Loading States

##### `setLoading(elementId, isLoading, loadingText)`
Show/hide loading state on elements.

```javascript
utils.setLoading('submitBtn', true, 'Saving...');
// Later...
utils.setLoading('submitBtn', false);
```

#### Data Formatting

##### `formatDate(date, format)`
Format dates for display.

```javascript
const formatted = utils.formatDate('2024-01-15', 'long');
// Formats: 'short', 'long', 'time'
```

##### `formatTime(timeString)`
Format time duration.

```javascript
const formatted = utils.formatTime('8:45:30');
// Returns formatted time string
```

##### `formatDistance(distance, unit)`
Format distance with units.

```javascript
const formatted = utils.formatDistance(500, 'km');
// Returns "500 km"
```

##### `formatSpeed(speed, unit)`
Format speed with units.

```javascript
const formatted = utils.formatSpeed(1200, 'm/min');
// Returns "1,200 m/min"
```

##### `formatNumber(number, options)`
Format numbers with locale settings.

```javascript
const formatted = utils.formatNumber(1234.56, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
// Returns "1,234.56"
```

#### Validation

##### `validateEmail(email)`
Validate email address format.

```javascript
const isValid = utils.validateEmail('user@example.com');
// Returns boolean
```

##### `validateRing(ring)`
Validate ring number format.

```javascript
const isValid = utils.validateRing('GB24-A12345');
// Returns boolean
```

##### `validateRequired(data, requiredFields)`
Validate required fields.

```javascript
const errors = utils.validateRequired(
  { name: 'Lightning', ring: '' },
  ['name', 'ring', 'gender']
);
// Returns array of error messages
```

##### `validateForm(formData, validationRules)`
Comprehensive form validation.

```javascript
const validationRules = {
  email: [
    { type: 'required', message: 'Email is required' },
    { type: 'email', message: 'Invalid email format' }
  ],
  password: [
    { type: 'required' },
    { type: 'minLength', value: 6 }
  ]
};

const { isValid, errors } = utils.validateForm(formData, validationRules);
```

#### File Operations

##### `downloadFile(data, filename, type)`
Download data as file.

```javascript
utils.downloadFile(
  JSON.stringify(data, null, 2),
  'pigeons.json',
  'application/json'
);
```

##### `readFileAsText(file)`
Read file contents as text.

```javascript
const content = await utils.readFileAsText(file);
```

##### `copyToClipboard(text)`
Copy text to clipboard.

```javascript
const success = await utils.copyToClipboard('Text to copy');
```

#### Data Manipulation

##### `deepCopy(obj)`
Create deep copy of object.

```javascript
const copy = utils.deepCopy(originalObject);
```

##### `multiSort(array, sortBy)`
Sort array by multiple criteria.

```javascript
const sorted = utils.multiSort(pigeons, [
  { key: 'year', order: 'desc' },
  { key: 'name', order: 'asc' }
]);
```

##### `multiFilter(array, filters)`
Filter array by multiple criteria.

```javascript
const filtered = utils.multiFilter(pigeons, [
  { key: 'gender', value: 'Cock', operator: 'equals' },
  { key: 'name', value: 'light', operator: 'contains' }
]);
```

##### `getNestedValue(obj, path)`
Get nested object value by dot notation.

```javascript
const value = utils.getNestedValue(pigeon, 'breeding.pairings.length');
```

##### `setNestedValue(obj, path, value)`
Set nested object value by dot notation.

```javascript
utils.setNestedValue(pigeon, 'breeding.status', 'active');
```

#### Theme Management

##### `toggleTheme()`
Toggle between light and dark themes.

```javascript
const newTheme = utils.toggleTheme();
// Returns 'light' or 'dark'
```

##### `setTheme(theme)`
Set specific theme.

```javascript
utils.setTheme('dark');
```

##### `getTheme()`
Get current theme.

```javascript
const theme = utils.getTheme();
// Returns 'light' or 'dark'
```

#### Storage Operations

##### `saveToStorage(key, data)`
Save data to localStorage.

```javascript
const success = utils.saveToStorage('preferences', { theme: 'dark' });
```

##### `getFromStorage(key, defaultValue)`
Get data from localStorage.

```javascript
const preferences = utils.getFromStorage('preferences', {});
```

##### `removeFromStorage(key)`
Remove data from localStorage.

```javascript
utils.removeFromStorage('preferences');
```

#### Utility Functions

##### `generateId(length)`
Generate unique ID.

```javascript
const id = utils.generateId(12);
// Returns random string of specified length
```

##### `debounce(func, wait, immediate)`
Debounce function calls.

```javascript
const debouncedSearch = utils.debounce((term) => {
  // Search logic
}, 300);
```

##### `throttle(func, limit)`
Throttle function calls.

```javascript
const throttledScroll = utils.throttle(() => {
  // Scroll handler
}, 100);
```

##### `isMobile()`
Check if device is mobile.

```javascript
const isMobile = utils.isMobile();
// Returns boolean
```

##### `formatFileSize(bytes)`
Format file size for display.

```javascript
const size = utils.formatFileSize(1024000);
// Returns "1000 KB"
```

## 🔄 Data Structures

### Pigeon Object
```javascript
{
  id: "unique_pigeon_id",
  ring: "GB24-A12345",
  name: "Lightning",
  gender: "Cock|Hen",
  color: "Blue",
  year: 2024,
  sire: "Champion Blue",
  dam: "Swift Queen",
  notes: "Additional notes",
  status: "active|retired",
  addedDate: "2024-01-15T10:30:00.000Z",
  lastUpdated: "2024-01-15T10:30:00.000Z",
  totalRaces: 15,
  wins: 5,
  avgPosition: 8.2,
  totalDistance: 7500,
  bestTime: "8:45:30",
  breeding: {
    offspring: ["child_id_1", "child_id_2"],
    pairings: ["pairing_id_1", "pairing_id_2"]
  },
  health: {
    vaccinations: [],
    treatments: [],
    notes: ""
  }
}
```

### Race Result Object
```javascript
{
  id: "unique_race_id",
  pigeonId: "pigeon_id",
  raceName: "Spring Classic 2024",
  raceDate: "2024-04-15",
  distance: "500",
  position: 1,
  timeFlown: "8:45:30",
  totalBirds: 450,
  weather: "Clear, 15°C",
  notes: "Excellent performance",
  speed: 1142,
  addedDate: "2024-04-15T15:30:00.000Z"
}
```

### User Document Structure
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  uid: "firebase_user_id",
  createdAt: "2024-01-01T00:00:00.000Z",
  lastLoginAt: "2024-01-15T10:00:00.000Z",
  pigeons: [/* array of pigeon objects */],
  raceResults: [/* array of race result objects */],
  breedingRecords: [/* array of breeding records */],
  settings: {
    theme: "light|dark",
    notifications: true,
    language: "en"
  },
  statistics: {
    totalPigeons: 25,
    totalRaces: 150,
    wins: 35,
    avgPosition: 8.5
  },
  backups: [/* array of backup objects */]
}
```

## 🔧 Configuration

### Firebase Configuration
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### Validation Rules Example
```javascript
const pigeonValidationRules = {
  ring: [
    { type: 'required' },
    { type: 'pattern', value: /^[A-Z]{2}\d{2}-[A-Z]\d{5}$/ }
  ],
  name: [
    { type: 'required' },
    { type: 'minLength', value: 2 },
    { type: 'maxLength', value: 50 }
  ],
  gender: [
    { type: 'required' },
    { type: 'custom', validator: (value) => ['Cock', 'Hen'].includes(value) }
  ],
  year: [
    { type: 'required' },
    { type: 'min', value: 1950 },
    { type: 'max', value: new Date().getFullYear() }
  ]
};
```

## 🚨 Error Handling

### Common Error Patterns
```javascript
try {
  const result = await pigeonManager.addPigeon(pigeonData);
  if (result.success) {
    utils.showNotification(result.message, 'success');
  } else {
    utils.showNotification(result.message, 'error');
  }
} catch (error) {
  console.error('Unexpected error:', error);
  utils.showNotification('An unexpected error occurred', 'error');
}
```

### Authentication Errors
```javascript
const errorMessages = {
  'auth/user-not-found': 'No account found with this email',
  'auth/wrong-password': 'Incorrect password',
  'auth/email-already-in-use': 'Email already registered',
  'auth/weak-password': 'Password too weak',
  'auth/invalid-email': 'Invalid email format'
};
```

## 📚 Examples

### Complete Pigeon Addition
```javascript
async function addNewPigeon() {
  try {
    // Validate user is authenticated
    authManager.requireAuth();
    
    // Get form data
    const formData = utils.getFormData('addPigeonForm');
    
    // Validate form
    const { isValid, errors } = utils.validateForm(formData, pigeonValidationRules);
    
    if (!isValid) {
      utils.showFormErrors('addPigeonForm', errors);
      return;
    }
    
    // Show loading state
    utils.setLoading('addPigeonBtn', true, 'Adding pigeon...');
    
    // Add pigeon
    const result = await pigeonManager.addPigeon(formData);
    
    if (result.success) {
      utils.showNotification('Pigeon added successfully!', 'success');
    if (result.success) {
      utils.showNotification('Pigeon added successfully!', 'success');
      utils.clearForm('addPigeonForm');
      utils.hideModal('addPigeonModal');
    } else {
      utils.showNotification(result.message, 'error');
    }
    
  } catch (error) {
    console.error('Error adding pigeon:', error);
    utils.showNotification('Failed to add pigeon', 'error');
  } finally {
    utils.setLoading('addPigeonBtn', false);
  }
}
```

### Race Result with Validation
```javascript
async function addRaceResult() {
  try {
    const raceData = {
      pigeonId: document.getElementById('pigeonSelect').value,
      raceName: document.getElementById('raceName').value,
      raceDate: document.getElementById('raceDate').value,
      distance: document.getElementById('distance').value,
      position: parseInt(document.getElementById('position').value),
      timeFlown: document.getElementById('timeFlown').value
    };
    
    // Validate required fields
    const errors = utils.validateRequired(raceData, [
      'pigeonId', 'raceName', 'raceDate', 'distance', 'position', 'timeFlown'
    ]);
    
    if (errors.length > 0) {
      utils.showNotification(errors[0], 'error');
      return;
    }
    
    const result = await pigeonManager.addRaceResult(raceData);
    
    if (result.success) {
      utils.showNotification('Race result added!', 'success');
      pigeonManager.updateStatistics();
    } else {
      utils.showNotification(result.message, 'error');
    }
    
  } catch (error) {
    utils.showNotification('Error adding race result', 'error');
  }
}
```

### Search and Filter Implementation
```javascript
function setupSearchAndFilters() {
  // Search input
  const searchInput = document.getElementById('searchInput');
  const debouncedSearch = utils.debounce((term) => {
    pigeonManager.setFilters({ search: term });
  }, 300);
  
  searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
  });
  
  // Gender filter
  document.getElementById('genderFilter').addEventListener('change', (e) => {
    pigeonManager.setFilters({ gender: e.target.value });
  });
  
  // Year filter
  document.getElementById('yearFilter').addEventListener('change', (e) => {
    pigeonManager.setFilters({ year: e.target.value });
  });
  
  // Sort options
  document.getElementById('sortBy').addEventListener('change', (e) => {
    const [field, order] = e.target.value.split('-');
    pigeonManager.setSorting(field, order);
  });
}
```

### Data Export with Progress
```javascript
async function exportAllData() {
  try {
    utils.setLoading('exportBtn', true, 'Preparing export...');
    
    // Get all data
    const userData = authManager.getUserDoc();
    const statistics = pigeonManager.getStatistics();
    
    const exportData = {
      user: {
        name: userData.name,
        email: authManager.getCurrentUser().email,
        exportDate: new Date().toISOString()
      },
      pigeons: userData.pigeons || [],
      raceResults: userData.raceResults || [],
      statistics: statistics,
      version: '1.0'
    };
    
    // Generate filename
    const date = new Date().toISOString().split('T')[0];
    const filename = `pigeon-data-${date}.json`;
    
    // Download file
    utils.downloadFile(
      JSON.stringify(exportData, null, 2),
      filename,
      'application/json'
    );
    
    utils.showNotification('Data exported successfully!', 'success');
    
  } catch (error) {
    console.error('Export error:', error);
    utils.showNotification('Export failed', 'error');
  } finally {
    utils.setLoading('exportBtn', false);
  }
}
```

### Breeding Management Example
```javascript
async function setupBreedingPair() {
  try {
    const { males, females } = pigeonManager.getBreedingPairs();
    
    // Populate dropdowns
    const sireSelect = document.getElementById('sireSelect');
    const damSelect = document.getElementById('damSelect');
    
    sireSelect.innerHTML = males.map(pigeon => 
      `<option value="${pigeon.id}">${pigeon.ring} - ${pigeon.name}</option>`
    ).join('');
    
    damSelect.innerHTML = females.map(pigeon => 
      `<option value="${pigeon.id}">${pigeon.ring} - ${pigeon.name}</option>`
    ).join('');
    
    // Handle form submission
    document.getElementById('breedingForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const pairData = {
        sireId: sireSelect.value,
        damId: damSelect.value,
        pairingDate: document.getElementById('pairingDate').value,
        expectedHatchDate: document.getElementById('expectedHatchDate').value,
        notes: document.getElementById('breedingNotes').value
      };
      
      const result = await pigeonManager.addBreedingRecord(pairData);
      
      if (result.success) {
        utils.showNotification('Breeding record added!', 'success');
        utils.hideModal('breedingModal');
      } else {
        utils.showNotification(result.message, 'error');
      }
    });
    
  } catch (error) {
    utils.showNotification('Error setting up breeding pairs', 'error');
  }
}
```

## 🎯 Event Handling

### Authentication Events
```javascript
// Listen for auth state changes
authManager.onAuthStateChanged((user) => {
  if (user) {
    // User signed in
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    pigeonManager.loadPigeonData();
  } else {
    // User signed out
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
  }
});
```

### Form Events
```javascript
// Handle form submissions
document.addEventListener('DOMContentLoaded', () => {
  // Login form
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    utils.setLoading('loginBtn', true);
    const result = await authManager.signIn(email, password);
    utils.setLoading('loginBtn', false);
    
    if (!result.success) {
      utils.showNotification(result.message, 'error');
    }
  });
  
  // Register form
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    // Registration logic here
  });
});
```

### Keyboard Shortcuts
```javascript
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + N: Add new pigeon
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    utils.showModal('addPigeonModal');
  }
  
  // Ctrl/Cmd + S: Quick save
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    authManager.saveUserData();
    utils.showNotification('Data saved', 'info');
  }
  
  // Escape: Close modals
  if (e.key === 'Escape') {
    utils.hideModal();
  }
});
```

## 🔍 Advanced Filtering

### Complex Filter Example
```javascript
function applyAdvancedFilters() {
  const filters = [
    // Active pigeons only
    { key: 'status', value: 'active', operator: 'equals' },
    
    // Minimum 5 races
    { key: 'totalRaces', value: 5, operator: 'gte' },
    
    // Win rate above 20%
    { key: 'wins', value: function(pigeon) {
      return pigeon.totalRaces > 0 && (pigeon.wins / pigeon.totalRaces) > 0.2;
    }, operator: 'custom' },
    
    // Born after 2020
    { key: 'year', value: 2020, operator: 'gt' },
    
    // Name contains search term
    { key: 'name', value: 'champion', operator: 'contains' }
  ];
  
  const filteredPigeons = utils.multiFilter(pigeonManager.pigeons, filters);
  return filteredPigeons;
}
```

### Dynamic Sorting
```javascript
function applySorting(pigeons, sortConfig) {
  return utils.multiSort(pigeons, [
    { key: 'wins', order: 'desc' },           // Most wins first
    { key: 'totalRaces', order: 'desc' },     // Most experienced
    { key: 'year', order: 'desc' },           // Youngest first
    { key: 'name', order: 'asc' }             // Alphabetical as tiebreaker
  ]);
}
```

## 📊 Performance Monitoring

### Track API Performance
```javascript
class PerformanceMonitor {
  static async measureAsync(name, asyncFunction) {
    const start = performance.now();
    try {
      const result = await asyncFunction();
      const duration = performance.now() - start;
      console.log(`${name} took ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`${name} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }
}

// Usage
const result = await PerformanceMonitor.measureAsync(
  'Add Pigeon',
  () => pigeonManager.addPigeon(pigeonData)
);
```

### Memory Usage Monitoring
```javascript
function checkMemoryUsage() {
  if (performance.memory) {
    const memory = performance.memory;
    console.log('Memory Usage:', {
      used: utils.formatFileSize(memory.usedJSHeapSize),
      total: utils.formatFileSize(memory.totalJSHeapSize),
      limit: utils.formatFileSize(memory.jsHeapSizeLimit)
    });
  }
}
```

## 🔒 Security Best Practices

### Input Sanitization
```javascript
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}
```

### Rate Limiting
```javascript
class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.requests = new Map();
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  
  isAllowed(userId) {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // Remove old requests
    const validRequests = userRequests.filter(
      time => now - time < this.windowMs
    );
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(userId, validRequests);
    return true;
  }
}

const rateLimiter = new RateLimiter(50, 60000); // 50 requests per minute
```

## 🧪 Testing Utilities

### Mock Data Generation
```javascript
function generateMockPigeons(count = 10) {
  const colors = ['Blue', 'Red', 'Checker', 'White', 'Dark', 'Grizzle'];
  const names = ['Lightning', 'Thunder', 'Swift', 'Champion', 'Ace', 'Star'];
  const mockPigeons = [];
  
  for (let i = 0; i < count; i++) {
    mockPigeons.push({
      id: utils.generateId(),
      ring: `TEST-${String(i + 1).padStart(3, '0')}`,
      name: names[Math.floor(Math.random() * names.length)],
      gender: Math.random() > 0.5 ? 'Cock' : 'Hen',
      color: colors[Math.floor(Math.random() * colors.length)],
      year: 2020 + Math.floor(Math.random() * 5),
      status: 'active',
      totalRaces: Math.floor(Math.random() * 20),
      wins: Math.floor(Math.random() * 5)
    });
  }
  
  return mockPigeons;
}
```

### API Testing
```javascript
async function testAPIEndpoints() {
  console.log('Testing API endpoints...');
  
  try {
    // Test authentication
    await PerformanceMonitor.measureAsync('Auth Check', 
      () => authManager.requireAuth()
    );
    
    // Test pigeon operations
    const mockPigeon = generateMockPigeons(1)[0];
    
    const addResult = await PerformanceMonitor.measureAsync('Add Pigeon',
      () => pigeonManager.addPigeon(mockPigeon)
    );
    
    if (addResult.success) {
      const pigeonId = addResult.pigeon.id;
      
      await PerformanceMonitor.measureAsync('Get Pigeon',
        () => pigeonManager.getPigeon(pigeonId)
      );
      
      await PerformanceMonitor.measureAsync('Update Pigeon',
        () => pigeonManager.updatePigeon(pigeonId, { name: 'Updated Name' })
      );
      
      await PerformanceMonitor.measureAsync('Delete Pigeon',
        () => pigeonManager.deletePigeon(pigeonId)
      );
    }
    
    console.log('API tests completed successfully');
    
  } catch (error) {
    console.error('API test failed:', error);
  }
}
```

## 📱 Mobile API Considerations

### Touch Events
```javascript
// Handle touch events for mobile
function setupMobileEvents() {
  let touchStartY = 0;
  
  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  });
  
  document.addEventListener('touchmove', (e) => {
    if (utils.isMobile()) {
      // Prevent rubber band effect
      const touchY = e.touches[0].clientY;
      const touchDiff = touchY - touchStartY;
      
      if (touchDiff > 0 && window.scrollY === 0) {
        e.preventDefault();
      }
    }
  });
}
```

### Offline Support
```javascript
class OfflineManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.pendingOperations = [];
    
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }
  
  async executeOperation(operation) {
    if (this.isOnline) {
      return await operation();
    } else {
      this.pendingOperations.push(operation);
      utils.showNotification('Operation queued for when online', 'info');
    }
  }
  
  async handleOnline() {
    this.isOnline = true;
    utils.showNotification('Connection restored', 'success');
    
    // Execute pending operations
    while (this.pendingOperations.length > 0) {
      const operation = this.pendingOperations.shift();
      try {
        await operation();
      } catch (error) {
        console.error('Failed to sync operation:', error);
      }
    }
  }
  
  handleOffline() {
    this.isOnline = false;
    utils.showNotification('You are offline', 'warning');
  }
}

const offlineManager = new OfflineManager();
```

## 🔄 Migration and Updates

### Data Migration
```javascript
class DataMigrator {
  static migrate(data, fromVersion, toVersion) {
    let currentData = utils.deepCopy(data);
    
    // Migration from v1.0 to v1.1
    if (fromVersion === '1.0' && toVersion >= '1.1') {
      currentData = this.migrateV1ToV1_1(currentData);
    }
    
    // Add more migrations as needed
    
    return currentData;
  }
  
  static migrateV1ToV1_1(data) {
    // Add new fields to existing pigeons
    if (data.pigeons) {
      data.pigeons = data.pigeons.map(pigeon => ({
        ...pigeon,
        breeding: pigeon.breeding || { offspring: [], pairings: [] },
        health: pigeon.health || { vaccinations: [], treatments: [], notes: '' }
      }));
    }
    
    return data;
  }
}
```

## 📋 API Summary

### Core Classes
- **AuthManager**: Authentication and user management
- **PigeonManager**: Pigeon and race result management  
- **Utils**: Common utilities and helpers

### Key Methods
- `authManager.signIn(email, password)`
- `pigeonManager.addPigeon(pigeonData)`
- `pigeonManager.addRaceResult(raceData)`
- `utils.showNotification(message, type)`
- `utils.validateForm(data, rules)`

### Data Structures
- Pigeon objects with complete metadata
- Race result objects with performance data
- User documents with settings and preferences

### Event Handling
- Authentication state changes
- Form submissions and validation
- Keyboard shortcuts and mobile gestures

---

**Version**: 1.0  
**Last Updated**: January 2025  
**Compatibility**: Modern browsers with ES6+ support

For setup instructions, see [SETUP.md](SETUP.md)  
For feature details, see [FEATURES.md](FEATURES.md)