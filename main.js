// Consolidated site JS for all pages

// Form validation utilities (moved from form-validation.js)
class FormValidator {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    static validatePhone(phone) {
        const phoneRegex = /^[0-9\-\+]{9,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
    
    static validateRequired(value) {
        return value && value.trim().length > 0;
    }
    
    static showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    static hideError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    static markAsValid(input) {
        input.classList.remove('error-input');
        input.classList.add('valid-input');
    }
    
    static markAsInvalid(input) {
        input.classList.add('error-input');
        input.classList.remove('valid-input');
    }
}

// Events filtering class (moved from events-filter.js)
class EventsFilter {
    constructor(events) {
        this.events = events;
        this.filteredEvents = [...events];
        this.currentFilter = 'all';
        this.currentPage = 1;
        this.eventsPerPage = 6;
    }
    
    filterByCategory(category) {
        this.currentFilter = category;
        const today = new Date();
        
        if (category === 'all') {
            this.filteredEvents = [...this.events];
        } else if (category === 'upcoming') {
            this.filteredEvents = this.events.filter(event => {
                return event.category === 'upcoming' || 
                      (event.type === 'event' && new Date(event.date) >= today);
            });
        } else if (category === 'past') {
            this.filteredEvents = this.events.filter(event => {
                return event.category === 'past' || 
                      (event.type === 'event' && new Date(event.date) < today);
            });
        } else {
            this.filteredEvents = this.events.filter(event => event.type === category);
        }
        
        this.currentPage = 1;
        return this.filteredEvents;
    }
    
    searchEvents(searchTerm) {
        const term = searchTerm.toLowerCase();
        this.filteredEvents = this.events.filter(event => 
            event.title.toLowerCase().includes(term) || 
            event.description.toLowerCase().includes(term)
        );
        
        this.currentPage = 1;
        return this.filteredEvents;
    }
    
    getPaginatedEvents() {
        const startIndex = (this.currentPage - 1) * this.eventsPerPage;
        const endIndex = startIndex + this.eventsPerPage;
        return this.filteredEvents.slice(startIndex, endIndex);
    }
    
    nextPage() {
        const totalPages = Math.ceil(this.filteredEvents.length / this.eventsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            return true;
        }
        return false;
    }
    
    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            return true;
        }
        return false;
    }
    
    getPageInfo() {
        const totalPages = Math.ceil(this.filteredEvents.length / this.eventsPerPage);
        return {
            current: this.currentPage,
            total: totalPages,
            hasNext: this.currentPage < totalPages,
            hasPrev: this.currentPage > 1
        };
    }
}

// Services tabs class (moved from services-tabs.js)
class ServicesTabs {
    constructor() {
        this.tabs = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.currentTab = 'business';
        this.servicesData = {};
        
        if (this.tabs.length) this.initialize();
    }
    
