const reviewsModal = document.getElementById('reviewsModal');
const reviewsBackdrop = document.getElementById('reviewsModalBackdrop');
const closeReviewsBtn = document.getElementById('closeReviewsModal');
const reviewsContainer = document.getElementById('reviewsContainer');
let reviewModalBusinessId = ""
// Modal visibility toggle
function toggleReviewsModal(visible) {
  reviewsModal.classList.toggle('hidden', !visible);
  reviewsBackdrop.classList.toggle('hidden', !visible);
  if (!visible) reviewsContainer.innerHTML = ''; // Clear on close
}

// Event listeners to close modal
closeReviewsBtn.addEventListener('click', () => toggleReviewsModal(false));
reviewsBackdrop.addEventListener('click', () => toggleReviewsModal(false));

// Setup review buttons
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.reviewsBusinessButton');
  const reviewForm = document.getElementById('reviewForm');

  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('reviewUser').value.trim();
      const comment = document.getElementById('reviewComment').value.trim();
      const rating = document.getElementById('reviewRating').value;

      if (!name || !comment || !rating) {
        alert('Please fill out all fields.');
        return;
      }

      try {
        const res = await fetch(`/api/businesses/${reviewModalBusinessId}/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user: name, comment, rating })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to submit review');

        window.location.reload();
      } catch (err) {
        console.error('Review submission failed:', err);
        alert('Something went wrong. Please try again later.');
      }
    });
  }
  
  buttons.forEach(button => {
    button.addEventListener('click', async () => {
      const businessId = button.dataset.id;
      if (!businessId) return;

      reviewModalBusinessId = businessId
      try {
        reviewsContainer.innerHTML = '<p class="text-sm text-gray-500">Loading reviews...</p>';
        toggleReviewsModal(true);

        const res = await fetch(`/api/businesses/${businessId}/reviews`);
        const data = await res.json();

        if (!Array.isArray(data)) throw new Error('Invalid review data');

        if (data.length === 0) {
          reviewsContainer.innerHTML = '<p class="text-sm text-gray-500">No reviews available.</p>';
          return;
        }

        reviewsContainer.innerHTML = ''; // Clear loading message
        data.forEach(review => {
          const div = document.createElement('div');
          div.className = 'border-b pb-2 border-gray-200 mb-2';
          div.innerHTML = `
            <div class="text-left text-sm font-semibold">${review.user || 'Anonymous'}</div>
            <div class="text-left text-yellow-500 text-xs">Rating: ${review.rating || 'N/A'}/5</div>
            <div class="text-left text-gray-700 text-sm">${review.comment || ''}</div>
          `;
          reviewsContainer.appendChild(div);
        });
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
        reviewsContainer.innerHTML = `<p class="text-sm text-red-500">Unable to load reviews. Please try again later.</p>`;
      }
    });
  });
});