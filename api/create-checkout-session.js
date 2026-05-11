const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }
    try {
        const { priceId } = JSON.parse(event.body);
        if (!priceId) return { statusCode: 400, body: JSON.stringify({ error: 'Missing price ID' }) };
        
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: 'https://YOUR-NETLIFY-URL.netlify.app/success.html?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://YOUR-NETLIFY-URL.netlify.app/cancel.html'
        });
        return { statusCode: 200, body: JSON.stringify({ sessionId: session.id }) };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed' }) };
    }
};
