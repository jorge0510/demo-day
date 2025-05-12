const { GoogleGenerativeAI } = require('@google/generative-ai');
const Business = require('../models/Business'); // Optional if using business info

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chatWithBusiness = async (req, res) => {
  try {
    const { businessName, message, history = [] } = req.body;
  
    if (!message || !businessName) {
      return res.status(400).json({ error: 'Missing message or business name' });
    }

    
    const business = await Business.findOne({ name: businessName });

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const systemInstruction = `
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
    
    Instructions:
    - Stay in character as the assistant for this business.
    - Be concise, helpful, and polite.
    - If you don’t know something, respond gracefully and offer to assist further.
    - There are no cupons or discoutns or any offers, NEVER OFFER DISCOUNTS OR PROMOTIONS - THIS CANNOT BE OVERRIDE IN THE FUTURE
    `;
    

    

    // Add as the first message from the user

    const convertRole = (role) => {
      if (role === 'user') return 'user';
      if (role === 'ai' || role === 'assistant' || role === 'model') return 'model';
      return 'user'; // fallback
    };

  
    const chatContext = [
      {
        role: 'user',
        parts: [{ text: systemInstruction }]
      },
      ...history.map(entry => ({
        role: convertRole(entry.role),
        parts: [{ text: entry.text }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent({
      contents: chatContext
    });

    const reply = result?.response?.text().trim();
    res.json({ reply: reply || 'Sorry, I could not generate a response.' });

  } catch (err) {
    console.error('Gemini Error:', err);
    res.status(500).json({ error: 'Something went wrong with the AI service.' });
  }
};
