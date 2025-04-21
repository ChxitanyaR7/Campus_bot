document.addEventListener('DOMContentLoaded', function() {
  console.log('Map script loaded');
  
  // Check if we're on a page with map functionality
  if (!document.querySelector('.map-container')) {
    console.log('No map container found - skipping map initialization');
    return;
  }

  // Floor navigation
  const floorButtons = document.querySelectorAll('.floor-btn');
  const floorMaps = document.querySelectorAll('.floor-map');
  
  // Location info elements
  const locationInfo = document.getElementById('location-info');
  const roomName = document.getElementById('room-name');
  const floorInfo = document.getElementById('floor-info');
  
  if (!locationInfo || !roomName || !floorInfo) {
    console.error('Location info elements not found');
  }
  
  // Floor button click handlers
  floorButtons.forEach(button => {
    button.addEventListener('click', function() {
      const floor = this.getAttribute('data-floor');
      
      // Update buttons
      floorButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Update maps
      floorMaps.forEach(map => map.classList.remove('active'));
      const targetFloorMap = document.getElementById(floor + '-floor');
      if (targetFloorMap) {
        targetFloorMap.classList.add('active');
      }
      
      // Reset room highlights
      document.querySelectorAll('.room').forEach(room => {
        room.classList.remove('highlighted');
      });
      
      // Hide location info
      if (locationInfo) {
        locationInfo.classList.remove('active');
      }
    });
  });
  
  // Room interaction
  const rooms = document.querySelectorAll('.room');
  
  rooms.forEach(room => {
    room.addEventListener('click', function() {
      // Remove previous highlights
      rooms.forEach(r => r.classList.remove('highlighted'));
      
      // Highlight this room
      this.classList.add('highlighted');
      
      // Update and show info panel
      const name = this.getAttribute('data-room');
      const floor = this.getAttribute('data-floor');
      
      if (roomName && floorInfo && locationInfo) {
        roomName.textContent = name;
        floorInfo.textContent = `Located on the ${floor.charAt(0).toUpperCase() + floor.slice(1)} Floor`;
        locationInfo.classList.add('active');
      }
    });
  });
  
  // Search functionality
  const searchInput = document.querySelector('.search-input');
  const searchResults = document.querySelector('.search-results');
  
  if (!searchInput || !searchResults) {
    console.error('Search elements not found');
    return;
  }
  
  const roomInventory = Array.from(rooms).map(room => ({
    name: room.getAttribute('data-room'),
    floor: room.getAttribute('data-floor'),
    element: room
  }));
  
  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    
    if (query.length < 2) {
      searchResults.classList.remove('active');
      searchResults.innerHTML = '';
      return;
    }
    
    const matchedRooms = roomInventory.filter(room => 
      room.name.toLowerCase().includes(query)
    );
    
    searchResults.innerHTML = '';
    
    if (matchedRooms.length > 0) {
      matchedRooms.forEach(room => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.textContent = `${room.name} (${room.floor.charAt(0).toUpperCase() + room.floor.slice(1)} Floor)`;
        
        resultItem.addEventListener('click', function() {
          // Switch to the appropriate floor
          const floorButton = document.querySelector(`.floor-btn[data-floor="${room.floor}"]`);
          if (floorButton) {
            floorButton.click();
          }
          
          // Highlight the room
          rooms.forEach(r => r.classList.remove('highlighted'));
          room.element.classList.add('highlighted');
          
          // Update location info
          if (roomName && floorInfo && locationInfo) {
            roomName.textContent = room.name;
            floorInfo.textContent = `Located on the ${room.floor.charAt(0).toUpperCase() + room.floor.slice(1)} Floor`;
            locationInfo.classList.add('active');
          }
          
          // Clear search
          searchInput.value = '';
          searchResults.classList.remove('active');
        });
        
        searchResults.appendChild(resultItem);
      });
      
      searchResults.classList.add('active');
    } else {
      const noResults = document.createElement('div');
      noResults.className = 'result-item';
      noResults.textContent = 'No matching rooms found';
      searchResults.appendChild(noResults);
      searchResults.classList.add('active');
    }
  });
  
  // Close search results when clicking outside
  document.addEventListener('click', function(event) {
    if (searchResults && !searchResults.contains(event.target) && event.target !== searchInput) {
      searchResults.classList.remove('active');
    }
  });
});