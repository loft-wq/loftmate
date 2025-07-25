# Racing Pigeon Manager - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase account
- Basic understanding of HTML/JavaScript

### 1. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `racing-pigeon-manager`
4. Enable Google Analytics (optional)
5. Click "Create project"

#### Enable Authentication
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. (Optional) Enable other providers like Google, Facebook

#### Setup Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (we'll secure it later)
4. Select a location closest to your users
5. Click "Done"

#### Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add web app
4. Register app with name: `Racing Pigeon Manager`
5. Copy the Firebase configuration object

### 2. Application Setup

#### Update Firebase Configuration
Open `firebase_pigeon_manager.html` and replace the Firebase config:

```javascript
// Replace this configuration with your Firebase config
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

#### File Structure
```
racing-pigeon-manager/
├── firebase_pigeon_manager.html (main file)
├── js/
│   ├── auth.js
│   ├── pigeon-manager.js
│   └── utils.js
├── assets/
│   └── icons/
│       └── favicon.ico
├── docs/
│   ├── SETUP.md
│   ├── FEATURES.md
│   └── API.md
└── .gitignore
```

### 3. Firebase Security Rules

#### Firestore Security Rules
Replace the default rules in Firestore with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read access for reference data (if needed)
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### Storage Security Rules (if using file uploads)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Local Development

#### Option 1: Simple HTTP Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

#### Option 2: Live Server (VS Code)
1. Install "Live Server" extension in VS Code
2. Right-click on `firebase_pigeon_manager.html`
3. Select "Open with Live Server"

### 5. Production Deployment

#### Firebase Hosting
1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize hosting:
```bash
firebase init hosting
```

4. Deploy:
```bash
firebase deploy
```

#### Alternative Hosting Options
- **Netlify**: Drag and drop your files
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Push to `gh-pages` branch
- **Traditional Web Hosting**: Upload files via FTP

### 6. Environment Configuration

#### Development Environment
- Use Firebase Emulator Suite for local testing
- Enable debug mode for detailed logging
- Use test data for development

#### Production Environment
- Update Firebase security rules
- Enable Firebase App Check for additional security
- Set up monitoring and analytics
- Configure backup strategies

### 7. Initial Data Setup

#### Create Test User
1. Open the application
2. Click "Create new account"
3. Fill in test user details
4. Verify email (if email verification is enabled)

#### Import Sample Data
```javascript
// Sample pigeon data structure
{
  "pigeons": [
    {
      "id": "pigeon1",
      "ring": "GB21-A12345",
      "name": "Lightning",
      "gender": "Cock",
      "color": "Blue",
      "year": 2021,
      "sire": "Champion Blue",
      "dam": "Swift Queen",
      "status": "active"
    }
  ],
  "raceResults": [
    {
      "id": "race1",
      "pigeonId": "pigeon1",
      "raceName": "Spring Classic",
      "raceDate": "2024-04-15",
      "distance": "500",
      "position": 1,
      "timeFlown": "8:45:30"
    }
  ]
}
```

### 8. Troubleshooting

#### Common Issues

**Firebase Connection Error**
- Check if Firebase config is correct
- Verify project ID and API key
- Ensure Firestore is enabled

**Authentication Not Working**
- Check if Email/Password provider is enabled
- Verify security rules allow user registration
- Check browser console for errors

**Data Not Saving**
- Check Firestore security rules
- Verify user is authenticated
- Check browser console for permission errors

**Mobile Display Issues**
- Ensure viewport meta tag is present
- Test responsive design on different devices
- Check CSS media queries

#### Debug Mode
Add this to enable debug logging:
```javascript
// Add after Firebase initialization
window.DEBUG = true;
```

### 9. Backup Strategy

#### Automatic Backups
- Enable Firestore automatic backups
- Set up scheduled exports to Cloud Storage
- Monitor backup success/failure

#### Manual Backups
- Export user data regularly
- Store backups in multiple locations
- Test restore procedures

### 10. Performance Optimization

#### Initial Load
- Minimize initial bundle size
- Use lazy loading for components
- Optimize images and assets

#### Database Performance
- Use proper indexing in Firestore
- Implement pagination for large datasets
- Cache frequently accessed data

### 11. Security Checklist

- [ ] Firebase security rules implemented
- [ ] User authentication required for all operations
- [ ] Input validation on all forms
- [ ] XSS protection in place
- [ ] HTTPS enforced in production
- [ ] Regular security updates
- [ ] User data encryption (if handling sensitive data)

### 12. Monitoring and Analytics

#### Firebase Analytics
1. Enable Google Analytics in Firebase
2. Add custom events for user actions
3. Monitor user engagement and retention

#### Error Monitoring
1. Set up Firebase Crashlytics
2. Implement error logging
3. Monitor application performance

### 13. Support and Updates

#### Documentation
- Keep documentation updated
- Document any customizations
- Maintain changelog

#### Community
- Report issues on GitHub
- Contribute improvements
- Share feedback and suggestions

## 📞 Support

If you encounter any issues during setup:

1. Check the troubleshooting section above
2. Review Firebase console for error messages
3. Check browser developer tools console
4. Consult Firebase documentation
5. Contact support if needed

## 🔄 Updates

To update the application:
1. Backup your current data
2. Download the latest version
3. Update Firebase configuration
4. Test functionality
5. Deploy updated version

---

**Next Steps**: After completing setup, check out [FEATURES.md](FEATURES.md) for detailed feature documentation.