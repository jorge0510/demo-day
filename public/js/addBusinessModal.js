document.addEventListener('DOMContentLoaded', () => {
    const addBusinessModal = document.getElementById('businessModal');
    const addBusinessBackdrop = document.getElementById('modalBackdrop');
    const openAddBusinessBtn = document.getElementById('openAddBusinessModalBtn');
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
})