    initialize() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
        this.loadServicesData();
    }
    
    switchTab(tabId) {
        this.currentTab = tabId;
        this.tabs.forEach(tab => {
            if (tab.getAttribute('data-tab') === tabId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        this.tabContents.forEach(content => {
            if (content.id === `${tabId}-tab-content`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        if (!this.servicesData[tabId]) {
            this.loadTabServices(tabId);
        }
    }
    
    loadServicesData() {
        this.servicesData = {
            business: [
                { 
                    id: 1, 
                    name: "Business Permit Application", 
                    description: "Process and requirements for new business registration and renewal of permits.",
                    requirements: ["Barangay Clearance", "Proof of Business Address", "DTI/SEC Registration", "Mayor's Permit from Previous Year (for renewal)"],
                    processingTime: "3-5 working days",
                    fee: "Based on business capitalization"
                }
            ]
        };
    }
    
    loadTabServices(tabId) {
        console.log(`Loading services for ${tabId} tab`);
    }
    
    searchServices(searchTerm) {
        console.log(`Searching for: ${searchTerm}`);
    }
}

// Utility: close modal by clicking outside and mobile menu
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) this.style.display = 'none';
        });
    });

    // Set current year if present
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Page-specific initializations
    if (document.getElementById('announcements-list')) {
        loadAnnouncements();
    }

    if (document.getElementById('city-officials-container')) {
        loadCityOfficials();
        loadDepartments();
    }

    if (document.getElementById('business-services')) {
        initializeServices();
        // initialize tab controls
        new ServicesTabs();
        // search and online service buttons
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) searchBtn.addEventListener('click', searchServices);
        const servicesSearch = document.getElementById('servicesSearch');
        if (servicesSearch) servicesSearch.addEventListener('keyup', function(e) { if (e.key === 'Enter') searchServices(); });

        const eservicesBtn = document.getElementById('eservicesBtn');
        if (eservicesBtn) eservicesBtn.addEventListener('click', function(){ alert('E-Services portal would open in a real implementation.'); });
        const appointmentBtn = document.getElementById('appointmentBtn');
        if (appointmentBtn) appointmentBtn.addEventListener('click', function(){ alert('Appointment system would open in a real implementation.'); });
        const downloadFormsBtn = document.getElementById('downloadFormsBtn');
        if (downloadFormsBtn) downloadFormsBtn.addEventListener('click', function(){ alert('Forms download page would open in a real implementation.'); });
        const serviceGuideBtn = document.getElementById('serviceGuideBtn');
        if (serviceGuideBtn) serviceGuideBtn.addEventListener('click', function(){ alert('Service guide PDF would download in a real implementation.'); });
    }

    if (document.getElementById('events-container')) {
        loadEvents();
        initializeCalendar();
        // Event search
        const searchBtn = document.getElementById('searchEventsBtn');
        if (searchBtn) searchBtn.addEventListener('click', searchEvents);
        const eventSearch = document.getElementById('eventSearch');
        if (eventSearch) eventSearch.addEventListener('keyup', function(e){ if (e.key === 'Enter') searchEvents(); });

        const subscribeBtn = document.getElementById('subscribeBtn');
        if (subscribeBtn) subscribeBtn.addEventListener('click', function(){
            const email = document.getElementById('subscribeEmail').value;
            if (email && isValidEmail(email)) {
                alert(`Thank you for subscribing with ${email}! You will receive notifications about upcoming events and announcements.`);
                document.getElementById('subscribeEmail').value = '';
                const subscriptions = JSON.parse(localStorage.getItem('bacoorSubscriptions') || '[]');
                subscriptions.push({ email, date: new Date().toISOString() });
                localStorage.setItem('bacoorSubscriptions', JSON.stringify(subscriptions));
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

    // Initialize any accordion controls present on the page (used in multiple pages)
    if (document.querySelector('.accordion-btn')) {
        setupAccordion();
    }

    if (document.getElementById('contactForm')) {
        setActiveNavLink();
        setupAccordion();
        loadSavedFormData();
        document.getElementById('contactForm').addEventListener('submit', handleFormSubmit);

        const volunteerBtn = document.getElementById('volunteerBtn');
        if (volunteerBtn) volunteerBtn.addEventListener('click', function(){ showVolunteerModal('City Volunteer Program', getVolunteerProgramContent()); });
        const membershipBtn = document.getElementById('membershipBtn');
        if (membershipBtn) membershipBtn.addEventListener('click', function(){ showVolunteerModal('Community Programs Membership', getMembershipContent()); });
        const donationBtn = document.getElementById('donationBtn');
        if (donationBtn) donationBtn.addEventListener('click', function(){ showVolunteerModal('Donations & Support', getDonationContent()); });
    }
});

// Modal functions
function openModal(title, date, content) {
    const modal = document.getElementById('announcementModal');
    if (!modal) return;
    const titleEl = document.getElementById('modal-title');
    const dateEl = document.getElementById('modal-date');
    const contentEl = document.getElementById('modal-content');
    if (titleEl) titleEl.textContent = title;
    if (dateEl) dateEl.textContent = date;
    if (contentEl) contentEl.innerHTML = content;
    modal.style.display = 'flex';
    const closeBtn = document.getElementById('closeModalBtn');
    if (closeBtn) closeBtn.addEventListener('click', function(){ modal.style.display = 'none'; });
}

// Email validation utility
function isValidEmail(email) {
    return FormValidator.validateEmail(email);
}

// --- Home page: Announcements ---
function loadAnnouncements() {
    const announcements = [
        { id:1, title: "Road Closure Advisory", content: "Main Street will be closed for road repairs from October 15-20, 2023. Please use alternate routes. Emergency vehicles will still have access. For inquiries, contact the City Engineering Office.", date: "October 10, 2023", type: "announcement" },
        { id:2, title: "Free Medical Check-up", content: "The City Health Office will conduct free medical check-ups for senior citizens on October 25, 2023 at the City Hall grounds from 8:00 AM to 4:00 PM. Bring your senior citizen ID and medical records.", date: "October 8, 2023", type: "announcement" },
        { id:3, title: "Business Permit Renewal", content: "Reminder: Business permit renewal for 2024 will start on November 1, 2023. Early renewal (November 1-30) gets 5% discount. Online renewal is available through our e-Services portal.", date: "October 5, 2023", type: "announcement" }
    ];
    const container = document.getElementById('announcements-list');
    if (!container) return;
    container.innerHTML = '';
    announcements.forEach(announcement => {
        const announcementEl = document.createElement('div');
        announcementEl.className = 'announcement-item';
        announcementEl.innerHTML = `
            <div>
                <h4 style="margin-bottom: 5px;">${announcement.title}</h4>
                <p>${announcement.content.substring(0,100)}...</p>
            </div>
            <div class="announcement-date">${announcement.date}</div>
        `;
        announcementEl.addEventListener('click', () => {
            openModal(announcement.title, announcement.date, `<p>${announcement.content}</p>`);
        });
        container.appendChild(announcementEl);
    });
}

// --- About page: City officials & departments ---
function loadCityOfficials() {
    const officials = [
        { name: "Mayor Strike B. Revilla", position: "City Mayor", department: "Executive Office", image: "mayor.jpg" },
        { name: "Vice Mayor Rowena Bautista-Mendiola", position: "City Vice Mayor", department: "Legislative Office", image: "vice-mayor.jpg" },
        { name: "Hon. Lani Mercado-Revilla", position: "Congresswoman", department: "2nd Legislative District, Province of Cavite", image: "congress.jpg" },
        { name: "Hon. Edwin Malvar", position: "Board Member", department: "Committee on Rules", image: "councilor2.jpg" },
        { name: "Hon. Alde Joselito Pagulayan", position: "Board Member", department: "Committe on Housing, Land Utilization, and Urban Development", image: "alde.jpg" },
        { name: "Hon. Rafael Paterno III", position: "Board Member", department: "ABC President", image: "abc.jpg" }
    ];
    const container = document.getElementById('city-officials-container');
    if (!container) return;
    container.innerHTML = '';
    officials.forEach(official => {
        const officialEl = document.createElement('div');
        officialEl.className = 'official-card';
        const imgSrc = `../assests/${official.image}`;
        officialEl.innerHTML = `
            <div class="official-photo">
                <img src="${imgSrc}" alt="${official.name}" onerror="this.onerror=null;this.src='../assests/bacoorlogo.png'" />
            </div>
            <h4>${official.name}</h4>
            <p><strong>${official.position}</strong></p>
            <p>${official.department}</p>
        `;
        container.appendChild(officialEl);
    });
}

function loadDepartments() {
    const departments = [
        { name: "City Mayor's Office", head: "Mayor Strike B. Revilla", contact: "(046) 434-9801" },
        { name: "City Health Office", head: "Dr. Roberto M. Cruz", contact: "(046) 434-9810" },
        { name: "City Engineering Office", head: "Engr. Mario S. Tolentino", contact: "(046) 434-9815" },
        { name: "City Social Welfare", head: "Ms. Anna L. Garcia", contact: "(046) 434-9820" },
        { name: "City Treasurer's Office", head: "Mr. Carlos D. Reyes", contact: "(046) 434-9825" },
        { name: "City Planning Office", head: "Arch. Maria S. Lopez", contact: "(046) 434-9830" }
    ];
    const container = document.getElementById('departments-container');
    if (!container) return;
    container.innerHTML = '';
    departments.forEach(dept => {
        const deptEl = document.createElement('div');
        deptEl.className = 'department-card';
        deptEl.innerHTML = `
            <h4>${dept.name}</h4>
            <p><strong>Department Head:</strong> ${dept.head}</p>
            <p><strong>Contact:</strong> ${dept.contact}</p>
            <a href="contact.html" class="btn btn-small">Contact Department</a>
        `;
        container.appendChild(deptEl);
    });
}

// --- Services page ---
function initializeServices() {
    loadBusinessServices();
    loadHealthServices();
    loadSocialServices();
    loadEducationServices();
    loadInfrastructureServices();
}

function loadBusinessServices() {
    const services = [
        { id:1, name: "Business Permit Application", description: "Process and requirements for new business registration and renewal of permits.", requirements: ["Barangay Clearance","Proof of Business Address","DTI/SEC Registration","Mayor's Permit from Previous Year (for renewal)"], processingTime: "3-5 working days", fee: "Based on business capitalization" },
        { id:2, name: "Mayor's Clearance", description: "Application for Mayor's Clearance for various purposes including employment and travel.", requirements: ["Valid ID","Barangay Clearance","Purpose Letter"], processingTime: "1-2 working days", fee: "PHP 100.00" },
        { id:3, name: "Market Stall Rental", description: "Information on public market stall availability and rental procedures.", requirements: ["Valid ID","Business Plan","Clearance from Market Administrator"], processingTime: "5-7 working days", fee: "Based on stall size and location" }
    ];
    const container = document.getElementById('business-services');
    renderServices(services, container);
}

function loadHealthServices() {
    const services = [
        { id:4, name: "Medical Consultations", description: "Free medical consultations at City Health Office and Barangay Health Centers.", requirements: ["Valid ID","Health Card (if available)"], processingTime: "Same day", fee: "Free" },
        { id:5, name: "Immunization Services", description: "Vaccination programs for children, adults, and senior citizens.", requirements: ["Vaccination Card","Valid ID"], processingTime: "Same day", fee: "Free" }
    ];
    const container = document.getElementById('health-services');
    renderServices(services, container);
}

function loadSocialServices() {
    const services = [
        { id:6, name: "Social Assistance", description: "Support services for marginalized and vulnerable groups.", requirements: ["Valid ID","Proof of Residency"], processingTime: "Varies", fee: "Free" }
    ];
    const container = document.getElementById('social-services');
    renderServices(services, container);
}

function loadEducationServices() {
    const services = [
        { id:7, name: "Scholarship Program", description: "Scholarships and financial assistance for deserving students.", requirements: ["Application Form","Transcript of Records"], processingTime: "Varies", fee: "Free" }
    ];
    const container = document.getElementById('education-services');
    renderServices(services, container);
}

function loadInfrastructureServices() {
    const services = [
        { id:8, name: "Road Repair Requests", description: "Report road damage and request repairs.", requirements: ["Location Details","Photos (if available)"], processingTime: "Varies", fee: "N/A" }
    ];
    const container = document.getElementById('infra-services');
    renderServices(services, container);
}

function renderServices(services, container) {
    if (!container) return;
    container.innerHTML = '';
    services.forEach(service => {
        const serviceEl = document.createElement('div');
        serviceEl.className = 'service-item';
        serviceEl.innerHTML = `
            <h4>${service.name}</h4>
            <p>${service.description}</p>
            <div class="service-details">
                <p><strong>Processing Time:</strong> ${service.processingTime}</p>
                <p><strong>Fee:</strong> ${service.fee}</p>
            </div>
            <button class="btn btn-small view-details-btn" data-service-id="${service.id}">View Details & Requirements</button>
        `;
        const btn = serviceEl.querySelector('.view-details-btn');
        if (btn) btn.addEventListener('click', function(){ showServiceDetails(service); });
        container.appendChild(serviceEl);
    });
}

function showServiceDetails(service) {
    const titleEl = document.getElementById('service-modal-title');
    const contentEl = document.getElementById('service-modal-content');
    const reqEl = document.getElementById('service-requirements');
    if (titleEl) titleEl.textContent = service.name;
    if (contentEl) contentEl.innerHTML = `<p>${service.description}</p><div class="service-info"><p><strong>Processing Time:</strong> ${service.processingTime}</p><p><strong>Fee:</strong> ${service.fee}</p></div>`;
    let requirementsHtml = '';
    if (service.requirements && service.requirements.length > 0) {
        requirementsHtml = `<h4>Requirements:</h4><ul>`;
        service.requirements.forEach(req => requirementsHtml += `<li>${req}</li>`);
        requirementsHtml += `</ul>`;
    }
    if (reqEl) reqEl.innerHTML = requirementsHtml;
    const modal = document.getElementById('serviceModal'); if (modal) modal.style.display = 'flex';
    const closeServiceModal = document.getElementById('closeServiceModal'); if (closeServiceModal) closeServiceModal.addEventListener('click', function(){ if (modal) modal.style.display='none'; });
    const closeServiceModalBtn = document.getElementById('closeServiceModalBtn'); if (closeServiceModalBtn) closeServiceModalBtn.addEventListener('click', function(){ if (modal) modal.style.display='none'; });
    const applyOnlineBtn = document.getElementById('applyOnlineBtn'); if (applyOnlineBtn) applyOnlineBtn.addEventListener('click', function(){ alert(`Application for ${service.name} would be processed online.`); if (modal) modal.style.display='none'; });
}

function searchServices() {
    const searchTermEl = document.getElementById('servicesSearch');
    if (!searchTermEl) return;
    const searchTerm = searchTermEl.value.toLowerCase();
    if (!searchTerm.trim()) return;
    alert(`Searching for: ${searchTerm}\n\nIn a real implementation, this would filter services based on the search term.`);
}

// --- Events page ---
function loadEvents() {
    const today = new Date();
    const events = [
        { id:1, title: "Bacoor City Festival", description: "Annual city festival celebrating Bacoor's culture and heritage with parades, food fairs, and cultural performances.", fullDescription: "Join us for the annual Bacoor City Festival featuring cultural presentations, food fair showcasing local delicacies, street dancing competition, and fireworks display. The festival celebrates our city's founding anniversary and rich cultural heritage.", date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7), type: "event", category: "upcoming", location: "Bacoor City Hall Grounds", time: "8:00 AM - 10:00 PM", registrationRequired: true },
        { id:2, title: "Public Consultation on City Budget", description: "Open forum for citizens to provide input on the proposed 2024 city budget.", fullDescription: "The City Government invites all residents to participate in the public consultation for the proposed 2024 Annual Budget. Share your insights and help prioritize projects and programs for our city.", date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3), type: "event", category: "upcoming", location: "City Council Session Hall", time: "2:00 PM - 5:00 PM", registrationRequired: false },
        { id:3, title: "Clean-up Drive", description: "Community clean-up drive along Bacoor Bay. Volunteers are welcome to join.", fullDescription: "Help keep our city clean! Join the monthly community clean-up drive along Bacoor Bay. Gloves and garbage bags will be provided. All volunteers will receive a certificate of participation.", date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10), type: "event", category: "upcoming", location: "Bacoor Baywalk", time: "6:00 AM - 9:00 AM", registrationRequired: true },
        { id:4, title: "Road Closure Advisory", description: "Main Street will be closed for road repairs from October 15-20, 2023.", fullDescription: "Please be advised that Main Street will be closed for road repairs and drainage improvement from October 15-20, 2023. Alternate routes are available via Secondary Road and Coastal Road. Emergency vehicles will have access at all times.", date: new Date(today.getFullYear(), today.getMonth(), 10), type: "announcement", category: "announcement" },
        { id:5, title: "All Saints' Day", description: "City government offices will be closed in observance of All Saints' Day.", fullDescription: "In observance of All Saints' Day, all city government offices will be closed on November 1, 2023. Regular operations will resume on November 2, 2023.", date: new Date(today.getFullYear(), 10, 1), type: "holiday", category: "holiday" }
    ];
    localStorage.setItem('bacoorEvents', JSON.stringify(events));
    renderEvents(events);
    setupEventFiltering(events);
}

