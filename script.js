
        var currentUser = '';
        var pigeons = [];
        var raceResults = [];
        var editingPigeonId = null;
        var filteredPigeons = [];

        // World country codes
        var countryCodes = [
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
            '🇴🇲',
            '🇵🇦', '🇵🇪', '🇵🇫', '🇵🇬', '🇵🇭', '🇵🇰', '🇵🇱', '🇵🇲', '🇵🇳', '🇵🇷', '🇵🇸', '🇵🇹', '🇵🇼', '🇵🇾',
            '🇶🇦',
            '🇷🇪', '🇷🇴', '🇷🇸', '🇷🇺', '🇷🇼',
            '🇸🇦', '🇸🇧', '🇸🇨', '🇸🇩', '🇸🇪', '🇸🇬', '🇸🇭', '🇸🇮', '🇸🇯', '🇸🇰', '🇸🇱', '🇸🇲', '🇸🇳', '🇸🇴', '🇸🇷', '🇸🇸', '🇸🇹', '🇸🇻', '🇸🇽', '🇸🇾', '🇸🇿',
            '🇹🇦', '🇹🇨', '🇹🇩', '🇹🇫', '🇹🇬', '🇹🇭', '🇹🇯', '🇹🇰', '🇹🇱', '🇹🇲', '🇹🇳', '🇹🇴', '🇹🇷', '🇹🇹', '🇹🇻', '🇹🇼', '🇹🇿',
            '🇺🇦', '🇺🇬', '🇺🇲', '🇺🇸', '🇺🇾', '🇺🇿',
            '🇻🇦', '🇻🇨', '🇻🇪', '🇻🇬', '🇻🇮', '🇻🇳', '🇻🇺',
            '🇼🇫', '🇼🇸',
            '🇽🇰',
            '🇾🇪', '🇾🇹',
            '🇿🇦', '🇿🇲', '🇿🇼'
        ];

        // Sample data initialization
        pigeons.push({
            id: generateId(),
            ringNumber: '25-01741',
            country: '🇫🇷',
            clubCode: 'FR123',
            name: 'Champion Alpha',
            ringColor: 'Red',
            pigeonColor: 'Blue Bar',
            strain: 'Janssen',
            owner: 'John Smith',
            gender: 'Cock',
            fatherRing: '23-15432',
            motherRing: '24-98765',
            notes: 'Excellent long-distance racer with consistent performance. Outstanding results on 500+ km races.',
            year: 2025,
            addedDate: new Date().toISOString()
        });

        pigeons.push({
            id: generateId(),
            ringNumber: '25-01802',
            country: '🇧🇪',
            clubCode: 'BE456',
            name: 'Golden Star',
            ringColor: 'Blue',
            pigeonColor: 'Red Check',
            strain: 'Gaby Vandenabeele',
            owner: 'Marie Johnson',
            gender: 'Hen',
            fatherRing: '23-11234',
            motherRing: '24-55678',
            notes: 'Exceptional breeding hen, mother to multiple champions.',
            year: 2025,
            addedDate: new Date().toISOString()
        });

        function generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }

        function loadData() {
            try {
                var saved = localStorage.getItem('pigeonData');
                if (saved) {
                    var data = JSON.parse(saved);
                    pigeons = data.pigeons || [];
                    raceResults = data.raceResults || [];
                    
                    pigeons.forEach(function(pigeon) {
                        if (!pigeon.id) {
                            pigeon.id = generateId();
                        }
                    });
                    
                    return true;
                }
            } catch (e) {
                console.log('Error loading data:', e);
            }
            return false;
        }

        function saveData() {
            try {
                var data = {
                    pigeons: pigeons,
                    raceResults: raceResults,
                    lastSaved: new Date().toISOString()
                };
                localStorage.setItem('pigeonData', JSON.stringify(data));
                return true;
            } catch (e) {
                console.log('Error saving data:', e);
                return false;
            }
        }

        function login() {
            var username = document.getElementById('username').value.trim();
            var password = document.getElementById('password').value.trim();

            if (username && password) {
                currentUser = username;
                document.getElementById('currentUser').textContent = username;
                document.getElementById('loginSection').style.display = 'none';
                document.getElementById('mainApp').classList.remove('hidden');
                
                loadData();
                updateStatistics();
                populateFilters();
                populateCountrySelect();
                showPigeonsList();
                
                setTimeout(function() {
                    showNotification('Login successful! Welcome ' + username, 'success');
                }, 500);
            } else {
                showNotification('Please enter username and password.', 'error');
            }
        }

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                document.getElementById('loginSection').style.display = 'block';
                document.getElementById('mainApp').classList.add('hidden');
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
                currentUser = '';
                showNotification('You have been logged out.', 'info');
            }
        }

        function toggleTheme() {
            var body = document.body;
            var themeToggle = document.querySelector('.theme-toggle');
            
            if (body.getAttribute('data-theme') === 'dark') {
                body.removeAttribute('data-theme');
                themeToggle.textContent = '🌙';
                localStorage.setItem('theme', 'light');
            } else {
                body.setAttribute('data-theme', 'dark');
                themeToggle.textContent = '☀️';
                localStorage.setItem('theme', 'dark');
            }
        }

        function populateCountrySelect() {
            var countrySelects = ['country'];
            countrySelects.forEach(function(selectId) {
                var select = document.getElementById(selectId);
                if (select) {
                    countryCodes.forEach(function(code) {
                        var option = document.createElement('option');
                        option.value = code;
                        option.textContent = code;
                        select.appendChild(option);
                    });
                }
            });
        }

        function handleStrainChange() {
            var strainSelect = document.getElementById('strain');
            var customInput = document.getElementById('customStrainInput');
            
            if (strainSelect.value === 'Other') {
                customInput.classList.add('show');
                document.getElementById('customStrain').focus();
            } else {
                customInput.classList.remove('show');
                document.getElementById('customStrain').value = '';
            }
        }

        function updateStatistics() {
            var total = pigeons.length;
            var males = pigeons.filter(function(p) { return p.gender === 'Cock'; }).length;
            var females = pigeons.filter(function(p) { return p.gender === 'Hen'; }).length;
            var young = pigeons.filter(function(p) { return p.year === new Date().getFullYear(); }).length;

            document.getElementById('totalCount').textContent = total;
            document.getElementById('maleCount').textContent = males;
            document.getElementById('femaleCount').textContent = females;
            document.getElementById('youngCount').textContent = young;
        }

        function populateFilters() {
            var countries = new Set();
            var strains = new Set();
            var colors = new Set();

            pigeons.forEach(function(pigeon) {
                if (pigeon.country) countries.add(pigeon.country);
                if (pigeon.strain) strains.add(pigeon.strain);
                if (pigeon.pigeonColor) colors.add(pigeon.pigeonColor);
            });

            populateSelect('countryFilter', Array.from(countries));
            populateSelect('strainFilter', Array.from(strains));
            populateSelect('colorFilter', Array.from(colors));
            populateSelect('raceParticipant', pigeons.map(function(p) { return p.ringNumber + ' - ' + p.name; }));
            populateSelect('pedigreeSelect', pigeons.map(function(p) { return p.ringNumber + ' - ' + p.name; }));
            populateSelect('exportPigeonSelect', pigeons.map(function(p) { return p.ringNumber + ' - ' + p.name; }));
        }

        function populateSelect(selectId, options) {
            var select = document.getElementById(selectId);
            if (!select) return;
            
            var currentValue = select.value;
            
            while (select.children.length > 1) {
                select.removeChild(select.lastChild);
            }

            options.sort().forEach(function(option) {
                var optionEl = document.createElement('option');
                optionEl.value = option;
                optionEl.textContent = option;
                select.appendChild(optionEl);
            });

            select.value = currentValue;
        }

        function findSiblings(pigeon) {
            if (!pigeon.fatherRing || !pigeon.motherRing) return [];
            
            return pigeons.filter(function(p) {
                return p.id !== pigeon.id && 
                       p.fatherRing === pigeon.fatherRing && 
                       p.motherRing === pigeon.motherRing;
            });
        }

        function findPigeonByRing(ringNumber) {
            return pigeons.find(function(p) { return p.ringNumber === ringNumber; });
        }

        function filterPigeons() {
            var searchTerm = document.getElementById('searchInput').value.toLowerCase();
            var countryFilter = document.getElementById('countryFilter').value;
            var strainFilter = document.getElementById('strainFilter').value;
            var colorFilter = document.getElementById('colorFilter').value;

            filteredPigeons = pigeons.filter(function(pigeon) {
                var matchesSearch = !searchTerm || 
                    pigeon.name.toLowerCase().includes(searchTerm) ||
                    pigeon.ringNumber.toLowerCase().includes(searchTerm) ||
                    (pigeon.owner && pigeon.owner.toLowerCase().includes(searchTerm));
                
                var matchesCountry = !countryFilter || pigeon.country === countryFilter;
                var matchesStrain = !strainFilter || pigeon.strain === strainFilter;
                var matchesColor = !colorFilter || pigeon.pigeonColor === colorFilter;

                return matchesSearch && matchesCountry && matchesStrain && matchesColor;
            });

            displayPigeons();
        }

        function clearFilters() {
            document.getElementById('searchInput').value = '';
            document.getElementById('countryFilter').selectedIndex = 0;
            document.getElementById('strainFilter').selectedIndex = 0;
            document.getElementById('colorFilter').selectedIndex = 0;
            filterPigeons();
        }

        function showAddForm() {
            editingPigeonId = null;
            document.getElementById('formTitle').textContent = 'Add New Pigeon';
            document.getElementById('saveButtonText').textContent = 'Save';
            
            hideAllSections();
            document.getElementById('addForm').classList.remove('hidden');
            document.getElementById('addForm').classList.add('fade-in');
            
            clearAddForm();
            
            setTimeout(function() {
                document.getElementById('ringNumber').focus();
            }, 100);
        }

        function showRaceManager() {
            hideAllSections();
            document.getElementById('raceManager').classList.remove('hidden');
            document.getElementById('raceManager').classList.add('fade-in');
            
            populateFilters();
        }

        function showPedigreeTree() {
            hideAllSections();
            document.getElementById('pedigreeSection').classList.remove('hidden');
            document.getElementById('pedigreeSection').classList.add('fade-in');
            
            populateFilters();
        }

        function showExportOptions() {
            hideAllSections();
            document.getElementById('exportSection').classList.remove('hidden');
            document.getElementById('exportSection').classList.add('fade-in');
            
            populateFilters();
        }

        function showPigeonsList() {
            hideAllSections();
            document.getElementById('pigeonsList').classList.remove('hidden');
            document.getElementById('pigeonsList').classList.add('fade-in');
            
            updateStatistics();
            populateFilters();
            filterPigeons();
        }

        function hideAllSections() {
            var sections = ['addForm', 'raceManager', 'pedigreeSection', 'exportSection', 'pigeonsList'];
            sections.forEach(function(sectionId) {
                document.getElementById(sectionId).classList.add('hidden');
            });
        }

        function savePigeon() {
            var ringNumber = document.getElementById('ringNumber').value.trim();
            var country = document.getElementById('country').value;
            var clubCode = document.getElementById('clubCode').value.trim();
            var name = document.getElementById('pigeonName').value.trim();
            var ringColor = document.getElementById('ringColor').value;
            var pigeonColor = document.getElementById('pigeonColor').value;
            var strain = document.getElementById('strain').value === 'Other' ? 
                        document.getElementById('customStrain').value.trim() : 
                        document.getElementById('strain').value;
            var owner = document.getElementById('owner').value.trim();
            var gender = document.getElementById('gender').value;
            var fatherRing = document.getElementById('fatherRing').value.trim();
            var motherRing = document.getElementById('motherRing').value.trim();
            var notes = document.getElementById('notes').value.trim();

            if (!ringNumber || !country) {
                showNotification('Please enter at least ring number and country.', 'error');
                return;
            }

            var existingPigeon = pigeons.find(function(p) { 
                return p.ringNumber === ringNumber && p.id !== editingPigeonId; 
            });
            
            if (existingPigeon) {
                showNotification('This ring number already exists. Please use a different number.', 'error');
                return;
            }

            var year = new Date().getFullYear();
            var ringMatch = ringNumber.match(/^(\d{2})-/);
            if (ringMatch) {
                var yearSuffix = parseInt(ringMatch[1]);
                year = yearSuffix + (yearSuffix > 50 ? 1900 : 2000);
            }

            var pigeon = {
                id: editingPigeonId || generateId(),
                ringNumber: ringNumber,
                country: country,
                clubCode: clubCode,
                name: name || 'Unnamed',
                ringColor: ringColor,
                pigeonColor: pigeonColor,
                strain: strain,
                owner: owner,
                gender: gender,
                fatherRing: fatherRing,
                motherRing: motherRing,
                notes: notes,
                year: year,
                addedDate: editingPigeonId ? 
                    pigeons.find(function(p) { return p.id === editingPigeonId; }).addedDate : 
                    new Date().toISOString()
            };

            if (editingPigeonId) {
                var index = pigeons.findIndex(function(p) { return p.id === editingPigeonId; });
                pigeons[index] = pigeon;
                showNotification('Pigeon updated successfully!', 'success');
            } else {
                pigeons.push(pigeon);
                showNotification('Pigeon added successfully!', 'success');
            }

            saveData();
            clearAddForm();
            showPigeonsList();
        }

        function editPigeon(pigeonId) {
            var pigeon = pigeons.find(function(p) { return p.id === pigeonId; });
            if (!pigeon) return;

            editingPigeonId = pigeonId;
            document.getElementById('formTitle').textContent = 'Edit Pigeon';
            document.getElementById('saveButtonText').textContent = 'Update';

            document.getElementById('ringNumber').value = pigeon.ringNumber;
            document.getElementById('country').value = pigeon.country;
            document.getElementById('clubCode').value = pigeon.clubCode || '';
            document.getElementById('pigeonName').value = pigeon.name;
            document.getElementById('ringColor').value = pigeon.ringColor || '';
            document.getElementById('pigeonColor').value = pigeon.pigeonColor || '';
            document.getElementById('strain').value = pigeon.strain || '';
            document.getElementById('owner').value = pigeon.owner || '';
            document.getElementById('gender').value = pigeon.gender || '';
            document.getElementById('fatherRing').value = pigeon.fatherRing || '';
            document.getElementById('motherRing').value = pigeon.motherRing || '';
            document.getElementById('notes').value = pigeon.notes || '';

            showAddForm();
        }

        function deletePigeon(pigeonId) {
            var pigeon = pigeons.find(function(p) { return p.id === pigeonId; });
            if (!pigeon) return;

            if (confirm('Are you sure you want to delete "' + pigeon.name + '" (' + pigeon.ringNumber + ')?')) {
                pigeons = pigeons.filter(function(p) { return p.id !== pigeonId; });
                raceResults = raceResults.filter(function(r) { return r.pigeonId !== pigeonId; });
                
                saveData();
                showNotification('Pigeon deleted successfully.', 'info');
                showPigeonsList();
            }
        }

        function addRaceResult() {
            var raceName = document.getElementById('raceName').value.trim();
            var raceDate = document.getElementById('raceDate').value;
            var distance = document.getElementById('raceDistance').value;
            var participantText = document.getElementById('raceParticipant').value;
            var position = document.getElementById('racePosition').value;
            var speed = document.getElementById('raceSpeed').value;

            if (!raceName || !raceDate || !participantText || !position) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            var ringNumber = participantText.split(' - ')[0];
            var pigeon = pigeons.find(function(p) { return p.ringNumber === ringNumber; });
            
            if (!pigeon) {
                showNotification('Pigeon not found.', 'error');
                return;
            }

            var result = {
                id: generateId(),
                pigeonId: pigeon.id,
                raceName: raceName,
                raceDate: raceDate,
                distance: parseInt(distance) || 0,
                position: parseInt(position),
                speed: parseInt(speed) || 0,
                addedDate: new Date().toISOString()
            };

            raceResults.push(result);
            saveData();
            
            showNotification('Race result added successfully!', 'success');
            
            document.getElementById('raceName').value = '';
            document.getElementById('raceDate').value = '';
            document.getElementById('raceDistance').value = '';
            document.getElementById('raceParticipant').selectedIndex = 0;
            document.getElementById('racePosition').value = '';
            document.getElementById('raceSpeed').value = '';
        }

        function generatePedigreeTree() {
            var selectedPigeon = document.getElementById('pedigreeSelect').value;
            if (!selectedPigeon) return;

            var ringNumber = selectedPigeon.split(' - ')[0];
            var pigeon = findPigeonByRing(ringNumber);
            
            if (!pigeon) return;

            var treeContainer = document.getElementById('pedigreeTree');
            
            // Find all ancestors
            var sire = findPigeonByRing(pigeon.fatherRing);
            var dam = findPigeonByRing(pigeon.motherRing);
            
            var siresSire = sire ? findPigeonByRing(sire.fatherRing) : null;
            var siresDam = sire ? findPigeonByRing(sire.motherRing) : null;
            var damsSire = dam ? findPigeonByRing(dam.fatherRing) : null;
            var damsDam = dam ? findPigeonByRing(dam.motherRing) : null;
            
            // Great grandparents
            var siresSiresSire = siresSire ? findPigeonByRing(siresSire.fatherRing) : null;
            var siresSiresDam = siresSire ? findPigeonByRing(siresSire.motherRing) : null;
            var siresDamsSire = siresDam ? findPigeonByRing(siresDam.fatherRing) : null;
            var siresDamsDam = siresDam ? findPigeonByRing(siresDam.motherRing) : null;
            var damsSiresSire = damsSire ? findPigeonByRing(damsSire.fatherRing) : null;
            var damsSiresDam = damsSire ? findPigeonByRing(damsSire.motherRing) : null;
            var damsDamsSire = damsDam ? findPigeonByRing(damsDam.fatherRing) : null;
            var damsDamsDam = damsDam ? findPigeonByRing(damsDam.motherRing) : null;
            
            var html = '';
            
            // Main title
            html += '<div style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: bold; color: #000;">';
            html += '"' + escapeHtml(pigeon.name.toUpperCase()) + '" ' + pigeon.country + ' ' + pigeon.ringNumber.toUpperCase();
            if (pigeon.gender === 'Cock') html += ' M';
            else if (pigeon.gender === 'Hen') html += ' F';
            html += '</div>';
            
            html += '<div class="tree-container">';
            
            // Main pigeon (leftmost)
            html += createPigeonBox(pigeon, 'main', pigeon.ringNumber.toUpperCase());
            
            // Parents (Generation 1)
            html += createPigeonBox(sire, 'sire', 'SIRE');
            html += createPigeonBox(dam, 'dam', 'DAM');
            
            // Grandparents (Generation 2)
            html += createPigeonBox(siresSire, 'sire-sire', 'SIRE\'S SIRE');
            html += createPigeonBox(siresDam, 'sire-dam', 'SIRE\'S DAM');
            html += createPigeonBox(damsSire, 'dam-sire', 'DAM\'S SIRE');
            html += createPigeonBox(damsDam, 'dam-dam', 'DAM\'S DAM');
            
            // Great Grandparents (Generation 3)
            html += createPigeonBox(siresSiresSire, 'sire-sire-sire', 'SS SIRE');
            html += createPigeonBox(siresSiresDam, 'sire-sire-dam', 'SS DAM');
            html += createPigeonBox(siresDamsSire, 'sire-dam-sire', 'SD SIRE');
            html += createPigeonBox(siresDamsDam, 'sire-dam-dam', 'SD DAM');
            html += createPigeonBox(damsSiresSire, 'dam-sire-sire', 'DS SIRE');
            html += createPigeonBox(damsSiresDam, 'dam-sire-dam', 'DS DAM');
            html += createPigeonBox(damsDamsSire, 'dam-dam-sire', 'DD SIRE');
            html += createPigeonBox(damsDamsDam, 'dam-dam-dam', 'DD DAM');
            
            // Connection lines
            html += generateConnectionLines();
            
            html += '</div>';
            
            // Footer with breeder info
            html += '<div style="margin-top: 20px; border-top: 2px solid #000; padding-top: 10px;">';
            html += '<div style="float: left; font-size: 12px; font-weight: bold;">';
            if (pigeon.owner) {
                html += 'BRED BY: ' + escapeHtml(pigeon.owner.toUpperCase());
            }
            html += '</div>';
            html += '<div style="float: right; font-size: 10px;">';
            html += 'Generated by Racing Pigeon Manager &copy; ' + new Date().getFullYear();
            html += '</div>';
            html += '<div style="clear: both;"></div>';
            html += '</div>';
            
            treeContainer.innerHTML = html;
        }

        function createPigeonBox(pigeon, className, defaultTitle) {
            if (!pigeon) {
                return '<div class="tree-box ' + className + ' unknown">' +
                       '<div style="font-weight: bold; text-align: center; margin-top: 30px;">UNKNOWN</div>' +
                       '</div>';
            }
            
            var html = '<div class="tree-box ' + className + '">';
            
            // Pigeon name first (on top with elegant styling)
            html += '<div class="pigeon-name">' + escapeHtml(pigeon.name.toUpperCase()) + '</div>';
            
            // Ring information with country on left and sex on right
            var sexIndicator = '';
            if (pigeon.gender === 'Cock') sexIndicator = 'M';
            else if (pigeon.gender === 'Hen') sexIndicator = 'F';
            
            html += '<div class="ring-info">' + pigeon.country + ' ' + pigeon.ringNumber.toUpperCase() + ' ' + sexIndicator + '</div>';
            
            // Additional info
            html += '<div class="pigeon-info">';
            if (pigeon.strain) {
                html += escapeHtml(pigeon.strain) + '<br>';
            }
            if (pigeon.owner && className === 'main') {
                html += 'Original by: ' + escapeHtml(pigeon.owner) + '<br>';
            }
            if (pigeon.pigeonColor) {
                html += escapeHtml(pigeon.pigeonColor) + '<br>';
            }
            if (pigeon.ringColor) {
                html += 'Badge Color: ' + escapeHtml(pigeon.ringColor) + '<br>';
            }
            if (pigeon.clubCode) {
                html += 'Club: ' + escapeHtml(pigeon.clubCode) + '<br>';
            }
            
            // Add race results for main pigeon
            if (className === 'main') {
                var pigeonRaces = raceResults.filter(function(r) { return r.pigeonId === pigeon.id; });
                if (pigeonRaces.length > 0) {
                    html += 'Pigeon Results: ' + pigeonRaces.length + '<br>';
                    
                    // Show best positions
                    var positions = pigeonRaces.map(function(r) { return r.position; }).sort(function(a, b) { return a - b; });
                    html += 'Best Classmen: ';
                    for (var i = 0; i < Math.min(3, positions.length); i++) {
                        html += positions[i];
                        if (i < Math.min(2, positions.length - 1)) html += ', ';
                    }
                    html += '<br>';
                }
                html += 'Year: ' + pigeon.year;
            }
            
            html += '</div>';
            html += '</div>';
            
            return html;
        }

        function generateConnectionLines() {
            var lines = '';
            
            // Main to parents - adjusted for mobile layout
            lines += '<div class="connection-line h-line" style="left: 170px; top: 205px; width: 30px;"></div>';
            lines += '<div class="connection-line v-line" style="left: 200px; top: 160px; height: 90px;"></div>';
            lines += '<div class="connection-line h-line" style="left: 200px; top: 160px; width: 20px;"></div>';
            lines += '<div class="connection-line h-line" style="left: 200px; top: 250px; width: 20px;"></div>';
            
            // Parents to grandparents
            // Sire to his parents
            lines += '<div class="connection-line h-line" style="left: 320px; top: 160px; width: 30px;"></div>';
            lines += '<div class="connection-line v-line" style="left: 350px; top: 120px; height: 80px;"></div>';
            lines += '<div class="connection-line h-line" style="left: 350px; top: 120px; width: 20px;"></div>';
            lines += '<div class="connection-line h-line" style="left: 350px; top: 180px; width: 20px;"></div>';
            
            // Dam to her parents  
            lines += '<div class="connection-line h-line" style="left: 320px; top: 250px; width: 30px;"></div>';
            lines += '<div class="connection-line v-line" style="left: 350px; top: 230px; height: 60px;"></div>';
            lines += '<div class="connection-line h-line" style="left: 350px; top: 230px; width: 20px;"></div>';
            lines += '<div class="connection-line h-line" style="left: 350px; top: 290px; width: 20px;"></div>';
            
            // Grandparents to great grandparents
            // Sire's sire to his parents
            lines += '<div class="connection-line h-line" style="left: 470px; top: 120px; width: 30px;"></div>';
            lines += '<div class="connection-line v-line" style="left: 500px; top: 90px; height: 60px;"></div>';
            lines += '<div class="connection-line h-line" style="left: 500px; top: 90px; width: 20px;"></div>';
            lines += '<div class="connection-line h-line" style="left: 500px; top: 130px; width: 20px;"></div>';
            
            // Sire's dam to her parents
            lines += '<div class="connection-line h-line" style="left: 470px; top: 180px; width: 30px;"></div>';
            lines += '<div class="connection-line v-line" style="left: 500px; top: 160px; height: 40px;"></div>';
            lines += '<div class="connection-line h-line" style="left: 500px; top: 160px; width: 20px;"></div>';
            lines += '<div class="connection-line h-line" style="left: 500px; top: 190px; width: 20px;"></div>';
            
            // Dam's sire to his parents
            lines += '<div class="connection-line h-line" style="left: 470px; top: 230px; width: 30px;"></div>';
            lines += '<div class="connection-line v-line" style="left: 500px; top: 220px; height: 40px;"></div>';
            lines += '<div class="connection-line h-line" style="left: 500px; top: 220px; width: 20px;"></div>';
            lines += '<div class="connection-line h-line" style="left: 500px; top: 250px; width: 20px;"></div>';
            
            // Dam's dam to her parents
            lines += '<div class="connection-line h-line" style="left: 470px; top: 290px; width: 30px;"></div>';
            lines += '<div class="connection-line v-line" style="left: 500px; top: 280px; height: 40px;"></div>';
            lines += '<div class="connection-line h-line" style="left: 500px; top: 280px; width: 20px;"></div>';
            lines += '<div class="connection-line h-line" style="left: 500px; top: 310px; width: 20px;"></div>';
            
            return lines;
        }

        function selectExportOption(type) {
            var radioButton = document.getElementById('export' + (type === 'all' ? 'All' : 'Single'));
            radioButton.checked = true;
            
            var singleSelect = document.getElementById('singlePigeonSelect');
            if (type === 'single') {
                singleSelect.style.display = 'block';
            } else {
                singleSelect.style.display = 'none';
            }
        }

        function performExport() {
            var exportType = document.querySelector('input[name="exportType"]:checked');
            if (!exportType) {
                showNotification('Please select an export option.', 'error');
                return;
            }

            if (exportType.value === 'all') {
                generatePDFAll();
            } else {
                var selectedPigeon = document.getElementById('exportPigeonSelect').value;
                if (!selectedPigeon) {
                    showNotification('Please select a pigeon to export.', 'error');
                    return;
                }
                generatePDFSingle(selectedPigeon);
            }
        }

        function generatePDFAll() {
            var printContent = '';
            printContent += '<h1 style="text-align: center; color: #667eea;">🐦 ' + escapeHtml(currentUser) + '\'s Racing Pigeons</h1>';
            printContent += '<p style="text-align: center; margin-bottom: 30px;">Generated on: ' + new Date().toLocaleDateString('en-US') + '</p>';
            
            printContent += '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px;">';
            printContent += '<div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;"><strong>Total:</strong> ' + pigeons.length + '</div>';
            printContent += '<div style="text-align: center; padding: 15px; background: #e3f2fd; border-radius: 8px;"><strong>Cocks:</strong> ' + pigeons.filter(function(p) { return p.gender === 'Cock'; }).length + '</div>';
            printContent += '<div style="text-align: center; padding: 15px; background: #fce4ec; border-radius: 8px;"><strong>Hens:</strong> ' + pigeons.filter(function(p) { return p.gender === 'Hen'; }).length + '</div>';
            printContent += '<div style="text-align: center; padding: 15px; background: #e8f5e8; border-radius: 8px;"><strong>Young:</strong> ' + pigeons.filter(function(p) { return p.year === new Date().getFullYear(); }).length + '</div>';
            printContent += '</div>';

            var pigeonsByYear = {};
            pigeons.forEach(function(pigeon) {
                if (!pigeonsByYear[pigeon.year]) {
                    pigeonsByYear[pigeon.year] = [];
                }
                pigeonsByYear[pigeon.year].push(pigeon);
            });

            var years = Object.keys(pigeonsByYear).sort(function(a, b) { return b - a; });

            years.forEach(function(year) {
                printContent += '<h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Year ' + year + ' (' + pigeonsByYear[year].length + ' pigeons)</h2>';
                
                pigeonsByYear[year].forEach(function(pigeon) {
                    printContent += '<div style="border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 8px; page-break-inside: avoid;">';
                    printContent += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">';
                    printContent += '<h3 style="color: #667eea; margin: 0;">' + escapeHtml(pigeon.ringNumber) + ' - ' + escapeHtml(pigeon.name) + '</h3>';
                    printContent += '<span style="font-size: 1.5em;">' + pigeon.country + '</span>';
                    html += '</div>';
                    
                    printContent += '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 14px;">';
                    printContent += '<div><strong>Strain:</strong> ' + (pigeon.strain || 'Not specified') + '</div>';
                    printContent += '<div><strong>Sex:</strong> ' + (pigeon.gender || 'Not specified') + '</div>';
                    printContent += '<div><strong>Color:</strong> ' + (pigeon.pigeonColor || 'Not specified') + '</div>';
                    printContent += '<div><strong>Owner:</strong> ' + escapeHtml(pigeon.owner || 'Not specified') + '</div>';
                    printContent += '<div><strong>Sire:</strong> ' + escapeHtml(pigeon.fatherRing || 'Not specified') + '</div>';
                    printContent += '<div><strong>Dam:</strong> ' + escapeHtml(pigeon.motherRing || 'Not specified') + '</div>';
                    if (pigeon.clubCode) {
                        printContent += '<div><strong>Club:</strong> ' + escapeHtml(pigeon.clubCode) + '</div>';
                    }
                    printContent += '</div>';
                    
                    if (pigeon.notes) {
                        printContent += '<div style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-left: 4px solid #667eea; font-style: italic;"><strong>Notes:</strong> ' + escapeHtml(pigeon.notes) + '</div>';
                    }
                    
                    printContent += '</div>';
                });
            });

            var printWindow = window.open('', '_blank');
            printWindow.document.write('<html><head><title>' + escapeHtml(currentUser) + ' - Racing Pigeons</title>');
            printWindow.document.write('<style>body { font-family: Arial, sans-serif; margin: 20px; } @media print { body { margin: 0; } }</style>');
            printWindow.document.write('</head><body>' + printContent + '</body></html>');
            printWindow.document.close();
            printWindow.print();
        }

        function generatePDFSingle(selectedPigeon) {
            var ringNumber = selectedPigeon.split(' - ')[0];
            var pigeon = findPigeonByRing(ringNumber);
            
            if (!pigeon) return;

            var sire = findPigeonByRing(pigeon.fatherRing);
            var dam = findPigeonByRing(pigeon.motherRing);
            var siblings = findSiblings(pigeon);
            var pigeonRaces = raceResults.filter(function(r) { return r.pigeonId === pigeon.id; });

            var printContent = '';
            printContent += '<h1 style="text-align: center; color: #667eea;">🐦 Pigeon Details Report</h1>';
            printContent += '<p style="text-align: center; margin-bottom: 30px;">Generated on: ' + new Date().toLocaleDateString('en-US') + '</p>';
            
            // Main pigeon info
            printContent += '<div style="border: 2px solid #667eea; padding: 20px; border-radius: 10px; margin-bottom: 20px;">';
            printContent += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">';
            printContent += '<h2 style="color: #667eea; margin: 0;">' + escapeHtml(pigeon.ringNumber) + ' - ' + escapeHtml(pigeon.name) + '</h2>';
            printContent += '<span style="font-size: 2em;">' + pigeon.country + '</span>';
            printContent += '</div>';
            
            printContent += '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 15px;">';
            printContent += '<div><strong>Strain:</strong> ' + (pigeon.strain || 'Not specified') + '</div>';
            printContent += '<div><strong>Sex:</strong> ' + (pigeon.gender === 'Cock' ? 'M' : pigeon.gender === 'Hen' ? 'F' : 'Not specified') + '</div>';
            printContent += '<div><strong>Color:</strong> ' + (pigeon.pigeonColor || 'Not specified') + '</div>';
            printContent += '<div><strong>Badge Color:</strong> ' + (pigeon.ringColor || 'Not specified') + '</div>';
            printContent += '<div><strong>Original by:</strong> ' + escapeHtml(pigeon.owner || 'Not specified') + '</div>';
            printContent += '<div><strong>Year:</strong> ' + pigeon.year + '</div>';
            if (pigeon.clubCode) {
                printContent += '<div><strong>Club Code:</strong> ' + escapeHtml(pigeon.clubCode) + '</div>';
            }
            printContent += '</div>';
            
            if (pigeon.notes) {
                printContent += '<div style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-left: 4px solid #667eea; font-style: italic;"><strong>Notes:</strong> ' + escapeHtml(pigeon.notes) + '</div>';
            }
            printContent += '</div>';

            // Pedigree information
            printContent += '<h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Pedigree Information</h3>';
            
            printContent += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">';
            
            // Sire info
            printContent += '<div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;">';
            printContent += '<h4 style="color: #667eea; margin-top: 0;">Sire</h4>';
            if (sire) {
                printContent += '<div><strong>Ring:</strong> ' + escapeHtml(sire.ringNumber) + '</div>';
                printContent += '<div><strong>Name:</strong> ' + escapeHtml(sire.name) + '</div>';
                printContent += '<div><strong>Country:</strong> ' + sire.country + '</div>';
                printContent += '<div><strong>Strain:</strong> ' + (sire.strain || 'Not specified') + '</div>';
                printContent += '<div><strong>Color:</strong> ' + (sire.pigeonColor || 'Not specified') + '</div>';
                if (sire.notes) {
                    printContent += '<div style="margin-top: 10px; font-style: italic;"><strong>Notes:</strong> ' + escapeHtml(sire.notes) + '</div>';
                }
            } else {
                printContent += '<div style="color: #999; font-style: italic;">Unknown</div>';
            }
            printContent += '</div>';
            
            // Dam info
            printContent += '<div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;">';
            printContent += '<h4 style="color: #667eea; margin-top: 0;">Dam</h4>';
            if (dam) {
                printContent += '<div><strong>Ring:</strong> ' + escapeHtml(dam.ringNumber) + '</div>';
                printContent += '<div><strong>Name:</strong> ' + escapeHtml(dam.name) + '</div>';
                printContent += '<div><strong>Country:</strong> ' + dam.country + '</div>';
                printContent += '<div><strong>Strain:</strong> ' + (dam.strain || 'Not specified') + '</div>';
                printContent += '<div><strong>Color:</strong> ' + (dam.pigeonColor || 'Not specified') + '</div>';
                if (dam.notes) {
                    printContent += '<div style="margin-top: 10px; font-style: italic;"><strong>Notes:</strong> ' + escapeHtml(dam.notes) + '</div>';
                }
            } else {
                printContent += '<div style="color: #999; font-style: italic;">Unknown</div>';
            }
            printContent += '</div>';
            
            printContent += '</div>';

            // Siblings information
            if (siblings.length > 0) {
                printContent += '<h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Siblings (' + siblings.length + ')</h3>';
                printContent += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 20px;">';
                
                siblings.forEach(function(sibling) {
                    printContent += '<div style="border: 1px solid #ddd; padding: 10px; border-radius: 8px;">';
                    printContent += '<div><strong>' + escapeHtml(sibling.ringNumber) + '</strong></div>';
                    printContent += '<div>' + escapeHtml(sibling.name) + '</div>';
                    printContent += '<div style="font-size: 0.9em; color: #666;">' + (sibling.gender || '') + ' - ' + (sibling.pigeonColor || '') + '</div>';
                    printContent += '</div>';
                });
                
                printContent += '</div>';
            }

            // Race results
            if (pigeonRaces.length > 0) {
                printContent += '<h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Pigeon Results (' + pigeonRaces.length + ')</h3>';
                printContent += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">';
                printContent += '<thead style="background: #f8f9fa;"><tr>';
                printContent += '<th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Race</th>';
                printContent += '<th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Date</th>';
                printContent += '<th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Distance</th>';
                printContent += '<th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Classmen</th>';
                printContent += '<th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Speed</th>';
                printContent += '</tr></thead><tbody>';
                
                pigeonRaces.forEach(function(race) {
                    printContent += '<tr>';
                    printContent += '<td style="border: 1px solid #ddd; padding: 8px;">' + escapeHtml(race.raceName) + '</td>';
                    printContent += '<td style="border: 1px solid #ddd; padding: 8px;">' + race.raceDate + '</td>';
                    printContent += '<td style="border: 1px solid #ddd; padding: 8px; text-align: center;">' + race.distance + ' km</td>';
                    printContent += '<td style="border: 1px solid #ddd; padding: 8px; text-align: center;">' + race.position + '</td>';
                    printContent += '<td style="border: 1px solid #ddd; padding: 8px; text-align: center;">' + race.speed + ' m/min</td>';
                    printContent += '</tr>';
                });
                
                printContent += '</tbody></table>';
            }

            var printWindow = window.open('', '_blank');
            printWindow.document.write('<html><head><title>' + escapeHtml(pigeon.ringNumber) + ' - ' + escapeHtml(pigeon.name) + '</title>');
            printWindow.document.write('<style>body { font-family: Arial, sans-serif; margin: 20px; } @media print { body { margin: 0; } } table { border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; }</style>');
            printWindow.document.write('</head><body>' + printContent + '</body></html>');
            printWindow.document.close();
            printWindow.print();
        }

        function exportJSON() {
            var exportType = document.querySelector('input[name="exportType"]:checked');
            if (!exportType) {
                showNotification('Please select an export option.', 'error');
                return;
            }

            var data;
            var filename;

            if (exportType.value === 'all') {
                data = {
                    user: currentUser,
                    pigeons: pigeons,
                    raceResults: raceResults,
                    exportDate: new Date().toISOString(),
                    totalPigeons: pigeons.length,
                    version: '4.0'
                };
                filename = currentUser + '_all_pigeons_' + new Date().toISOString().split('T')[0] + '.json';
            } else {
                var selectedPigeon = document.getElementById('exportPigeonSelect').value;
                if (!selectedPigeon) {
                    showNotification('Please select a pigeon to export.', 'error');
                    return;
                }
                
                var ringNumber = selectedPigeon.split(' - ')[0];
                var pigeon = findPigeonByRing(ringNumber);
                var pigeonRaces = raceResults.filter(function(r) { return r.pigeonId === pigeon.id; });
                
                data = {
                    user: currentUser,
                    pigeon: pigeon,
                    raceResults: pigeonRaces,
                    sire: findPigeonByRing(pigeon.fatherRing),
                    dam: findPigeonByRing(pigeon.motherRing),
                    siblings: findSiblings(pigeon),
                    exportDate: new Date().toISOString(),
                    version: '4.0'
                };
                filename = currentUser + '_' + pigeon.ringNumber.replace(/[^a-zA-Z0-9]/g, '_') + '_' + new Date().toISOString().split('T')[0] + '.json';
            }

            var dataStr = JSON.stringify(data, null, 2);
            var element = document.createElement('a');
            element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr));
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);

            showNotification('Data exported successfully!', 'success');
        }

        function printPedigreeTree() {
            var selectedPigeon = document.getElementById('pedigreeSelect').value;
            if (!selectedPigeon) {
                showNotification('Please select a pigeon first.', 'error');
                return;
            }

            var pedigreeContent = document.getElementById('pedigreeTree').innerHTML;
            
            var printWindow = window.open('', '_blank');
            printWindow.document.write('<html><head><title>Pedigree Tree - ' + selectedPigeon + '</title>');
            printWindow.document.write('<style>');
            printWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
            printWindow.document.write('.tree-container { position: relative; min-width: 1000px; height: 400px; font-family: Arial, sans-serif; font-size: 11px; }');
            printWindow.document.write('.tree-box { position: absolute; border: 2px solid #000; background: white; padding: 8px; min-width: 120px; max-width: 120px; min-height: 60px; overflow: hidden; box-sizing: border-box; }');
            printWindow.document.write('.tree-box.main { left: 20px; top: 160px; width: 150px; height: 90px; background: #FFE4B5; border: 3px solid #000; }');
            printWindow.document.write('.tree-box.sire { left: 200px; top: 120px; background: #FFB6C1; }');
            printWindow.document.write('.tree-box.dam { left: 200px; top: 220px; background: #E6E6FA; }');
            printWindow.document.write('.tree-box.sire-sire { left: 350px; top: 80px; background: #F0E68C; }');
            printWindow.document.write('.tree-box.sire-dam { left: 350px; top: 140px; background: #98FB98; }');
            printWindow.document.write('.tree-box.dam-sire { left: 350px; top: 200px; background: #87CEEB; }');
            printWindow.document.write('.tree-box.dam-dam { left: 350px; top: 260px; background: #DDA0DD; }');
            printWindow.document.write('.tree-box.sire-sire-sire { left: 500px; top: 60px; background: #FFEFD5; }');
            printWindow.document.write('.tree-box.sire-sire-dam { left: 500px; top: 100px; background: #F5DEB3; }');
            printWindow.document.write('.tree-box.sire-dam-sire { left: 500px; top: 130px; background: #FFFACD; }');
            printWindow.document.write('.tree-box.sire-dam-dam { left: 500px; top: 160px; background: #E0FFFF; }');
            printWindow.document.write('.tree-box.dam-sire-sire { left: 500px; top: 190px; background: #F0FFFF; }');
            printWindow.document.write('.tree-box.dam-sire-dam { left: 500px; top: 220px; background: #F5F5DC; }');
            printWindow.document.write('.tree-box.dam-dam-sire { left: 500px; top: 250px; background: #FDF5E6; }');
            printWindow.document.write('.tree-box.dam-dam-dam { left: 500px; top: 280px; background: #FAFAD2; }');
            printWindow.document.write('.tree-box.unknown { background: #F5F5F5; border: 2px dashed #999; color: #666; text-align: center; display: flex; align-items: center; justify-content: center; }');
            printWindow.document.write('.connection-line { position: absolute; background: #000; z-index: 1; }');
            printWindow.document.write('.h-line { height: 2px; }');
            printWindow.document.write('.v-line { width: 2px; }');
            printWindow.document.write('.ring-info { font-weight: bold; font-size: 10px; color: #000; margin-bottom: 3px; border-bottom: 1px solid #000; padding-bottom: 2px; }');
            printWindow.document.write('.main .ring-info { font-size: 12px; text-align: center; }');
            printWindow.document.write('.pigeon-name { font-weight: bold; font-size: 9px; margin-bottom: 2px; color: #000; }');
            printWindow.document.write('.main .pigeon-name { font-size: 11px; text-align: center; }');
            printWindow.document.write('.pigeon-info { font-size: 8px; line-height: 1.2; color: #333; }');
            printWindow.document.write('.main .pigeon-info { font-size: 9px; text-align: center; }');
            printWindow.document.write('.sex-indicator { display: inline-block; font-weight: bold; color: #000; }');
            printWindow.document.write('.male { color: #0066CC; }');
            printWindow.document.write('.female { color: #CC0066; }');
            printWindow.document.write('@media print { body { margin: 0; } }');
            printWindow.document.write('</style>');
            printWindow.document.write('</head><body>' + pedigreeContent + '</body></html>');
            printWindow.document.close();
            printWindow.print();
        }

        function clearAddForm() {
            var fields = ['ringNumber', 'pigeonName', 'owner', 'fatherRing', 'motherRing', 'notes', 'clubCode', 'customStrain'];
            for (var i = 0; i < fields.length; i++) {
                var field = document.getElementById(fields[i]);
                if (field) field.value = '';
            }
            
            var selects = ['country', 'ringColor', 'pigeonColor', 'strain', 'gender'];
            for (var j = 0; j < selects.length; j++) {
                var select = document.getElementById(selects[j]);
                if (select) select.selectedIndex = 0;
            }
            
            document.getElementById('customStrainInput').classList.remove('show');
        }

        function displayPigeons() {
            var container = document.getElementById('pigeonsContent');
            var pigeonsToShow = filteredPigeons.length > 0 || 
                document.getElementById('searchInput').value || 
                document.getElementById('countryFilter').value ||
                document.getElementById('strainFilter').value ||
                document.getElementById('colorFilter').value ? 
                filteredPigeons : pigeons;

            if (pigeonsToShow.length === 0) {
                if (pigeons.length === 0) {
                    container.innerHTML = '<div class="empty-state">No pigeons registered. Click "Add Pigeon" to start.</div>';
                } else {
                    container.innerHTML = '<div class="empty-state">No pigeons match the search criteria.</div>';
                }
                return;
            }

            var helpMessage = '<div class="click-hint">💡 Click on a card to see more details</div>';

            var pigeonsByYear = {};
            for (var i = 0; i < pigeonsToShow.length; i++) {
                var pigeon = pigeonsToShow[i];
                if (!pigeonsByYear[pigeon.year]) {
                    pigeonsByYear[pigeon.year] = [];
                }
                pigeonsByYear[pigeon.year].push(pigeon);
            }

            var years = Object.keys(pigeonsByYear).sort(function(a, b) { return b - a; });
            var html = '';

            for (var y = 0; y < years.length; y++) {
                var year = years[y];
                var yearPigeons = pigeonsByYear[year];

                html += '<div class="year-section fade-in">';
                html += '<div class="year-title">Year ' + year + ' (' + yearPigeons.length + ' pigeon' + (yearPigeons.length > 1 ? 's' : '') + ')</div>';
                html += '<div class="pigeon-grid">';

                for (var p = 0; p < yearPigeons.length; p++) {
                    var pigeon = yearPigeons[p];
                    var pigeonRaces = raceResults.filter(function(r) { return r.pigeonId === pigeon.id; });
                    var siblings = findSiblings(pigeon);

                    html += '<div class="pigeon-card" onclick="togglePigeonDetails(this)">';
                    html += '<div class="pigeon-number">' + escapeHtml(pigeon.ringNumber) + '</div>';
                    html += '<div class="expand-arrow">▼</div>';
                    html += '<div class="pigeon-country">' + pigeon.country + '</div>';
                    if (pigeon.clubCode) {
                        html += '<div class="club-code">' + escapeHtml(pigeon.clubCode) + '</div>';
                    }
                    html += '<div class="pigeon-name">' + escapeHtml(pigeon.name) + '</div>';
                    
                    html += '<div class="pigeon-summary">';
                    html += '<span>' + (pigeon.strain || 'No strain specified') + '</span>';
                    html += '<span>' + (pigeon.gender || '') + '</span>';
                    html += '</div>';
                    
                    if (pigeon.strain) {
                        html += '<div class="strain-badge">🏆 ' + pigeon.strain + '</div>';
                    }
                    
                    if (siblings.length > 0) {
                        html += '<div class="siblings-indicator">👥 ' + siblings.length + ' sibling' + (siblings.length > 1 ? 's' : '') + '</div>';
                    }
                    
                    html += '<div class="pigeon-details">';
                    html += '<div class="detail-row"><span class="detail-label">Badge Color:</span><span class="detail-value">' + (pigeon.ringColor || 'Not specified') + '</span></div>';
                    html += '<div class="detail-row"><span class="detail-label">Pigeon Color:</span><span class="detail-value">' + (pigeon.pigeonColor || 'Not specified') + '</span></div>';
                    html += '<div class="detail-row"><span class="detail-label">Strain:</span><span class="detail-value">' + (pigeon.strain || 'Not specified') + '</span></div>';
                    html += '<div class="detail-row"><span class="detail-label">Original by:</span><span class="detail-value">' + escapeHtml(pigeon.owner || 'Not specified') + '</span></div>';
                    html += '<div class="detail-row"><span class="detail-label">Sex:</span><span class="detail-value">' + ((pigeon.gender === 'Cock' ? 'M' : pigeon.gender === 'Hen' ? 'F' : 'Not specified')) + '</span></div>';
                    html += '<div class="detail-row"><span class="detail-label">Father:</span><span class="detail-value">' + escapeHtml(pigeon.fatherRing || 'Not specified') + '</span></div>';
                    html += '<div class="detail-row"><span class="detail-label">Mother:</span><span class="detail-value">' + escapeHtml(pigeon.motherRing || 'Not specified') + '</span></div>';
                    
                    if (pigeon.clubCode) {
                        html += '<div class="detail-row"><span class="detail-label">Club Code:</span><span class="detail-value">' + escapeHtml(pigeon.clubCode) + '</span></div>';
                    }

                    if (pigeonRaces.length > 0) {
                        html += '<div class="detail-row"><span class="detail-label">Pigeon Results:</span><span class="detail-value">' + pigeonRaces.length + ' result' + (pigeonRaces.length > 1 ? 's' : '') + '</span></div>';
                    }
                    
                    if (siblings.length > 0) {
                        html += '<div class="detail-row"><span class="detail-label">Siblings:</span><span class="detail-value">';
                        siblings.forEach(function(sibling, index) {
                            html += escapeHtml(sibling.ringNumber);
                            if (index < siblings.length - 1) html += ', ';
                        });
                        html += '</span></div>';
                    }

                    if (pigeon.notes) {
                        html += '<div class="notes-box"><strong>Notes:</strong><br>' + escapeHtml(pigeon.notes) + '</div>';
                    }

                    html += '<div class="card-actions">';
                    html += '<button class="btn btn-warning btn-small" onclick="event.stopPropagation(); editPigeon(\'' + pigeon.id + '\')">✏️ Edit</button>';
                    html += '<button class="btn btn-danger btn-small" onclick="event.stopPropagation(); deletePigeon(\'' + pigeon.id + '\')">🗑️ Delete</button>';
                    html += '</div>';

                    html += '</div>';
                    html += '</div>';
                }

                html += '</div>';
                html += '</div>';
            }

            container.innerHTML = helpMessage + html;
        }

        function togglePigeonDetails(card) {
            var details = card.querySelector('.pigeon-details');
            var arrow = card.querySelector('.expand-arrow');
            
            if (details.classList.contains('expanded')) {
                details.classList.remove('expanded');
                arrow.classList.remove('rotated');
            } else {
                details.classList.add('expanded');
                arrow.classList.add('rotated');
            }
        }

        function closeEditModal() {
            document.getElementById('editModal').style.display = 'none';
        }

        function escapeHtml(text) {
            if (!text) return '';
            var div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function importData(event) {
            var file = event.target.files[0];
            if (!file) return;

            var reader = new FileReader();
            reader.onload = function(e) {
                try {
                    var data = JSON.parse(e.target.result);
                    
                    if (data.pigeons && Array.isArray(data.pigeons)) {
                        if (confirm('Do you want to replace all existing data? This action cannot be undone.')) {
                            pigeons = data.pigeons;
                            raceResults = data.raceResults || [];
                            
                            pigeons.forEach(function(pigeon) {
                                if (!pigeon.id) {
                                    pigeon.id = generateId();
                                }
                            });

                            saveData();
                            updateStatistics();
                            populateFilters();
                            showPigeonsList();
                            showNotification('Data imported successfully! ' + pigeons.length + ' pigeons loaded.', 'success');
                        }
                    } else {
                        showNotification('Invalid file format.', 'error');
                    }
                } catch (error) {
                    showNotification('Error importing file.', 'error');
                }
            };
            reader.readAsText(file);
            
            event.target.value = '';
        }

        function clearAllData() {
            if (confirm('Are you sure you want to delete ALL data? This action cannot be undone.')) {
                if (confirm('Final confirmation: All data will be permanently lost!')) {
                    pigeons = [];
                    raceResults = [];
                    saveData();
                    updateStatistics();
                    populateFilters();
                    showPigeonsList();
                    showNotification('All data has been deleted.', 'info');
                }
            }
        }

        function showNotification(message, type) {
            var notification = document.createElement('div');
            notification.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1000; padding: 15px 20px; border-radius: 8px; color: white; font-weight: 600; max-width: 300px; word-wrap: break-word; animation: slideIn 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
            
            switch(type) {
                case 'success':
                    notification.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
                    break;
                case 'error':
                    notification.style.background = 'linear-gradient(135deg, #dc3545, #fd7e14)';
                    break;
                case 'info':
                    notification.style.background = 'linear-gradient(135deg, #17a2b8, #6f42c1)';
                    break;
                default:
                    notification.style.background = 'linear-gradient(135deg, #6c757d, #495057)';
            }
            
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(function() {
                notification.style.animation = 'fadeOut 0.3s ease';
                setTimeout(function() {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }

        document.addEventListener('DOMContentLoaded', function() {
            var savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.setAttribute('data-theme', 'dark');
                document.querySelector('.theme-toggle').textContent = '☀️';
            }

            var loginInputs = ['username', 'password'];
            for (var i = 0; i < loginInputs.length; i++) {
                var input = document.getElementById(loginInputs[i]);
                if (input) {
                    input.addEventListener('keypress', function(e) {
                        if (e.key === 'Enter') {
                            login();
                        }
                    });
                }
            }
            
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                var viewportTag = document.querySelector('meta[name="viewport"]');
                if (viewportTag) {
                    viewportTag.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
                }
            }

            setInterval(function() {
                if (currentUser && pigeons.length > 0) {
                    saveData();
                }
            }, 300000);

            setTimeout(function() {
                console.log('🐦 Racing Pigeon Manager is ready!');
                console.log('💡 Tip: You can install this app on your phone from the browser menu');
            }, 1000);
        });
    