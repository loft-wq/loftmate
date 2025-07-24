var currentUser = '';
var pigeons = [];
var raceResults = [];
var editingPigeonId = null;
var filteredPigeons = [];

// تهيئة بيانات تجريبية
pigeons.push({
    id: generateId(),
    ringNumber: '25-01741',
    country: '🇫🇷',
    name: 'البطل ألفا',
    ringColor: 'أحمر',
    pigeonColor: 'أزرق مخطط',
    breed: 'جانسن',
    owner: 'أحمد محمد',
    gender: 'ذكر',
    fatherRing: '23-15432',
    motherRing: '24-98765',
    notes: 'حمامة ممتازة للمسافات الطويلة، منتظمة في المسابقات. أداء استثنائي على المسافات البعيدة.',
    year: 2025,
    addedDate: new Date().toISOString()
});

pigeons.push({
    id: generateId(),
    ringNumber: '25-01802',
    country: '🇧🇪',
    name: 'النجمة الجميلة',
    ringColor: 'أزرق',
    pigeonColor: 'أحمر متقشر',
    breed: 'جابي فاندنابيلي',
    owner: 'فاطمة أحمد',
    gender: 'أنثى',
    fatherRing: '23-11234',
    motherRing: '24-55678',
    notes: 'مربية استثنائية، أم للعديد من الأبطال.',
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
            
            // التأكد من أن جميع الحمام لديهم معرفات
            pigeons.forEach(function(pigeon) {
                if (!pigeon.id) {
                    pigeon.id = generateId();
                }
            });
            
            return true;
        }
    } catch (e) {
        console.log('خطأ في تحميل البيانات:', e);
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
        console.log('خطأ في حفظ البيانات:', e);
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
        showPigeonsList();
        
        setTimeout(function() {
            showNotification('تم تسجيل الدخول بنجاح! أهلاً وسهلاً ' + username, 'success');
        }, 500);
    } else {
        showNotification('يرجى إدخال اسم المستخدم وكلمة المرور.', 'error');
    }
}

function logout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('mainApp').classList.add('hidden');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        currentUser = '';
        showNotification('تم تسجيل الخروج.', 'info');
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

function updateStatistics() {
    var total = pigeons.length;
    var males = pigeons.filter(function(p) { return p.gender === 'ذكر'; }).length;
    var females = pigeons.filter(function(p) { return p.gender === 'أنثى'; }).length;
    var young = pigeons.filter(function(p) { return p.year === new Date().getFullYear(); }).length;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('maleCount').textContent = males;
    document.getElementById('femaleCount').textContent = females;
    document.getElementById('youngCount').textContent = young;
}

function populateFilters() {
    var countries = new Set();
    var breeds = new Set();
    var colors = new Set();

    pigeons.forEach(function(pigeon) {
        if (pigeon.country) countries.add(pigeon.country);
        if (pigeon.breed) breeds.add(pigeon.breed);
        if (pigeon.pigeonColor) colors.add(pigeon.pigeonColor);
    });

    populateSelect('countryFilter', Array.from(countries));
    populateSelect('breedFilter', Array.from(breeds));
    populateSelect('colorFilter', Array.from(colors));
    populateSelect('raceParticipant', pigeons.map(function(p) { return p.ringNumber + ' - ' + p.name; }));
}

