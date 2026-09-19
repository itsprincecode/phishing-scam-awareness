import { DetectionScenario } from '../types';

export const detectionScenarios: DetectionScenario[] = [
  {
    id: 'scenario-1',
    title: 'Urgent Bank Account Deactivation SMS',
    channel: 'SMS',
    sender: 'VM-SBIBNK',
    timestamp: 'Today, 02:45 PM',
    messageContent: 'URGENT! Dear Customer, your SBI bank account has been locked today due to uncompleted KYC documents. Click http://sbi-kyc-update-portal.info to verify immediately or your balance will be frozen permanently.',
    correctVerdict: 'scam',
    difficulty: 'Beginner',
    explanation: 'Banks never send frantic threats claiming your account will be frozen within hours, and they NEVER ask you to complete KYC through non-official third-party HTTP domains like ".info" or unverified links.',
    redFlags: [
      'Panic-inducing capitalized text ("URGENT!") designed to bypass rational judgment.',
      'Unsecured, non-standard domain (sbi-kyc-update-portal.info instead of the authentic onlinesbi.sbi or onlinesbi.com).',
      'Uses HTTP instead of HTTPS security protocol.',
      'Threatens immediate financial freeze without prior notice or postal communication.'
    ],
    safeActions: [
      'Do NOT click the hyperlink under any circumstance.',
      'Open your bank\'s official mobile application independently or visit a local branch.',
      'Report the phishing number to your cellular provider or the 1930 Cybercrime Helpline.'
    ]
  },
  {
    id: 'scenario-2',
    title: '₹50,000 Lucky Draw Prize Announcement',
    channel: 'WhatsApp',
    sender: '+91 98765 01234 (Festival Promotions)',
    timestamp: 'Yesterday, 07:15 PM',
    messageContent: '🎉 Congratulations! Your mobile number was selected in the All India Shopping Lucky Draw! You have won a cash reward of ₹50,000! To claim your funds directly to your Google Pay or PhonePe, simply pay a one-time refundable processing & tax clearance fee of ₹999 at: upi://pay?pa=luckyfest@okaxis',
    correctVerdict: 'scam',
    difficulty: 'Beginner',
    explanation: 'This is a textbook "Advance-Fee Scam" (419 fraud). You can never win a contest you never registered for, and genuine prize disbursements deduct required statutory tax at source (TDS) rather than asking the winner to prepay arbitrary processing fees.',
    redFlags: [
      'Winning a contest or lucky draw that you never purchased a ticket for or entered.',
      'Asking the recipient to pay an upfront "processing", "registration", or "clearance" fee to receive money.',
      'Sent from an unverified random personal mobile number on WhatsApp.',
      'Promises "refundable" fees to artificially lower psychological resistance.'
    ],
    safeActions: [
      'Block and report the contact immediately on WhatsApp.',
      'Never send funds via UPI to claim an unverified cash prize.',
      'Warn friends and family about the advance-fee formula: You should never pay money to get money.'
    ]
  },
  {
    id: 'scenario-3',
    title: 'Shortlisted Internship Application KYC Demand',
    channel: 'Job Portal',
    sender: 'HR Team <careers@globaltech-solutions-hr.com>',
    subjectOrHeader: 'Shortlist Notice: Summer Tech & Research Internship',
    timestamp: 'Today, 10:30 AM',
    messageContent: 'Dear Applicant, We are pleased to inform you that your resume has been shortlisted for our paid summer internship (Stipend: ₹35,000/month). Because this is a remote program, our onboarding requires immediate identity validation today. Please reply directly with clear photos of your front & back Aadhaar card, bank account number, IFSC code, and the 6-digit confirmation code we just dispatched to your mobile number.',
    correctVerdict: 'scam',
    difficulty: 'Intermediate',
    explanation: 'Legitimate corporate organizations never ask for immediate submissions of Aadhaar cards, bank credentials, and mobile SMS verification codes before holding a single interview, technical evaluation, or issuing a signed formal offer letter. Asking for the 6-digit code is an attempt to hijack an account or authorize a transaction.',
    redFlags: [
      'Shortlist offer with unusually high compensation without an interview or portfolio review.',
      'Urgent same-day deadline to pressure the applicant into hasty compliance.',
      'Requests photos of sensitive government ID (Aadhaar) and bank details over plain email.',
      'Directly demands a "6-digit confirmation code" sent to your mobile phone (an account login or financial OTP).'
    ],
    safeActions: [
      'Stop all communication with the sender.',
      'Check the company\'s official website and reach out to genuine HR representatives on LinkedIn.',
      'Never share SMS verification codes; those are OTPs meant strictly for your eyes only.'
    ]
  },
  {
    id: 'scenario-4',
    title: 'Instagram Account Deletion Warning DM',
    channel: 'Social Media',
    sender: '@meta_copyright_resolution_center',
    timestamp: 'Today, 01:12 PM',
    messageContent: '⚠️ IMPORTANT POLICY ALERT: A post on your profile was found to violate Meta\'s Copyright & Trademark terms. As per our 2025 guidelines, your Instagram account will be permanently deactivated within 24 hours. If you believe this is an error, submit your appeal immediately through our verified resolution form: https://instagram-security-appeals-case88.web.app/login',
    correctVerdict: 'scam',
    difficulty: 'Intermediate',
    explanation: 'Meta/Instagram never communicates copyright violations or account terminations via direct messages (DMs). Official notices appear exclusively under Settings > Help > Support Requests, or via verified email. The link uses a free Firebase web app domain (`.web.app`) to host a cloned login page.',
    redFlags: [
      'Direct message from a non-verified handle claiming to be official Meta support.',
      '24-hour countdown clock designed to incite panic and cloud judgment.',
      'Domain is hosted on a free cloud hosting tier (`.web.app`) instead of `help.instagram.com`.',
      'The appeal link takes you directly to a credential login screen rather than internal app settings.'
    ],
    safeActions: [
      'Do not click the link or type your login credentials.',
      'Open Instagram Settings > Security > "Emails from Instagram" to inspect real official communications.',
      'Report the profile for impersonation and spam.'
    ]
  },
  {
    id: 'scenario-5',
    title: 'Legitimate Automated Bank Transaction Alert',
    channel: 'SMS',
    sender: 'HDFCBK-Txn',
    timestamp: 'Yesterday, 04:30 PM',
    messageContent: 'INR 450.00 debited from a/c **1892 on 17-Sep-26 16:30:12 to SWIGGY BANGALORE via UPI Ref 426019827102. Bal: INR 14,210.80. If not done by you, call 18002026161 or SMS BLOCK 1892 to 5676712.',
    correctVerdict: 'safe',
    difficulty: 'Intermediate',
    explanation: 'This is a genuine standard transaction notification. It reflects an actual purchase made by the user, masks the account number (**1892), does NOT contain clickable links, does not demand an OTP or password, and provides standard official bank helpline numbers.',
    redFlags: [],
    safeActions: [
      'Review your recent Swiggy food delivery order to confirm the amount matches.',
      'No action is required if this transaction was initiated by you.',
      'If you did not make this purchase, contact your bank\'s official helpline provided on your debit card.'
    ]
  },
  {
    id: 'scenario-6',
    title: 'Marketplace Buyer: "Scan QR to Receive Money"',
    channel: 'WhatsApp',
    sender: '+91 91234 56789 (Buyer: Rajesh Kumar)',
    timestamp: 'Today, 11:15 AM',
    messageContent: 'Hello, I saw your used study table listed on OLX for ₹3,000. I am purchasing it for my brother in your city. I have generated a merchant instant payment barcode. Open Google Pay or PhonePe, select "Scan QR Code", scan this image and enter your UPI PIN. The ₹3,000 will be instantly credited to your bank account!',
    correctVerdict: 'scam',
    difficulty: 'Beginner',
    explanation: 'This is the widespread "QR Code Receive Money Scam". In the UPI architecture, scanning a QR code and entering your UPI PIN is STRICTLY used to AUTHORIZE MONEY LEAVING YOUR ACCOUNT. You NEVER need to enter your PIN or scan a QR code to receive money.',
    redFlags: [
      'Claiming that scanning a QR code will "credit" funds into your account.',
      'Asking the seller to enter their UPI PIN to "receive" payment.',
      'Buyer is eager to pay immediately without viewing the physical product or negotiating price.',
      'Refuses to pay directly to a phone number or UPI VPA ID normally.'
    ],
    safeActions: [
      'Never scan a QR code or enter your UPI PIN when receiving money.',
      'Block the buyer immediately on WhatsApp and report their profile on OLX.',
      'Remind yourself: PIN is only entered when sending money from your account.'
    ]
  },
  {
    id: 'scenario-7',
    title: 'Courier Address Mismatch Alert',
    channel: 'SMS',
    sender: 'AX-INDIAPOST',
    timestamp: 'Today, 09:00 AM',
    messageContent: 'India Post: Your package #IN889218 could not be delivered due to incomplete street number. Please update your delivery address and pay the ₹25 re-dispatch surcharge within 12 hours: https://indiapost-parcel-reschedule.top/track',
    correctVerdict: 'scam',
    difficulty: 'Intermediate',
    explanation: 'India Post does not send SMS links asking for address updates along with small re-dispatch fees on strange top-level domains like `.top`. Attackers use nominal charges (like ₹25) to induce the victim to enter their credit/debit card numbers and CVV on a fake payment gateway.',
    redFlags: [
      'Suspicious top-level domain (`.top` instead of the official government `.gov.in`).',
      'Artificial 12-hour urgency claiming the parcel will be destroyed or returned.',
      'Small nominal fee (₹25) intended to lure users into submitting card credentials.',
      'Sent to users who may not even be expecting a delivery from India Post.'
    ],
    safeActions: [
      'Do not click the link or enter card details.',
      'Check official parcel tracking strictly at `www.indiapost.gov.in` using your original tracking number.',
      'Delete and report the message as spam.'
    ]
  },
  {
    id: 'scenario-8',
    title: 'University Official Examination Schedule Notice',
    channel: 'Email',
    sender: 'Examination Controller <controller@university-edu.ac.in>',
    subjectOrHeader: 'CIRCULAR: Final Semester Examination Timetable - Nov/Dec 2026',
    timestamp: 'Yesterday, 03:00 PM',
    messageContent: 'Dear Students, The tentative timetable for the upcoming semester examinations has been published on the official University Examination Portal. You may review the schedule, examination hall regulations, and download your hall tickets by logging into your student portal at https://exams.university-edu.ac.in using your regular student roll number credentials. For discrepancies, reach out to your faculty advisor.',
    correctVerdict: 'safe',
    difficulty: 'Advanced',
    explanation: 'The email comes from the authentic university domain (`.ac.in`), uses a secure subdomain (`exams.university-edu.ac.in`), does not create panic, does not demand OTPs, passwords, or surprise payments, and instructs students to use established campus support channels.',
    redFlags: [],
    safeActions: [
      'Verify that the URL domain matches your verified college portal format (`.ac.in`).',
      'Log in through your regular bookmark or student portal to download the hall ticket.',
      'Consult your academic advisor or class coordinator if any exam dates conflict.'
    ]
  }
];
