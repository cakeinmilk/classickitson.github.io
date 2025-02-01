// /js/script.js

// Function to load HTML content into a specified element
async function loadComponent(componentPath, elementId) {
  try {
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`Could not fetch ${componentPath}: ${response.statusText}`);
    }
    const content = await response.text();
    document.getElementById(elementId).innerHTML = content;
  } catch (error) {
    console.error(error);
  }
}

// Function to toggle dark mode
function toggleDarkMode() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const themeToggleButton = document.getElementById('theme-toggle');

  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    if (themeToggleButton) {
      themeToggleButton.textContent = 'brightness_6'; // Sun icon for light mode
      themeToggleButton.setAttribute('aria-label', 'Switch to dark mode');
    }
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    if (themeToggleButton) {
      themeToggleButton.textContent = 'brightness_3'; // Moon icon for dark mode
      themeToggleButton.setAttribute('aria-label', 'Switch to light mode');
    }
  }
}

// Function to toggle navigation menu (for mobile)
function toggleNavigationMenu() {
  const menu = document.getElementById('mobile-navigation-menu');
  if (menu) {
    menu.classList.toggle('mdc-menu--open');
  }
}

// Function to apply the saved or system theme on page load
function applyTheme() {
  const savedTheme = localStorage.getItem('theme');
  const themeToggleButton = document.getElementById('theme-toggle');

  if (savedTheme) {
    // Apply the saved theme
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    // Detect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  // Update the toggle button icon based on the current theme
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (themeToggleButton) {
    if (currentTheme === 'dark') {
      themeToggleButton.textContent = 'brightness_3'; // Moon icon
      themeToggleButton.setAttribute('aria-label', 'Switch to light mode');
    } else {
      themeToggleButton.textContent = 'brightness_6'; // Sun icon
      themeToggleButton.setAttribute('aria-label', 'Switch to dark mode');
    }
  }
}

// Function to listen to system color scheme changes
function listenToSystemThemeChanges() {
  const prefersDarkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  prefersDarkMediaQuery.addEventListener('change', (e) => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      if (e.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }

      // Update the toggle button icon based on the current theme
      const themeToggleButton = document.getElementById('theme-toggle');
      if (themeToggleButton) {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
          themeToggleButton.textContent = 'brightness_3'; // Moon icon
          themeToggleButton.setAttribute('aria-label', 'Switch to light mode');
        } else {
          themeToggleButton.textContent = 'brightness_6'; // Sun icon
          themeToggleButton.setAttribute('aria-label', 'Switch to dark mode');
        }
      }
    }
  });
}

// Function to handle theme changes from other tabs
function handleStorageEvent(e) {
  if (e.key === 'theme') {
    applyTheme();
  }
}

// Function to handle dismissing the banner
function handleBannerDismiss() {
  const banner = document.getElementById('latest-news-banner');
  if (banner) {
    banner.classList.add('hidden');
    // Remember that the user dismissed the banner
    localStorage.setItem('bannerDismissed', 'true');
  }
}

// Function to check if the banner should be shown
function shouldShowBanner() {
  const bannerDismissed = localStorage.getItem('bannerDismissed');
  return !bannerDismissed;
}

// Inside renderTimeline function
//	timelineItem.setAttribute('data-aos', 'fade-up'); // Example animation

// /js/script.js

