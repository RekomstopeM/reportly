const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    try {
        const { priceId } = req.body;
        if (!priceId) return res.status(400).json({ error: 'Missing price ID' });
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: 'https://YOUR-NETLIFY-URL.netlify.app/success.html?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://YOUR-NETLIFY-URL.netlify.app/cancel.html'
        });
        res.json({ sessionId: session.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed' });
    }
};