function renderEvents(eventsToRender) {
    const container = document.getElementById('events-container');
    if (!container) return;
    container.innerHTML = '';
    if (eventsToRender.length === 0) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 40px; color: var(--gray);">No events found matching your search criteria.</p>';
        return;
    }
    eventsToRender.forEach(event => {
        const eventDate = new Date(event.date);
        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const eventEl = document.createElement('div');
        eventEl.className = 'event-card';
        eventEl.innerHTML = `
            <div class="event-date">
                <div class="day">${eventDate.getDate()}</div>
                <div class="month">${monthNames[eventDate.getMonth()]}</div>
                <div class="year">${eventDate.getFullYear()}</div>
            </div>
            <div class="event-content">
                <h3>${event.title}</h3>
                <p>${event.description.substring(0,120)}...</p>
                <div style="margin-top: 15px;"><span class="event-tag ${event.type}">${event.type === 'event' ? 'Event' : event.type === 'announcement' ? 'Announcement' : 'Holiday'}</span></div>
            </div>
        `;
        eventEl.addEventListener('click', () => showEventDetails(event));
        container.appendChild(eventEl);
    });
}

function showEventDetails(event) {
    const eventDate = new Date(event.date);
    const titleEl = document.getElementById('event-modal-title');
    const dateEl = document.getElementById('event-modal-date');
    const contentEl = document.getElementById('event-modal-content');
    const detailsEl = document.getElementById('event-details');
    if (titleEl) titleEl.textContent = event.title;
    if (dateEl) dateEl.textContent = eventDate.toDateString();
    if (contentEl) contentEl.innerHTML = `<p>${event.fullDescription || event.description}</p>`;
    let detailsHtml = '';
    if (event.location) detailsHtml += `<p><strong>Location:</strong> ${event.location}</p>`;
    if (event.time) detailsHtml += `<p><strong>Time:</strong> ${event.time}</p>`;
    if (event.registrationRequired !== undefined) detailsHtml += `<p><strong>Registration:</strong> ${event.registrationRequired ? 'Required' : 'Not Required'}</p>`;
    if (detailsEl) detailsEl.innerHTML = detailsHtml;
    const registerBtn = document.getElementById('registerEventBtn');
    if (registerBtn) registerBtn.style.display = (event.type === 'event' && event.registrationRequired) ? 'inline-block' : 'none';
    const modal = document.getElementById('eventModal'); if (modal) modal.style.display = 'flex';
    const closeEventModal = document.getElementById('closeEventModal'); if (closeEventModal) closeEventModal.addEventListener('click', function(){ if (modal) modal.style.display='none'; });
    const closeEventModalBtn = document.getElementById('closeEventModalBtn'); if (closeEventModalBtn) closeEventModalBtn.addEventListener('click', function(){ if (modal) modal.style.display='none'; });
    if (registerBtn) registerBtn.addEventListener('click', function(){ alert(`Registration for "${event.title}" would open in a real implementation.`); if (modal) modal.style.display='none'; });
}

