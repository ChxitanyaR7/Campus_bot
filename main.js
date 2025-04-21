import authService from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
        window.location.href = 'login.html?redirect=main.html';
        return;
    }
    
    // Get and display user information
    const user = authService.getCurrentUser();
    const userEmailElement = document.getElementById('userEmail');
    if (userEmailElement && user) {
        userEmailElement.textContent = user.name || user.email;
    }
    
    // Set up logout functionality
    const logoutButtons = document.querySelectorAll('#logoutBtn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            authService.logoutUser();
        });
    });
    
    // Feature navigation
    const featureCards = document.querySelectorAll('.feature-card');
    const contentSections = document.querySelectorAll('.content-section');
    
    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active class from all cards
            featureCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            card.classList.add('active');
            
            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Show the corresponding content section
            const target = card.getAttribute('data-target');
            document.querySelector(`.${target}`).classList.add('active');
        });
    });
    
    // Chat functionality
    const chatForm = document.getElementById('chatForm');
    const chatMessages = document.getElementById('chatMessages');
    const userMessageInput = document.getElementById('userMessage');
    
    if (chatForm && chatMessages && userMessageInput) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const message = userMessageInput.value.trim();
            if (!message) return;
            
            // Add user message to chat
            addMessage(message, 'user');
            userMessageInput.value = '';
            
            // Simulate bot response (would connect to backend in real app)
            setTimeout(() => {
                const botResponse = getBotResponse(message);
                addMessage(botResponse, 'bot');
            }, 1000);
        });
    }
    
    // Function to add message to chat
    function addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        
        const contentElement = document.createElement('div');
        contentElement.className = 'message-content';
        contentElement.textContent = message;
        
        messageElement.appendChild(contentElement);
        chatMessages.appendChild(messageElement);
        
        // Scroll to bottom of chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Simple bot response function (would be replaced with actual API call)
    function getBotResponse(message) {
        message = message.toLowerCase();
        
        if (message.includes('hello') || message.includes('hi')) {
            return 'Hello there! How can I help you today?';
        } else if (message.includes('exam') || message.includes('schedule')) {
            return 'The university summer exams begin on May 13, 2025. You can view the full schedule in the Resources section.';
        } else if (message.includes('library')) {
            return 'The central library is open Monday to Friday from 8 AM to 8 PM, and on Saturdays from 9 AM to 5 PM.';
        } else if (message.includes('workshop')) {
            return 'There is an upcoming AI workshop on April 22, 2025. Check the Events section for registration details.';
        } else {
            return "I'm not sure I understand. Could you please rephrase your question?";
        }
    }
    
    // Mobile navigation toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }
});
const featureCards = document.querySelectorAll('.feature-card');
const contentSections = document.querySelectorAll('.content-section');

// Initialize map flag
let mapInitialized = false;

featureCards.forEach(card => {
    card.addEventListener('click', () => {
        const target = card.getAttribute('data-target');
        
        // Update active card
        featureCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        // Show target section
        contentSections.forEach(section => {
            section.classList.toggle('active', section.classList.contains(target));
        });
        
        // Special handling for map section - only initialize once
        if (target === 'map-section' && !mapInitialized) {
            initializeMapFunctionality();
            mapInitialized = true;
        }
    });
});

// Chat functionality
const chatForm = document.getElementById('chatForm');
const userMessageInput = document.getElementById('userMessage');
const chatMessages = document.getElementById('chatMessages');

if (chatForm && userMessageInput && chatMessages) {
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const message = userMessageInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, 'user');
        userMessageInput.value = '';        
        
        try {
            // Send message to server
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            
            // Add bot response to chat
            addMessage(data.response, 'bot');
        } catch (error) {
            console.error('Error sending message:', error);
            addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    });

    // Add some example conversation for demo purposes
    setTimeout(() => {
        addMessage("Can you guide me through the admission process?", 'user');
        setTimeout(() => {
            addMessage("To apply for admission, follow these steps:<br><br>" + 
                    "1. Visit our website and fill out the application form.<br>" + 
                    "2. Upload the required documents (10th marksheet, 12th marksheet, and ID proof).<br>" + 
                    "3. Pay the application fee.<br>" + 
                    "4. Submit your application.<br><br>" + 
                    "Let me know if you need help with any of these steps!", 'bot');
        }, 1000);
    }, 1500);

    // Function to add message to chat
    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = content;  // Changed to innerHTML
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom of chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Mobile navigation toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }
}

