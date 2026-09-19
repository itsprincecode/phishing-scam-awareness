import { QuizQuestion } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What should you do if an unknown message asks you to share an OTP?',
    options: [
      'Share it immediately to prevent your account from being locked',
      'Reply asking who they are and why they need it',
      'Never share the OTP and verify through an official channel',
      'Forward it to friends to check if they received it too'
    ],
    correctAnswer: 2,
    explanation: 'OTPs (One-Time Passwords) are confidential security tokens meant solely for you to authorize actions you initiated. Legitimate bank staff, technical support, or service agents will NEVER request an OTP over phone or chat.',
    topic: 'OTP Security'
  },
  {
    id: 'q2',
    question: 'A buyer on an online marketplace insists that you scan a QR code on your mobile phone to receive payment for your used bicycle. What will happen if you scan and enter your UPI PIN?',
    options: [
      'The payment will instantly credit directly into your bank account',
      'Money will be debited from your bank account to the buyer',
      'The transaction will be held in an escrow account for 24 hours',
      'Your bank app will automatically detect and reject the payment'
    ],
    correctAnswer: 1,
    explanation: 'In the UPI architecture, scanning a QR code and entering your UPI PIN always authorizes money leaving your account. You NEVER need to enter your PIN or scan a QR code to receive money.',
    topic: 'QR Scams'
  },
  {
    id: 'q3',
    question: 'Which of the following is the most reliable sign that an email claiming to be from your bank is actually a phishing attempt?',
    options: [
      'The email has the bank\'s official logo at the top',
      'The sender\'s email address uses a domain like support@bank-security-notice.biz instead of the bank\'s authentic domain',
      'The email is written in English with formal language',
      'The email was received during standard banking business hours'
    ],
    correctAnswer: 1,
    explanation: 'Logos and email formatting can be copied in seconds. The definitive telltale indicator is the actual domain name in the sender address. Banks strictly send correspondence from their registered official domain name.',
    topic: 'Phishing Detection'
  },
  {
    id: 'q4',
    question: 'You receive an unsolicited WhatsApp message offering an easy work-from-home job paying ₹4,000/day just for liking social media posts, but you must first pay ₹1,500 for a "training starter kit". What should you conclude?',
    options: [
      'It is a standard recruitment policy for part-time college internships',
      'It is a legitimate opportunity if they provide a registered business number',
      'It is a classic advance-fee task scam where they will steal the upfront deposit',
      'You should pay half the fee to test if they give you tasks'
    ],
    correctAnswer: 2,
    explanation: 'Genuine employers pay employees for their labor; they never demand registration fees, security deposits, or training kit payments upfront from candidates.',
    topic: 'Job Scams'
  },
  {
    id: 'q5',
    question: 'An urgent SMS says: "Your electricity connection will be disconnected tonight at 9:30 PM due to previous bill unpaid. Call electricity officer at 9876543210 immediately." What is this an example of?',
    options: [
      'Routine utility billing notification',
      'Panic-based social engineering scam designed to force an impulsive payment or app install',
      'Government automated audit reminder',
      'Mandatory telecom bill dispatch'
    ],
    correctAnswer: 1,
    explanation: 'Electricity utility boards never disconnect power abruptly at night via a personal 10-digit mobile number. Scammers use artificial panic deadlines to prevent victims from thinking critically or checking bills.',
    topic: 'Social Engineering'
  },
  {
    id: 'q6',
    question: 'When checking if an online shopping portal is legitimate before typing your debit card details, which factor is the most crucial to inspect?',
    options: [
      'Whether the website displays a padlock icon in the browser address bar',
      'Whether the products have 5-star customer reviews on the webpage',
      'The exact URL domain spelling, company contact address, and independent reviews outside the website',
      'Whether the prices are marked 80% lower than major retailers'
    ],
    correctAnswer: 2,
    explanation: 'A padlock icon only confirms an encrypted HTTPS connection—even malicious phishing websites easily get free SSL certificates. Checking the exact spelling of the domain, real company registration, and external reputation is vital.',
    topic: 'Fake Websites'
  },
  {
    id: 'q7',
    question: 'A caller claiming to be a technical support executive from your telecom operator tells you to install an application called "AnyDesk" or "TeamViewer" to resolve poor cellular network speeds. What should you do?',
    options: [
      'Install the application immediately and grant all requested permissions',
      'Refuse and hang up; screen-sharing software gives scammers complete visual and remote control of your phone and banking screens',
      'Install it, but disconnect your Wi-Fi connection',
      'Share the app\'s 9-digit code but hide your bank app'
    ],
    correctAnswer: 1,
    explanation: 'Applications like AnyDesk, TeamViewer, and QuickSupport mirror your phone screen and allow remote control. Scammers use them to view your incoming OTPs and bank credentials in real-time.',
    topic: 'Banking & Device Safety'
  },
  {
    id: 'q8',
    question: 'What is "typosquatting" in the context of cyber threats?',
    options: [
      'A software bug in keyboard firmware',
      'Registering common misspellings of popular website domains to trap users who make a typing error',
      'Speed-typing competitions held by security researchers',
      'A method used to generate strong mathematical passwords'
    ],
    correctAnswer: 1,
    explanation: 'Typosquatting involves registering domain names that are slight variations or common typographical misspellings of well-known websites (e.g., `amazn.com` or `paypa1.com`) to lure unsuspecting visitors onto malicious clones.',
    topic: 'Suspicious Links'
  },
  {
    id: 'q9',
    question: 'You receive a text message stating that you have won a ₹1,00,000 cash reward from a national retail chain, and you need to click a bit.ly link to claim it. What should you consider?',
    options: [
      'Click the link quickly because cash rewards expire fast',
      'You cannot legitimately win a contest you never entered, and masked short links often hide malicious destinations',
      'Forward the message to your family members so they can claim it too',
      'Reply to the text asking for bank account deposit'
    ],
    correctAnswer: 1,
    explanation: 'If you did not enter a contest or lottery, you cannot win it. Masked or shortened links are frequently used by fraudsters to disguise malicious redirect chains and spoofed web forms.',
    topic: 'Scam Messages'
  },
  {
    id: 'q10',
    question: 'If you realize you accidentally clicked a suspicious link and typed your bank or college password on a fake website, what is the very first step you should take?',
    options: [
      'Wait 48 hours to see if any suspicious activity occurs',
      'Immediately change the password on the legitimate website from another tab/device and enable Multi-Factor Authentication (MFA)',
      'Shut down your computer and do not turn it on for a week',
      'Post a public apology on your social media accounts'
    ],
    correctAnswer: 1,
    explanation: 'Speed is critical. Immediately changing your password invalidates the stolen credential before the attacker has a chance to execute an automated login. Also notify your IT administrator or bank support right away.',
    topic: 'Incident Response'
  }
];
