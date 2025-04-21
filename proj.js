document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (menuToggle && mobileNav) {
      menuToggle.addEventListener('click', function() {
          mobileNav.classList.toggle('open');
      });
  }

  // Close mobile nav when a link is clicked (optional)
  const mobileNavLinks = document.querySelectorAll('.mobile-nav ul li a');
  mobileNavLinks.forEach(link => {
      link.addEventListener('click', function() {
          mobileNav.classList.remove('open');
      });
  });

  // Example of adding functionality to the dashboard buttons
  const actionButtons = document.querySelectorAll('.action-btn');
  actionButtons.forEach(button => {
      button.addEventListener('click', function() {
          const parentItem = button.closest('.dashboard-item');
          if (parentItem) {
              const title = parentItem.querySelector('h2').textContent;
              alert(`You clicked the action button for: ${title}`);
              // Replace alert with your desired functionality (e.g., redirect, modal, etc.)
          }
      });
  });

  // Example of adding functionality to the profile button
  const profileButton = document.querySelector('.profile-btn');
  if (profileButton) {
      profileButton.addEventListener('click', function() {
          alert("Profile functionality to be implemented");
      });
  }
});