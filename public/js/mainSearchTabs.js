document.addEventListener("DOMContentLoaded", () => {
    const tabChatBtn = document.getElementById("chat-tab");
    const tabSearchBtn = document.getElementById("search-tab");

    const contentChat = document.getElementById("chat-content");
    const contentSearch = document.getElementById("search-content");

    if(tabChatBtn && tabSearchBtn && contentChat && contentSearch) {
      tabChatBtn.addEventListener("click", () => {
        // Button styles
        tabChatBtn.classList.add("text-yellow-600", "border-b-2", "border-yellow-500");
        tabChatBtn.classList.remove("text-gray-600");

        tabSearchBtn.classList.remove("text-yellow-600", "border-b-2", "border-yellow-500");
        tabSearchBtn.classList.add("text-gray-600");

        // Content visibility
        contentChat.classList.remove("hidden");
        contentSearch.classList.add("hidden");
      });

      tabSearchBtn.addEventListener("click", () => {
        tabSearchBtn.classList.add("text-yellow-600", "border-b-2", "border-yellow-500");
        tabSearchBtn.classList.remove("text-gray-600");

        tabChatBtn.classList.remove("text-yellow-600", "border-b-2", "border-yellow-500");
        tabChatBtn.classList.add("text-gray-600");

        contentSearch.classList.remove("hidden");
        contentChat.classList.add("hidden");
      });
    }
  });