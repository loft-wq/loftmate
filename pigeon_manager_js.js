/**
 * Pigeon Manager Module for Racing Pigeon Manager
 * Handles all pigeon-related operations, race results, and breeding records
 */

class PigeonManager {
    constructor(authManager) {
        this.auth = authManager;
        this.pigeons = [];
        this.raceResults = [];
        this.filters = {
            gender: 'all',
            year: 'all',
            status: 'all',
            search: ''
        };
        this.sortBy = 'ring';
        this.sortOrder = 'asc';
        this.currentView = 'grid';
        
        this.initialize();
    }

    /**
     * Initialize the pigeon manager
     */
    async initialize() {
        // Wait for auth to be ready
        this.auth.onAuthStateChanged((user) => {
            if (user) {
                this.loadPigeonData();
            } else {
                this.clearData();
            }
        });

        console.log('🐦 Pigeon Manager initialized');
    }

    /**
     * Load pigeon data from user document
     */
    loadPigeonData() {
        const userDoc = this.auth.getUserDoc();
        if (userDoc) {
            this.pigeons = userDoc.pigeons || [];
            this.raceResults = userDoc.raceResults || [];
            this.updateStatistics();
            this.renderPigeons();
        }
    }

    /**
     * Clear all data
     */
    clearData() {
        this.pigeons = [];
        this.raceResults = [];
        this.updateStatistics();
        this.renderPigeons();
    }

    /**
     * Add a new pigeon
     */
    async addPigeon(pigeonData) {
        try {
            this.auth.requireAuth();

            // Validate required fields
            const requiredFields = ['ring', 'name', 'gender', 'color', 'year'];
            for (const field of requiredFields) {
                if (!pigeonData[field]) {
                    throw new Error(`${field} is required`);
                }
            }

            // Check for duplicate ring number
            if (this.pigeons.some(p => p.ring === pigeonData.ring)) {
                throw new Error('Ring number already exists');
            }

            const newPigeon = {
                id: this.generateId(),
                ...pigeonData,
                addedDate: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                totalRaces: 0,
                wins: 0,
                avgPosition: 0,
                totalDistance: 0,
                bestTime: null,
                status: 'active',
                breeding: {
                    offspring: [],
                    pairings: []
                },
                health: {
                    vaccinations: [],
                    treatments: [],
                    notes: ''
                }
            };

            this.pigeons.push(newPigeon);
            await this.savePigeonData();
            this.updateStatistics();
            this.renderPigeons();

            return {
                success: true,
                pigeon: newPigeon,
                message: 'Pigeon added successfully!'
            };
        } catch (error) {
            console.error('Error adding pigeon:', error);
            return {
                success: false,
                message: error.message || 'Error adding pigeon'
            };
        }
    }

    /**
     * Update an existing pigeon
     */
    async updatePigeon(pigeonId, updates) {
        try {
            this.auth.requireAuth();

            const index = this.pigeons.findIndex(p => p.id === pigeonId);
            if (index === -1) {
                throw new Error('Pigeon not found');
            }

            // Check for duplicate ring if ring is being updated
            if (updates.ring && updates.ring !== this.pigeons[index].ring) {
                if (this.pigeons.some(p => p.ring === updates.ring && p.id !== pigeonId)) {
                    throw new Error('Ring number already exists');
                }
            }

            this.pigeons[index] = {
                ...this.pigeons[index],
                ...updates,
                lastUpdated: new Date().toISOString()
            };

            await this.savePigeonData();
            this.updateStatistics();
            this.renderPigeons();

            return {
                success: true,
                pigeon: this.pigeons[index],
                message: 'Pigeon updated successfully!'
            };
        } catch (error) {
            console.error('Error updating pigeon:', error);
            return {
                success: false,
                message: error.message || 'Error updating pigeon'
            };
        }
    }

    /**
     * Delete a pigeon
     */
    async deletePigeon(pigeonId) {
        try {
            this.auth.requireAuth();

            const index = this.pigeons.findIndex(p => p.id === pigeonId);
            if (index === -1) {
                throw new Error('Pigeon not found');
            }

            const pigeon = this.pigeons[index];
            
            // Remove pigeon
            this.pigeons.splice(index, 1);
            
            // Remove associated race results
            this.raceResults = this.raceResults.filter(r => r.pigeonId !== pigeonId);

            await this.savePigeonData();
            this.updateStatistics();
            this.renderPigeons();

            return {
                success: true,
                message: `Pigeon ${pigeon.ring} deleted successfully`
            };
        } catch (error) {
            console.error('Error deleting pigeon:', error);
            return {
                success: false,
                message: error.message || 'Error deleting pigeon'
            };
        }
    }