function searchEvents() {
    const searchTerm = document.getElementById('eventSearch') ? document.getElementById('eventSearch').value.toLowerCase() : '';
    const allEvents = JSON.parse(localStorage.getItem('bacoorEvents') || '[]');
    if (!searchTerm.trim()) { renderEvents(allEvents); return; }
    const filteredEvents = allEvents.filter(event => event.title.toLowerCase().includes(searchTerm) || event.description.toLowerCase().includes(searchTerm));
    renderEvents(filteredEvents);
}

// Minimal calendar initializer (keeps pages functional)
function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;
    // Simple placeholder calendar: show current month name
    const header = document.getElementById('currentMonthYear');
    if (header) header.textContent = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    calendarEl.innerHTML = '<p style="padding:20px;color:var(--gray)">Calendar preview is available in the full implementation.</p>';
}

function setupEventFiltering(events) {
    // Simple wiring: filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (!filterBtns.length) return;
    const eventsFilter = new EventsFilter(events);
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            const filtered = eventsFilter.filterByCategory(filter);
            renderEvents(filtered);
        });
    });
    // pagination controls (simple)
    const prevBtn = document.getElementById('prevEventsBtn');
    const nextBtn = document.getElementById('nextEventsBtn');
    if (prevBtn) prevBtn.addEventListener('click', function(){ if (eventsFilter.prevPage()) renderEvents(eventsFilter.getPaginatedEvents()); });
    if (nextBtn) nextBtn.addEventListener('click', function(){ if (eventsFilter.nextPage()) renderEvents(eventsFilter.getPaginatedEvents()); });
}

