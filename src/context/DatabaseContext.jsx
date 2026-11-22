import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

const DatabaseContext = createContext(null);

export const DatabaseProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // Core Firestore Collections
  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('evex_real_requests');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [proposals, setProposals] = useState(() => {
    try {
      const saved = localStorage.getItem('evex_real_proposals');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('evex_real_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [jobListings, setJobListings] = useState(() => {
    try {
      const saved = localStorage.getItem('evex_real_job_listings');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('evex_real_applications');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [payments, setPayments] = useState(() => {
    try {
      const saved = localStorage.getItem('evex_real_payments');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [earnings, setEarnings] = useState(() => {
    try {
      const saved = localStorage.getItem('evex_real_earnings');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Auxiliary Features: Messages, Saved Items, Reviews, Packages, Expenses, Notifications
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('evex_real_messages');
      return saved ? JSON.parse(saved) : [
        {
          id: 'msg_init_1',
          senderId: 'mgr_aura',
          senderName: 'Aura Events Co.',
          receiverId: 'cust_kirthana',
          receiverName: 'Kirthana',
          text: 'Hi! Can you share the decor theme options for your wedding?',
          timestamp: '10:24 AM',
          read: true
        },
        {
          id: 'msg_init_2',
          senderId: 'cust_kirthana',
          senderName: 'Kirthana',
          receiverId: 'mgr_aura',
          receiverName: 'Aura Events Co.',
          text: 'Sure! Here are a few theme options based on our preferences:',
          images: [
            'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400',
            'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400'
          ],
          timestamp: '10:28 AM',
          read: true
        }
      ];
    } catch { return []; }
  });

  const [savedManagers, setSavedManagers] = useState(() => {
    try {
      const saved = localStorage.getItem('evex_saved_managers');
      return saved ? JSON.parse(saved) : ['mgr_aura', 'mgr_elite'];
    } catch { return ['mgr_aura']; }
  });

  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('evex_saved_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('evex_real_reviews');
      return saved ? JSON.parse(saved) : [
        {
          id: 'rev_1',
          targetId: 'mgr_aura',
          authorName: 'Sneha Patel',
          rating: 5.0,
          comment: 'Aura Events coordinated our wedding flawlessly. Every guest was amazed by the stage layout!',
          eventName: 'Wedding Reception',
          date: 'Nov 2026'
        },
        {
          id: 'rev_2',
          targetId: 'mgr_aura',
          authorName: 'Vikram Mehta',
          rating: 4.8,
          comment: 'Very professional team. Great sound system and on-time catering delivery.',
          eventName: 'Corporate Annual Meet',
          date: 'Oct 2026'
        }
      ];
    } catch { return []; }
  });

  const [packages, setPackages] = useState(() => {
    try {
      const saved = localStorage.getItem('evex_service_packages');
      return saved ? JSON.parse(saved) : [
        {
          id: 'pkg_1',
          name: 'Classic Wedding Package',
          category: 'Weddings',
          price: 250000,
          description: 'Includes stage decor, standard sound setup, floral entrance, and 1 coordinator.',
          features: ['Stage & Backdrop', 'Entry Arch', 'Sound System', 'Full-Day Coordinator']
        },
        {
          id: 'pkg_2',
          name: 'Grand Royal Wedding',
          category: 'Weddings',
          price: 500000,
          description: 'Complete luxury wedding production with VIP lounge, LED walls, and gourmet catering management.',
          features: ['Luxury Stage', 'LED Video Wall', 'Banquet Steward Team', 'Live Photography Rig']
        },
        {
          id: 'pkg_3',
          name: 'Corporate Summit Production',
          category: 'Corporate Events',
          price: 180000,
          description: 'A/V setup, podium branding, attendee badge printing, and audio coordination.',
          features: ['Stage & Podiums', 'Dual HD Projectors', 'Wireless Mic Array', 'Registration Desk Staff']
        }
      ];
    } catch { return []; }
  });

  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('evex_manager_expenses');
      return saved ? JSON.parse(saved) : [
        { id: 'exp_1', bookingId: 'book_1', title: 'Flower Market Decor', category: 'Decoration', amount: 35000, date: '12 Dec 2026' },
        { id: 'exp_2', bookingId: 'book_1', title: 'Banquet Stewards Advance', category: 'Staffing', amount: 16000, date: '13 Dec 2026' },
        { id: 'exp_3', bookingId: 'book_1', title: 'Stage Generator Fuel', category: 'Logistics', amount: 8500, date: '14 Dec 2026' }
      ];
    } catch { return []; }
  });

  const [notifications, setNotifications] = useState(() => {
    return [
      {
        id: 'notif_1',
        title: 'New Proposal Received',
        message: 'Aura Events submitted a quote for your Wedding Function.',
        timestamp: '10m ago',
        read: false,
        type: 'proposal'
      },
      {
        id: 'notif_2',
        title: 'Booking Confirmed',
        message: 'Advance payment of ₹1,12,000 received for booking #EVX-8291.',
        timestamp: '1h ago',
        read: false,
        type: 'booking'
      },
      {
        id: 'notif_3',
        title: 'Job Application Accepted',
        message: 'You have been selected for Catering Staff at Aura Events!',
        timestamp: '2h ago',
        read: true,
        type: 'job'
      }
    ];
  });

  // Local Storage Cache Synchronization
  useEffect(() => { localStorage.setItem('evex_real_requests', JSON.stringify(requests)); }, [requests]);
  useEffect(() => { localStorage.setItem('evex_real_proposals', JSON.stringify(proposals)); }, [proposals]);
  useEffect(() => { localStorage.setItem('evex_real_bookings', JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem('evex_real_job_listings', JSON.stringify(jobListings)); }, [jobListings]);
  useEffect(() => { localStorage.setItem('evex_real_applications', JSON.stringify(applications)); }, [applications]);
  useEffect(() => { localStorage.setItem('evex_real_payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem('evex_real_earnings', JSON.stringify(earnings)); }, [earnings]);
  useEffect(() => { localStorage.setItem('evex_real_messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('evex_saved_managers', JSON.stringify(savedManagers)); }, [savedManagers]);
  useEffect(() => { localStorage.setItem('evex_saved_jobs', JSON.stringify(savedJobs)); }, [savedJobs]);
  useEffect(() => { localStorage.setItem('evex_real_reviews', JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem('evex_service_packages', JSON.stringify(packages)); }, [packages]);
  useEffect(() => { localStorage.setItem('evex_manager_expenses', JSON.stringify(expenses)); }, [expenses]);

  // Scoped Real-Time Firestore Synchronization based on Authenticated User Role
  useEffect(() => {
    const unsubs = [];

    // Public / Read-All collections
    try {
      const jobsUnsub = onSnapshot(collection(db, 'jobListings'), (snap) => {
        if (!snap.empty) {
          setJobListings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      }, (e) => console.warn('jobListings sync notice:', e.message));
      unsubs.push(jobsUnsub);
    } catch (e) {}

    // User-Scoped Listeners
    if (currentUser?.uid) {
      const uid = currentUser.uid;
      const role = currentUser.role;

      if (role === 'customer') {
        try {
          const reqQuery = query(collection(db, 'requests'), where('customerId', '==', uid));
          const reqUnsub = onSnapshot(reqQuery, (snap) => {
            if (!snap.empty) {
              setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            }
          }, (e) => console.warn('requests sync notice:', e.message));
          unsubs.push(reqUnsub);

          const bookQuery = query(collection(db, 'bookings'), where('customerId', '==', uid));
          const bookUnsub = onSnapshot(bookQuery, (snap) => {
            if (!snap.empty) {
              setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            }
          }, (e) => console.warn('bookings sync notice:', e.message));
          unsubs.push(bookUnsub);

          const payQuery = query(collection(db, 'payments'), where('customerId', '==', uid));
          const payUnsub = onSnapshot(payQuery, (snap) => {
            if (!snap.empty) {
              setPayments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            }
          }, (e) => console.warn('payments sync notice:', e.message));
          unsubs.push(payUnsub);
        } catch (e) {}
      } else if (role === 'manager') {
        try {
          // Managers read open requests
          const reqQuery = query(collection(db, 'requests'), where('status', 'in', ['open', 'proposals_received']));
          const reqUnsub = onSnapshot(reqQuery, (snap) => {
            if (!snap.empty) {
              setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            }
          }, (e) => console.warn('manager requests sync notice:', e.message));
          unsubs.push(reqUnsub);

          const propQuery = query(collection(db, 'proposals'), where('managerId', '==', uid));
          const propUnsub = onSnapshot(propQuery, (snap) => {
            if (!snap.empty) {
              setProposals(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            }
          }, (e) => console.warn('manager proposals sync notice:', e.message));
          unsubs.push(propUnsub);

          const bookQuery = query(collection(db, 'bookings'), where('managerId', '==', uid));
          const bookUnsub = onSnapshot(bookQuery, (snap) => {
            if (!snap.empty) {
              setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            }
          }, (e) => console.warn('manager bookings sync notice:', e.message));
          unsubs.push(bookUnsub);

          const appQuery = query(collection(db, 'applications'), where('managerId', '==', uid));
          const appUnsub = onSnapshot(appQuery, (snap) => {
            if (!snap.empty) {
              setApplications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            }
          }, (e) => console.warn('manager applications sync notice:', e.message));
          unsubs.push(appUnsub);
        } catch (e) {}
      } else if (role === 'seeker') {
        try {
          const appQuery = query(collection(db, 'applications'), where('applicantId', '==', uid));
          const appUnsub = onSnapshot(appQuery, (snap) => {
            if (!snap.empty) {
              setApplications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            }
          }, (e) => console.warn('seeker applications sync notice:', e.message));
          unsubs.push(appUnsub);

          const earnQuery = query(collection(db, 'earnings'), where('seekerId', '==', uid));
          const earnUnsub = onSnapshot(earnQuery, (snap) => {
            if (!snap.empty) {
              setEarnings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            }
          }, (e) => console.warn('seeker earnings sync notice:', e.message));
          unsubs.push(earnUnsub);
        } catch (e) {}
      }
    }

    return () => {
      unsubs.forEach((u) => { if (typeof u === 'function') u(); });
    };
  }, [currentUser]);

  // Firestore Persist Helpers
  const saveToFirestore = async (colName, id, data) => {
    try {
      if (id) {
        await setDoc(doc(db, colName, id), data);
      } else {
        await addDoc(collection(db, colName), data);
      }
    } catch (err) {
      console.warn(`Firestore save [${colName}] notice:`, err.message);
    }
  };

  const updateInFirestore = async (colName, id, updates) => {
    try {
      await updateDoc(doc(db, colName, id), updates);
    } catch (err) {
      console.warn(`Firestore update [${colName}] notice:`, err.message);
    }
  };

  // =========================================================================
  // CUSTOMER WORKFLOWS
  // =========================================================================
  const createCustomerRequest = async (reqData, customer) => {
    const reqId = `req_${Date.now()}`;
    const newReq = {
      id: reqId,
      customerId: customer.id || customer.uid,
      customerName: customer.name,
      customerPhone: customer.phone || '',
      eventName: reqData.eventName || 'Special Celebration',
      eventType: reqData.eventType || 'Wedding',
      eventDate: reqData.eventDate || '15 Dec 2026',
      location: reqData.location || 'Bengaluru',
      budget: Number(reqData.budget) || 250000,
      guestCount: Number(reqData.guestCount) || 150,
      requiredServices: reqData.requiredServices || ['Catering', 'Decoration', 'Photography'],
      specialInstructions: reqData.specialInstructions || '',
      status: 'open',
      createdAt: new Date().toISOString()
    };

    setRequests((prev) => [newReq, ...prev]);
    await saveToFirestore('requests', reqId, newReq);
    return newReq;
  };

  const acceptProposal = async (proposal, customer) => {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === proposal.id) return { ...p, status: 'accepted' };
        if (p.requestId === proposal.requestId) return { ...p, status: 'rejected' };
        return p;
      })
    );
    await updateInFirestore('proposals', proposal.id, { status: 'accepted' });

    setRequests((prev) =>
      prev.map((r) => (r.id === proposal.requestId ? { ...r, status: 'booked' } : r))
    );
    await updateInFirestore('requests', proposal.requestId, { status: 'booked' });

    const origReq = requests.find((r) => r.id === proposal.requestId) || {};
    const totalAmount = Number(proposal.proposedPrice) || Number(origReq.budget) || 280000;

    const bookId = `book_${Date.now()}`;
    const newBooking = {
      id: bookId,
      requestId: proposal.requestId,
      proposalId: proposal.id,
      customerId: customer.id || customer.uid,
      customerName: customer.name,
      managerId: proposal.managerId,
      managerName: proposal.managerName || 'Aura Events',
      eventName: proposal.eventName || origReq.eventName || 'My Wedding',
      eventType: origReq.eventType || 'Wedding',
      eventDate: origReq.eventDate || '15 Dec 2026',
      location: origReq.location || 'Bengaluru',
      totalAmount,
      paidAmount: Math.round(totalAmount * 0.4),
      remainingAmount: Math.round(totalAmount * 0.6),
      status: 'confirmed',
      progress: 'In Preparation (Current)',
      progressPercent: 50,
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      createdAt: new Date().toISOString()
    };

    setBookings((prev) => [newBooking, ...prev]);
    await saveToFirestore('bookings', bookId, newBooking);

    // Initial simulated advance payment record
    const payId = `pay_${Date.now()}`;
    const receiptNo = `EVX-${Date.now().toString().slice(-6)}`;
    const newPayment = {
      id: payId,
      bookingId: newBooking.id,
      eventName: newBooking.eventName,
      customerId: customer.id || customer.uid,
      customerName: customer.name,
      managerId: proposal.managerId,
      managerName: proposal.managerName,
      amount: newBooking.paidAmount,
      paymentMethod: 'UPI (Advance Simulation)',
      receiptNo,
      type: 'Advance Paid',
      isSimulation: true,
      status: 'simulation_settled',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString()
    };

    setPayments((prev) => [newPayment, ...prev]);
    await saveToFirestore('payments', payId, newPayment);
    return newBooking;
  };

  const rejectProposal = async (proposalId) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: 'rejected' } : p))
    );
    await updateInFirestore('proposals', proposalId, { status: 'rejected' });
  };

  const processPayment = async ({ bookingId, amount, paymentMethod, customer }) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');

    const payAmount = Number(amount);
    if (isNaN(payAmount) || payAmount <= 0) throw new Error('Invalid payment amount');

    const newPaid = (booking.paidAmount || 0) + payAmount;
    const newRemaining = Math.max(0, (booking.totalAmount || 0) - newPaid);
    const isCompleted = newRemaining === 0;

    const updates = {
      paidAmount: newPaid,
      remainingAmount: newRemaining,
      status: isCompleted ? 'completed' : booking.status,
      progress: isCompleted ? 'Completed' : booking.progress,
      progressPercent: isCompleted ? 100 : booking.progressPercent
    };

    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, ...updates } : b)));

    const payId = `pay_${Date.now()}`;
    const receiptNo = `EVX-${Date.now().toString().slice(-6)}`;
    const newPayment = {
      id: payId,
      bookingId: booking.id,
      eventName: booking.eventName,
      customerId: customer?.id || booking.customerId,
      customerName: customer?.name || booking.customerName,
      managerId: booking.managerId,
      managerName: booking.managerName,
      amount: payAmount,
      paymentMethod: paymentMethod || 'UPI (Simulation)',
      receiptNo,
      type: isCompleted ? 'Final Settlement' : 'Part Payment',
      isSimulation: true,
      status: 'simulation_settled',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString()
    };

    setPayments((prev) => [newPayment, ...prev]);
    await saveToFirestore('payments', payId, newPayment);
    return newPayment;
  };

  const toggleSaveManager = (managerId) => {
    setSavedManagers((prev) =>
      prev.includes(managerId) ? prev.filter((id) => id !== managerId) : [...prev, managerId]
    );
  };

  // =========================================================================
  // EVENT MANAGER WORKFLOWS
  // =========================================================================
  const createProposal = async (request, manager, { proposedPrice, includedServices, additionalDetails }) => {
    const propId = `prop_${Date.now()}`;
    const newProp = {
      id: propId,
      requestId: request.id,
      eventName: request.eventName,
      managerId: manager.id || manager.uid,
      managerName: manager.name || manager.companyName || 'Aura Events',
      managerRating: manager.rating || 4.8,
      managerAvatar: manager.avatar || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=150',
      proposedPrice: Number(proposedPrice),
      servicesIncluded: includedServices && includedServices.length > 0 ? includedServices : (request.requiredServices || ['Catering', 'Decoration']),
      additionalDetails: additionalDetails || 'Full-service management package with dedicated coordinator.',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setProposals((prev) => [newProp, ...prev]);
    await saveToFirestore('proposals', propId, newProp);

    setRequests((prev) =>
      prev.map((r) => (r.id === request.id ? { ...r, status: 'proposals_received' } : r))
    );
    await updateInFirestore('requests', request.id, { status: 'proposals_received' });
    return newProp;
  };

  const updateBookingProgress = async (bookingId, progress, progressPercent, status = 'ongoing') => {
    const updates = { progress, progressPercent, status };
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, ...updates } : b)));
    await updateInFirestore('bookings', bookingId, updates);
  };

  const createJobListing = async (jobData, manager) => {
    const jobId = `job_${Date.now()}`;
    const newJob = {
      id: jobId,
      managerId: manager.id || manager.uid,
      managerName: manager.name || manager.companyName || 'Aura Events',
      eventName: jobData.eventName || 'Wedding Function',
      jobTitle: jobData.jobTitle || 'Catering Staff',
      jobDescription: jobData.jobDescription || 'Assist with guest hospitality and banquet service.',
      workersRequired: Number(jobData.workersRequired) || 5,
      workersFilled: 0,
      salaryPerDay: Number(jobData.salaryPerDay) || 800,
      location: jobData.location || 'Bengaluru',
      date: jobData.date || '15 Dec 2026',
      startTime: jobData.startTime || '04:00 PM',
      endTime: jobData.endTime || '11:00 PM',
      requiredSkills: jobData.requiredSkills || ['Catering', 'Banquet Etiquette'],
      status: 'open',
      createdAt: new Date().toISOString()
    };

    setJobListings((prev) => [newJob, ...prev]);
    await saveToFirestore('jobListings', jobId, newJob);
    return newJob;
  };

  const updateApplicationStatus = async (appId, newStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );
    await updateInFirestore('applications', appId, { status: newStatus });

    if (newStatus === 'accepted') {
      const app = applications.find((a) => a.id === appId);
      if (app) {
        setJobListings((prev) =>
          prev.map((job) =>
            job.id === app.jobId
              ? { ...job, workersFilled: (job.workersFilled || 0) + 1 }
              : job
          )
        );
        const job = jobListings.find((j) => j.id === app.jobId);
        if (job) {
          await updateInFirestore('jobListings', job.id, {
            workersFilled: (job.workersFilled || 0) + 1
          });
        }

        const earnId = `earn_${Date.now()}`;
        const newEarning = {
          id: earnId,
          managerId: app.managerId,
          seekerId: app.applicantId,
          jobId: app.jobId,
          applicationId: app.id,
          eventName: app.eventName || app.jobTitle,
          managerName: app.managerName || 'Aura Events',
          amount: Number(app.salaryPerDay) || 800,
          date: 'Upcoming',
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        setEarnings((prev) => [newEarning, ...prev]);
        await saveToFirestore('earnings', earnId, newEarning);
      }
    }
  };

  const addExpense = (newExp) => {
    const expenseRecord = {
      id: `exp_${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      ...newExp
    };
    setExpenses((prev) => [expenseRecord, ...prev]);
  };

  const createPackage = (newPkg) => {
    const pkgRecord = {
      id: `pkg_${Date.now()}`,
      ...newPkg
    };
    setPackages((prev) => [pkgRecord, ...prev]);
  };

  // =========================================================================
  // JOB SEEKER WORKFLOWS
  // =========================================================================
  const applyForJob = async (job, seeker) => {
    const seekerId = seeker.id || seeker.uid;
    const exists = applications.some((a) => a.jobId === job.id && a.applicantId === seekerId);
    if (exists) {
      throw new Error('You have already applied for this assignment.');
    }

    const appId = `app_${Date.now()}`;
    const newApp = {
      id: appId,
      jobId: job.id,
      jobTitle: job.jobTitle,
      eventName: job.eventName,
      managerId: job.managerId,
      managerName: job.managerName,
      applicantId: seekerId,
      applicantName: seeker.name,
      applicantAvatar: seeker.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      applicantRole: job.jobTitle,
      applicantExperience: seeker.experience || '2 Years',
      applicantRating: seeker.rating || 4.8,
      salaryPerDay: job.salaryPerDay,
      location: job.location,
      date: job.date,
      status: 'under_review',
      appliedAt: new Date().toISOString()
    };

    setApplications((prev) => [newApp, ...prev]);
    await saveToFirestore('applications', appId, newApp);
    return newApp;
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  // =========================================================================
  // MESSAGING & SOCIAL WORKFLOWS
  // =========================================================================
  const sendMessage = ({ receiverId, receiverName, text, images = [] }) => {
    if (!currentUser) return;
    const msg = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id || currentUser.uid,
      senderName: currentUser.name,
      receiverId,
      receiverName,
      text,
      images,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  };

  const addReview = ({ targetId, rating, comment, eventName }) => {
    if (!currentUser) return;
    const rev = {
      id: `rev_${Date.now()}`,
      targetId,
      authorName: currentUser.name,
      rating: Number(rating) || 5.0,
      comment,
      eventName: eventName || 'Event Service',
      date: 'Just now'
    };
    setReviews((prev) => [rev, ...prev]);
  };

  const markNotificationRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  return (
    <DatabaseContext.Provider
      value={{
        requests,
        proposals,
        bookings,
        jobListings,
        applications,
        payments,
        earnings,
        messages,
        savedManagers,
        savedJobs,
        reviews,
        packages,
        expenses,
        notifications,
        createCustomerRequest,
        createProposal,
        acceptProposal,
        rejectProposal,
        processPayment,
        toggleSaveManager,
        updateBookingProgress,
        createJobListing,
        updateApplicationStatus,
        addExpense,
        createPackage,
        applyForJob,
        toggleSaveJob,
        sendMessage,
        addReview,
        markNotificationRead
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) throw new Error('useDatabase must be used within DatabaseProvider');
  return context;
};
