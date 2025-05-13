const businessContainer = document.getElementById('businessListContainer');
const numberOfBusinessesFound = document.getElementById('numberOfBusinesses');

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

// navbar responsiveness on mobile
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

//claim business modal
document.getElementById('closeClaimModalBtn').addEventListener('click', () => {
  document.getElementById('claimBusinessModal').classList.add('hidden');
  document.getElementById('claimModalBackdrop').classList.add('hidden');
});

document.getElementById('claimModalBackdrop').addEventListener('click', () => {
  document.getElementById('claimBusinessModal').classList.add('hidden');
  document.getElementById('claimModalBackdrop').classList.add('hidden');
});

const claimBusinessForm = document.getElementById('claimBusinessForm')
if (claimBusinessForm) {
  claimBusinessForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const businessId = document.getElementById('claimBusinessId').value;
    const message = e.target.message.value.trim();

    try {
      const res = await fetch(`/api/businesses/${businessId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Claim submitted!');
        e.target.reset();
        document.getElementById('claimBusinessModal').classList.add('hidden');
        document.getElementById('claimModalBackdrop').classList.add('hidden');
      } else {
        alert(data.error || 'Failed to claim business.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting claim.');
    }
  });
}

//create business modal
// Add Business Modal Elements
const addBusinessModal = document.getElementById('businessModal');
const addBusinessBackdrop = document.getElementById('modalBackdrop');
const openAddBusinessBtn = document.getElementById('openCreateBusinessModalBtn');
const closeAddBusinessBtn = document.getElementById('closeModalBtn');

// Step Navigation
const addBusinessTabs = document.querySelectorAll('.step-tab');
const addBusinessSteps = document.querySelectorAll('.step-content');
const prevBusinessStepBtn = document.getElementById('prevBtn');
const nextBusinessStepBtn = document.getElementById('nextBtn');
let businessModalStep = 0;

function showBusinessStep(index) {
  addBusinessSteps.forEach((step, i) => step.classList.toggle('hidden', i !== index));
  addBusinessTabs.forEach((tab, i) => {
    tab.classList.toggle('text-gray-500', i !== index);
    tab.classList.toggle('border-b-2', i === index);
  });
  prevBusinessStepBtn.classList.toggle('hidden', index === 0);
  nextBusinessStepBtn.textContent = index === addBusinessSteps.length - 1 ? 'Submit Business' : 'Next';
}

// Modal Open/Close Handlers
openAddBusinessBtn.addEventListener('click', () => {
  addBusinessModal.classList.remove('hidden');
  addBusinessBackdrop.classList.remove('hidden');
  businessModalStep = 0;
  showBusinessStep(businessModalStep);
});

closeAddBusinessBtn.addEventListener('click', () => {
  addBusinessModal.classList.add('hidden');
  addBusinessBackdrop.classList.add('hidden');
});

addBusinessBackdrop.addEventListener('click', () => {
  addBusinessModal.classList.add('hidden');
  addBusinessBackdrop.classList.add('hidden');
});

// Step tab click
addBusinessTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    businessModalStep = parseInt(tab.dataset.step);
    showBusinessStep(businessModalStep);
  });
});

// Navigation button logic
nextBusinessStepBtn.addEventListener('click', () => {
  if (businessModalStep === addBusinessSteps.length - 1) {
    const form = document.getElementById('businessForm');
    const formData = new FormData(form);

    fetch('/api/businesses', {
      method: 'POST',
      body: formData
    }).then(async res => {
      const result = await res.json();
      if (res.ok) {
        alert('Business submitted!');
        form.reset();
        addBusinessModal.classList.add('hidden');
        addBusinessBackdrop.classList.add('hidden');
      } else {
        alert('Error: ' + result.error);
      }
    }).catch(err => {
      console.error('Network error:', err);
      alert('Submission failed');
    });
  } else {
    businessModalStep++;
    showBusinessStep(businessModalStep);
  }
});

prevBusinessStepBtn.addEventListener('click', () => {
  if (businessModalStep > 0) {
    businessModalStep--;
    showBusinessStep(businessModalStep);
  }
});


//auth modal
const authModal = document.getElementById('authModal');
const authBackdrop = document.getElementById('authBackdrop');
const closeAuthModal = document.getElementById('closeAuthModal');
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authModalButton = document.getElementById('authModalButton');

if(authModalButton) {authModalButton.addEventListener('click', openAuthModal)}

const params = new URLSearchParams(window.location.search);
if (params.get('auth') === 'open') {
  document.addEventListener("DOMContentLoaded", function () {
    openAuthModal(); 
  });
}

// Show modal
function openAuthModal(e) {
  e && e.preventDefault()
  authModal.classList.remove('hidden');
  authBackdrop.classList.remove('hidden');
  loginTab.click(); // default to login
}

// Close modal
closeAuthModal.onclick = () => {
  authModal.classList.add('hidden');
  authBackdrop.classList.add('hidden');
};

// Toggle tabs
loginTab.onclick = () => {
  loginTab.classList.add('text-black', 'border-black');
  loginTab.classList.remove('text-gray-500', 'border-transparent');

  registerTab.classList.remove('text-black', 'border-black');
  registerTab.classList.add('text-gray-500', 'border-transparent');

  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
};

registerTab.onclick = () => {
  registerTab.classList.add('text-black', 'border-black');
  registerTab.classList.remove('text-gray-500', 'border-transparent');

  loginTab.classList.remove('text-black', 'border-black');
  loginTab.classList.add('text-gray-500', 'border-transparent');

  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
};

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


//chat modal
const chatModal = document.getElementById('chatModal');
const chatBackdrop = document.getElementById('chatModalBackdrop');
const closeChatModalBtn = document.getElementById('closeChatModal');
const chatHeader = document.getElementById('chatHeader');

let chatHistory = []; // Keep track of conversation history
let currentBusinessName = ''; // Set this when opening the chat modal


// on chat button clicked - chat modal open
businessContainer.addEventListener('click', async (event) => {
    const chatButton = event.target.closest('.chatNowBusinessButton');
    const reviewsBusinessButton = event.target.closest('.reviewsBusinessButton');
    const claimBtn = event.target.closest('.claimBusinessButton');
    const chatMessages = document.getElementById('chatMessages')

    if (chatButton) {
        const businessName = chatButton.closest('[data-business-name]')?.dataset?.businessName || 'the business';

        if (currentBusinessName !== businessName) {
          chatHistory = []; // Reset history if different business
        }
        
        // Reset chat UI

        if (chatMessages){
          chatMessages.innerHTML = `
            <div class="text-left self-start bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-xs text-sm shadow">
              Hello! Welcome to ${businessName}. How can I help you today?
            </div>
          `;
        }

        currentBusinessName = businessName
        chatHeader && (chatHeader.innerText = `Chat with ${businessName}`);
        chatModal && chatModal.classList.remove('hidden');
        chatBackdrop && chatBackdrop.classList.remove('hidden');

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
    } else if (claimBtn) {
      const bizId = claimBtn.dataset.id;
      const bizIdInput = document.getElementById('claimBusinessId');
      if (bizIdInput) {
        bizIdInput.value = bizId;
      }
      document.getElementById('claimBusinessModal').classList.remove('hidden');
      document.getElementById('claimModalBackdrop').classList.remove('hidden');
    }
});

// close chat modal
if(closeChatModalBtn) {
  closeChatModalBtn.addEventListener('click', () => {
    chatModal.classList.add('hidden');
    chatBackdrop.classList.add('hidden');
  });
}


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

const chatForm = document.getElementById('chatForm')

if(chatForm) {
  chatForm.addEventListener('submit', async (e) => {
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
}

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

const addPointZero = number =>
  Number.isInteger(number) ? number.toString() + ".0" : number.toFixed(1);

const displayRating = (reviewData) =>
  reviewData.length
    ? addPointZero(
        reviewData.reduce((a, c) => a + c.rating, 0) / reviewData.length
      )
    : "";

const renderBusinesses = (businessList) => {
  numberOfBusinessesFound.innerText = businessList.length || 0;
  businessContainer.innerHTML = '';

  businessList.forEach(business => {
    const {
      _id,
      name,
      category,
      city,
      state,
      zipCode,
      description,
      image,
      featured,
      claimed,
      reviewData,
      website,
      address,
      phone,
      amenities = []
    } = business;

    const imageUrl = image || '/img/logo.jpg';
    
    const reviewCount = reviewData.length || 0;

    const featuredBadge = featured
      ? `<div class="absolute top-0 left-0 w-full bg-yellow-500 text-white text-xs font-medium py-1 px-2 text-center">Featured</div>`
      : '';

    const amenitiesHtml = amenities.map(a => `
      <div class="border-gray-300 inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors text-foreground text-xs bg-gray-50">
        ${a}
      </div>
    `).join('');

    function formatPhoneUS(phone) {
      const digits = phone.replace(/\D/g, ''); // Remove non-digits
      if (digits.length !== 10) return phone;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

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
                  <span class="font-medium">${ displayRating(reviewData) }</span>
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
                    ${claimed ? `
                    <div class="items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ml-2 hidden sm:inline-flex border-green-200 text-green-700 bg-green-50">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-green-500 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 13l4 4L19 7"/>
                      </svg>
                      Claimed
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
                      <span class="font-medium">${displayRating(reviewData)}</span>
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
              <p class="text-left text-sm mt-3 text-gray-600">${truncateText(description, 499) || 'No description provided.'}</p>
              <div class="bg-gray-300 h-[1px] w-full my-4"></div>
              <div class="flex flex-col sm:flex-row gap-4 text-sm">
                <div class="flex items-center text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin h-4 w-4 mr-2 text-gray-400">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>${address || 'Address not available'}, ${city || ""}, ${state || ""}. ${zipCode}
                </div>
                <div class="cursor-pointer flex items-center text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone h-4 w-4 mr-2 text-gray-400">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg> <a href="tel://${phone}">${formatPhoneUS(phone) || 'N/A'}</a>
                </div>
                <div class="cursor-pointer flex items-center text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg"
                      width="24" height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-globe h-4 w-4 mr-2 text-gray-400">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M2 12h20"></path>
                    <path d="M12 2a15.3 15.3 0 0 1 0 20"></path>
                    <path d="M12 2a15.3 15.3 0 0 0 0 20"></path>
                  </svg>
                  <a href="https://${website}" target="_blank" class="hover:underline">${website || 'Website'}</a>
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

                 ${ !claimed ? `
                    <button data-id="${_id}" class="claimBusinessButton cursor-pointer text-xs border border-dashed border-gray-300 rounded-md px-3 py-1 text-gray-500 hover:text-gray-700 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>Claim Business
                    </button> 
                 ` : ''
                  }
                  
                  
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

//featured businesses
function renderFeaturedBusinesses(featuredList = []) {
  const container = document.getElementById('featuredBusinessesContainer');
  if (!container) return;

  container.innerHTML = '';

  featuredList.forEach(biz => {
    const div = document.createElement('div');
    div.className = 'cursor-pointer border-gray-200 rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden';
    div.innerHTML = `
      <div class="p-3">
        <div class="flex items-center gap-3">
          <div class="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
            <img alt="${biz.name}" class="h-full w-full object-cover" src="${biz.image || '/img/logo.jpg'}" />
          </div>
          <div>
            <h4 class="font-medium text-sm line-clamp-1">${biz.name}</h4>
            <div class="flex items-center text-yellow-500 text-xs">
              <svg class="h-3 w-3 fill-yellow-500 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span>${ displayRating(biz.reviewData) || 'No Reviews'}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}


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

// filter and render featured ones
const featured = businesses.filter(b => b.featured);
renderFeaturedBusinesses(featured);



  