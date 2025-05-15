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