// --- Contact page ---
function handleFormSubmit(e) {
    e.preventDefault();
    document.querySelectorAll('.error').forEach(error => { error.style.display = 'none'; });
    document.querySelectorAll('.form-control').forEach(input => input.classList.remove('error-input'));
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();
    const newsletter = document.getElementById('newsletter').checked;
    let isValid = true;
    if (!name) { const el=document.getElementById('nameError'); if (el) el.style.display='block'; document.getElementById('name').classList.add('error-input'); isValid=false; }
    if (!email || !isValidEmail(email)) { const el=document.getElementById('emailError'); if (el) el.style.display='block'; document.getElementById('email').classList.add('error-input'); isValid=false; }
    if (!subject) { const el=document.getElementById('subjectError'); if (el) el.style.display='block'; document.getElementById('subject').classList.add('error-input'); isValid=false; }
    if (!message) { const el=document.getElementById('messageError'); if (el) el.style.display='block'; document.getElementById('message').classList.add('error-input'); isValid=false; }
    if (!isValid) return;
    const phone = document.getElementById('phone').value.trim();
    const department = document.getElementById('department').value;
    const inquiry = { name, email, phone, subject, department, message, newsletter, timestamp: new Date().toISOString(), status: 'pending' };
    saveInquiry(inquiry);
    const successEl = document.getElementById('successMessage'); if (successEl) successEl.style.display='block';
    document.getElementById('contactForm').reset();
    localStorage.removeItem('bacoorContactFormDraft');
    setTimeout(()=>{ if (successEl) successEl.style.display='none'; }, 5000);
}

