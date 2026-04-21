const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    try {
        const { priceId } = req.body;
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: 'https://reportly-gold.vercel.app/success.html?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://reportly-gold.vercel.app/cancel.html'
        });
        res.status(200).json({ sessionId: session.id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create session' });
    }
};