// Map integration functionality
function initializeMapFunctionality() {
    // Check if map is already initialized to prevent duplicates
    if (document.querySelector('.map-container')) return;
    
    const mapSection = document.querySelector('.map-section');
    
    if (mapSection) {
        // Create map container with the structure from map.html
        const mapContainer = document.createElement('div');
        mapContainer.className = 'map-container';
        mapContainer.innerHTML = `
            <div class="floor-navigation">
                <button class="floor-btn active" data-floor="ground">Ground Floor</button>
                <button class="floor-btn" data-floor="first">First Floor</button>
                <button class="floor-btn" data-floor="second">Second Floor</button>
                <button class="floor-btn" data-floor="third">Third Floor</button>
                <button class="floor-btn" data-floor="fourth">Fourth Floor</button>
                <button class="floor-btn" data-floor="fifth">Fifth Floor</button>
            </div>
            
            <div class="search-box">
                <input type="text" class="search-input" placeholder="Search for a location (e.g., Library, Computer Lab)">
                <div class="search-results"></div>
            </div>
            
            <div class="floor-map-container">
                <!-- Floor maps will be loaded here dynamically -->
            </div>
            
            <div class="location-info">
                <h4>Location Details</h4>
                <p class="location-name">Select a location to see details</p>
                <p class="location-floor"></p>
                <p class="location-description"></p>
            </div>
            
            <div class="legend">
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #252538;"></div>
                    <span>Rooms</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #3a506b;"></div>
                    <span>Boys Washroom</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #6d597a;"></div>
                    <span>Girls Washroom</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #9c27b0;"></div>
                    <span>Selected Location</span>
                </div>
            </div>
        `;
        
        // Replace the placeholder content with our map container
        const mapPlaceholder = mapSection.querySelector('.map-placeholder');
        if (mapPlaceholder) {
            mapPlaceholder.parentNode.replaceChild(mapContainer, mapPlaceholder);
        } else {
            // Add after the heading
            const heading = mapSection.querySelector('h3');
            if (heading) {
                heading.after(mapContainer);
            } else {
                mapSection.appendChild(mapContainer);
            }
        }
        
        // Load floor maps from the PDF data
        loadFloorMaps();
        
        // Add event listeners for floor navigation
        const floorButtons = document.querySelectorAll('.floor-btn');
        floorButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                floorButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show the selected floor map
                const floor = button.getAttribute('data-floor');
                showFloorMap(floor);
            });
        });
        
        // Add search functionality
        const searchInput = document.querySelector('.search-input');
        const searchResults = document.querySelector('.search-results');
        
        if (searchInput && searchResults) {
            searchInput.addEventListener('input', () => {
                const query = searchInput.value.toLowerCase().trim();
                if (query.length < 2) {
                    searchResults.classList.remove('active');
                    return;
                }
                
                // Search for matching rooms
                const rooms = document.querySelectorAll('.room');
                const matches = [];
                
                rooms.forEach(room => {
                    const roomName = room.getAttribute('data-room').toLowerCase();
                    const floor = room.getAttribute('data-floor');
                    
                    if (roomName.includes(query)) {
                        matches.push({ name: room.getAttribute('data-room'), floor, element: room });
                    }
                });
                
                // Display results
                if (matches.length > 0) {
                    searchResults.innerHTML = '';
                    matches.forEach(match => {
                        const resultItem = document.createElement('div');
                        resultItem.className = 'result-item';
                        resultItem.textContent = `${match.name} (${capitalizeFirstLetter(match.floor)} Floor)`;
                        
                        resultItem.addEventListener('click', () => {
                            // Navigate to the floor and highlight the room
                            const floorBtn = document.querySelector(`.floor-btn[data-floor="${match.floor}"]`);
                            if (floorBtn) {
                                floorBtn.click();
                            }
                            
                            // Highlight the room
                            highlightRoom(match.element);
                            
                            // Update location info
                            updateLocationInfo(match.name, match.floor);
                            
                            // Clear and hide search results
                            searchInput.value = '';
                            searchResults.classList.remove('active');
                        });
                        
                        searchResults.appendChild(resultItem);
                    });
                    
                    searchResults.classList.add('active');
                } else {
                    searchResults.innerHTML = '<div class="result-item">No matches found</div>';
                    searchResults.classList.add('active');
                }
            });
            
            // Hide search results when clicking outside
            document.addEventListener('click', (event) => {
                if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
                    searchResults.classList.remove('active');
                }
            });
        }
    }
}