// Function to render the timeline
function renderTimeline(shows, isAscending = true) {
  const timelineContainer = document.getElementById('timeline-container');

  if (!timelineContainer) {
    console.error("Timeline container not found!");
    return;
  }

  console.log("Rendering timeline with shows:", shows);

  // Clear existing timeline items
  timelineContainer.innerHTML = '';

  // Sort shows based on the isAscending flag
  const sortedShows = [...shows].sort((a, b) => {
    return isAscending ? (a.year - b.year) : (b.year - a.year);
  });

  // Iterate over the sorted shows and create timeline items
  sortedShows.forEach((show, index) => {
    const isLeft = index % 2 === 0;
    console.log(`Rendering show: ${show.title} on ${isLeft ? 'left' : 'right'} side`);

    // Create timeline item container
    const timelineItem = document.createElement('div');
    timelineItem.classList.add('timeline-item', isLeft ? 'left' : 'right');
    timelineItem.setAttribute('data-year', show.year); // Assign data-year attribute

    // Create the content card
    const card = document.createElement('div');
    card.classList.add('mdc-card', 'timeline-card');

    // Add class based on show type for background color
    if (show.type === 'theatre') {
      card.classList.add('theatre');
    } else if (show.type === 'standup') {
      card.classList.add('standup');
    }

    // Add SVG Image
    if (show.imageSrc && show.imageSrc.length > 0) {
      const svgImg = document.createElement('img');
      svgImg.src = show.imageSrc[0];
      svgImg.alt = `${show.title} Logo`;
      svgImg.classList.add('timeline-card-svg');
      svgImg.setAttribute('loading', 'lazy'); // Optimize loading
      card.appendChild(svgImg);
    }

    // Append Icons Based on Show Properties

    // 1. Append Performance Type Icon ("solo" or "collaboration")
    if (show.icons && show.icons.length > 0) {
      show.icons.forEach((iconType) => {
        const iconImg = document.createElement('img');
        
		// Handle exceptions based on show title
        if (show.title === "A Show for Christmas") {
          iconImg.src = '../images/icons/santa.png';
          iconImg.alt = 'Santa Icon';
        } else if (show.title === "Maybe a Ghost Story") {
          iconImg.src = '../images/icons/ghost.png';
          iconImg.alt = 'Ghost Icon';
        } else {
          // Standard solo/collaboration icons
          if (iconType === 'solo') {
            iconImg.src = '../images/icons/solo.png';
            iconImg.alt = 'Solo Performance';
          } else if (iconType === 'collaboration') {
            iconImg.src = '../images/icons/collaboration.png';
            iconImg.alt = 'Collaboration';
          } else {
            console.warn(`Unknown icon type: ${iconType} for show: ${show.title}`);
            return; // Skip unknown icon types
          }
        }
		
        iconImg.classList.add('timeline-card-icon', `icon-${iconType}`);
        iconImg.setAttribute('loading', 'lazy'); // Optimize loading
        card.appendChild(iconImg);
      });
    }

    // 2. Append Availability Icon if available
    if (show.availability && show.availability.includes('yes')) {
      const availabilityImg = document.createElement('img');
      availabilityImg.src = '../images/icons/available.png';
      availabilityImg.alt = 'Available';
      availabilityImg.classList.add('timeline-card-icon', 'icon-available');
      availabilityImg.setAttribute('loading', 'lazy'); // Optimize loading
      card.appendChild(availabilityImg);
    }
	
	timelineItem.setAttribute('data-aos', 'fade-up'); // Example animation

    // Make entire card clickable by wrapping in a link
    const showLink = document.createElement('a');
    showLink.href = `show-details.html?title=${encodeURIComponent(show.title.toLowerCase().replace(/\s+/g, '-'))}`;
    showLink.classList.add('timeline-card-link');
    showLink.style.textDecoration = 'none'; // Remove underline

    showLink.appendChild(card);
    timelineItem.appendChild(showLink);
    timelineContainer.appendChild(timelineItem);
  });
}

// Function to initialize the timeline and toggle functionality
function initializeTimeline() {
  const toggleButton = document.getElementById('toggle-order-button');
  
  // Retrieve sort state from localStorage or default to ascending
  let isAscending = localStorage.getItem('timelineOrder') === 'descending' ? false : true;

  // Initial render
  renderTimeline(showsData, isAscending);

  // Set initial button state
  updateToggleButtonState(toggleButton, isAscending);

  // Event listener for toggle button
  toggleButton.addEventListener('click', () => {
    isAscending = !isAscending; // Toggle the sorting order
    renderTimeline(showsData, isAscending);
    updateToggleButtonState(toggleButton, isAscending);
    
    // Save the current sort state to localStorage
    localStorage.setItem('timelineOrder', isAscending ? 'ascending' : 'descending');
  });
}


// Function to update the toggle button's appearance based on the current state
function updateToggleButtonState(button, isAscending) {
  if (isAscending) {
    button.classList.remove('descending');
    button.classList.add('ascending');
    // Optionally, change the icon or rotate it
    button.querySelector('.material-icons').textContent = 'swap_vert';
    button.setAttribute('aria-label', 'Sort timeline: Oldest to Newest');
  } else {
    button.classList.remove('ascending');
    button.classList.add('descending');
    // Optionally, change the icon or rotate it
    button.querySelector('.material-icons').textContent = 'swap_vert';
    button.setAttribute('aria-label', 'Sort timeline: Newest to Oldest');
  }
}

// Initialize the timeline after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeTimeline();
});


// Load Header and Footer on DOMContentLoaded
document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent('/new/components/header.html', 'header');
  await loadComponent('/new/components/footer.html', 'footer');

  // Initialize Material Components (if any)
  if (window.mdc) {
    mdc.autoInit();
  }
  
  // Initialize AOS
  if (window.AOS) {
    AOS.init({
      duration: 800, // Animation duration in milliseconds
      easing: 'ease-in-out', // Animation easing
      once: true, // Whether animation should happen only once
    });
  }

  // Apply the theme after header is loaded
  applyTheme();

  // Add event listener for dark mode toggle
  const themeToggleButton = document.getElementById('theme-toggle');
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', toggleDarkMode);
  }

  // Add event listener for mobile navigation menu (if implemented)
  const menuButton = document.querySelector('.navigation-menu-button');
  if (menuButton) {
    menuButton.addEventListener('click', toggleNavigationMenu);
  }

  // Listen to system theme changes
  listenToSystemThemeChanges();

  // Handle the banner
  if (shouldShowBanner()) {
    const banner = document.getElementById('latest-news-banner');
    if (banner) {
      banner.classList.remove('hidden'); // Ensure the banner is visible
    }
  }

  // Add event listener for dismissing the banner
  const dismissButton = document.getElementById('dismiss-banner-button');
  if (dismissButton) {
    dismissButton.addEventListener('click', handleBannerDismiss);
  }

  // Render the timeline if on the Shows page
  if (window.location.pathname.includes('/shows')) {
    renderTimeline(showsData);
  }

  // Listen to storage events to handle theme changes from other tabs
  window.addEventListener('storage', handleStorageEvent);
});
