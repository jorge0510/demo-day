
document.addEventListener('DOMContentLoaded', () => {
  let currentBusinessName = 'VozmIA';
  let currentBusinessId = '';
  let chatStarted = false;
  let chatHistory = [];

  const chatInput = document.getElementById('chatInput');
  const chatForm = document.getElementById('chatForm');
  const callGenerealAIBtn = document.getElementById('callGeneralAI');
  const chatMessages = document.getElementById('chatMessages');

  function addChatBubble(role, text, isSystemMessage = false) {
    
      const wrapper = document.createElement('div');
      wrapper.className = role === 'user' ? 'flex justify-end' : 'flex justify-start';
    
      const bubble = document.createElement('div');
      bubble.className = 'max-w-[80%] rounded-lg px-4 py-2 shadow';
    
      if (role === 'user') {
        bubble.classList.add('bg-[#4793EB]', 'text-white');
        const p = document.createElement('p');
        p.className = 'text-sm';
        p.innerText = text;
        bubble.appendChild(p);
      } else {
      
        if (isSystemMessage) {
          bubble.className = 'w-full text-gray-500 italic text-sm text-center';
          bubble.innerText = text;
        } else {
          
          bubble.classList.add('bg-gray-100', 'text-gray-800');
    
          const header = document.createElement('div');
          header.className = 'flex items-center gap-2 mb-1';
    
          const label = document.createElement('span');
          label.className = 'text-xs font-bold';
          label.innerText = `${currentBusinessName || "VozmIA"}'s assistant` || 'Business Assistant';
    
          
          header.appendChild(label);
    
          const p = document.createElement('p');
          p.className = 'text-sm';
          p.innerText = text;
    
          bubble.appendChild(header);
          bubble.appendChild(p);
        }
      }
    
      wrapper.appendChild(bubble);
      chatMessages.appendChild(wrapper);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }


  //listen for enter
  if (chatInput && chatForm) {
    chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.requestSubmit(); // triggers 'submit' event
      }
    });
  }

    

    function resetAll() {
      currentBusinessName = '';
      currentBusinessId = '';
      document.querySelectorAll('.chatNowBusinessButton').forEach(btn => {
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
          </svg>
          Chat Now
        `;
        btn.classList.remove('bg-gray-300');
        btn.classList.add('bg-[#4793EB]', 'hover:bg-[#3A7AC5]');
      });
    }

    // Chat Now button (on business) logic
    document.querySelectorAll('.chatNowBusinessButton').forEach(button => {
      button.addEventListener('click', () => {
        const businessName = button.closest('[data-business-name]').dataset.businessName;
        const businessId = button.closest('[data-id]').dataset.id;
        
    
        if (currentBusinessId !== businessId) {
          addChatBubble('ai', `${currentBusinessName || "VozmIA"}'s assistant has entered the chat`, true);
          resetAll();

          currentBusinessId = businessId;
          currentBusinessName = businessName;
          chatStarted = true;
          chatHistory = [];


          // Update this button to show "Chatting Now"
          button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
            </svg>
            In the Chat
          `;
          button.classList.remove('bg-[#4793EB]', 'hover:bg-[#3A7AC5]');
          button.classList.add('bg-gray-300');
    
          // Intro + typing + welcome message
          addChatBubble('ai', `${currentBusinessName || "VozmIA"}'s assistant has entered the chat`, true);
          
          const typingBubble = document.createElement('div');
          typingBubble.className = 'self-start bg-gray-200 text-gray-500 px-4 py-2 rounded-lg max-w-xs text-sm italic shadow';
          typingBubble.innerText = 'Typing...';
          chatMessages.appendChild(typingBubble);
          chatMessages.scrollTop = chatMessages.scrollHeight;
    
          setTimeout(() => {
            chatMessages.removeChild(typingBubble);
            const welcomeMsg = `Hey, welcome to ${currentBusinessName}, how can we help you today?`;
            addChatBubble('ai', welcomeMsg);
            chatHistory.push({ role: 'ai', text: welcomeMsg });
          }, 800);
        }
    
        // Show chat tab
        const chatTab = document.getElementById('chat-tab');
        const chatContent = document.getElementById('chat-content');
        const searchTab = document.getElementById('search-tab');
        const searchContent = document.getElementById('search-content');
    
        if (chatTab && chatContent && searchTab && searchContent) {
          chatContent.classList.remove('hidden');
          searchContent.classList.add('hidden');
          chatTab.classList.add('text-yellow-600', 'border-yellow-500', 'border-b-2');
          searchTab.classList.remove('text-yellow-600', 'border-yellow-500', 'border-b-2');
          chatTab.classList.remove('text-gray-600');
          searchTab.classList.add('text-gray-600');
        }
    
        setTimeout(() => {
          document.getElementById('chatInput')?.focus();
        }, 150);
      });
    });



    // on call VozmIA
    
    callGenerealAIBtn && callGenerealAIBtn.addEventListener('click', async () => {
      // If already in VozmIA, do nothing
      if (currentBusinessName === 'VozmIA') return;
    
      // If switching from another business, show "left" message
      if (currentBusinessName && currentBusinessName !== 'VozmIA') {
        addChatBubble('ai', `${currentBusinessName}'s assistant has left the chat`, true);
      }
    
      resetAll(); // This should clear state (including currentBusinessName)
    
      await new Promise(resolve => setTimeout(resolve, 300));
    
      // Switch to VozmIA
      currentBusinessName = 'VozmIA';
      const welcomeMsg = `VozmIA has returned to the chat`;
      addChatBubble('ai', welcomeMsg, true);
      chatHistory.push({ role: 'ai', text: welcomeMsg });
      onVozmiaEnter()
    });


    // Chat Form Submission
    if (chatForm) {
      chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        if (!message) return;

        addChatBubble('user', message);
        chatHistory.push({ role: 'user', text: message });
        input.value = '';

        
        const typingBubble = document.createElement('div');
        typingBubble.className = 'self-start bg-gray-200 text-gray-500 px-4 py-2 rounded-lg max-w-xs text-sm italic shadow';
        typingBubble.innerText = 'Typing...';
        chatMessages.appendChild(typingBubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              businessId: currentBusinessId,
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

    function onVozmiaEnter() {
      setTimeout(() => {
        const welcomeMsg = `Hi! Let me know what you’re looking for—I’m here to help!`;
        addChatBubble('ai', welcomeMsg);
        chatHistory.push({ role: 'ai', text: welcomeMsg });
      }, 500);
    }

    
  const suggestionsContainer = document.getElementById('suggestions');
  const suggestionButtons = suggestionsContainer?.querySelectorAll('button') || [];
  
if (suggestionsContainer) {
  suggestionButtons.forEach(button => {
    button.addEventListener('click', () => {
      chatInput.value = button.innerText;
      suggestionsContainer.classList.add('hidden'); // hide suggestions
      chatInput.focus();
    });
  });

  
  if (chatForm) {
    chatForm.addEventListener('submit', () => {
      suggestionsContainer?.classList.add('hidden');
    });
  }
}
  
  

    onVozmiaEnter()
})