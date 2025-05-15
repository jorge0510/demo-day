document.addEventListener('DOMContentLoaded', () => {
    // Handle ignore
    document.querySelectorAll('.ignore-btn').forEach(button => {
        button.addEventListener('click', async () => {
          const faqId = button.dataset.ignore;
          const businessId = button.dataset.business;
      
          if (confirm('Are you sure you want to ignore this question?')) {
            await handleIgnore(businessId, faqId);
          }
        });
      });
  
    // Handle reply toggle
    document.querySelectorAll('.reply-btn').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.reply;
        toggleReplyInput(id);
      });
    });
  
    // Handle reply submit
    document.querySelectorAll('.submit-reply-btn').forEach(button => {
      button.addEventListener('click', () => {
        const textarea = button.previousElementSibling;
        const message = textarea.value.trim();
        if (!message) {
          alert('Please type a reply first.');
          return;
        }
  
        // Simulated behavior – replace this with form.submit() or fetch()
        alert('Reply sent: ' + message);
        textarea.value = '';
        const wrapper = button.closest('.reply-input-wrapper');
        if (wrapper) wrapper.classList.add('hidden');
      });
    });
  });
  
  function toggleReplyInput(id) {
    const inputSection = document.getElementById(`replyInput-${id}`);
    if (inputSection) {
      inputSection.classList.toggle('hidden');
    }
  }
  
  
  async function handleIgnore(businessId, faqId) {
    try {
      const res = await fetch(`/api/businesses/${businessId}/faqs/${faqId}/hide`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (res.ok) {
        const card = document.getElementById(`faqCard-${faqId}`);
        if (card) card.remove();
      } else {
        alert('Failed to hide FAQ');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    }
  }