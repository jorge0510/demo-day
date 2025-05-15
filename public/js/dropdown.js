const dropdownBtn = document.getElementById('profileDropdownBtn');
const dropdownMenu = document.getElementById('profileDropdown');

dropdownBtn.addEventListener('click', function (e) {
e.stopPropagation(); 
dropdownMenu.classList.toggle('hidden');
});


window.addEventListener('click', function () {
dropdownMenu.classList.add('hidden');
});