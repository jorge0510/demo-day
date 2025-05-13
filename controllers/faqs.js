const FAQ = require('../models/FAQ');
const Business = require('../models/Business');

exports.listFaqs = async (req, res) => {
  try {
    const businessId = req.params.businessId;

    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).send('Business not found.');
    }

    // Ensure only the user who claimed the business can view
    if (!business.claimedBy?.userId?.equals(req.user._id)) {
      return res.status(403).send('Access denied.');
    }

    const faqs = await FAQ.find({ business: businessId }).sort({ createdAt: -1 });

    res.render('dashboard/faqManagement', {
      business,
      faqs,
      user: req.user
    });
  } catch (err) {
    console.error('FAQ list error:', err);
    res.status(500).send('Server error.');
  }
};

exports.replyToFaq = async (req, res) => {
  try {
    const { id, faqId } = req.params;
    const { reply } = req.body;

    const business = await Business.findOne({ _id: id });

    if (!business) {
      return res.status(404).send('Business not found.');
    }

    // Ensure only the user who claimed the business can reply
    if (!business.claimedBy?.userId?.equals(req.user._id)) {
      return res.status(403).send('Access denied.');
    }

    const faq = await FAQ.findOne({ _id: faqId });

    if (!faq) {
      return res.status(404).send('FAQ not found.');
    }

    faq.reply = reply;
    faq.repliedAt = new Date();
    faq.approved = true;
    faq.source = 'owner';

    await faq.save();

    res.redirect(`/dashboard`);
  } catch (err) {
    console.error('FAQ reply error:', err);
    res.status(500).send('Server error.');
  }
};

exports.hideFaq = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.faqId).populate('business');
    if (!faq) return res.status(404).send('FAQ not found');

    // Make sure current user owns the business
    if (faq.business.claimedBy?.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send('Unauthorized');
    }

    faq.hidden = true;
    await faq.save();

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};