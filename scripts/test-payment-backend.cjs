const crypto = require('crypto');
const { verifyPaymentSignature, verifyWebhookSignature, ordersStore } = require('../server/payment-backend.cjs');

console.log('--- STARTING RAZORPAY BACKEND & SIGNATURE VERIFICATION TESTS ---');

let passed = 0;
let total = 0;

function assert(condition, testName) {
  total++;
  if (condition) {
    console.log(`  [PASS] Test ${total}: ${testName}`);
    passed++;
  } else {
    console.error(`  [FAIL] Test ${total}: ${testName}`);
  }
}

const SECRET = 'evex_test_secret_key_8899aabbcc';
const orderId = 'order_test_123456';
const paymentId = 'pay_test_987654';

// 1. Valid Signature Test
const validSignature = crypto
  .createHmac('sha256', SECRET)
  .update(`${orderId}|${paymentId}`)
  .digest('hex');

assert(
  verifyPaymentSignature(orderId, paymentId, validSignature),
  'Positive: Valid HMAC SHA256 Razorpay signature is successfully verified'
);

// 2. Tampered Signature Test
const tamperedSignature = validSignature.slice(0, -4) + '0000';
assert(
  !verifyPaymentSignature(orderId, paymentId, tamperedSignature),
  'Negative: Tampered signature is strictly rejected'
);

// 3. Tampered Payment ID Test
assert(
  !verifyPaymentSignature(orderId, 'pay_forged_fake_id', validSignature),
  'Negative: Mismatched paymentId signature is rejected'
);

// 4. Missing Parameters Test
assert(
  !verifyPaymentSignature(null, paymentId, validSignature),
  'Negative: Missing orderId signature check safely returns false'
);

// 5. Webhook Signature Test
const WEBHOOK_SECRET = 'evex_webhook_secret_9988';
const payload = JSON.stringify({ event: 'payment.captured', id: 'evt_123' });
const validWebhookSig = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(payload)
  .digest('hex');

assert(
  verifyWebhookSignature(payload, validWebhookSig),
  'Positive: Razorpay webhook payload signature is authenticated'
);

assert(
  !verifyWebhookSignature(payload, 'invalid_sig_abc'),
  'Negative: Forged webhook signature is rejected'
);

console.log(`\n=================================================================`);
console.log(`PAYMENT SECURITY RESULTS: ${passed} / ${total} TESTS PASSED`);
console.log(`=================================================================\n`);

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
