// Racing Pigeon Manager - Firebase Integration
// نظام إدارة الحمام الزاجل مع تكامل Firebase

class PigeonManager {
    constructor() {
        this.currentUser = null;
        this.userDoc = null;
        this.pigeons = [];
        this.raceResults = [];
        this.editingPigeonId = null;
        this.filteredPigeons = [];
        
        // Country codes with flags
        this.countryCodes = [
            '🇦🇩', '🇦🇪', '🇦🇫', '🇦🇬', '🇦🇮', '🇦🇱', '🇦🇲', '🇦🇴', '🇦🇶', '🇦🇷', '🇦🇸', '🇦🇹', '🇦🇺', '🇦🇼', '🇦🇽', '🇦🇿',
            '🇧🇦', '🇧🇧', '🇧🇩', '🇧🇪', '🇧🇫', '🇧🇬', '🇧🇭', '🇧🇮', '🇧🇯', '🇧🇱', '🇧🇲', '🇧🇳', '🇧🇴', '🇧🇶', '🇧🇷', '🇧🇸', '🇧🇹', '🇧🇻', '🇧🇼', '🇧🇾', '🇧🇿',
            '🇨🇦', '🇨🇨', '🇨🇩', '🇨🇫', '🇨🇬', '🇨🇭', '🇨🇮', '🇨🇰', '🇨🇱', '🇨🇲', '🇨🇳', '🇨🇴', '🇨🇷', '🇨🇺', '🇨🇻', '🇨🇼', '🇨🇽', '🇨🇾', '🇨🇿',
            '🇩🇪', '🇩🇯', '🇩🇰', '🇩🇲', '🇩🇴', '🇩🇿',
            '🇪🇨', '🇪🇪', '🇪🇬', '🇪🇭', '🇪🇷', '🇪🇸', '🇪🇹', '🇪🇺',
            '🇫🇮', '🇫🇯', '🇫🇰', '🇫🇲', '🇫🇴', '🇫🇷',
            '🇬🇦', '🇬🇧', '🇬🇩', '🇬🇪', '🇬🇫', '🇬🇬', '🇬🇭', '🇬🇮', '🇬🇱', '🇬🇲', '🇬🇳', '🇬🇵', '🇬🇶', '🇬🇷', '🇬🇸', '🇬🇹', '🇬🇺', '🇬🇼', '🇬🇾',
            '🇭🇰', '🇭🇲', '🇭🇳', '🇭🇷', '🇭🇹', '🇭🇺',
            '🇮🇨', '🇮🇩', '🇮🇪', '🇮🇱', '🇮🇲', '🇮🇳', '🇮🇴', '🇮🇶', '🇮🇷', '🇮🇸', '🇮🇹',
            '🇯🇪', '🇯🇲', '🇯🇴', '🇯🇵',
            '🇰🇪', '🇰🇬', '🇰🇭', '🇰🇮', '🇰🇲', '🇰🇳', '🇰🇵', '🇰🇷', '🇰🇼', '🇰🇾', '🇰🇿',
            '🇱🇦', '🇱🇧', '🇱🇨', '🇱🇮', '🇱🇰', '🇱🇷', '🇱🇸', '🇱🇹', '🇱🇺', '🇱🇻', '🇱🇾',
            '🇲🇦', '🇲🇨', '🇲🇩', '🇲🇪', '🇲🇫', '🇲🇬', '🇲🇭', '🇲🇰', '🇲🇱', '🇲🇲', '🇲🇳', '🇲🇴', '🇲🇵', '🇲🇶', '🇲🇷', '🇲🇸', '🇲🇹', '🇲🇺', '🇲🇻', '🇲🇼', '🇲🇽', '🇲🇾', '🇲🇿',
            '🇳🇦', '🇳🇨', '🇳🇪', '🇳🇫', '🇳🇬', '🇳🇮', '🇳🇱', '🇳🇴', '🇳🇵', '🇳🇷', '🇳🇺', '🇳🇿',
            '🇴🇲', '🇵🇦', '🇵🇪', '🇵🇫', '🇵🇬', '🇵🇭', '🇵🇰', '🇵🇱', '🇵🇲', '🇵🇳', '🇵🇷', '🇵🇸', '🇵🇹', '🇵🇼', '🇵🇾',
            '🇶🇦', '🇷🇪', '🇷🇴', '🇷🇸', '🇷🇺', '🇷🇼',
            '🇸🇦', '🇸🇧', '🇸🇨', '🇸🇩', '🇸🇪', '🇸🇬', '🇸🇭', '🇸🇮', '🇸🇯', '🇸🇰', '🇸🇱', '🇸🇲', '🇸🇳', '🇸🇴', '🇸🇷', '🇸🇸', '🇸🇹', '🇸🇻', '🇸🇽', '🇸🇾', '🇸🇿',
            '🇹🇦', '🇹🇨', '🇹🇩', '🇹🇫', '🇹🇬', '🇹🇭', '🇹🇯', '🇹🇰', '🇹🇱', '🇹🇲', '🇹🇳', '🇹🇴', '🇹🇷', '🇹🇹', '🇹🇻', '🇹🇼', '🇹🇿',
            '🇺🇦', '🇺🇬', '🇺🇲', '🇺🇸', '🇺🇾', '🇺🇿',
            '🇻🇦', '🇻🇨', '🇻🇪', '🇻🇬', '🇻🇮', '🇻🇳', '🇻🇺',
            '🇼🇫', '🇼🇸', '🇽🇰', '🇾🇪', '🇾🇹', '🇿🇦', '🇿🇲', '🇿🇼'
        ];
        
        this.init();
    }

