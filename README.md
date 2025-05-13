# 🏨 Vozmia – Smarter Conversations With Local Businesses

## About Vozmia

**Vozmia** is an AI-ready business directory designed to help users connect directly with local businesses through smart, conversational interfaces. Our mission is to empower businesses to teach the AI what they truly are—by simply answering questions.

---

## 👶 Learning Like a Baby

Our AI doesn't assume—it asks. Like a child learning its first words, Vozmia's chatbot starts with questions and learns from the source: the business owners themselves. This approach minimizes hallucinations and ensures answers are accurate, trustworthy, and human-approved.

---

## 🔁 Training With Every Interaction

When a customer asks a question—like "Do you offer gluten-free options?"—and the owner replies "Yes, every item is customizable!", Vozmia learns that response. From then on, the AI can answer that question instantly and reliably.

---

## 📍 A Smarter Local Experience

Vozmia bridges the gap between automation and authenticity. We believe that the best AI is one that listens first—then speaks from real knowledge. Each business trains its own assistant, and customers benefit from faster, clearer support.

---

## 🛠️ Tech Stack

* **Frontend:** EJS, TailwindCSS, Vanilla JavaScript
* **Backend:** Node.js, Express.js, MongoDB
* **AI Integration:** OpenAI API
* **Authentication:** Passport/Session-based login

---

## 📁 Project Structure

```
├── config/            # Configuration files
├── controllers/       # Route logic (likely handles business logic)
├── middleware/        # Auth or other middleware
├── models/            # Mongoose or DB models
├── node_modules/      
├── public/            # Static assets (CSS, JS, images)
├── routes/            # Express route definitions
├── src/               # Likely extra logic / helpers / client-side JS
├── views/             # EJS templates (where index.ejs probably lives)
├── index.js           # Main Express app entry

```

---

## 🧭 Running the App

### 1. Clone the repo

```bash
git clone https://github.com/jorge0510/demo-day.git
cd demo-day
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

```env
MONGODB_URI=your_mongo_connection
SESSION_SECRET=your_secret
OPENAI_API_KEY=your_openai_key
```

### 4. Start the server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## ✨ Coming Soon

* AI training dashboards
* Customer chat widgets
* Insights for business owners

---

## 📬 Contact

**Jorge Garcia-Zapata**
🌐 [Portfolio](https://jorge.bizete.com)
💼 [LinkedIn](https://www.linkedin.com/in/jorgeagarcia1)

---

> "Your business, your voice. Trained by you. Powered by Vozmia."