function saveInquiry(inquiry) {
    const inquiries = JSON.parse(localStorage.getItem('bacoorInquiries') || '[]');
    inquiries.push(inquiry);
    localStorage.setItem('bacoorInquiries', JSON.stringify(inquiries));
    if (inquiry.newsletter) {
        const subscriptions = JSON.parse(localStorage.getItem('bacoorSubscriptions') || '[]');
        if (!subscriptions.some(sub => sub.email === inquiry.email)) {
            subscriptions.push({ email: inquiry.email, name: inquiry.name, date: new Date().toISOString() });
            localStorage.setItem('bacoorSubscriptions', JSON.stringify(subscriptions));
        }
    }
}

function loadSavedFormData() {
    const savedData = localStorage.getItem('bacoorContactFormDraft');
    if (savedData) {
        const formData = JSON.parse(savedData);
        document.getElementById('name').value = formData.name || '';
        document.getElementById('email').value = formData.email || '';
        document.getElementById('phone').value = formData.phone || '';
        document.getElementById('subject').value = formData.subject || '';
        document.getElementById('department').value = formData.department || '';
        document.getElementById('message').value = formData.message || '';
        showDraftNotification();
    }
    const formInputs = document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea');
    formInputs.forEach(input => input.addEventListener('input', autoSaveForm));
}

