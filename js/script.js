// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// js/script.js

// Function to fetch APOD data for a date range
async function fetchAPOD(startDate, endDate) {
  // Show loading message with NASA branding
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🚀</div>
      <h3>Mission in Progress</h3>
      <p>Houston, we are go for launch! Retrieving spectacular space imagery from NASA archives...</p>
      <div class="mission-stats">
        <div class="stat">
          <span class="stat-number">⏳</span>
          <span class="stat-label">Loading</span>
        </div>
        <div class="stat">
          <span class="stat-number">📡</span>
          <span class="stat-label">Transmitting</span>
        </div>
        <div class="stat">
          <span class="stat-number">🛰️</span>
          <span class="stat-label">Processing</span>
        </div>
      </div>
    </div>
  `;
  
  // NASA APOD API URL with your API key and date range
  const apiKey = 'ANcbWvu2taadEZB5BF7i9XB6ZzveL5wJtJgA218v'; // Replace with your NASA API key
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  try {
    // Fetch data from the API
    const response = await fetch(url);
    const data = await response.json();

    // Call function to display the gallery
    displayGallery(data);
  } catch (error) {
    console.error('Error fetching APOD data:', error);
    // Show error message to user with NASA theme
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">🛰️</div>
        <h3>Mission Control Alert</h3>
        <p>Houston, we have a problem! Communication with NASA servers interrupted. Please check your connection and retry mission.</p>
        <div class="mission-stats">
          <div class="stat">
            <span class="stat-number">⚠️</span>
            <span class="stat-label">Error</span>
          </div>
          <div class="stat">
            <span class="stat-number">🔄</span>
            <span class="stat-label">Retry</span>
          </div>
          <div class="stat">
            <span class="stat-number">📞</span>
            <span class="stat-label">Support</span>
          </div>
        </div>
      </div>
    `;
  }
}

// Function to display the gallery
function displayGallery(apodArray) {
  // Get the gallery container from the HTML
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = ''; // Clear previous results

  // Loop through each APOD object and create HTML elements
  apodArray.forEach(apod => {
    // Only show images (not videos)
    if (apod.media_type === 'image') {
      // Create a div for each image
      const item = document.createElement('div');
      item.className = 'gallery-item';

      // Add image, title, date, and explanation
      item.innerHTML = `
        <img src="${apod.url}" alt="${apod.title}" />
        <h3>${apod.title}</h3>
        <p><strong>Date:</strong> ${apod.date}</p>
        <p>${apod.explanation}</p>
      `;

      // Add click event listener to open modal
      item.addEventListener('click', () => {
        openModal(apod);
      });

      // Add pointer cursor to show it's clickable
      item.style.cursor = 'pointer';

      // Add the item to the gallery
      gallery.appendChild(item);
    }
  });
}

// Function to open the modal with image details
function openModal(apod) {
  // Get modal elements
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDate = document.getElementById('modalDate');
  const modalExplanation = document.getElementById('modalExplanation');

  // Set modal content
  modalImage.src = apod.url;
  modalImage.alt = apod.title;
  modalTitle.textContent = apod.title;
  modalDate.textContent = `Date: ${apod.date}`;
  modalExplanation.textContent = apod.explanation;

  // Show the modal
  modal.style.display = 'block';
  
  // Prevent body scrolling when modal is open
  document.body.style.overflow = 'hidden';
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.style.display = 'none';
  
  // Restore body scrolling
  document.body.style.overflow = 'auto';
}

// Find the "Launch Mission" button
const getImagesButton = document.querySelector('.mission-button');

// Add event listener to the button
getImagesButton.addEventListener('click', () => {
  // Get the selected dates from the date inputs
  const startDate = startInput.value;
  const endDate = endInput.value;
  
  // Make sure both dates are selected
  if (startDate && endDate) {
    // Fetch APOD data for the selected date range
    fetchAPOD(startDate, endDate);
  } else {
    // Alert user if dates are not selected
    alert('Please select both start and end dates.');
  }
});

// Modal event listeners
const modal = document.getElementById('imageModal');
const closeButton = document.getElementById('closeModal');

// Close modal when clicking the X button
closeButton.addEventListener('click', closeModal);

// Close modal when clicking outside the modal content
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// Close modal when pressing the Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.style.display === 'block') {
    closeModal();
  }
});

// Load default images when the page first loads
// Wait a moment for the date inputs to be set up by dateRange.js
setTimeout(() => {
  const startDate = startInput.value;
  const endDate = endInput.value;
  
  if (startDate && endDate) {
    fetchAPOD(startDate, endDate);
  }
}, 100);