    // Initialize Firebase connection and event listeners
    async init() {
        await this.waitForFirebase();
        this.setupEventListeners();
        this.initializeSampleData();
    }

    // Wait for Firebase to be fully loaded
    waitForFirebase() {
        return new Promise((resolve) => {
            const checkFirebase = () => {
                if (window.firebaseAuth && window.firebaseDb) {
                    resolve();
                } else {
                    setTimeout(checkFirebase, 100);
                }
            };
            checkFirebase();
        });
    }

    // Setup all event listeners
    setupEventListeners() {
        // Authentication state listener
        window.firebaseAuthFunctions.onAuthStateChanged(window.firebaseAuth, (user) => {
            if (user) {
                this.handleAuthSuccess(user);
            } else {
                this.handleAuthLogout();
            }
        });
    }

    // Initialize with sample data if user has no pigeons
    initializeSampleData() {
        if (!this.userDoc || !this.userDoc.pigeons || this.userDoc.pigeons.length === 0) {
            this.pigeons = [
                {
                    id: this.generateId(),
                    ringNumber: '25-01741',
                    country: '🇫🇷',
                    clubCode: 'FR123',
                    name: 'Champion Alpha',
                    ringColor: 'Red',
                    pigeonColor: 'Blue Bar',
                    strain: 'Janssen',
                    owner: 'Default User',
                    gender: 'Cock',
                    fatherRing: '23-15432',
                    motherRing: '24-98765',
                    notes: 'Excellent long-distance racer with consistent performance.',
                    year: 2025,
                    addedDate: new Date().toISOString()
                },
                {
                    id: this.generateId(),
                    ringNumber: '25-01802',
                    country: '🇧🇪',
                    clubCode: 'BE456',
                    name: 'Golden Star',
                    ringColor: 'Blue',
                    pigeonColor: 'Red Check',
                    strain: 'Gaby Vandenabeele',
                    owner: 'Default User',
                    gender: 'Hen',
                    fatherRing: '23-11234',
                    motherRing: '24-55678',
                    notes: 'Exceptional breeding hen, mother to multiple champions.',
                    year: 2025,
                    addedDate: new Date().toISOString()
                }
            ];
        }
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Firebase Data Management
    async saveUserData() {
        if (!this.currentUser || !this.userDoc) return false;
        
        try {
            const docRef = window.firebaseDbFunctions.doc(window.firebaseDb, 'users', this.currentUser.uid);
            await window.firebaseDbFunctions.updateDoc(docRef, {
                ...this.userDoc,
                pigeons: this.pigeons,
                raceResults: this.raceResults,
                lastUpdated: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error('Error saving user data:', error);
            this.showNotification('خطأ في حفظ البيانات', 'error');
            return false;
        }
    }

    async loadUserData() {
        if (!this.currentUser) return false;
        
        try {
            const docRef = window.firebaseDbFunctions.doc(window.firebaseDb, 'users', this.currentUser.uid);
            const docSnap = await window.firebaseDbFunctions.getDoc(docRef);
            
            if (docSnap.exists()) {
                this.userDoc = docSnap.data();
                this.pigeons = this.userDoc.pigeons || [];
                this.raceResults = this.userDoc.raceResults || [];
                this.updateStatistics();
                this.populateFilters();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error loading user data:', error);
            this.showNotification('خطأ في تحميل البيانات', 'error');
            return false;
        }
    }

    // Authentication handlers
    async handleAuthSuccess(user) {
        this.currentUser = user;
        
        try {
            const docRef = window.firebaseDbFunctions.doc(window.firebaseDb, 'users', user.uid);
            const docSnap = await window.firebaseDbFunctions.getDoc(docRef);
            
            if (docSnap.exists()) {
                this.userDoc = docSnap.data();
                this.pigeons = this.userDoc.pigeons || [];
                this.raceResults = this.userDoc.raceResults || [];
            } else {
                // Create new user document
                this.userDoc = {
                    name: user.displayName || user.email.split('@')[0],
                    email: user.email,
                    createdAt: new Date().toISOString(),
                    pigeons: [],
                    raceResults: []
                };
                await window.firebaseDbFunctions.setDoc(docRef, this.userDoc);
                this.initializeSampleData();
            }
            
            this.showMainApp();
            this.updateUserInfo();
            this.updateStatistics();
            this.populateCountrySelect();
            this.populateFilters();
            this.displayPigeons();
            
        } catch (error) {
            console.error('Error handling auth success:', error);
            this.showNotification('خطأ في تحميل بيانات المستخدم', 'error');
        }
    }

    handleAuthLogout() {
        this.currentUser = null;
        this.userDoc = null;
        this.pigeons = [];
        this.raceResults = [];
        this.showLogin();
    }

    // Route protection
    requireAuth() {
        if (!this.currentUser) {
            this.showNotification('يرجى تسجيل الدخول للوصول لهذه الميزة', 'error');
            this.showLogin();
            return false;
        }
        return true;
    }

    // Pigeon Management Functions
    async addPigeon(pigeonData) {
        if (!this.requireAuth()) return false;
        
        try {
            const newPigeon = {
                ...pigeonData,
                id: this.generateId(),
                userId: this.currentUser.uid,
                addedDate: new Date().toISOString()
            };
            
            this.pigeons.push(newPigeon);
            await this.saveUserData();
            this.updateStatistics();
            this.populateFilters();
            this.displayPigeons();
            this.showNotification('تم إضافة الحمامة بنجاح!', 'success');
            return true;
        } catch (error) {
            console.error('Error adding pigeon:', error);
            this.showNotification('خطأ في إضافة الحمامة', 'error');
            return false;
        }
    }

    async updatePigeon(pigeonId, pigeonData) {
        if (!this.requireAuth()) return false;
        
        try {
            const index = this.pigeons.findIndex(p => p.id === pigeonId);
            if (index === -1) {
                this.showNotification('الحمامة غير موجودة', 'error');
                return false;
            }
            
            this.pigeons[index] = {
                ...this.pigeons[index],
                ...pigeonData,
                updatedDate: new Date().toISOString()
            };
            
            await this.saveUserData();
            this.updateStatistics();
            this.populateFilters();
            this.displayPigeons();
            this.showNotification('تم تحديث الحمامة بنجاح!', 'success');
            return true;
        } catch (error) {
            console.error('Error updating pigeon:', error);
            this.showNotification('خطأ في تحديث الحمامة', 'error');
            return false;
        }
    }

    async deletePigeon(pigeonId) {
        if (!this.requireAuth()) return false;
        
        try {
            const pigeon = this.pigeons.find(p => p.id === pigeonId);
            if (!pigeon) {
                this.showNotification('الحمامة غير موجودة', 'error');
                return false;
            }
            
            if (confirm(`هل أنت متأكد من حذف "${pigeon.name}" (${pigeon.ringNumber})؟`)) {
                this.pigeons = this.pigeons.filter(p => p.id !== pigeonId);
                this.raceResults = this.raceResults.filter(r => r.pigeonId !== pigeonId);
                
                await this.saveUserData();
                this.updateStatistics();
                this.populateFilters();
                this.displayPigeons();
                this.showNotification('تم حذف الحمامة بنجاح', 'info');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting pigeon:', error);
            this.showNotification('خطأ في حذف الحمامة', 'error');
            return false;
        }
    }

    // Race Results Management
    async addRaceResult(raceData) {
        if (!this.requireAuth()) return false;
        
        try {
            const newRaceResult = {
                ...raceData,
                id: this.generateId(),
                userId: this.currentUser.uid,
                addedDate: new Date().toISOString()
            };
            
            this.raceResults.push(newRaceResult);
            await this.saveUserData();
            this.showNotification('تم إضافة نتيجة السباق بنجاح!', 'success');
            return true;
        } catch (error) {
            console.error('Error adding race result:', error);
            this.showNotification('خطأ في إضافة نتيجة السباق', 'error');
            return false;
        }
    }

    // UI Helper Functions
    updateStatistics() {
        const total = this.pigeons.length;
        const males = this.pigeons.filter(p => p.gender === 'Cock').length;
        const females = this.pigeons.filter(p => p.gender === 'Hen').length;
        const young = this.pigeons.filter(p => p.year === new Date().getFullYear()).length;

        const totalEl = document.getElementById('totalCount');
        const maleEl = document.getElementById('maleCount');
        const femaleEl = document.getElementById('femaleCount');
        const youngEl = document.getElementById('youngCount');

        if (totalEl) totalEl.textContent = total;
        if (maleEl) maleEl.textContent = males;
        if (femaleEl) femaleEl.textContent = females;
        if (youngEl) youngEl.textContent = young;
    }

    updateUserInfo() {
        if (!this.currentUser || !this.userDoc) return;
        
        const userName = this.userDoc.name || this.currentUser.displayName || this.currentUser.email.split('@')[0];
        const userEmail = this.currentUser.email;
        
        const nameEl = document.getElementById('currentUserName');
        const emailEl = document.getElementById('currentUserEmail');
        const avatarEl = document.getElementById('userAvatar');
        
        if (nameEl) nameEl.textContent = userName;
        if (emailEl) emailEl.textContent = userEmail;
        if (avatarEl) avatarEl.textContent = userName.charAt(0).toUpperCase();
    }

    populateCountrySelect() {
        const countrySelects = ['country'];
        countrySelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                // Clear existing options except the first one
                while (select.children.length > 1) {
                    select.removeChild(select.lastChild);
                }
                
                this.countryCodes.forEach(code => {
                    const option = document.createElement('option');
                    option.value = code;
                    option.textContent = code;
                    select.appendChild(option);
                });
            }
        });
    }

    populateFilters() {
        const countries = new Set();
        const strains = new Set();
        const colors = new Set();

        this.pigeons.forEach(pigeon => {
            if (pigeon.country) countries.add(pigeon.country);
            if (pigeon.strain) strains.add(pigeon.strain);
            if (pigeon.pigeonColor) colors.add(pigeon.pigeonColor);
        });

        this.populateSelect('countryFilter', Array.from(countries));
        this.populateSelect('strainFilter', Array.from(strains));
        this.populateSelect('colorFilter', Array.from(colors));
        this.populateSelect('raceParticipant', this.pigeons.map(p => p.ringNumber + ' - ' + p.name));
        this.populateSelect('pedigreeSelect', this.pigeons.map(p => p.ringNumber + ' - ' + p.name));
        this.populateSelect('exportPigeonSelect', this.pigeons.map(p => p.ringNumber + ' - ' + p.name));
    }

    populateSelect(selectId, options) {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        const currentValue = select.value;
        
        // Keep first option, remove others
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }

        options.sort().forEach(option => {
            const optionEl = document.createElement('option');
            optionEl.value = option;
            optionEl.textContent = option;
            select.appendChild(optionEl);
        });

        select.value = currentValue;
    }

    // Search and Filter Functions
    filterPigeons() {
        const searchInput = document.getElementById('searchInput');
        const countryFilter = document.getElementById('countryFilter');
        const strainFilter = document.getElementById('strainFilter');
        const colorFilter = document.getElementById('colorFilter');
        
        if (!searchInput || !countryFilter || !strainFilter || !colorFilter) return;

        const searchTerm = searchInput.value.toLowerCase();
        const countryFilterValue = countryFilter.value;
        const strainFilterValue = strainFilter.value;
        const colorFilterValue = colorFilter.value;

        this.filteredPigeons = this.pigeons.filter(pigeon => {
            const matchesSearch = !searchTerm || 
                pigeon.name.toLowerCase().includes(searchTerm) ||
                pigeon.ringNumber.toLowerCase().includes(searchTerm) ||
                (pigeon.owner && pigeon.owner.toLowerCase().includes(searchTerm));
            
            const matchesCountry = !countryFilterValue || pigeon.country === countryFilterValue;
            const matchesStrain = !strainFilterValue || pigeon.strain === strainFilterValue;
            const matchesColor = !colorFilterValue || pigeon.pigeonColor === colorFilterValue;

            return matchesSearch && matchesCountry && matchesStrain && matchesColor;
        });

        this.displayPigeons();
    }

    clearFilters() {
        const searchInput = document.getElementById('searchInput');
        const countryFilter = document.getElementById('countryFilter');
        const strainFilter = document.getElementById('strainFilter');
        const colorFilter = document.getElementById('colorFilter');
        
        if (searchInput) searchInput.value = '';
        if (countryFilter) countryFilter.selectedIndex = 0;
        if (strainFilter) strainFilter.selectedIndex = 0;
        if (colorFilter) colorFilter.selectedIndex = 0;
        
        this.filterPigeons();
    }

    // Display Functions
    displayPigeons() {
        const container = document.getElementById('pigeonsContent');
        if (!container) return;
        
        const pigeonsToShow = this.filteredPigeons.length > 0 || 
            this.hasActiveFilters() ? this.filteredPigeons : this.pigeons;

        if (pigeonsToShow.length === 0) {
            if (this.pigeons.length === 0) {
                container.innerHTML = '<div class="empty-state">لم يتم تسجيل أي حمام. انقر على "إضافة حمامة" للبدء.</div>';
            } else {
                container.innerHTML = '<div class="empty-state">لا توجد حمامات تطابق معايير البحث.</div>';
            }
            return;
        }

        // Group by year
        const pigeonsByYear = {};
        pigeonsToShow.forEach(pigeon => {
            if (!pigeonsByYear[pigeon.year]) {
                pigeonsByYear[pigeon.year] = [];
            }
            pigeonsByYear[pigeon.year].push(pigeon);
        });

        const years = Object.keys(pigeonsByYear).sort((a, b) => b - a);
        let html = '<div class="click-hint">💡 انقر على البطاقة لرؤية المزيد من التفاصيل</div>';

        years.forEach(year => {
            const yearPigeons = pigeonsByYear[year];
            html += `<div class="year-section fade-in">`;
            html += `<div class="year-title">سنة ${year} (${yearPigeons.length} حمامة${yearPigeons.length > 1 ? '' : ''})</div>`;
            html += `<div class="pigeon-grid">`;

            yearPigeons.forEach(pigeon => {
                const pigeonRaces = this.raceResults.filter(r => r.pigeonId === pigeon.id);
                const siblings = this.findSiblings(pigeon);

                html += this.createPigeonCard(pigeon, pigeonRaces, siblings);
            });

            html += `</div></div>`;
        });

        container.innerHTML = html;
    }

    createPigeonCard(pigeon, races, siblings) {
        return `
            <div class="pigeon-card" onclick="pigeonManager.togglePigeonDetails(this)">
                <div class="pigeon-number">${this.escapeHtml(pigeon.ringNumber)}</div>
                <div class="expand-arrow">▼</div>
                <div class="pigeon-country">${pigeon.country}</div>
                ${pigeon.clubCode ? `<div class="club-code">${this.escapeHtml(pigeon.clubCode)}</div>` : ''}
                <div class="pigeon-name">${this.escapeHtml(pigeon.name)}</div>
                
                <div class="pigeon-summary">
                    <span>${pigeon.strain || 'غير محدد السلالة'}</span>
                    <span>${pigeon.gender || ''}</span>
                </div>
                
                ${pigeon.strain ? `<div class="strain-badge">🏆 ${pigeon.strain}</div>` : ''}
                ${siblings.length > 0 ? `<div class="siblings-indicator">👥 ${siblings.length} أشقاء</div>` : ''}
                
                <div class="pigeon-details">
                    <div class="detail-row">
                        <span class="detail-label">الأب:</span>
                        <span class="detail-value">${this.escapeHtml(pigeon.fatherRing || 'غير محدد')}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">الأم:</span>
                        <span class="detail-value">${this.escapeHtml(pigeon.motherRing || 'غير محدد')}</span>
                    </div>
                    ${pigeon.clubCode ? `
                    <div class="detail-row">
                        <span class="detail-label">رمز النادي:</span>
                        <span class="detail-value">${this.escapeHtml(pigeon.clubCode)}</span>
                    </div>` : ''}
                    ${races.length > 0 ? `
                    <div class="detail-row">
                        <span class="detail-label">نتائج السباقات:</span>
                        <span class="detail-value">${races.length} نتيجة</span>
                    </div>` : ''}
                    ${siblings.length > 0 ? `
                    <div class="detail-row">
                        <span class="detail-label">الأشقاء:</span>
                        <span class="detail-value">${siblings.map(s => this.escapeHtml(s.ringNumber)).join(', ')}</span>
                    </div>` : ''}
                    ${pigeon.notes ? `
                    <div class="notes-box">
                        <strong>ملاحظات:</strong><br>
                        ${this.escapeHtml(pigeon.notes)}
                    </div>` : ''}
                    
                    <div class="card-actions">
                        <button class="btn btn-warning btn-small" onclick="event.stopPropagation(); pigeonManager.editPigeon('${pigeon.id}')">
                            ✏️ تعديل
                        </button>
                        <button class="btn btn-danger btn-small" onclick="event.stopPropagation(); pigeonManager.deletePigeon('${pigeon.id}')">
                            🗑️ حذف
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Helper Functions
    hasActiveFilters() {
        const searchInput = document.getElementById('searchInput');
        const countryFilter = document.getElementById('countryFilter');
        const strainFilter = document.getElementById('strainFilter');
        const colorFilter = document.getElementById('colorFilter');
        
        return (searchInput && searchInput.value) ||
               (countryFilter && countryFilter.value) ||
               (strainFilter && strainFilter.value) ||
               (colorFilter && colorFilter.value);
    }

    findSiblings(pigeon) {
        if (!pigeon.fatherRing || !pigeon.motherRing) return [];
        
        return this.pigeons.filter(p => 
            p.id !== pigeon.id && 
            p.fatherRing === pigeon.fatherRing && 
            p.motherRing === pigeon.motherRing
        );
    }

    findPigeonByRing(ringNumber) {
        return this.pigeons.find(p => p.ringNumber === ringNumber);
    }

    togglePigeonDetails(card) {
        const details = card.querySelector('.pigeon-details');
        const arrow = card.querySelector('.expand-arrow');
        
        if (details.classList.contains('expanded')) {
            details.classList.remove('expanded');
            arrow.classList.remove('rotated');
        } else {
            details.classList.add('expanded');
            arrow.classList.add('rotated');
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Form Management
    showAddForm() {
        this.editingPigeonId = null;
        const formTitle = document.getElementById('formTitle');
        const saveButtonText = document.getElementById('saveButtonText');
        
        if (formTitle) formTitle.textContent = 'إضافة حمامة جديدة';
        if (saveButtonText) saveButtonText.textContent = 'حفظ';
        
        this.hideAllSections();
        this.showSection('addForm');
        this.clearAddForm();
        
        setTimeout(() => {
            const ringNumberInput = document.getElementById('ringNumber');
            if (ringNumberInput) ringNumberInput.focus();
        }, 100);
    }

    editPigeon(pigeonId) {
        const pigeon = this.pigeons.find(p => p.id === pigeonId);
        if (!pigeon) return;

        this.editingPigeonId = pigeonId;
        const formTitle = document.getElementById('formTitle');
        const saveButtonText = document.getElementById('saveButtonText');
        
        if (formTitle) formTitle.textContent = 'تعديل الحمامة';
        if (saveButtonText) saveButtonText.textContent = 'تحديث';

        // Fill form with pigeon data
        this.setInputValue('ringNumber', pigeon.ringNumber);
        this.setInputValue('country', pigeon.country);
        this.setInputValue('clubCode', pigeon.clubCode || '');
        this.setInputValue('pigeonName', pigeon.name);
        this.setInputValue('ringColor', pigeon.ringColor || '');
        this.setInputValue('pigeonColor', pigeon.pigeonColor || '');
        this.setInputValue('strain', pigeon.strain || '');
        this.setInputValue('owner', pigeon.owner || '');
        this.setInputValue('gender', pigeon.gender || '');
        this.setInputValue('fatherRing', pigeon.fatherRing || '');
        this.setInputValue('motherRing', pigeon.motherRing || '');
        this.setInputValue('notes', pigeon.notes || '');

        this.showAddForm();
    }

    savePigeon() {
        const pigeonData = {
            ringNumber: this.getInputValue('ringNumber'),
            country: this.getInputValue('country'),
            clubCode: this.getInputValue('clubCode'),
            name: this.getInputValue('pigeonName') || 'بدون اسم',
            ringColor: this.getInputValue('ringColor'),
            pigeonColor: this.getInputValue('pigeonColor'),
            strain: this.getInputValue('strain') === 'Other' ? 
                   this.getInputValue('customStrain') : 
                   this.getInputValue('strain'),
            owner: this.getInputValue('owner'),
            gender: this.getInputValue('gender'),
            fatherRing: this.getInputValue('fatherRing'),
            motherRing: this.getInputValue('motherRing'),
            notes: this.getInputValue('notes')
        };

        if (!pigeonData.ringNumber || !pigeonData.country) {
            this.showNotification('يرجى إدخال رقم الخاتم والدولة على الأقل.', 'error');
            return;
        }

        // Check for duplicate ring number
        const existingPigeon = this.pigeons.find(p => 
            p.ringNumber === pigeonData.ringNumber && p.id !== this.editingPigeonId
        );
        
        if (existingPigeon) {
            this.showNotification('رقم الخاتم موجود مسبقاً. يرجى استخدام رقم آخر.', 'error');
            return;
        }

        // Extract year from ring number
        let year = new Date().getFullYear();
        const ringMatch = pigeonData.ringNumber.match(/^(\d{2})-/);
        if (ringMatch) {
            const yearSuffix = parseInt(ringMatch[1]);
            year = yearSuffix + (yearSuffix > 50 ? 1900 : 2000);
        }
        pigeonData.year = year;

        if (this.editingPigeonId) {
            this.updatePigeon(this.editingPigeonId, pigeonData);
        } else {
            this.addPigeon(pigeonData);
        }

        this.clearAddForm();
        this.showPigeonsList();
    }

    clearAddForm() {
        const fields = [
            'ringNumber', 'pigeonName', 'owner', 'fatherRing', 
            'motherRing', 'notes', 'clubCode', 'customStrain'
        ];
        
        fields.forEach(fieldId => {
            this.setInputValue(fieldId, '');
        });
        
        const selects = ['country', 'ringColor', 'pigeonColor', 'strain', 'gender'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) select.selectedIndex = 0;
        });
        
        const customStrainInput = document.getElementById('customStrainInput');
        if (customStrainInput) customStrainInput.classList.remove('show');
    }

    // Navigation Functions
    showPigeonsList() {
        this.hideAllSections();
        this.showSection('pigeonsList');
        this.updateStatistics();
        this.populateFilters();
        this.filterPigeons();
    }

    showRaceManager() {
        this.hideAllSections();
        this.showSection('raceManager');
        this.populateFilters();
    }

    showPedigreeTree() {
        this.hideAllSections();
        this.showSection('pedigreeSection');
        this.populateFilters();
    }

    showExportOptions() {
        this.hideAllSections();
        this.showSection('exportSection');
        this.populateFilters();
    }

    hideAllSections() {
        const sections = [
            'addForm', 'raceManager', 'pedigreeSection', 
            'exportSection', 'pigeonsList'
        ];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) section.classList.add('hidden');
        });
    }

    showSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.remove('hidden');
            section.classList.add('fade-in');
        }
    }

    showLogin() {
        const loginSection = document.getElementById('loginSection');
        const mainApp = document.getElementById('mainApp');
        
        if (loginSection) loginSection.classList.remove('hidden');
        if (mainApp) mainApp.classList.add('hidden');
    }

    showMainApp() {
        const loginSection = document.getElementById('loginSection');
        const registerSection = document.getElementById('registerSection');
        const forgotPasswordSection = document.getElementById('forgotPasswordSection');
        const mainApp = document.getElementById('mainApp');
        
        if (loginSection) loginSection.classList.add('hidden');
        if (registerSection) registerSection.classList.add('hidden');
        if (forgotPasswordSection) forgotPasswordSection.classList.add('hidden');
        if (mainApp) mainApp.classList.remove('hidden');
    }

    // Utility Functions
    setInputValue(inputId, value) {
        const input = document.getElementById(inputId);
        if (input) input.value = value || '';
    }

    getInputValue(inputId) {
        const input = document.getElementById(inputId);
        return input ? input.value.trim() : '';
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Export/Import Functions
    async exportUserData() {
        if (!this.requireAuth()) return;
        
        try {
            const exportData = {
                user: {
                    name: this.userDoc.name,
                    email: this.currentUser.email,
                    uid: this.currentUser.uid
                },
                pigeons: this.pigeons,
                raceResults: this.raceResults,
                exportDate: new Date().toISOString(),
                version: '5.0'
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const element = document.createElement('a');
            element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr));
            element.setAttribute('download', `pigeon_data_${this.currentUser.uid}_${new Date().toISOString().split('T')[0]}.json`);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            
            this.showNotification('تم تصدير البيانات بنجاح!', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showNotification('خطأ في تصدير البيانات', 'error');
        }
    }

    async importUserData(file) {
        if (!this.requireAuth()) return;
        
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (!data.pigeons || !Array.isArray(data.pigeons)) {
                this.showNotification('تنسيق الملف غير صالح', 'error');
                return;
            }
            
            if (confirm('سيتم استبدال جميع البيانات الحالية. هل أنت متأكد؟')) {
                this.pigeons = data.pigeons.map(pigeon => ({
                    ...pigeon,
                    userId: this.currentUser.uid,
                    importedDate: new Date().toISOString()
                }));
                
                this.raceResults = data.raceResults ? data.raceResults.map(result => ({
                    ...result,
                    userId: this.currentUser.uid,
                    importedDate: new Date().toISOString()
                })) : [];
                
                await this.saveUserData();
                this.updateStatistics();
                this.populateFilters();
                this.displayPigeons();
                this.showNotification(`تم استيراد ${data.pigeons.length} حمامة بنجاح!`, 'success');
            }
        } catch (error) {
            console.error('Error importing data:', error);
            this.showNotification('خطأ في استيراد البيانات. يرجى التحقق من تنسيق الملف.', 'error');
        }
    }

    // Auto-save functionality
    startAutoSave() {
        setInterval(async () => {
            if (this.currentUser && this.userDoc) {
                await this.saveUserData();
                console.log('Auto-save completed at', new Date().toLocaleTimeString());
            }
        }, 300000); // Save every 5 minutes
    }

    // Race Results Functions
    addRaceResultFromForm() {
        const raceData = {
            raceName: this.getInputValue('raceName'),
            raceDate: this.getInputValue('raceDate'),
            distance: parseInt(this.getInputValue('raceDistance')) || 0,
            participantText: this.getInputValue('raceParticipant'),
            position: parseInt(this.getInputValue('racePosition')),
            speed: parseInt(this.getInputValue('raceSpeed')) || 0
        };

        if (!raceData.raceName || !raceData.raceDate || !raceData.participantText || !raceData.position) {
            this.showNotification('يرجى ملء جميع الحقول المطلوبة.', 'error');
            return;
        }

        const ringNumber = raceData.participantText.split(' - ')[0];
        const pigeon = this.pigeons.find(p => p.ringNumber === ringNumber);
        
        if (!pigeon) {
            this.showNotification('الحمامة غير موجودة.', 'error');
            return;
        }

        const result = {
            pigeonId: pigeon.id,
            raceName: raceData.raceName,
            raceDate: raceData.raceDate,
            distance: raceData.distance,
            position: raceData.position,
            speed: raceData.speed
        };

        this.addRaceResult(result);
        
        // Clear form
        ['raceName', 'raceDate', 'raceDistance', 'racePosition', 'raceSpeed'].forEach(fieldId => {
            this.setInputValue(fieldId, '');
        });
        
        const participantSelect = document.getElementById('raceParticipant');
        if (participantSelect) participantSelect.selectedIndex = 0;
    }

    // Theme toggle
    toggleTheme() {
        const body = document.body;
        const themeToggle = document.querySelector('.theme-toggle');
        
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            if (themeToggle) themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            if (themeToggle) themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        }
    }

    // Clear all data
    async clearAllData() {
        if (!this.requireAuth()) return;
        
        if (confirm('هل أنت متأكد من حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.')) {
            if (confirm('التأكيد الأخير: سيتم فقدان جميع البيانات نهائياً!')) {
                this.pigeons = [];
                this.raceResults = [];
                await this.saveUserData();
                this.updateStatistics();
                this.populateFilters();
                this.displayPigeons();
                this.showNotification('تم حذف جميع البيانات.', 'info');
            }
        }
    }
}

// Global instance
let pigeonManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) themeToggle.textContent = '☀️';
    }
    
    // Initialize pigeon manager
    pigeonManager = new PigeonManager();
    
    // Start auto-save
    pigeonManager.startAutoSave();
    
    // Handle browser refresh/close
    window.addEventListener('beforeunload', () => {
        if (pigeonManager && pigeonManager.currentUser && pigeonManager.userDoc) {
            pigeonManager.saveUserData();
        }
    });
    
    // Handle online/offline status
    window.addEventListener('online', () => {
        pigeonManager.showNotification('تم استعادة الاتصال. ستتم مزامنة البيانات تلقائياً.', 'success');
        if (pigeonManager && pigeonManager.currentUser && pigeonManager.userDoc) {
            pigeonManager.saveUserData();
        }
    });
    
    window.addEventListener('offline', () => {
        pigeonManager.showNotification('أنت غير متصل. ستتم مزامنة التغييرات عند استعادة الاتصال.', 'info');
    });
});

// Global functions for HTML integration
function showAddForm() {
    if (pigeonManager) pigeonManager.showAddForm();
}

function showPigeonsList() {
    if (pigeonManager) pigeonManager.showPigeonsList();
}

function showRaceManager() {
    if (pigeonManager) pigeonManager.showRaceManager();
}

function showPedigreeTree() {
    if (pigeonManager) pigeonManager.showPedigreeTree();
}

function showExportOptions() {
    if (pigeonManager) pigeonManager.showExportOptions();
}

function savePigeon() {
    if (pigeonManager) pigeonManager.savePigeon();
}

function addRaceResult() {
    if (pigeonManager) pigeonManager.addRaceResultFromForm();
}

function filterPigeons() {
    if (pigeonManager) pigeonManager.filterPigeons();
}

function clearFilters() {
    if (pigeonManager) pigeonManager.clearFilters();
}

function toggleTheme() {
    if (pigeonManager) pigeonManager.toggleTheme();
}

function clearAllData() {
    if (pigeonManager) pigeonManager.clearAllData();
}

function importData(event) {
    if (pigeonManager && event.target.files[0]) {
        pigeonManager.importUserData(event.target.files[0]);
        event.target.value = ''; // Clear file input
    }
}

function exportJSON() {
    if (pigeonManager) pigeonManager.exportUserData();
}

function handleStrainChange() {
    const strainSelect = document.getElementById('strain');
    const customInput = document.getElementById('customStrainInput');
    
    if (strainSelect && customInput) {
        if (strainSelect.value === 'Other') {
            customInput.classList.add('show');
            const customStrainInput = document.getElementById('customStrain');
            if (customStrainInput) customStrainInput.focus();
        } else {
            customInput.classList.remove('show');
            const customStrainInput = document.getElementById('customStrain');
            if (customStrainInput) customStrainInput.value = '';
        }
    }
}

// Console logging for development
console.log('🐦 Racing Pigeon Manager with Firebase Integration loaded successfully!');
console.log('🔐 Advanced user authentication and data management enabled');
console.log('☁️ Real-time cloud synchronization active');
console.log('🌍 Multi-language support: Arabic/English');
console.log('📱 Responsive design for all devices');
                        <span class="detail-label">لون الخاتم:</span>
                        <span class="detail-value">${pigeon.ringColor || 'غير محدد'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">لون الحمامة:</span>
                        <span class="detail-value">${pigeon.pigeonColor || 'غير محدد'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">السلالة:</span>
                        <span class="detail-value">${pigeon.strain || 'غير محدد'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">المربي الأصلي:</span>
                        <span class="detail-value">${this.escapeHtml(pigeon.owner || 'غير محدد')}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">الجنس:</span>
                        <span class="detail-value">${pigeon.gender === 'Cock' ? 'ذكر' : pigeon.gender === 'Hen' ? 'أنثى' : 'غير محدد'}</span>
                    </div>
                    <div class="detail-row">
                