function autoSaveForm() {
    const formData = { name: document.getElementById('name').value, email: document.getElementById('email').value, phone: document.getElementById('phone').value, subject: document.getElementById('subject').value, department: document.getElementById('department').value, message: document.getElementById('message').value };
    localStorage.setItem('bacoorContactFormDraft', JSON.stringify(formData));
}

function showDraftNotification() {
    const notification = document.createElement('div');
    notification.className = 'draft-notification';
    notification.innerHTML = `<p><i class="fas fa-save"></i> Draft restored from previous session</p><button class="btn btn-small" id="clearDraftBtn">Clear Draft</button>`;
    const container = document.querySelector('.contact-form-container'); if (container) container.prepend(notification);
    const clearBtn = document.getElementById('clearDraftBtn'); if (clearBtn) clearBtn.addEventListener('click', function(){ localStorage.removeItem('bacoorContactFormDraft'); document.getElementById('contactForm').reset(); notification.remove(); });
    setTimeout(()=>{ if (notification.parentNode) notification.remove(); }, 10000);
}

function showVolunteerModal(title, content) {
    const titleEl = document.getElementById('volunteer-modal-title');
    const contentEl = document.getElementById('volunteer-modal-content');
    if (titleEl) titleEl.textContent = title;
    if (contentEl) contentEl.innerHTML = content;
    const modal = document.getElementById('volunteerModal'); if (modal) modal.style.display = 'flex';
    const closeVolunteerModal = document.getElementById('closeVolunteerModal'); if (closeVolunteerModal) closeVolunteerModal.addEventListener('click', function(){ if (modal) modal.style.display='none'; });
    const closeVolunteerModalBtn = document.getElementById('closeVolunteerModalBtn'); if (closeVolunteerModalBtn) closeVolunteerModalBtn.addEventListener('click', function(){ if (modal) modal.style.display='none'; });
    const applyVolunteerBtn = document.getElementById('applyVolunteerBtn'); if (applyVolunteerBtn) applyVolunteerBtn.addEventListener('click', function(){ alert(`Application for "${title}" would open in a real implementation.`); if (modal) modal.style.display='none'; });
}

function getVolunteerProgramContent() {
    return `<p>The City Volunteer Program offers opportunities for citizens to contribute to community development through various initiatives:</p><ul><li><strong>Disaster Response Volunteers</strong> - Assist during calamities and emergencies</li><li><strong>Environmental Volunteers</strong> - Participate in clean-up drives and tree planting</li><li><strong>Event Volunteers</strong> - Help organize city festivals and public events</li><li><strong>Senior Citizen Assistants</strong> - Provide support to elderly citizens</li><li><strong>Youth Volunteers</strong> - Leadership and community service opportunities for students</li></ul><p><strong>Requirements:</strong></p><ul><li>Must be at least 18 years old (16 with parental consent)</li><li>Good moral character</li><li>Willing to undergo orientation/training</li><li>Can commit at least 4 hours per month</li></ul>`;
}

