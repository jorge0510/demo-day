document.addEventListener('DOMContentLoaded', () => {
    // Handle ignore
    document.querySelectorAll('.ignore-btn').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.ignore;
        if (confirm('Are you sure you want to ignore this question?')) {
          handleIgnore(id);
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
  
  function handleIgnore(id) {
    window.location.href = `/api/businesses/ignore-faq/${id}`;
  }