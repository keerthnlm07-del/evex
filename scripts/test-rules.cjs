const fs = require('fs');
const {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds
} = require('@firebase/rules-unit-testing');
const { doc, getDoc, setDoc, updateDoc, deleteDoc } = require('firebase/firestore');

const PROJECT_ID = 'evex-security-final-verification';

async function runRulesTests() {
  console.log('--- STARTING EVEX FINAL 8-DOMAIN FIRESTORE SECURITY RULES TEST SUITE ---');

  const rules = fs.readFileSync('firestore.rules', 'utf8');
  const testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules,
      host: '127.0.0.1',
      port: 8080
    }
  });

  const customerId = 'cust_kirthana_1';
  const managerId = 'mgr_aura_1';
  const seekerId = 'seeker_deepak_1';
  const attackerId = 'malicious_user_99';

  const customerCtx = testEnv.authenticatedContext(customerId);
  const managerCtx = testEnv.authenticatedContext(managerId);
  const seekerCtx = testEnv.authenticatedContext(seekerId);
  const attackerCtx = testEnv.authenticatedContext(attackerId);
  const unauthCtx = testEnv.unauthenticatedContext();

  const customerDb = customerCtx.firestore();
  const managerDb = managerCtx.firestore();
  const seekerDb = seekerCtx.firestore();
  const attackerDb = attackerCtx.firestore();
  const unauthDb = unauthCtx.firestore();

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  [PASS] Test ${total}: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] Test ${total}: ${name} ->`, err.message);
    }
  }

  // =========================================================================
  // DOMAIN 1: USERS COLLECTION & PRIVATE DATA PROTECTION (Req 1 & 3)
  // =========================================================================
  console.log('\n[1] Users Collection & Private Field Protection:');
  
  await test('Customer can create their own private profile', async () => {
    await assertSucceeds(
      setDoc(doc(customerDb, 'users', customerId), {
        uid: customerId,
        name: 'Kirthana',
        email: 'kirthana@evex.app',
        phone: '+919876543210',
        role: 'customer'
      })
    );
  });

  await test('Manager can create their own private profile', async () => {
    await assertSucceeds(
      setDoc(doc(managerDb, 'users', managerId), {
        uid: managerId,
        name: 'Aura Events Manager',
        email: 'aura@evex.app',
        phone: '+919876543211',
        role: 'manager'
      })
    );
  });

  await test('Job Seeker can create their own private profile', async () => {
    await assertSucceeds(
      setDoc(doc(seekerDb, 'users', seekerId), {
        uid: seekerId,
        name: 'Deepak Kumar',
        email: 'deepak@evex.app',
        phone: '+919876543212',
        role: 'seeker'
      })
    );
  });

  await test('Negative: Attacker cannot create profile for another user', async () => {
    await assertFails(
      setDoc(doc(attackerDb, 'users', customerId), {
        uid: customerId,
        name: 'Imposter',
        role: 'customer'
      })
    );
  });

  await test('Negative: Customer cannot escalate role to manager', async () => {
    await assertFails(
      updateDoc(doc(customerDb, 'users', customerId), {
        role: 'manager'
      })
    );
  });

  await test('Negative: User cannot read another user private profile (email/phone protected)', async () => {
    // Attacker cannot read customer's private doc containing phone/email
    await assertFails(getDoc(doc(attackerDb, 'users', customerId)));
  });

  await test('Negative: User cannot read manager private profile from /users', async () => {
    // Customer cannot read manager's private doc in /users
    await assertFails(getDoc(doc(customerDb, 'users', managerId)));
  });

  // =========================================================================
  // DOMAIN 2: PUBLIC PROFILES DIRECTORY (Req 3)
  // =========================================================================
  console.log('\n[2] Public Profiles Collection & Directory Privacy:');

  await test('Manager can create sanitized public directory profile', async () => {
    await assertSucceeds(
      setDoc(doc(managerDb, 'publicProfiles', managerId), {
        uid: managerId,
        name: 'Aura Events',
        role: 'manager',
        companyName: 'Aura Events Productions',
        rating: 4.8,
        verified: true
      })
    );
  });

  await test('Seeker can create sanitized public directory profile', async () => {
    await assertSucceeds(
      setDoc(doc(seekerDb, 'publicProfiles', seekerId), {
        uid: seekerId,
        name: 'Deepak Kumar',
        role: 'seeker',
        rating: 4.7,
        verified: true,
        skills: ['Catering', 'Setup']
      })
    );
  });

  await test('Negative: Manager cannot include email in public profile', async () => {
    await assertFails(
      setDoc(doc(managerDb, 'publicProfiles', 'mgr_leaky'), {
        uid: 'mgr_leaky',
        name: 'Leaky Manager',
        role: 'manager',
        email: 'leaky@secret.com' // FORBIDDEN
      })
    );
  });

  await test('Negative: Seeker cannot include phone in public profile', async () => {
    await assertFails(
      setDoc(doc(seekerDb, 'publicProfiles', 'seeker_leaky'), {
        uid: 'seeker_leaky',
        name: 'Leaky Seeker',
        role: 'seeker',
        phone: '+919999999999' // FORBIDDEN
      })
    );
  });

  await test('Negative: Customer cannot publish a public profile (customers private)', async () => {
    await assertFails(
      setDoc(doc(customerDb, 'publicProfiles', customerId), {
        uid: customerId,
        name: 'Kirthana Customer',
        role: 'customer' // FORBIDDEN
      })
    );
  });

  await test('Authenticated customer can read manager public profile', async () => {
    await assertSucceeds(getDoc(doc(customerDb, 'publicProfiles', managerId)));
  });

  // =========================================================================
  // DOMAIN 3: EVENT REQUESTS (Req 1 & 2)
  // =========================================================================
  console.log('\n[3] Event Requests Security (Role & Read Restrictions):');

  await test('Verified Customer can create request with status open', async () => {
    await assertSucceeds(
      setDoc(doc(customerDb, 'requests', 'req_101'), {
        customerId: customerId,
        eventName: 'My Wedding',
        eventType: 'Wedding',
        eventDate: '15 Dec 2026',
        location: 'Bengaluru',
        budget: 300000,
        status: 'open'
      })
    );
  });

  await test('Negative: Seeker cannot create an event request (Firestore role check)', async () => {
    await assertFails(
      setDoc(doc(seekerDb, 'requests', 'req_seeker_fake'), {
        customerId: seekerId,
        eventName: 'Seeker Fake Event',
        budget: 100000,
        status: 'open'
      })
    );
  });

  await test('Negative: Manager cannot create an event request (Firestore role check)', async () => {
    await assertFails(
      setDoc(doc(managerDb, 'requests', 'req_mgr_fake'), {
        customerId: managerId,
        eventName: 'Manager Fake Event',
        budget: 100000,
        status: 'open'
      })
    );
  });

  await test('Negative: Customer cannot create request with arbitrary status', async () => {
    await assertFails(
      setDoc(doc(customerDb, 'requests', 'req_fake_status'), {
        customerId: customerId,
        eventName: 'Fake Wedding',
        budget: 300000,
        status: 'approved'
      })
    );
  });

  await test('Negative: Job Seeker cannot read customer event requests (Req 2)', async () => {
    await assertFails(getDoc(doc(seekerDb, 'requests', 'req_101')));
  });

  await test('Owner Customer can read their own request', async () => {
    await assertSucceeds(getDoc(doc(customerDb, 'requests', 'req_101')));
  });

  await test('Verified Manager CAN read open customer event request (Req 2)', async () => {
    await assertSucceeds(getDoc(doc(managerDb, 'requests', 'req_101')));
  });

  await test('Customer CAN update permitted event details', async () => {
    await assertSucceeds(
      updateDoc(doc(customerDb, 'requests', 'req_101'), {
        budget: 350000,
        location: 'Bengaluru Palace'
      })
    );
  });

  await test('Negative: Customer cannot transfer ownership (change customerId)', async () => {
    await assertFails(
      updateDoc(doc(customerDb, 'requests', 'req_101'), {
        customerId: attackerId
      })
    );
  });

  await test('Verified Manager can transition request status to proposals_received', async () => {
    await assertSucceeds(
      updateDoc(doc(managerDb, 'requests', 'req_101'), {
        status: 'proposals_received'
      })
    );
  });

  await test('Negative: Seeker cannot update event request', async () => {
    await assertFails(
      updateDoc(doc(seekerDb, 'requests', 'req_101'), {
        status: 'booked'
      })
    );
  });

  // =========================================================================
  // DOMAIN 4: PROPOSALS (Req 1)
  // =========================================================================
  console.log('\n[4] Proposals Security (Manager Role Verification):');

  await test('Verified Manager can create proposal for existing request', async () => {
    await assertSucceeds(
      setDoc(doc(managerDb, 'proposals', 'prop_101'), {
        requestId: 'req_101',
        managerId: managerId,
        proposedPrice: 280000,
        servicesIncluded: ['Catering', 'Decoration'],
        additionalDetails: 'Full package',
        status: 'pending'
      })
    );
  });

  await test('Negative: Customer cannot create a proposal (Firestore role check)', async () => {
    await assertFails(
      setDoc(doc(customerDb, 'proposals', 'prop_cust_fake'), {
        requestId: 'req_101',
        managerId: customerId,
        proposedPrice: 100000,
        status: 'pending'
      })
    );
  });

  await test('Negative: Seeker cannot create a proposal (Firestore role check)', async () => {
    await assertFails(
      setDoc(doc(seekerDb, 'proposals', 'prop_seeker_fake'), {
        requestId: 'req_101',
        managerId: seekerId,
        proposedPrice: 100000,
        status: 'pending'
      })
    );
  });

  await test('Negative: Manager cannot change managerId after creation', async () => {
    await assertFails(
      updateDoc(doc(managerDb, 'proposals', 'prop_101'), {
        managerId: attackerId
      })
    );
  });

  await test('Negative: Manager cannot change requestId after creation', async () => {
    await assertFails(
      updateDoc(doc(managerDb, 'proposals', 'prop_101'), {
        requestId: 'req_other'
      })
    );
  });

  await test('Manager CAN update permitted quote fields', async () => {
    await assertSucceeds(
      updateDoc(doc(managerDb, 'proposals', 'prop_101'), {
        proposedPrice: 290000,
        additionalDetails: 'Updated with lighting'
      })
    );
  });

  await test('Negative: Third-party cannot read proposal', async () => {
    await assertFails(getDoc(doc(attackerDb, 'proposals', 'prop_101')));
  });

  await test('Target customer CAN read proposal for their request', async () => {
    await assertSucceeds(getDoc(doc(customerDb, 'proposals', 'prop_101')));
  });

  await test('Target customer can accept proposal (status only)', async () => {
    await assertSucceeds(
      updateDoc(doc(customerDb, 'proposals', 'prop_101'), {
        status: 'accepted'
      })
    );
  });

  await test('Negative: Customer cannot tamper with proposed price', async () => {
    await assertFails(
      updateDoc(doc(customerDb, 'proposals', 'prop_101'), {
        proposedPrice: 1000
      })
    );
  });

  // =========================================================================
  // DOMAIN 5: BOOKINGS & ANTI-MUTATION CHECKS (Req 1, 4, 5, 6)
  // =========================================================================
  console.log('\n[5] Bookings Security & Anti-Mutation (Req 4, 5, 6):');

  await test('Negative: Customer cannot forge booking without accepted proposal', async () => {
    await assertFails(
      setDoc(doc(customerDb, 'bookings', 'book_forged'), {
        customerId: customerId,
        managerId: managerId,
        requestId: 'req_101',
        proposalId: 'prop_unaccepted_or_fake',
        eventName: 'My Wedding',
        totalAmount: 100,
        paidAmount: 40,
        remainingAmount: 60,
        status: 'confirmed'
      })
    );
  });

  await test('Customer CAN create legitimate confirmed booking matching accepted proposal', async () => {
    await assertSucceeds(
      setDoc(doc(customerDb, 'bookings', 'book_101'), {
        customerId: customerId,
        managerId: managerId,
        requestId: 'req_101',
        proposalId: 'prop_101',
        eventName: 'My Wedding',
        totalAmount: 290000,
        paidAmount: 116000,
        remainingAmount: 174000,
        status: 'confirmed',
        progress: 'In Preparation (Current)',
        progressPercent: 50
      })
    );
  });

  await test('Negative: Customer cannot change booking progress or progressPercent (Req 4)', async () => {
    await assertFails(
      updateDoc(doc(customerDb, 'bookings', 'book_101'), {
        progress: 'Completed',
        progressPercent: 100
      })
    );
  });

  await test('Negative: Customer cannot change paid balances directly (Req 4 & 6)', async () => {
    await assertFails(
      updateDoc(doc(customerDb, 'bookings', 'book_101'), {
        paidAmount: 290000,
        remainingAmount: 0
      })
    );
  });

  await test('Negative: Manager cannot change payment fields (Req 5)', async () => {
    await assertFails(
      updateDoc(doc(managerDb, 'bookings', 'book_101'), {
        paidAmount: 0,
        remainingAmount: 290000
      })
    );
  });

  await test('Negative: Manager cannot mark booking completed without gateway webhook (Req 6)', async () => {
    await assertFails(
      updateDoc(doc(managerDb, 'bookings', 'book_101'), {
        status: 'completed'
      })
    );
  });

  await test('Manager CAN update execution progress and progressPercent', async () => {
    await assertSucceeds(
      updateDoc(doc(managerDb, 'bookings', 'book_101'), {
        progress: 'Execution in Progress',
        progressPercent: 75,
        status: 'ongoing'
      })
    );
  });

  await test('Negative: Booking deletion is strictly forbidden', async () => {
    await assertFails(deleteDoc(doc(customerDb, 'bookings', 'book_101')));
  });

  // =========================================================================
  // DOMAIN 6: JOB LISTINGS (Req 1)
  // =========================================================================
  console.log('\n[6] Job Listings Security (Manager Verification):');

  await test('Verified Manager can create job listing', async () => {
    await assertSucceeds(
      setDoc(doc(managerDb, 'jobListings', 'job_101'), {
        managerId: managerId,
        jobTitle: 'Catering Staff',
        salaryPerDay: 800,
        status: 'open'
      })
    );
  });

  await test('Negative: Seeker cannot create job listing (Firestore role check)', async () => {
    await assertFails(
      setDoc(doc(seekerDb, 'jobListings', 'job_seeker_fake'), {
        managerId: seekerId,
        jobTitle: 'Fake Seeker Job',
        salaryPerDay: 800,
        status: 'open'
      })
    );
  });

  await test('Negative: Attacker cannot modify manager job listing', async () => {
    await assertFails(
      updateDoc(doc(attackerDb, 'jobListings', 'job_101'), {
        salaryPerDay: 50
      })
    );
  });

  // =========================================================================
  // DOMAIN 7: JOB APPLICATIONS (Req 1)
  // =========================================================================
  console.log('\n[7] Job Applications Security (Seeker Role Verification):');

  await test('Verified Seeker can apply for job listing', async () => {
    await assertSucceeds(
      setDoc(doc(seekerDb, 'applications', 'app_101'), {
        jobId: 'job_101',
        managerId: managerId,
        applicantId: seekerId,
        status: 'under_review'
      })
    );
  });

  await test('Negative: Manager cannot apply for job (Firestore role check)', async () => {
    await assertFails(
      setDoc(doc(managerDb, 'applications', 'app_mgr_fake'), {
        jobId: 'job_101',
        managerId: managerId,
        applicantId: managerId,
        status: 'under_review'
      })
    );
  });

  await test('Negative: Applicant cannot self-approve their own application', async () => {
    await assertFails(
      updateDoc(doc(seekerDb, 'applications', 'app_101'), {
        status: 'accepted'
      })
    );
  });

  await test('Negative: Attacker cannot change applicantId or jobId', async () => {
    await assertFails(
      updateDoc(doc(attackerDb, 'applications', 'app_101'), {
        applicantId: attackerId
      })
    );
  });

  await test('Hiring manager CAN accept candidate application', async () => {
    await assertSucceeds(
      updateDoc(doc(managerDb, 'applications', 'app_101'), {
        status: 'accepted'
      })
    );
  });

  // Create a second unaccepted application for negative test in earnings
  await test('Create unaccepted application for negative test', async () => {
    await assertSucceeds(
      setDoc(doc(seekerDb, 'applications', 'app_unaccepted'), {
        jobId: 'job_101',
        managerId: managerId,
        applicantId: seekerId,
        status: 'under_review'
      })
    );
  });

  // =========================================================================
  // DOMAIN 8: PAYMENTS & EARNINGS ANTI-FRAUD (Req 1, 6, 7)
  // =========================================================================
  console.log('\n[8] Payments & Earnings Anti-Fraud (Req 6 & 7):');

  await test('Customer CAN record sandbox simulation payment', async () => {
    await assertSucceeds(
      setDoc(doc(customerDb, 'payments', 'pay_sim_101'), {
        customerId: customerId,
        managerId: managerId,
        amount: 116000,
        isSimulation: true,
        status: 'simulation_settled'
      })
    );
  });

  await test('Negative: Client cannot create real completed payment without gateway (Req 6)', async () => {
    await assertFails(
      setDoc(doc(customerDb, 'payments', 'pay_fake_real'), {
        customerId: customerId,
        managerId: managerId,
        amount: 290000,
        isSimulation: false,
        status: 'completed'
      })
    );
  });

  await test('Negative: Seeker cannot create payment record (Firestore role check)', async () => {
    await assertFails(
      setDoc(doc(seekerDb, 'payments', 'pay_seeker_fake'), {
        customerId: seekerId,
        managerId: managerId,
        amount: 1000,
        isSimulation: true,
        status: 'simulation_settled'
      })
    );
  });

  await test('Negative: Client cannot edit or delete payment records', async () => {
    await assertFails(
      updateDoc(doc(customerDb, 'payments', 'pay_sim_101'), {
        amount: 500
      })
    );
    await assertFails(deleteDoc(doc(customerDb, 'payments', 'pay_sim_101')));
  });

  await test('Negative: Seeker CANNOT self-award earnings', async () => {
    await assertFails(
      setDoc(doc(seekerDb, 'earnings', 'earn_fake_1'), {
        managerId: seekerId,
        seekerId: seekerId,
        jobId: 'job_101',
        applicationId: 'app_101',
        amount: 50000,
        status: 'pending'
      })
    );
  });

  await test('Negative: Manager CANNOT create earnings for an UNACCEPTED application (Req 7)', async () => {
    await assertFails(
      setDoc(doc(managerDb, 'earnings', 'earn_unaccepted'), {
        managerId: managerId,
        seekerId: seekerId,
        jobId: 'job_101',
        applicationId: 'app_unaccepted', // Status is under_review, NOT accepted!
        amount: 800,
        status: 'pending'
      })
    );
  });

  await test('Negative: Manager CANNOT create earnings without referencing valid application (Req 7)', async () => {
    await assertFails(
      setDoc(doc(managerDb, 'earnings', 'earn_no_app'), {
        managerId: managerId,
        seekerId: seekerId,
        jobId: 'job_101',
        applicationId: 'app_non_existent',
        amount: 800,
        status: 'pending'
      })
    );
  });

  await test('Negative: Unrelated manager cannot award earnings for someone elses application (Req 7)', async () => {
    await assertFails(
      setDoc(doc(attackerDb, 'earnings', 'earn_fake_2'), {
        managerId: attackerId,
        seekerId: seekerId,
        jobId: 'job_101',
        applicationId: 'app_101',
        amount: 800,
        status: 'pending'
      })
    );
  });

  await test('Hiring manager CAN credit pending earnings for genuinely accepted applicant (Req 7)', async () => {
    await assertSucceeds(
      setDoc(doc(managerDb, 'earnings', 'earn_101'), {
        managerId: managerId,
        seekerId: seekerId,
        jobId: 'job_101',
        applicationId: 'app_101', // Genuinely accepted!
        amount: 800,
        status: 'pending'
      })
    );
  });

  await test('Negative: Arbitrary client cannot modify earnings', async () => {
    await assertFails(
      updateDoc(doc(seekerDb, 'earnings', 'earn_101'), {
        amount: 100000,
        status: 'completed'
      })
    );
  });

  await test('Seeker CAN read their own earnings balance', async () => {
    await assertSucceeds(getDoc(doc(seekerDb, 'earnings', 'earn_101')));
  });

  await test('Negative: Attacker cannot read seeker earnings', async () => {
    await assertFails(getDoc(doc(attackerDb, 'earnings', 'earn_101')));
  });

  console.log(`\n=================================================================`);
  console.log(`FINAL SECURITY TEST RESULTS: ${passed} / ${total} TESTS PASSED`);
  console.log(`=================================================================\n`);

  await testEnv.cleanup();
  process.exit(passed === total ? 0 : 1);
}

runRulesTests().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
