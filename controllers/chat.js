const { GoogleGenerativeAI } = require('@google/generative-ai');
const Business = require('../models/Business'); 
const FAQ = require('../models/FAQ');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


exports.chatWithBusiness = async (req, res) => {
  try {
    const { businessId, message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Missing message' });
    }

    let systemInstruction = '';
    let business;

    if (businessId) {
      business = await Business.findById(businessId);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      const faqs = await FAQ.find({ business: business._id, approved: true, hidden: false });

      const faqInstructions = faqs.length
        ? `Frequently Asked Questions:\n` +
          faqs.map(faq => `- Q: ${faq.question}\n  A: ${faq.reply}`).join('\n')
        : '';

      systemInstruction = `
      You are an AI assistant representing "${business.name}".
      Please answer user questions as if you were a friendly and knowledgeable staff member.

      Business Overview:
      - Category: ${business.category}
      - Subcategory: ${business.subcategory || 'N/A'}
      - Description: ${business.description || 'N/A'}

      Location & Contact:
      - Address: ${business.address || 'N/A'}, ${business.city || 'N/A'}, ZIP ${business.zipCode || 'N/A'}
      - Phone: ${business.phone || 'N/A'}
      - Email: ${business.email || 'N/A'}
      - Website: ${business.website || 'N/A'}
      - Facebook: ${business.social?.facebook || 'N/A'}
      - Instagram: ${business.social?.instagram || 'N/A'}

      Operating Hours:
      - Monday: ${business.hours?.Monday || 'N/A'}
      - Tuesday: ${business.hours?.Tuesday || 'N/A'}
      - Wednesday: ${business.hours?.Wednesday || 'N/A'}
      - Thursday: ${business.hours?.Thursday || 'N/A'}
      - Friday: ${business.hours?.Friday || 'N/A'}
      - Saturday: ${business.hours?.Saturday || 'N/A'}
      - Sunday: ${business.hours?.Sunday || 'N/A'}

      Amenities:
      - ${business.amenities?.length ? business.amenities.join(', ') : 'None'}

      ${faqInstructions}

      Instructions:
      - Stay in character as the assistant for this business.
      - Be concise, helpful, and polite.
      - Do not repeat greetings, be concise.
      - Never offer discounts or promotions.
      - If you're unsure, say you'll notify the owner and offer to assist further.
      `;
    } else {
      systemInstruction = `
      You are VozmIA, a general business assistant AI.
      Help users find local businesses, answer general business-related questions, and offer guidance on navigating services.
      
      Guidelines:
      - You are neutral and do not represent any single business.
      - Be helpful, concise, and friendly.
      - If a question is specific to a business, suggest searching by name or category.
      - Never make up business info.
      `;
    }

    const convertRole = (role) => {
      if (role === 'user') return 'user';
      if (role === 'ai' || role === 'assistant' || role === 'model') return 'model';
      return 'user'; // fallback
    };

    const chatContext = [
      { role: 'user', parts: [{ text: systemInstruction }] },
      ...history.map(entry => ({
        role: convertRole(entry.role),
        parts: [{ text: entry.text }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent({ contents: chatContext });

    const reply = result?.response?.text().trim();

    const hallucinationIndicators = [
      "I'm not sure",
      "As an AI",
      "I don't have information",
      "I can't provide",
      "Unfortunately",
      "I cannot confirm",
      "don't know",
      "I am not sure",
      "I am going to communicate",
      "I will pass this question along"
    ];

    const isUncertain = hallucinationIndicators.some(indicator =>
      reply?.toLowerCase().includes(indicator.toLowerCase())
    );

    if (isUncertain && businessId) {
      await FAQ.create({
        business: business._id,
        question: message,
        email: req.user?.email || null,
        reply: null,
        questionSource: 'user',
        replySource: null,
        approved: false,
        createdAt: new Date(),
        repliedAt: null
      });
    }

    res.json({ reply: reply || 'Sorry, I could not generate a response.' });

  } catch (err) {
    console.error('Gemini Error:', err);
    res.status(500).json({ error: 'Something went wrong with the AI service.' });
  }
};