function populateSelect(selectId, options) {
    var select = document.getElementById(selectId);
    var currentValue = select.value;
    
    // الاحتفاظ بالخيار الأول ومسح الباقي
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

function filterPigeons() {
    var searchTerm = document.getElementById('searchInput').value.toLowerCase();
    var countryFilter = document.getElementById('countryFilter').value;
    var breedFilter = document.getElementById('breedFilter').value;
    var colorFilter = document.getElementById('colorFilter').value;

    filteredPigeons = pigeons.filter(function(pigeon) {
        var matchesSearch = !searchTerm || 
            pigeon.name.toLowerCase().includes(searchTerm) ||
            pigeon.ringNumber.toLowerCase().includes(searchTerm) ||
            (pigeon.owner && pigeon.owner.toLowerCase().includes(searchTerm));
        
        var matchesCountry = !countryFilter || pigeon.country === countryFilter;
        var matchesBreed = !breedFilter || pigeon.breed === breedFilter;
        var matchesColor = !colorFilter || pigeon.pigeonColor === colorFilter;

        return matchesSearch && matchesCountry && matchesBreed && matchesColor;
    });

    displayPigeons();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('countryFilter').selectedIndex = 0;
    document.getElementById('breedFilter').selectedIndex = 0;
    document.getElementById('colorFilter').selectedIndex = 0;
    filterPigeons();
}

function showAddForm() {
    editingPigeonId = null;
    document.getElementById('formTitle').textContent = 'إضافة حمامة جديدة';
    document.getElementById('saveButtonText').textContent = 'حفظ';
    
    document.getElementById('addForm').classList.remove('hidden');
    document.getElementById('addForm').classList.add('fade-in');
    document.getElementById('pigeonsList').classList.add('hidden');
    document.getElementById('raceManager').classList.add('hidden');
    
    clearAddForm();
    
    setTimeout(function() {
        document.getElementById('ringNumber').focus();
    }, 100);
}

function showRaceManager() {
    document.getElementById('raceManager').classList.remove('hidden');
    document.getElementById('raceManager').classList.add('fade-in');
    document.getElementById('addForm').classList.add('hidden');
    document.getElementById('pigeonsList').classList.add('hidden');
    
    populateFilters();
}

function showPigeonsList() {
    document.getElementById('addForm').classList.add('hidden');
    document.getElementById('raceManager').classList.add('hidden');
    document.getElementById('pigeonsList').classList.remove('hidden');
    document.getElementById('pigeonsList').classList.add('fade-in');
    
    updateStatistics();
    populateFilters();
    filterPigeons();
}

function savePigeon() {
    var ringNumber = document.getElementById('ringNumber').value.trim();
    var country = document.getElementById('country').value;
    var name = document.getElementById('pigeonName').value.trim();
    var ringColor = document.getElementById('ringColor').value;
    var pigeonColor = document.getElementById('pigeonColor').value;
    var breed = document.getElementById('breed').value;
    var owner = document.getElementById('owner').value.trim();
    var gender = document.getElementById('gender').value;
    var fatherRing = document.getElementById('fatherRing').value.trim();
    var motherRing = document.getElementById('motherRing').value.trim();
    var notes = document.getElementById('notes').value.trim();

    if (!ringNumber || !country) {
        showNotification('يرجى إدخال رقم الحلقة والبلد على الأقل.', 'error');
        return;
    }

    // التحقق من تكرار أرقام الحلقات (باستثناء عند التعديل)
    var existingPigeon = pigeons.find(function(p) { 
        return p.ringNumber === ringNumber && p.id !== editingPigeonId; 
    });
    
    if (existingPigeon) {
        showNotification('رقم الحلقة هذا موجود بالفعل. يرجى استخدام رقم آخر.', 'error');
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
        name: name || 'بدون اسم',
        ringColor: ringColor,
        pigeonColor: pigeonColor,
        breed: breed,
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
        showNotification('تم تعديل الحمامة بنجاح!', 'success');
    } else {
        pigeons.push(pigeon);
        showNotification('تم إضافة الحمامة بنجاح!', 'success');
    }

    saveData();
    clearAddForm();
    showPigeonsList();
}

function editPigeon(pigeonId) {
    var pigeon = pigeons.find(function(p) { return p.id === pigeonId; });
    if (!pigeon) return;

    editingPigeonId = pigeonId;
    document.getElementById('formTitle').textContent = 'تعديل الحمامة';
    document.getElementById('saveButtonText').textContent = 'تحديث';

    // ملء النموذج ببيانات الحمامة
    document.getElementById('ringNumber').value = pigeon.ringNumber;
    document.getElementById('country').value = pigeon.country;
    document.getElementById('pigeonName').value = pigeon.name;
    document.getElementById('ringColor').value = pigeon.ringColor || '';
    document.getElementById('pigeonColor').value = pigeon.pigeonColor || '';
    document.getElementById('breed').value = pigeon.breed || '';
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

    if (confirm('هل أنت متأكد من حذف الحمامة "' + pigeon.name + '" (' + pigeon.ringNumber + ')؟')) {
        pigeons = pigeons.filter(function(p) { return p.id !== pigeonId; });
        raceResults = raceResults.filter(function(r) { return r.pigeonId !== pigeonId; });
        
        saveData();
        showNotification('تم حذف الحمامة بنجاح.', 'info');
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
        showNotification('يرجى ملء جميع الحقول المطلوبة.', 'error');
        return;
    }

    var ringNumber = participantText.split(' - ')[0];
    var pigeon = pigeons.find(function(p) { return p.ringNumber === ringNumber; });
    
    if (!pigeon) {
        showNotification('الحمامة غير موجودة.', 'error');
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
    
    showNotification('تم إضافة نتيجة المسابقة بنجاح!', 'success');
    
    // مسح النموذج
    document.getElementById('raceName').value = '';
    document.getElementById('raceDate').value = '';
    document.getElementById('raceDistance').value = '';
    document.getElementById('raceParticipant').selectedIndex = 0;
    document.getElementById('racePosition').value = '';
    document.getElementById('raceSpeed').value = '';
}

function clearAddForm() {
    var fields = ['ringNumber', 'pigeonName', 'owner', 'fatherRing', 'motherRing', 'notes'];
    for (var i = 0; i < fields.length; i++) {
        document.getElementById(fields[i]).value = '';
    }
    
    var selects = ['country', 'ringColor', 'pigeonColor', 'breed', 'gender'];
    for (var j = 0; j < selects.length; j++) {
        document.getElementById(selects[j]).selectedIndex = 0;
    }
}

function displayPigeons() {
    var container = document.getElementById('pigeonsContent');
    var pigeonsToShow = filteredPigeons.length > 0 || 
        document.getElementById('searchInput').value || 
        document.getElementById('countryFilter').value ||
        document.getElementById('breedFilter').value ||
        document.getElementById('colorFilter').value ? 
        filteredPigeons : pigeons;

    if (pigeonsToShow.length === 0) {
        if (pigeons.length === 0) {
            container.innerHTML = '<div class="empty-state">لا توجد حمامات مسجلة. انقر على "إضافة حمامة" للبدء.</div>';
        } else {
            container.innerHTML = '<div class="empty-state">لا توجد حمامات تطابق معايير البحث.</div>';
        }
        return;
    }

    var helpMessage = '<div class="click-hint">💡 انقر على البطاقة لرؤية المزيد من التفاصيل</div>';

    // تجميع الحمام حسب السنة
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
        html += '<div class="year-title">سنة ' + year + ' (' + yearPigeons.length + ' حمامة' + (yearPigeons.length > 1 ? '' : '') + ')</div>';
        html += '<div class="pigeon-grid">';

        for (var p = 0; p < yearPigeons.length; p++) {
            var pigeon = yearPigeons[p];
            var pigeonRaces = raceResults.filter(function(r) { return r.pigeonId === pigeon.id; });

            html += '<div class="pigeon-card" onclick="togglePigeonDetails(this)">';
            html += '<div class="pigeon-number">' + escapeHtml(pigeon.ringNumber) + '</div>';
            html += '<div class="expand-arrow">▼</div>';
            html += '<div class="pigeon-country">' + pigeon.country + '</div>';
            html += '<div class="pigeon-name">' + escapeHtml(pigeon.name) + '</div>';
            
            html += '<div class="pigeon-summary">';
            html += '<span>' + (pigeon.breed || 'سلالة غير محددة') + '</span>';
            html += '<span>' + (pigeon.gender || '') + '</span>';
            html += '</div>';
            
            if (pigeon.breed) {
                html += '<div class="race-badge">🏆 ' + pigeon.breed + '</div>';
            }
            
            html += '<div class="pigeon-details">';
            html += '<div class="detail-row"><span class="detail-label">لون الحلقة:</span><span class="detail-value">' + (pigeon.ringColor || 'غير محدد') + '</span></div>';
            html += '<div class="detail-row"><span class="detail-label">لون الحمامة:</span><span class="detail-value">' + (pigeon.pigeonColor || 'غير محدد') + '</span></div>';
            html += '<div class="detail-row"><span class="detail-label">السلالة:</span><span class="detail-value">' + (pigeon.breed || 'غير محددة') + '</span></div>';
            html += '<div class="detail-row"><span class="detail-label">المالك:</span><span class="detail-value">' + escapeHtml(pigeon.owner || 'غير محدد') + '</span></div>';
            html += '<div class="detail-row"><span class="detail-label">الجنس:</span><span class="detail-value">' + (pigeon.gender || 'غير محدد') + '</span></div>';
            html += '<div class="detail-row"><span class="detail-label">الأب:</span><span class="detail-value">' + escapeHtml(pigeon.fatherRing || 'غير محدد') + '</span></div>';
            html += '<div class="detail-row"><span class="detail-label">الأم:</span><span class="detail-value">' + escapeHtml(pigeon.motherRing || 'غير محددة') + '</span></div>';

            if (pigeonRaces.length > 0) {
                html += '<div class="detail-row"><span class="detail-label">المسابقات:</span><span class="detail-value">' + pigeonRaces.length + ' نتيجة</span></div>';
            }

            if (pigeon.notes) {
                html += '<div class="notes-box"><strong>ملاحظات:</strong><br>' + escapeHtml(pigeon.notes) + '</div>';
            }

            html += '<div class="card-actions">';
            html += '<button class="btn btn-warning btn-small" onclick="event.stopPropagation(); editPigeon(\'' + pigeon.id + '\')">✏️ تعديل</button>';
            html += '<button class="btn btn-danger btn-small" onclick="event.stopPropagation(); deletePigeon(\'' + pigeon.id + '\')">🗑️ حذف</button>';
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

function exportData() {
    var data = {
        user: currentUser,
        pigeons: pigeons,
        raceResults: raceResults,
        exportDate: new Date().toISOString(),
        totalPigeons: pigeons.length,
        version: '3.0'
    };

    var dataStr = JSON.stringify(data, null, 2);
    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr));
    element.setAttribute('download', 'pigeon_backup_' + new Date().toISOString().split('T')[0] + '.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    showNotification('تم تصدير البيانات بنجاح!\nعدد الحمامات: ' + pigeons.length, 'success');
}

function importData(event) {
    var file = event.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            var data = JSON.parse(e.target.result);
            
            if (data.pigeons && Array.isArray(data.pigeons)) {
                if (confirm('هل تريد استبدال جميع البيانات الموجودة؟ هذا الإجراء لا يمكن التراجع عنه.')) {
                    pigeons = data.pigeons;
                    raceResults = data.raceResults || [];
                    
                    // التأكد من أن جميع الحمامات لديها معرفات
                    pigeons.forEach(function(pigeon) {
                        if (!pigeon.id) {
                            pigeon.id = generateId();
                        }
                    });

                    saveData();
                    updateStatistics();
                    populateFilters();
                    showPigeonsList();
                    showNotification('تم استيراد البيانات بنجاح! ' + pigeons.length + ' حمامة تم تحميلها.', 'success');
                }
            } else {
                showNotification('تنسيق الملف غير صحيح.', 'error');
            }
        } catch (error) {
            showNotification('خطأ في استيراد الملف.', 'error');
        }
    };
    reader.readAsText(file);
    
    // إعادة تعيين مدخل الملف
    event.target.value = '';
}

function clearAllData() {
    if (confirm('هل أنت متأكد من حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
        if (confirm('تأكيد أخير: جميع البيانات ستفقد نهائياً!')) {
            pigeons = [];
            raceResults = [];
            saveData();
            updateStatistics();
            populateFilters();
            showPigeonsList();
            showNotification('تم حذف جميع البيانات.', 'info');
        }
    }
}

function generatePDF() {
    var printContent = '';
    printContent += '<h1 style="text-align: center; color: #667eea;">📋 قائمة الحمام</h1>';
    printContent += '<p style="text-align: center; margin-bottom: 30px;">تم إنشاؤه في: ' + new Date().toLocaleDateString('ar-SA') + '</p>';
    
    printContent += '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px;">';
    printContent += '<div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;"><strong>الإجمالي:</strong> ' + pigeons.length + '</div>';
    printContent += '<div style="text-align: center; padding: 15px; background: #e3f2fd; border-radius: 8px;"><strong>ذكور:</strong> ' + pigeons.filter(function(p) { return p.gender === 'ذكر'; }).length + '</div>';
    printContent += '<div style="text-align: center; padding: 15px; background: #fce4ec; border-radius: 8px;"><strong>إناث:</strong> ' + pigeons.filter(function(p) { return p.gender === 'أنثى'; }).length + '</div>';
    printContent += '<div style="text-align: center; padding: 15px; background: #e8f5e8; border-radius: 8px;"><strong>صغار:</strong> ' + pigeons.filter(function(p) { return p.year === new Date().getFullYear(); }).length + '</div>';
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
        printContent += '<h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">سنة ' + year + ' (' + pigeonsByYear[year].length + ' حمامة)</h2>';
        
        pigeonsByYear[year].forEach(function(pigeon) {
            printContent += '<div style="border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 8px; page-break-inside: avoid;">';
            printContent += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">';
            printContent += '<h3 style="color: #667eea; margin: 0;">' + escapeHtml(pigeon.ringNumber) + ' - ' + escapeHtml(pigeon.name) + '</h3>';
            printContent += '<span style="font-size: 1.5em;">' + pigeon.country + '</span>';
            printContent += '</div>';
            
            printContent += '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 14px;">';
            printContent += '<div><strong>السلالة:</strong> ' + (pigeon.breed || 'غير محددة') + '</div>';
            printContent += '<div><strong>الجنس:</strong> ' + (pigeon.gender || 'غير محدد') + '</div>';
            printContent += '<div><strong>اللون:</strong> ' + (pigeon.pigeonColor || 'غير محدد') + '</div>';
            printContent += '<div><strong>المالك:</strong> ' + escapeHtml(pigeon.owner || 'غير محدد') + '</div>';
            printContent += '<div><strong>الأب:</strong> ' + escapeHtml(pigeon.fatherRing || 'غير محدد') + '</div>';
            printContent += '<div><strong>الأم:</strong> ' + escapeHtml(pigeon.motherRing || 'غير محددة') + '</div>';
            printContent += '</div>';
            
            if (pigeon.notes) {
                printContent += '<div style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-left: 4px solid #667eea; font-style: italic;"><strong>ملاحظات:</strong> ' + escapeHtml(pigeon.notes) + '</div>';
            }
            
            printContent += '</div>';
        });
    });

    var printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>قائمة الحمام</title>');
    printWindow.document.write('<style>body { font-family: Arial, sans-serif; margin: 20px; direction: rtl; } @media print { body { margin: 0; } }</style>');
    printWindow.document.write('</head><body>' + printContent + '</body></html>');
    printWindow.document.close();
    printWindow.print();
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
    // تحميل الثيم
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.querySelector('.theme-toggle').textContent = '☀️';
    }

    // معالجة لوحة المفاتيح لنموذج تسجيل الدخول
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
    
    // منع التكبير في iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        var viewportTag = document.querySelector('meta[name="viewport"]');
        if (viewportTag) {
            viewportTag.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }
    }

    // حفظ تلقائي كل 5 دقائق
    setInterval(function() {
        if (currentUser && pigeons.length > 0) {
            saveData();
        }
    }, 300000);
});