function getMembershipContent() {
    return `<p>The City Government of Bacoor offers several community programs for residents:</p><ul><li><strong>Bacoor Community Health Program</strong> - Free health check-ups and medical services</li><li><strong>Livelihood Training Program</strong> - Skills development for entrepreneurs</li><li><strong>Youth Development Council</strong> - Leadership programs for young residents</li><li><strong>Senior Citizens Association</strong> - Activities and benefits for elderly residents</li><li><strong>PWD Federation</strong> - Support and advocacy for persons with disabilities</li><li><strong>Urban Gardening Club</strong> - Community gardening and sustainability initiatives</li></ul><p>Membership is free for Bacoor residents. Each program has regular meetings, workshops, and community activities.</p>`;
}

function getDonationContent() {
    return `<p>Support the City Government of Bacoor in serving our community better. Your donations help fund various projects and programs:</p><ul><li><strong>Education Support</strong> - Scholarships, school supplies for underprivileged students</li><li><strong>Health Programs</strong> - Medical equipment, medicine for community health centers</li><li><strong>Disaster Response</strong> - Emergency supplies and equipment</li><li><strong>Environmental Projects</strong> - Tree planting, clean-up drives</li><li><strong>Senior Citizen Programs</strong> - Meals, activities for elderly residents</li></ul><p><strong>Donation Methods:</strong></p><ul><li>Cash or check donation at City Treasurer's Office</li><li>Bank transfer to official city accounts</li><li>In-kind donations (contact us for accepted items)</li></ul><p>All donations are tax-deductible and will be acknowledged with official receipt.</p>`;
}

function setupAccordion() {
    const accordionBtns = document.querySelectorAll('.accordion-btn');
    accordionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.maxHeight) content.style.maxHeight = null; else content.style.maxHeight = content.scrollHeight + "px";
        });
    });
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) link.classList.add('active'); else link.classList.remove('active');
    });
}

// Load announcements for home page
        document.addEventListener('DOMContentLoaded', function() {
            loadAnnouncements();
            setActiveNavLink();
            
            // Set current year in footer
            document.getElementById('currentYear').textContent = new Date().getFullYear();
        });
        
        function loadAnnouncements() {
            const announcements = [
                {
                    id: 1,
                    title: "Road Closure Advisory",
                    content: "Main Street will be closed for road repairs from October 15-20, 2023. Please use alternate routes. Emergency vehicles will still have access. For inquiries, contact the City Engineering Office.",
                    date: "October 10, 2023",
                    type: "announcement"
                },
                {
                    id: 2,
                    title: "Free Medical Check-up",
                    content: "The City Health Office will conduct free medical check-ups for senior citizens on October 25, 2023 at the City Hall grounds from 8:00 AM to 4:00 PM. Bring your senior citizen ID and medical records.",
                    date: "October 8, 2023",
                    type: "announcement"
                },
                {
                    id: 3,
                    title: "Business Permit Renewal",
                    content: "Reminder: Business permit renewal for 2024 will start on November 1, 2023. Early renewal (November 1-30) gets 5% discount. Online renewal is available through our e-Services portal.",
                    date: "October 5, 2023",
                    type: "announcement"
                }
            ];
            
            const container = document.getElementById('announcements-list');
            container.innerHTML = '';
            
            announcements.forEach(announcement => {
                const announcementEl = document.createElement('div');
                announcementEl.className = 'announcement-item';
                announcementEl.innerHTML = `
                    <div>
                        <h4 style="margin-bottom: 5px;">${announcement.title}</h4>
                        <p>${announcement.content.substring(0, 100)}...</p>
                    </div>
                    <div class="announcement-date">${announcement.date}</div>
                `;
                
                announcementEl.addEventListener('click', () => {
                    openModal(
                        announcement.title,
                        announcement.date,
                        `<p>${announcement.content}</p>`
                    );
                });
                
                container.appendChild(announcementEl);
            });
        }
        
        function setActiveNavLink() {
            const currentPage = window.location.pathname.split('/').pop();
            const navLinks = document.querySelectorAll('.nav-link');
            
            navLinks.forEach(link => {
                const linkPage = link.getAttribute('href');
                if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }