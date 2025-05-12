const businessContainer = document.getElementById('businessListContainer');
const numberOfBusinessesFound = document.getElementById('numberOfBusinesses');

//chat modal
const chatModal = document.getElementById('chatModal');
const chatBackdrop = document.getElementById('chatModalBackdrop');
const closeChatModalBtn = document.getElementById('closeChatModal');
const chatHeader = document.getElementById('chatHeader');

let chatHistory = []; // Keep track of conversation history
let currentBusinessName = ''; // Set this when opening the chat modal

//review modal
const reviewsModal = document.getElementById('reviewsModal');
const reviewsBackdrop = document.getElementById('reviewsModalBackdrop');
const closeReviewsBtn = document.getElementById('closeReviewsModal');
const reviewsContainer = document.getElementById('reviewsContainer');
let businessId = null;

function toggleReviewsModal(visible) {
  reviewsModal.classList.toggle('hidden', !visible);
  reviewsBackdrop.classList.toggle('hidden', !visible);
  if (!visible) reviewsContainer.innerHTML = ''; // Reset on close
}

// review modal Close logic
closeReviewsBtn.addEventListener('click', () => toggleReviewsModal(false));
reviewsBackdrop.addEventListener('click', () => toggleReviewsModal(false));


// on chat button clicked - chat modal open
businessContainer.addEventListener('click', async (event) => {
    const chatButton = event.target.closest('.chatNowBusinessButton');
    const reviewsBusinessButton = event.target.closest('.reviewsBusinessButton');

    if (chatButton) {
        const businessName = chatButton.closest('[data-business-name]')?.dataset?.businessName || 'the business';
        
        if (currentBusinessName !== businessName) {
            chatHistory = []
        }
        currentBusinessName = businessName
        chatHeader.innerText = `Chat with ${businessName}`;
        chatModal.classList.remove('hidden');
        chatBackdrop.classList.remove('hidden');

        // ✅ Focus the input after a short delay to ensure the modal is visible
        setTimeout(() => {
          document.getElementById('chatInput')?.focus();
        }, 100);
    } else if (reviewsBusinessButton) {
      businessId = reviewsBusinessButton.dataset.id;
      try {
        const res = await fetch(`/api/businesses/${businessId}/reviews`);
        const data = await res.json();

        if (!Array.isArray(data)) throw new Error('Invalid review data');

        // Render reviews
        data.forEach(review => {
          const div = document.createElement('div');
          div.className = 'border-b pb-2 border-gray-200';
          div.innerHTML = `
            <div class="text-left text-sm font-semibold">${review.user || 'Anonymous'}</div>
            <div class="text-left text-yellow-500 text-xs">Rating: ${review.rating}/5</div>
            <div class="text-left text-gray-700 text-sm">${review.comment}</div>
          `;
          reviewsContainer.appendChild(div);
        });

        toggleReviewsModal(true);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      }
    }
});

// close chat modal
closeChatModalBtn.addEventListener('click', () => {
    chatModal.classList.add('hidden');
    chatBackdrop.classList.add('hidden');
});

// on chat send message
function addChatBubble(role, text) {
    const chatMessages = document.getElementById('chatMessages');

    const bubble = document.createElement('div');
    bubble.className = `max-w-xs text-sm px-4 py-2 rounded-lg shadow ${
        role === 'user'
        ? 'text-right self-end bg-blue-600 text-white'
        : 'text-left self-start bg-gray-200 text-gray-800'
    }`;
    bubble.innerText = text;

    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
}

document.getElementById('chatForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message) return;

  // 1. Add user message to UI and history
  addChatBubble('user', message);
  chatHistory.push({ role: 'user', text: message });
  input.value = '';

  // 2. Add typing indicator
  const chatMessages = document.getElementById('chatMessages');
  const typingBubble = document.createElement('div');
  typingBubble.className = 'self-start bg-gray-200 text-gray-500 px-4 py-2 rounded-lg max-w-xs text-sm italic shadow';
  typingBubble.innerText = 'Typing...';
  chatMessages.appendChild(typingBubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    // 3. Send to backend
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: currentBusinessName,
        message,
        history: chatHistory
      })
    });

    const data = await res.json();
    chatMessages.removeChild(typingBubble);

    if (!res.ok || !data.reply) {
      addChatBubble('ai', 'Sorry, something went wrong. Please try again.');
    } else {
      addChatBubble('ai', data.reply);
      chatHistory.push({ role: 'ai', text: data.reply });
    }

  } catch (err) {
    chatMessages.removeChild(typingBubble);
    addChatBubble('ai', 'Network error. Please try again later.');
    console.error('Chat error:', err);
  }
});

//review form
const reviewForm = document.getElementById('reviewForm');
const reviewUser = document.getElementById('reviewUser');
const reviewComment = document.getElementById('reviewComment');
const reviewRating = document.getElementById('reviewRating');

reviewForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const review = {
    user: reviewUser.value.trim(),
    comment: reviewComment.value.trim(),
    rating: parseFloat(reviewRating.value)
  };

  if (!review.user || !review.comment || !review.rating || !businessId) return;

  try {
    const res = await fetch(`/api/businesses/${businessId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit review');

    // Add new review to the top of the list
    const div = document.createElement('div');
    div.className = 'border-b pb-2';
    div.innerHTML = `
      <div class="text-sm font-semibold">${data.user || 'Anonymous'}</div>
      <div class="text-yellow-500 text-xs">Rating: ${data.rating}/5</div>
      <div class="text-gray-700 text-sm">${data.comment}</div>
    `;
    reviewsContainer.prepend(div);

    reviewForm.reset();
  } catch (err) {
    console.error('Review submission error:', err);
    alert('Failed to submit review. Please try again.');
  }
});


// business category filter
document.querySelectorAll('.categoryFilterBtn').forEach(button => {
  button.addEventListener('click', async () => {
    const category = button.dataset.category || '';

    // Remove highlight from all buttons
    document.querySelectorAll('.categoryFilterBtn').forEach(btn => {
      btn.classList.remove('bg-yellow-500', 'text-white');
    });

    // Add highlight to all buttons with matching category
    document.querySelectorAll(`.categoryFilterBtn[data-category="${category}"]`).forEach(btn => {
      btn.classList.add('bg-yellow-500', 'text-white');
    });

    // Fetch and render businesses
    try {
      const data = await fetchBusinesses({ category });
      renderBusinesses(data);
    } catch (err) {
      console.error('Failed to fetch by category:', err);
    }
  });
});

//zipcode filter
const zipcodeModal = document.getElementById('zipcodeModal');
const zipcodeBackdrop = document.getElementById('zipcodeModalBackdrop');
const openZipcodeBtn = document.getElementById('openZipcodeModal');
const closeZipcodeBtn = document.getElementById('closeZipcodeModal');
const zipcodeForm = document.getElementById('zipcodeForm');
const zipcodeInput = document.getElementById('zipcodeInput');

function toggleZipcodeModal(visible) {
  zipcodeModal.classList.toggle('hidden', !visible);
  zipcodeBackdrop.classList.toggle('hidden', !visible);
}

openZipcodeBtn.addEventListener('click', () => toggleZipcodeModal(true));
closeZipcodeBtn.addEventListener('click', () => toggleZipcodeModal(false));
zipcodeBackdrop.addEventListener('click', () => toggleZipcodeModal(false));

zipcodeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const zip = zipcodeInput.value.trim();

  if (!/^\d{5}$/.test(zip)) return;

  toggleZipcodeModal(false);

  try {
    const data = await fetchBusinesses({ zipcode: zip });
    renderBusinesses(data);
    Array.from(document.getElementsByClassName("zipText")).forEach(e => {
      e.innerText = zip;
    });
  } catch (err) {
    console.error('Failed to fetch by zipcode:', err);
  }
});

//search filter
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const search = searchInput.value.trim();

  try {
    const data = await fetchBusinesses({ search });
    renderBusinesses(data);
  } catch (err) {
    console.error('Search failed:', err);
  }
});

  

const renderBusinesses = (businessList) => {
  numberOfBusinessesFound.innerText = businessList.length || 0;
  businessContainer.innerHTML = '';

  businessList.forEach(business => {
    const {
      name,
      category,
      city,
      description,
      image,
      featured,
      reviewData,
      address,
      phone,
      amenities = []
    } = business;

    const imageUrl = image || 'https://place-hold.it/128';
    const displayRating = reviewData.rating ? (reviewData.reduce( (a, c) => a = c.rating)/reviewData.length).toFixed(1) : 5;
    const reviewCount = reviewData.length || 0;

    const featuredBadge = featured
      ? `<div class="absolute top-0 left-0 w-full bg-yellow-500 text-white text-xs font-medium py-1 px-2 text-center">Featured</div>`
      : '';

    const amenitiesHtml = amenities.map(a => `
      <div class="border-gray-300 inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors text-foreground text-xs bg-gray-50">
        ${a}
      </div>
    `).join('');

    businessContainer.innerHTML += `
      <div data-business-name="${business.name}" class="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border-transparent hover:border-yellow-200">
        <div class="p-0">
          <div class="flex flex-col sm:flex-row">
            <div class="sm:w-32 sm:h-32 h-48 relative">
              <img alt="${name}" loading="lazy" decoding="async" class="object-cover" src="${imageUrl}" style="position: absolute; height: 100%; width: 100%; inset: 0px;">
              ${featuredBadge}
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 sm:hidden">
                <div class="flex items-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span class="font-medium">${ displayRating }</span>
                  <span class="text-white/80 text-xs ml-1">(${reviewCount})</span>
                </div>
              </div>
            </div>
            <div class="flex-1 p-5">
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div class="flex items-center">
                    <h3 class="font-semibold tracking-tight text-xl">${name}</h3>
                    ${featured ? `
                      <div class="items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ml-2 hidden sm:inline-flex border-yellow-200 text-yellow-700 bg-yellow-50">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Featured
                      </div>` : ''
                    }
                  </div>
                  <div class="flex items-center flex-wrap gap-2 mt-2">
                    <div class="rounded-full border px-2.5 py-0.5 text-xs font-semibold flex items-center gap-1 bg-gray-100 text-secondary-foreground border-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path d="M10 2v2"/><path d="M14 2v2"/><path d="M6 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12a4 4 0 1 1 0 8h-1"/>
                      </svg>
                      <span>${category || 'N/A'}</span>
                    </div>
                    <div class="reviewsBusinessButton cursor-pointer hidden sm:flex items-center text-yellow-500" data-id="${business._id}">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-yellow-500 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      <span class="font-medium">${displayRating}</span>
                      <span class="text-muted-foreground text-sm ml-1">(${reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
                <button class="chatNowBusinessButton cursor-pointer bg-[#4793EB] hover:bg-[#3A7AC5] text-white text-sm rounded-full px-5 py-2 flex items-center gap-2 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                  </svg>
                  Chat Now
                </button>
              </div>
              <p class="text-left text-sm mt-3 text-gray-600">${description || 'No description provided.'}</p>
              <div class="bg-gray-300 h-[1px] w-full my-4"></div>
              <div class="flex flex-col sm:flex-row gap-4 text-sm">
                <div class="flex items-center text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin h-4 w-4 mr-2 text-gray-400">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>${address || 'Address not available'}, ${city}
                </div>
                <div class="flex items-center text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone h-4 w-4 mr-2 text-gray-400">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>${phone || 'N/A'}
                </div>
                <div class="flex items-center text-muted-foreground ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Open Now
                </div>
              </div>
              <div class="mt-4 pt-2 flex justify-between items-center">
                <div class="flex gap-2">${amenitiesHtml}</div>
                <div class="flex items-center gap-2">
                  <button class="text-xs border border-dashed border-gray-300 rounded-md px-3 py-1 text-gray-500 hover:text-gray-700 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>Claim Business
                  </button>
                  <button class="text-xs hover:bg-accent rounded-md px-3 py-1 text-gray-500 hover:text-gray-700 flex items-center gap-1">
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="M15 3h6v6"/><path d="M10 14L21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  // add pagination
  // businessContainer.innerHTML += `
  //   <div class="flex justify-center mt-8">
  //       <div class="flex items-center space-x-2">
  //           <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10" disabled="" aria-label="Previous page">
  //           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left h-4 w-4">
  //               <path d="m15 18-6-6 6-6"></path>
  //           </svg>
  //           </button>
  //           <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 text-primary-foreground h-10 w-10 bg-yellow-500 hover:bg-yellow-600" aria-label="Page 1" aria-current="page">1</button>
  //           <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10" aria-label="Page 2">2</button>
  //           <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10" aria-label="Next page">
  //           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right h-4 w-4">
  //               <path d="m9 18 6-6-6-6"></path>
  //           </svg>
  //           </button>
  //       </div>
  //   </div>
  // `
};


async function fetchBusinesses({ category = '', zipcode = '', search = '', page = 1, limit = 10 } = {}) {
  const queryParams = new URLSearchParams();

  if (category) queryParams.append('category', category);
  if (zipcode) queryParams.append('zipcode', zipcode);
  if (search) queryParams.append('search', search);

  queryParams.append('page', page);
  queryParams.append('limit', limit);

  try {
    const res = await fetch(`/api/businesses?${queryParams}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch businesses');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}


const businesses = await fetchBusinesses()
renderBusinesses(businesses)



  