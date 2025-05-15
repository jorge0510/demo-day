const { GoogleGenerativeAI } = require('@google/generative-ai');
const Business = require('../models/Business'); 
const FAQ = require('../models/FAQ');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const cityToZip = {
  'East Boston': '02128',
  'Revere': '02151',
  'Cambridge': '02139',
  'Boston': '02118',
};

const generateVozmiaSystemPrompt = async (message, user = null) => {
  const zipMatch = message.match(/\b\d{5}\b/);
  let zipCode = zipMatch ? zipMatch[0] : null;

  const knownCities = Object.keys(cityToZip);
  const matchedCity = knownCities.find(city =>
    message.toLowerCase().includes(city.toLowerCase())
  );
  if (!zipCode && matchedCity) {
    zipCode = cityToZip[matchedCity];
  }

  const keywords = message.toLowerCase().split(/\s+/).filter(w => w.length > 2).slice(0, 5);
  const knownCategories = ['Restaurants', 'Healthcare', 'Fitness', 'Technology', 'Professional Services'];
  const matchedCategory = knownCategories.find(cat =>
    message.toLowerCase().includes(cat.toLowerCase())
  );

  const businessMatch = await Business.findOne({
    name: { $regex: new RegExp(keywords.join('|'), 'i') }
  });

  let businesses = [];
  let shouldRedirect = false;
  let redirectUrl = '';
  let reply = '';

  if (businessMatch) {
    businesses = [businessMatch];
    shouldRedirect = true;
    redirectUrl = `/?search=${encodeURIComponent(businessMatch.name)}&zipcode=${businessMatch.zipCode || ''}`;
    reply = `${businessMatch.name} in ${businessMatch.city || 'the area'} is a great ${businessMatch.category.toLowerCase()} option.`;
  } else if (matchedCategory || zipCode) {
    const query = {};
    if (matchedCategory) query.category = matchedCategory;
    if (zipCode) query.zipCode = zipCode;
    businesses = await Business.find(query).limit(5);

    if (businesses.length > 0) {
      shouldRedirect = true;
      reply = `Here are some ${matchedCategory || ''} businesses${zipCode ? ` in ZIP ${zipCode}` : ''}.`;

      if (matchedCategory && zipCode) {
        redirectUrl = `/?category=${encodeURIComponent(matchedCategory)}&zipcode=${zipCode}`;
      } else if (matchedCategory) {
        redirectUrl = `/?category=${encodeURIComponent(matchedCategory)}`;
      } else if (zipCode) {
        redirectUrl = `/?zipcode=${zipCode}`;
      }
    }
  } else {
    businesses = await Business.find({
      $or: [
        { name: new RegExp(keywords.join('|'), 'i') },
        { category: new RegExp(keywords.join('|'), 'i') },
        { description: new RegExp(keywords.join('|'), 'i') }
      ]
    }).limit(3);
  }

  const businessSummaries = businesses.map(b =>
    `- ${b.name} (${b.category}) in ${b.city || 'N/A'}: ${b.description || 'No description available.'}`
  ).join('\n');

  const prompt = `
You are VozmIA, a general business assistant AI.
${user?.name ? `The current user is ${user.name}.` : ""}
Help users find local businesses, answer general business-related questions, and offer guidance on navigating services.

${businessSummaries
    ? `Based on the user's message, here are some relevant businesses:\n${businessSummaries}`
    : 'No specific businesses matched the query. Try asking about a category, ZIP code, or business name.'}

Guidelines:
- Be helpful, concise, and friendly.
- Reference only the businesses listed above if available.
- Never make up business info.
- If no matches are found, politely suggest more specific terms.
`;

  return { prompt, shouldRedirect, redirectUrl, reply };
};






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
      const { prompt, shouldRedirect, redirectUrl, reply } = await generateVozmiaSystemPrompt(message, req.user);

      if (shouldRedirect) {
        const fullUrl = `${redirectUrl}&reply=${encodeURIComponent(reply)}`;
        return res.json({ redirect: fullUrl });
      }

      systemInstruction = prompt;
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
      "notify the owner",
      "check with the owner",
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