// Function to load floor maps from the parsed PDF data
function loadFloorMaps() {
    const floorMapContainer = document.querySelector('.floor-map-container');
    if (!floorMapContainer) return;
    
    // Clear any existing content
    floorMapContainer.innerHTML = '';
    
    // Create SVG maps for each floor based on the parsed PDF data
    const floors = ['ground', 'first', 'second', 'third', 'fourth', 'fifth'];
    
    floors.forEach((floor, index) => {
        const floorMap = document.createElement('div');
        floorMap.className = `floor-map ${index === 0 ? 'active' : ''}`;
        floorMap.id = `${floor}-floor`;
        
        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'map-svg');
        svg.setAttribute('viewBox', '0 0 1000 600');
        
        // Main outline
        const outline = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        outline.setAttribute('x', '50');
        outline.setAttribute('y', '50');
        outline.setAttribute('width', '900');
        outline.setAttribute('height', '500');
        outline.setAttribute('fill', '#121212');
        outline.setAttribute('stroke', '#444');
        outline.setAttribute('stroke-width', '2');
        
        svg.appendChild(outline);
        
        // Add rooms based on the floor data
        addRoomsToFloor(svg, floor);
        
        floorMap.appendChild(svg);
        floorMapContainer.appendChild(floorMap);
    });
    
    // Add click event listeners to room elements
    const rooms = document.querySelectorAll('.room');
    rooms.forEach(room => {
        room.addEventListener('click', () => {
            // Highlight the selected room
            highlightRoom(room);
            
            // Update location information
            const roomName = room.getAttribute('data-room');
            const floor = room.getAttribute('data-floor');
            updateLocationInfo(roomName, floor);
        });
    });
}

// Function to add rooms to a floor map based on the floor
function addRoomsToFloor(svg, floor) {
    // This is where you would add room elements based on your parsed PDF data
    // For example, for the ground floor:
    
    if (floor === 'ground') {
        // Example rooms from your PDF data
        const rooms = [
            {name: 'Basic Workshop I', x: 200, y: 50, width: 150, height: 100},
            {name: 'Civil HOD Cabin', x: 400, y: 50, width: 100, height: 70},
            {name: 'Thermal Engg Lab', x: 350, y: 130, width: 150, height: 100},
            {name: 'Material Testing Lab', x: 550, y: 50, width: 150, height: 100},
            // Add more rooms as needed
        ];
        
        rooms.forEach(room => {
            addRoom(svg, room.name, room.x, room.y, room.width, room.height, floor);
        });
        
        // Add stairs, lifts, and washrooms
        addUtility(svg, 'Stairs', 50, 50, 50, 80, '#444', floor);
        addUtility(svg, 'LIFT 1', 120, 50, 40, 40, '#333', floor);
        addUtility(svg, 'LIFT 2', 120, 100, 40, 40, '#333', floor);
        addUtility(svg, 'Boys Washroom', 120, 150, 60, 40, '#3a506b', floor);
    } else if (floor === 'first') {
        // Example rooms for first floor
        const rooms = [
            {name: 'Administrative Office', x: 200, y: 50, width: 200, height: 120},
            {name: 'Principal\'s Office', x: 410, y: 50, width: 150, height: 100},
            {name: 'Training and Placement', x: 200, y: 180, width: 180, height: 100},
            // Add more rooms as needed
        ];
        
        rooms.forEach(room => {
            addRoom(svg, room.name, room.x, room.y, room.width, room.height, floor);
        });
        
        // Add stairs, lifts, and washrooms
        addUtility(svg, 'Stairs', 50, 50, 50, 80, '#444', floor);
        addUtility(svg, 'LIFT 1', 120, 50, 40, 40, '#333', floor);
        addUtility(svg, 'LIFT 2', 120, 100, 40, 40, '#333', floor);
        addUtility(svg, 'Boys Washroom', 120, 150, 60, 40, '#3a506b', floor);
    }
    // Add more floors as needed
}

// Helper function to add a room to the SVG
function addRoom(svg, name, x, y, width, height, floor) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'room');
    group.setAttribute('data-room', name);
    group.setAttribute('data-floor', floor);
    
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('fill', '#252538'); // Add default fill color
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x + width/2);
    text.setAttribute('y', y + height/2);
    text.setAttribute('class', 'room-label');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', 'white'); // Add text color
    text.textContent = name;
    
    group.appendChild(rect);
    group.appendChild(text);
    svg.appendChild(group);
}

// Helper function to add utilities like stairs, lifts, and washrooms
function addUtility(svg, name, x, y, width, height, color, floor) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'room');
    group.setAttribute('data-room', name);
    group.setAttribute('data-floor', floor);
    
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('fill', color);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x + width/2);
    text.setAttribute('y', y + height/2);
    text.setAttribute('class', 'room-label');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', 'white'); // Add text color
    text.textContent = name;
    
    group.appendChild(rect);
    group.appendChild(text);
    svg.appendChild(group);
}