    /**
     * Add race result
     */
    async addRaceResult(raceData) {
        try {
            this.auth.requireAuth();

            const requiredFields = ['pigeonId', 'raceName', 'raceDate', 'distance', 'position', 'timeFlown'];
            for (const field of requiredFields) {
                if (!raceData[field]) {
                    throw new Error(`${field} is required`);
                }
            }

            // Validate pigeon exists
            const pigeon = this.pigeons.find(p => p.id === raceData.pigeonId);
            if (!pigeon) {
                throw new Error('Pigeon not found');
            }

            const raceResult = {
                id: this.generateId(),
                ...raceData,
                addedDate: new Date().toISOString(),
                speed: this.calculateSpeed(raceData.distance, raceData.timeFlown)
            };

            this.raceResults.push(raceResult);
            
            // Update pigeon statistics
            this.updatePigeonStats(raceData.pigeonId);
            
            await this.savePigeonData();
            this.updateStatistics();

            return {
                success: true,
                result: raceResult,
                message: 'Race result added successfully!'
            };
        } catch (error) {
            console.error('Error adding race result:', error);
            return {
                success: false,
                message: error.message || 'Error adding race result'
            };
        }
    }

    /**
     * Update pigeon statistics based on race results
     */
    updatePigeonStats(pigeonId) {
        const pigeon = this.pigeons.find(p => p.id === pigeonId);
        if (!pigeon) return;

        const pigeonRaces = this.raceResults.filter(r => r.pigeonId === pigeonId);
        
        if (pigeonRaces.length === 0) {
            pigeon.totalRaces = 0;
            pigeon.wins = 0;
            pigeon.avgPosition = 0;
            pigeon.totalDistance = 0;
            pigeon.bestTime = null;
            return;
        }

        pigeon.totalRaces = pigeonRaces.length;
        pigeon.wins = pigeonRaces.filter(r => r.position === 1).length;
        pigeon.avgPosition = pigeonRaces.reduce((sum, r) => sum + r.position, 0) / pigeonRaces.length;
        pigeon.totalDistance = pigeonRaces.reduce((sum, r) => sum + parseFloat(r.distance), 0);
        
        // Find best time (fastest speed)
        const bestRace = pigeonRaces.reduce((best, race) => {
            const speed = this.calculateSpeed(race.distance, race.timeFlown);
            const bestSpeed = best ? this.calculateSpeed(best.distance, best.timeFlown) : 0;
            return speed > bestSpeed ? race : best;
        }, null);
        
        pigeon.bestTime = bestRace ? bestRace.timeFlown : null;
        pigeon.lastUpdated = new Date().toISOString();
    }

    /**
     * Calculate speed in meters per minute
     */
    calculateSpeed(distance, timeFlown) {
        try {
            // Parse distance (assume in kilometers)
            const distanceM = parseFloat(distance) * 1000;
            
            // Parse time (format: HH:MM:SS or MM:SS)
            const timeParts = timeFlown.split(':').map(Number);
            let totalMinutes = 0;
            
            if (timeParts.length === 3) {
                // HH:MM:SS
                totalMinutes = timeParts[0] * 60 + timeParts[1] + timeParts[2] / 60;
            } else if (timeParts.length === 2) {
                // MM:SS
                totalMinutes = timeParts[0] + timeParts[1] / 60;
            }
            
            return totalMinutes > 0 ? Math.round(distanceM / totalMinutes) : 0;
        } catch (error) {
            console.error('Error calculating speed:', error);
            return 0;
        }
    }

    /**
     * Get pigeon by ID
     */
    getPigeon(pigeonId) {
        return this.pigeons.find(p => p.id === pigeonId);
    }

    /**
     * Get pigeon by ring number
     */
    getPigeonByRing(ring) {
        return this.pigeons.find(p => p.ring === ring);
    }

    /**
     * Get race results for a pigeon
     */
    getPigeonRaces(pigeonId) {
        return this.raceResults.filter(r => r.pigeonId === pigeonId);
    }

    /**
     * Get filtered and sorted pigeons
     */
    getFilteredPigeons() {
        let filtered = [...this.pigeons];

        // Apply filters
        if (this.filters.gender !== 'all') {
            filtered = filtered.filter(p => p.gender.toLowerCase() === this.filters.gender.toLowerCase());
        }

        if (this.filters.year !== 'all') {
            filtered = filtered.filter(p => p.year.toString() === this.filters.year.toString());
        }

        if (this.filters.status !== 'all') {
            filtered = filtered.filter(p => p.status === this.filters.status);
        }

        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(p => 
                p.ring.toLowerCase().includes(searchTerm) ||
                p.name.toLowerCase().includes(searchTerm) ||
                p.color.toLowerCase().includes(searchTerm) ||
                (p.sire && p.sire.toLowerCase().includes(searchTerm)) ||
                (p.dam && p.dam.toLowerCase().includes(searchTerm))
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aVal = a[this.sortBy];
            let bVal = b[this.sortBy];

            // Handle numeric values
            if (this.sortBy === 'year' || this.sortBy === 'totalRaces' || this.sortBy === 'wins') {
                aVal = parseFloat(aVal) || 0;
                bVal = parseFloat(bVal) || 0;
            }

            // Handle string values
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (this.sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return filtered;
    }

    /**
     * Set filters
     */
    setFilters(filters) {
        this.filters = { ...this.filters, ...filters };
        this.renderPigeons();
    }

    /**
     * Set sorting
     */
    setSorting(sortBy, sortOrder = null) {
        this.sortBy = sortBy;
        if (sortOrder) {
            this.sortOrder = sortOrder;
        } else {
            // Toggle sort order if same field
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        }
        this.renderPigeons();
    }

    /**
     * Get statistics
     */
    getStatistics() {
        const total = this.pigeons.length;
        const males = this.pigeons.filter(p => p.gender === 'Cock').length;
        const females = this.pigeons.filter(p => p.gender === 'Hen').length;
        const currentYear = new Date().getFullYear();
        const young = this.pigeons.filter(p => p.year === currentYear).length;
        const active = this.pigeons.filter(p => p.status === 'active').length;
        const totalRaces = this.raceResults.length;
        const wins = this.raceResults.filter(r => r.position === 1).length;

        return {
            total,
            males,
            females,
            young,
            active,
            retired: total - active,
            totalRaces,
            wins,
            winRate: totalRaces > 0 ? Math.round((wins / totalRaces) * 100) : 0
        };
    }

    /**
     * Update statistics display
     */
    updateStatistics() {
        const stats = this.getStatistics();
        
        const elements = {
            totalCount: document.getElementById('totalCount'),
            maleCount: document.getElementById('maleCount'),
            femaleCount: document.getElementById('femaleCount'),
            youngCount: document.getElementById('youngCount')
        };

        if (elements.totalCount) elements.totalCount.textContent = stats.total;
        if (elements.maleCount) elements.maleCount.textContent = stats.males;
        if (elements.femaleCount) elements.femaleCount.textContent = stats.females;
        if (elements.youngCount) elements.youngCount.textContent = stats.young;
    }

    /**
     * Render pigeons list
     */
    renderPigeons() {
        const container = document.getElementById('pigeonsContainer');
        if (!container) return;

        const filteredPigeons = this.getFilteredPigeons();
        
        if (filteredPigeons.length === 0) {
            container.innerHTML = `
                <div class="no-pigeons">
                    <div class="no-pigeons-icon">🐦</div>
                    <h3>No pigeons found</h3>
                    <p>Add your first pigeon or adjust your filters</p>
                </div>
            `;
            return;
        }

        const html = filteredPigeons.map(pigeon => this.renderPigeonCard(pigeon)).join('');
        container.innerHTML = html;
    }

    /**
     * Render individual pigeon card
     */
    renderPigeonCard(pigeon) {
        const races = this.getPigeonRaces(pigeon.id);
        const winRate = pigeon.totalRaces > 0 ? Math.round((pigeon.wins / pigeon.totalRaces) * 100) : 0;
        
        return `
            <div class="pigeon-card" data-pigeon-id="${pigeon.id}">
                <div class="pigeon-header">
                    <div class="pigeon-ring">${pigeon.ring}</div>
                    <div class="pigeon-actions">
                        <button class="btn btn-small btn-secondary" onclick="pigeonManager.editPigeon('${pigeon.id}')">✏️</button>
                        <button class="btn btn-small btn-danger" onclick="pigeonManager.deletePigeon('${pigeon.id}')">🗑️</button>
                    </div>
                </div>
                <div class="pigeon-info">
                    <div><span>Name:</span> <strong>${pigeon.name}</strong></div>
                    <div><span>Gender:</span> <strong>${pigeon.gender}</strong></div>
                    <div><span>Color:</span> <strong>${pigeon.color}</strong></div>
                    <div><span>Year:</span> <strong>${pigeon.year}</strong></div>
                    <div><span>Races:</span> <strong>${pigeon.totalRaces}</strong></div>
                    <div><span>Wins:</span> <strong>${pigeon.wins} (${winRate}%)</strong></div>
                    ${pigeon.sire ? `<div><span>Sire:</span> <strong>${pigeon.sire}</strong></div>` : ''}
                    ${pigeon.dam ? `<div><span>Dam:</span> <strong>${pigeon.dam}</strong></div>` : ''}
                </div>
                <div class="pigeon-status status-${pigeon.status}">
                    ${pigeon.status.toUpperCase()}
                </div>
            </div>`