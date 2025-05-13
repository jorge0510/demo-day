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

### 🧠 How it Works
- The AI doesn't assume—it **asks**.
- Business owners train their assistant by answering questions like:  
  _“Do you offer gluten-free options?”_
- The AI learns from every reply and stores those answers for future conversations.
- Customers benefit from instant, accurate, and trustworthy info—on demand.

---

## 🧩 Features

- 🔍 **Minimalistic Search Experience**
- 🧠 **Conversational AI with business-taught knowledge**
- 🗂️ **Categorized, Filterable Directory**
- 📦 **Multitenancy-ready for multiple businesses**
- 📸 **Image upload with Cloudinary**
- 🧾 **Feature request and feedback system**
- 🛡️ **Authentication & Authorization**

---

## 🛠️ Tech Stack

* **Frontend:** EJS, TailwindCSS, Vanilla JavaScript
* **Backend:** Node.js, Express.js, MongoDB
* **AI Integration:** Gemini API
* **Authentication:** Passport/Session-based login

---

## 📁 Project Structure

```
├── config/           # DB + Passport config
├── controllers/      # Business, Chat, Auth, FAQs, Reviews logic
├── middleware/       # Auth, Cloudinary, Multer
├── models/           # Business, User, FAQ schemas
├── public/           # Static assets
├── routes/           # Express routes
├── src/              # Styles and client logic
├── views/            # EJS views and partials
├── index.js          # App entry point
├── Dockerfile        # Deployment setup
└── README.md         # You’re here

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
PORT=3000
DB_STRING=your_mongo_connection_string
GEMINI_API_KEY=your_google_gemini_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 4. Start the server

```bash
npm run dev
# or
node index.js
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