// Function to show the selected floor map
function showFloorMap(floor) {
    const floorMaps = document.querySelectorAll('.floor-map');
    floorMaps.forEach(map => {
        if (map.id === `${floor}-floor`) {
            map.classList.add('active');
        } else {
            map.classList.remove('active');
        }
    });
    
    // Clear any highlighted rooms
    const rooms = document.querySelectorAll('.room');
    rooms.forEach(room => {
        room.classList.remove('highlighted');
    });
    
    // Hide location info
    const locationInfo = document.querySelector('.location-info');
    if (locationInfo) {
        locationInfo.classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Check if already initialized to avoid duplicates
    if (window.examScheduleInitialized) return;
    window.examScheduleInitialized = true;

    // Add University Exam Modal to the page
    const universityModal = document.createElement('div');
    universityModal.innerHTML = `
    <div class="modal" id="universityExamModal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="university-header">
                <h2>University of Mumbai</h2>
                <div class="exam-ref">1T00734</div>
                <h3>EXAMINATION TIME TABLE</h3>
                <h4>Summer 2025</h4>
                <p class="program-title">PROGRAMME - S.E. (Computer) (Choice Based) (R-2020-21 'C' Scheme)</p>
                <p class="semester">SEMESTER - IV</p>
            </div>
            
            <div class="exam-schedule-table">
                <table>
                    <thead>
                        <tr>
                            <th>Days and Dates</th>
                            <th>Time</th>
                            <th>Paper Code</th>
                            <th>Paper</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Tuesday, 13 May, 2025</td>
                            <td>02:30 p.m. to 05:30 p.m.</td>
                            <td>40521</td>
                            <td>Engineering Mathematics-IV</td>
                        </tr>
                        <tr>
                            <td>Thursday, 15 May, 2025</td>
                            <td>02:30 p.m. to 05:30 p.m.</td>
                            <td>40522</td>
                            <td>Analysis of Algorithm</td>
                        </tr>
                        <tr>
                            <td>Monday, 19 May, 2025</td>
                            <td>02:30 p.m. to 05:30 p.m.</td>
                            <td>40523</td>
                            <td>Database Management System</td>
                        </tr>
                        <tr>
                            <td>Wednesday, 21 May, 2025</td>
                            <td>02:30 p.m. to 05:30 p.m.</td>
                            <td>40524</td>
                            <td>Operating System</td>
                        </tr>
                        <tr>
                            <td>Friday, 23 May, 2025</td>
                            <td>02:30 p.m. to 05:30 p.m.</td>
                            <td>40525</td>
                            <td>Microprocessors</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="important-notes">
                <h4>Important Notes:</h4>
                <ul>
                    <li>The candidates appearing for the examination should report 20 minutes before the start of examination.</li>
                    <li>Mobile phones and other electronic gadgets are prohibited in the examination hall.</li>
                    <li>Change if any, in the time table shall be communicated on the university web site.</li>
                </ul>
                <div class="signature-block">
                    <div class="location">Mumbai - 400 098</div>
                    <div class="signatory">Dr. Pooja Raundale</div>
                </div>
            </div>
        </div>
    </div>
    `;
    document.body.appendChild(universityModal);

    // Update Resources section to include the University Exam Schedule
    const resourcesSection = document.querySelector('.resources-section .resources-container');
    if (resourcesSection) {
        // Check if the card doesn't already exist
        if (!document.getElementById('viewUniversityExamSchedule')) {
            const uniExamCard = document.createElement('div');
            uniExamCard.className = 'resource-card highlight-resource';
            uniExamCard.innerHTML = `
                <i class="fas fa-calendar-check"></i>
                <h4>University Exam Schedule</h4>
                <p>S.E. Computer Summer 2025 Exam Timetable</p>
                <a href="#" class="resource-download-btn" id="viewUniversityExamSchedule">View</a>
            `;
            // Insert at the beginning 
            resourcesSection.insertBefore(uniExamCard, resourcesSection.firstChild);
        }
    }
    
    // Update Events section to show the University Exams
    const eventsContainer = document.querySelector('.events-section .events-container');
    if (eventsContainer) {
        // Check if the highlight event card doesn't already exist
        if (!eventsContainer.querySelector('.highlight-event')) {
            const uniExamEvent = document.createElement('div');
            uniExamEvent.className = 'event-card highlight-event';
            uniExamEvent.innerHTML = `
                <div class="event-date">
                    <span class="day">13</span>
                    <span class="month">MAY</span>
                </div>
                <div class="event-details">
                    <h4>University Summer Exam 2025</h4>
                    <p><i class="fas fa-clock"></i> 02:30 PM - 05:30 PM</p>
                    <p><i class="fas fa-map-marker-alt"></i> Examination Hall</p>
                    <p><i class="fas fa-book"></i> Engineering Mathematics-IV</p>
                </div>
                <button class="event-register-btn view-schedule-btn university-schedule-btn">View Full Schedule</button>
            `;
            // Insert at the beginning
            eventsContainer.insertBefore(uniExamEvent, eventsContainer.firstChild);
        }
    }

    // Modal functionality
    const universityExamModal = document.getElementById('universityExamModal');
    const internalExamModal = document.getElementById('examScheduleModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    // Function to open university exam modal
    function openUniversityModal() {
        if (universityExamModal) {
            universityExamModal.style.display = 'block';
        }
    }
    
    // Function to open internal exam modal
    function openInternalModal() {
        if (internalExamModal) {
            internalExamModal.style.display = 'block';
        }
    }
    
    // Function to close all modals
    function closeAllModals() {
        if (universityExamModal) universityExamModal.style.display = 'none';
        if (internalExamModal) internalExamModal.style.display = 'none';
    }
    
    // Event listeners for opening modals
    document.querySelectorAll('.university-schedule-btn').forEach(btn => {
        btn.addEventListener('click', openUniversityModal);
    });
    
    document.querySelectorAll('.view-internal-schedule-btn').forEach(btn => {
        btn.addEventListener('click', openInternalModal);
    });
    
    const viewUniversityExamBtn = document.getElementById('viewUniversityExamSchedule');
    if (viewUniversityExamBtn) {
        viewUniversityExamBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openUniversityModal();
        });
    }
    
    const viewInternalExamBtn = document.getElementById('viewExamSchedule');
    if (viewInternalExamBtn) {
        viewInternalExamBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openInternalModal();
        });
    }
    
    // Event listeners for closing modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === universityExamModal || e.target === internalExamModal) {
            closeAllModals();
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // Update any existing buttons to point to the correct modal
    const existingScheduleBtns = document.querySelectorAll('.view-schedule-btn:not(.university-schedule-btn):not(.view-internal-schedule-btn)');
    existingScheduleBtns.forEach(btn => {
        // Remove old listeners (if possible)
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        // Add new listener for university exams
        newBtn.addEventListener('click', openUniversityModal);
    });
});

