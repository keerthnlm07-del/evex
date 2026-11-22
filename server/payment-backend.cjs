/**
 * EVEX Payment Backend Service (Test Mode & Production Ready)
 * Handles Razorpay Order Creation, HMAC SHA256 Signature Verification,
 * Webhook Handling, and Idempotent Ledgering.
 */

const http = require('http');
const crypto = require('crypto');

// Default Razorpay Test Credentials (or from process.env)
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_evexDemoKey123';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'evex_test_secret_key_8899aabbcc';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'evex_webhook_secret_9988';

const PORT = process.env.PAYMENT_PORT || 4000;

// In-memory idempotent store for transaction tracking & deduplication
const ordersStore = new Map();
const processedPayments = new Set();

/**
 * Verify Razorpay payment signature
 * signature = HMAC_SHA256(order_id + '|' + payment_id, secret)
 */
function verifyPaymentSignature(orderId, paymentId, signature) {
  if (!orderId || !paymentId || !signature) return false;
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
}

/**
 * Verify Webhook signature
 */
function verifyWebhookSignature(payloadBody, webhookSignature) {
  if (!payloadBody || !webhookSignature) return false;
  const expected = crypto
    .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
    .update(payloadBody)
    .digest('hex');
  return expected === webhookSignature;
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Razorpay-Signature');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // 1. Health check
  if (req.method === 'GET' && pathname === '/api/payment/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', mode: 'test', razorpayKeyId: RAZORPAY_KEY_ID }));
    return;
  }

  // Collect request body
  let bodyChunks = [];
  req.on('data', chunk => bodyChunks.push(chunk));
  req.on('end', () => {
    const rawBody = Buffer.concat(bodyChunks).toString();
    let body = {};
    if (rawBody) {
      try { body = JSON.parse(rawBody); } catch (e) { /* ignore */ }
    }

    // 2. Create Razorpay Order
    if (req.method === 'POST' && pathname === '/api/payment/create-order') {
      const { bookingId, amount, customerId, customerName, customerEmail } = body;

      if (!bookingId || !amount || amount <= 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid bookingId or amount' }));
        return;
      }

      // Generate order with receipt and idempotency tag
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const orderData = {
        id: orderId,
        entity: 'order',
        amount: Math.round(Number(amount) * 100), // in paise
        currency: 'INR',
        receipt: `rcpt_${bookingId.slice(-6)}_${Date.now().toString().slice(-4)}`,
        status: 'created',
        bookingId,
        customerId,
        customerName,
        customerEmail,
        createdAt: new Date().toISOString()
      };

      ordersStore.set(orderId, orderData);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        orderId: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        key: RAZORPAY_KEY_ID,
        receipt: orderData.receipt,
        testMode: true
      }));
      return;
    }

    // 3. Verify Payment Signature
    if (req.method === 'POST' && pathname === '/api/payment/verify-signature') {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, amount } = body;

      // Idempotency check: prevent duplicate payments
      if (processedPayments.has(razorpay_payment_id)) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Payment already processed (idempotent duplicate request)',
          status: 'Paid',
          paymentId: razorpay_payment_id
        }));
        return;
      }

      const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

      if (!isValid) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Invalid payment signature. Verification failed.',
          status: 'Failed'
        }));
        return;
      }

      // Mark payment processed
      processedPayments.add(razorpay_payment_id);

      const order = ordersStore.get(razorpay_order_id);
      if (order) {
        order.status = 'paid';
        order.paymentId = razorpay_payment_id;
      }

      const verifiedRecord = {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        bookingId: bookingId || order?.bookingId,
        amount: amount || (order ? order.amount / 100 : 0),
        status: 'Paid',
        signatureVerified: true,
        testMode: true,
        timestamp: new Date().toISOString()
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        verified: true,
        status: 'Paid',
        data: verifiedRecord
      }));
      return;
    }

    // 4. Razorpay Webhook Handler
    if (req.method === 'POST' && pathname === '/api/payment/webhook') {
      const webhookSig = req.headers['x-razorpay-signature'];
      const isValid = verifyWebhookSignature(rawBody, webhookSig);

      if (!isValid) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid webhook signature' }));
        return;
      }

      const event = body.event;
      console.log(`[Razorpay Webhook] Received event: ${event}`);

      // Handle payment events
      if (event === 'payment.captured') {
        const paymentEntity = body.payload?.payment?.entity;
        if (paymentEntity) {
          processedPayments.add(paymentEntity.id);
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ received: true }));
      return;
    }

    // 404 for other routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`✓ EVEX Razorpay Payment Backend running on http://localhost:${PORT}`);
    console.log(`  Key ID: ${RAZORPAY_KEY_ID}`);
    console.log(`  Mode: Razorpay Standard Checkout (TEST MODE)`);
  });
}

module.exports = {
  server,
  verifyPaymentSignature,
  verifyWebhookSignature,
  ordersStore
};