// Function to highlight a selected room
function highlightRoom(roomElement) {
    // Clear any previously highlighted rooms
    const rooms = document.querySelectorAll('.room');
    rooms.forEach(room => {
        room.classList.remove('highlighted');
    });
    
    // Highlight the selected room
    roomElement.classList.add('highlighted');
    
    // Show location info
    const locationInfo = document.querySelector('.location-info');
    if (locationInfo) {
        locationInfo.classList.add('active');
    }
}

// Function to update location information
function updateLocationInfo(name, floor) {
    const locationName = document.querySelector('.location-name');
    const locationFloor = document.querySelector('.location-floor');
    const locationDescription = document.querySelector('.location-description');
    
    if (locationName && locationFloor) {
        locationName.textContent = name;
        locationFloor.textContent = `Floor: ${capitalizeFirstLetter(floor)}`;
        
        // Add a description based on the room type
        if (locationDescription) {
            if (name.includes('Lab')) {
                locationDescription.textContent = `This is a laboratory for ${name.replace(' Lab', '')} experiments and practical sessions.`;
            } else if (name.includes('Washroom')) {
                locationDescription.textContent = 'Restroom facilities.';
            } else if (name.includes('Office')) {
                locationDescription.textContent = 'Administrative office for faculty and staff.';
            } else if (name.includes('HOD')) {
                locationDescription.textContent = 'Office of the Head of Department.';
            } else if (name.includes('Workshop')) {
                locationDescription.textContent = 'Workshop area for practical training and projects.';
            } else {
                locationDescription.textContent = 'Select a location to see details.';
            }
        }
    }
}

// Add this to your scripts/main.js file or in a script tag at the bottom of your HTML
document.addEventListener('DOMContentLoaded', function() {
    // Feature card navigation
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            featureCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            this.classList.add('active');
            
            // Get target section
            const targetSection = this.getAttribute('data-target');
            
            // Hide all content sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            document.querySelector('.' + targetSection).classList.add('active');
        });
    });
});

// Utility function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}