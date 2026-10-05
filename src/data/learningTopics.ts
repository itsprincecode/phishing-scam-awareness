import { LearningTopic } from '../types';

export const learningTopics: LearningTopic[] = [
  {
    id: 'phishing',
    title: 'Phishing',
    category: 'Deceptive Messaging',
    shortDesc: 'Deceptive emails, texts, and messages designed to steal credentials and sensitive data.',
    iconName: 'MailWarning',
    readTime: '4 min read',
    whatIsIt: 'Phishing is a cyber attack where criminals impersonate reputable institutions, banks, college authorities, or trusted services via email, SMS, or direct messages to trick you into revealing sensitive credentials, passwords, or personal identity numbers.',
    howItWorks: [
      'The attacker crafts an email or text mimicking a trusted institution (e.g., your university portal, bank, or Netflix).',
      'The message uses psychological manipulation—most often panic, fear of penalties, or artificial urgency.',
      'It contains a hyperlink pointing to a cloned website that appears identical to the real login screen.',
      'Once entered, your credentials are saved by the criminal and used to compromise your actual accounts.'
    ],
    warningSigns: [
      'Artificial urgency ("Account suspended in 2 hours", "Action required immediately").',
      'Generic greetings like "Dear Customer" or "Valued Student" instead of your actual registered name.',
      'Mismatched domain names (e.g., support@paypa1-update.com instead of paypal.com).',
      'Unsolicited attachments with extensions like .zip, .html, or .exe.',
      'Direct requests to input passwords, OTPs, or credit card details via a link.'
    ],
    exampleScenario: {
      title: 'University Tuition Portal Suspension Notice',
      context: 'An engineering student received an email from "billing@university-portal-verify.org" stating their semester registration was paused due to missing tuition fees.',
      attackerMethod: 'The link directed to a counterfeit portal with identical college logos, prompting the student to enter their portal login and debit card numbers.',
      impact: 'The student identified the strange domain extension before entering payment details and forwarded the email to the campus IT helpdesk.'
    },
    protectionTips: [
      'Always inspect the sender address and domain spelling thoroughly.',
      'Never click links in unexpected security alert emails; navigate to the official portal manually in a new tab.',
      'Enable Multi-Factor Authentication (MFA) on all university and personal email accounts.',
      'Use a reputable password manager that refuses to auto-fill credentials on fake URL domains.',
      'Report suspected phishing emails to your institution or email provider.'
    ],
    videos: [
      {
        title: 'How Phishing Scams Actually Work (and How to Spot Them)',
        channelName: 'IBM Technology',
        thumbnailUrl: 'https://img.youtube.com/vi/XBkzBrXllBo/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=XBkzBrXllBo',
        youtubeId: 'XBkzBrXllBo'
      },
      {
        title: 'Phishing Attacks Explained in 5 Minutes',
        channelName: 'Simplilearn',
        thumbnailUrl: 'https://img.youtube.com/vi/qfZfH_33a0E/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=qfZfH_33a0E',
        youtubeId: 'qfZfH_33a0E'
      },
      {
        title: 'Internet Safety: What is Phishing?',
        channelName: 'GCFGlobal',
        thumbnailUrl: 'https://img.youtube.com/vi/Y7zNlEMDm3A/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=Y7zNlEMDm3A',
        youtubeId: 'Y7zNlEMDm3A'
      }
    ]
  },
  {
    id: 'online-scams',
    title: 'Online Scams',
    category: 'Financial & Cyber Fraud',
    shortDesc: 'Fraudulent schemes promising financial gain, prizes, fake giveaways, or bogus investments.',
    iconName: 'AlertTriangle',
    readTime: '5 min read',
    whatIsIt: 'Online scams are deceptive schemes run over digital channels where fraudsters fabricate stories, prize announcements, investment windfalls, or online marketplace deals to extract money or personal assets from unsuspecting victims.',
    howItWorks: [
      'Fraudsters broadcast messages across Telegram, WhatsApp, Instagram, or SMS claiming you have won a lottery, scholarship, or exclusive cashback.',
      'To release the supposed funds, they demand an upfront "processing fee", "GST payment", or "customs clearance".',
      'Once the victim pays the initial fee, the fraudster asks for further fees under different pretexts before cutting off contact entirely.'
    ],
    warningSigns: [
      'Guaranteed high financial returns with "zero risk" or "secret trading algorithms".',
      'Requests to pay an upfront fee to claim a prize or scholarship you never applied for.',
      'Pressure to pay via non-reversible methods like UPI, gift cards, or crypto transfers.',
      'Pressure to keep the conversation private and not consult family, advisors, or authorities.',
      'Screenshots of fake bank statements or celebrity endorsements as "proof".'
    ],
    exampleScenario: {
      title: 'The ₹50,000 Festival Cashback Win',
      context: 'A student received a WhatsApp message with festive branding stating: "Congratulations! You won ₹50,000 in the National Shopping Draw. Pay ₹999 processing fee to instantly release the prize to your UPI ID."',
      attackerMethod: 'The scammer shared a QR code for the ₹999 payment, assuring immediate automatic payout of the larger amount.',
      impact: 'The student recognized the classic advance-fee fraud formula (paying money to receive money) and blocked the contact.'
    },
    protectionTips: [
      'Remember the golden rule: If you did not enter a lottery or contest, you cannot win it.',
      'Legitimate prizes and refunds NEVER require an advance processing fee to be credited.',
      'Never send money to unknown individuals via instant payment platforms like UPI or gift cards.',
      'Verify company promotions by visiting official verified social media handles or corporate websites.'
    ],
    videos: [
      {
        title: 'Top 5 Financial & Internet Scams You Must Watch Out For',
        channelName: 'Cybercrime Support Network',
        thumbnailUrl: 'https://img.youtube.com/vi/o5V8n9uC7_4/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=o5V8n9uC7_4',
        youtubeId: 'o5V8n9uC7_4'
      },
      {
        title: 'How Common Online Scams Work & How to Protect Yourself',
        channelName: 'Federal Trade Commission',
        thumbnailUrl: 'https://img.youtube.com/vi/x9iA3w74-xY/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=x9iA3w74-xY',
        youtubeId: 'x9iA3w74-xY'
      },
      {
        title: 'Advance Fee Fraud & Online Lottery Scams Decoded',
        channelName: 'Scam Survivor Hub',
        thumbnailUrl: 'https://img.youtube.com/vi/5g1Wk6oM8i0/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=5g1Wk6oM8i0',
        youtubeId: '5g1Wk6oM8i0'
      }
    ]
  },
  {
    id: 'digital-fraud',
    title: 'Digital Fraud',
    category: 'Identity & Financial Security',
    shortDesc: 'Unauthorized transactions, unauthorized SIM swaps, and identity impersonation.',
    iconName: 'ShieldAlert',
    readTime: '4 min read',
    whatIsIt: 'Digital fraud encompasses illegal manipulation of electronic systems, unauthorized transactions, identity theft, credit or debit card cloning, and fraudulent financial redirection across digital payment networks.',
    howItWorks: [
      'Attackers gather personal details through leaked databases, public social media, or previous phishing breaches.',
      'They exploit payment gateways, clone banking apps, or trick telecom providers into SIM swapping.',
      'With redirected communication or forged identity documents, unauthorized transactions are initiated against victims accounts.'
    ],
    warningSigns: [
      'Unprompted SMS alerts regarding debit transactions, card authorizations, or password changes.',
      'Sudden loss of cellular signal on your mobile device (potential indicator of unauthorized SIM swap).',
      'Unauthorized debit charges or small test debits (e.g., ₹1 or ₹5) appearing on your bank statement.',
      'Calls from supposed bank officials asking for your card expiry, CVV, or internet banking user ID.'
    ],
    exampleScenario: {
      title: 'The Unauthorized KYC Update Call',
      context: 'A victim received a call from an alleged telecom officer stating their SIM KYC would expire at midnight unless they installed a verification APK file.',
      attackerMethod: 'The APK was malicious spyware designed to forward incoming SMS messages and banking notifications to the fraudster.',
      impact: 'The victim refused the download, knowing telecom providers never mandate third-party APK installations for KYC verification.'
    },
    protectionTips: [
      'Immediately lock or block cards via your official banking app if an unrecognized debit occurs.',
      'Never install APK files sent via WhatsApp, Telegram, or unknown email links.',
      'Set transaction and daily spending limits on debit/credit cards and UPI profiles.',
      'Regularly review your bank account statements and transaction histories.'
    ],
    videos: [
      {
        title: 'Digital Banking & UPI Payment Fraud: Protection Guide',
        channelName: 'Reserve Bank Cyber Cell',
        thumbnailUrl: 'https://img.youtube.com/vi/2NBi3z5W8uI/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=2NBi3z5W8uI',
        youtubeId: '2NBi3z5W8uI'
      },
      {
        title: 'Identity Theft & Unauthorized Card Transactions Explained',
        channelName: 'Kaspersky Cyber Hub',
        thumbnailUrl: 'https://img.youtube.com/vi/OqM2aP8yK5g/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=OqM2aP8yK5g',
        youtubeId: 'OqM2aP8yK5g'
      },
      {
        title: 'SIM Swap Fraud: How Criminals Steal Your Phone Number',
        channelName: 'CNBC Cyber Reports',
        thumbnailUrl: 'https://img.youtube.com/vi/i7nflg3f3yA/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=i7nflg3f3yA',
        youtubeId: 'i7nflg3f3yA'
      }
    ]
  },
  {
    id: 'social-engineering',
    title: 'Social Engineering',
    category: 'Human Vulnerabilities',
    shortDesc: 'Psychological manipulation to trick individuals into divulging confidential information.',
    iconName: 'Users',
    readTime: '5 min read',
    whatIsIt: 'Social engineering is the psychological art of manipulating people into performing actions or divulging confidential data. Rather than exploiting technical software bugs, it targets human emotions like trust, fear, empathy, greed, or curiosity.',
    howItWorks: [
      'Pretexting: The attacker invents an authoritative persona (professor, IT support engineer, police officer, or bank manager).',
      'Elicitation: They ask seemingly innocent questions or create high-stress circumstances demanding immediate compliance.',
      'Exploitation: Under emotional duress or false rapport, the victim shares sensitive details, bypasses security protocols, or approves approvals.'
    ],
    warningSigns: [
      'Excessive pressure to act before you have time to consult others or verify facts.',
      'Unusual requests from "friends" or "supervisors" asking for emergency funds via unfamiliar channels.',
      'Callers who know basic public info about you (college name, hometown) and use it to build false authority.',
      'Appeals to secrecy: "Don\'t tell anyone yet, this is an internal confidential audit."'
    ],
    exampleScenario: {
      title: 'The "Department Head" Urgent WhatsApp Message',
      context: 'A student received a WhatsApp message displaying their College Principal\'s photo: "I am in an urgent academic board meeting and need three Apple gift cards right away. Can you purchase and send the codes? I will reimburse you by evening."',
      attackerMethod: 'The criminal leveraged respect for academic leadership to prompt fast, unverified financial transactions.',
      impact: 'The student called the college administrative office directly, revealing the phone number was an impersonator.'
    },
    protectionTips: [
      'Slow down: High-pressure urgency is the single biggest indicator of social engineering.',
      'Always verify unusual requests via an independent, established communication channel.',
      'Limit personal information (phone numbers, family names, travel dates) shared publicly on social media.',
      'Remember that legitimate authorities will never ask you to execute secret financial transfers.'
    ],
    videos: [
      {
        title: 'Social Engineering 101: How Hackers Hack the Human Mind',
        channelName: 'John Hammond',
        thumbnailUrl: 'https://img.youtube.com/vi/lc7scxvzkUU/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=lc7scxvzkUU',
        youtubeId: 'lc7scxvzkUU'
      },
      {
        title: 'The Psychology of Manipulation: Urgent Calls & Authority',
        channelName: 'David Bombal',
        thumbnailUrl: 'https://img.youtube.com/vi/n86W_9V_lV8/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=n86W_9V_lV8',
        youtubeId: 'n86W_9V_lV8'
      },
      {
        title: 'Real Life Social Engineering Attacks & Defensive Tactics',
        channelName: 'Insider Cybersecurity',
        thumbnailUrl: 'https://img.youtube.com/vi/r9b8a8b1p1E/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=r9b8a8b1p1E',
        youtubeId: 'r9b8a8b1p1E'
      }
    ]
  },
  {
    id: 'fake-websites',
    title: 'Fake Websites',
    category: 'Spoofed Web Infrastructure',
    shortDesc: 'Counterfeit portals and cloned login pages designed to capture personal credentials.',
    iconName: 'Globe',
    readTime: '4 min read',
    whatIsIt: 'Fake websites are bogus web destinations created by attackers that visually mimic legitimate brands, university examination portals, banking platforms, or e-commerce stores to steal passwords, financial credentials, or inject malware.',
    howItWorks: [
      'Attackers register "typosquatting" domains that look almost identical to real ones (e.g., `micros0ft.com`, `statebank-kyc.net`).',
      'They copy CSS, logos, and layouts directly from the legitimate target site.',
      'They often buy search engine ads or send links via spam messages so the fake site appears high in search results.',
      'When users attempt to log in or purchase an item, their credentials or card details are intercepted.'
    ],
    warningSigns: [
      'Subtle misspellings or extra hyphenations in the address bar (e.g., `amazon-deals-in.com`).',
      'Non-functional footer links, blank "Terms of Service" or "About Us" pages.',
      'Unrealistic discounts (e.g., brand-new flagship smartphones for ₹4,999).',
      'Forms requesting unnecessary sensitive inputs like ATM PIN, mother\'s maiden name, or Aadhaar on standard shopping checkouts.'
    ],
    exampleScenario: {
      title: 'The Scholarship Application Cloned Portal',
      context: 'Students searching for a state merit scholarship clicked a sponsored search ad leading to `scholarship-gov-registration.org`.',
      attackerMethod: 'The page matched the state scholarship scheme layout exactly, but asked for bank account passwords and debit card PIN to "verify eligibility".',
      impact: 'A student noticed the official government domain suffix `.gov.in` was missing, preventing credential loss across campus.'
    },
    protectionTips: [
      'Carefully inspect the full domain name in the browser address bar before typing any credentials.',
      'Official Indian government sites strictly end in `.gov.in` or `.nic.in`.',
      'Bookmark frequently used banking and college portals rather than clicking search engine sponsored ads.',
      'Look for proper HTTPS certificates, but remember: even fake sites can have free SSL locks, so check the domain name itself!'
    ],
    videos: [
      {
        title: 'How to Detect Cloned Portals and Fake Websites',
        channelName: 'All About Tech',
        thumbnailUrl: 'https://img.youtube.com/vi/K1GZ1uP0wX8/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=K1GZ1uP0wX8',
        youtubeId: 'K1GZ1uP0wX8'
      },
      {
        title: 'Typosquatting & Lookalike Domains Explained',
        channelName: 'CyberNews',
        thumbnailUrl: 'https://img.youtube.com/vi/4mZ6H4Wv2Bw/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=4mZ6H4Wv2Bw',
        youtubeId: '4mZ6H4Wv2Bw'
      },
      {
        title: 'Why SSL Padlocks Can Lie: Inspecting Real Domain Names',
        channelName: 'Techquickie',
        thumbnailUrl: 'https://img.youtube.com/vi/Sj1s9Q1hXyU/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=Sj1s9Q1hXyU',
        youtubeId: 'Sj1s9Q1hXyU'
      }
    ]
  },
  {
    id: 'malicious-links',
    title: 'Malicious Links',
    category: 'Deceptive Links & Payloads',
    shortDesc: 'Shortened URLs, drive-by download links, and redirectors that deploy spyware or malware.',
    iconName: 'Link2',
    readTime: '4 min read',
    whatIsIt: 'Malicious links are hyperlinks engineered to redirect users to hazardous web destinations, trigger automatic drive-by downloads of spyware, or execute cross-site script exploits on connected devices.',
    howItWorks: [
      'Attackers disguise harmful destinations using URL shorteners (e.g., bit.ly, tinyurl) or deceptive anchor text.',
      'Clicking the link navigates through multiple redirects to mask the attacker\'s true origin server.',
      'The destination executes browser exploit scripts, prompts malicious extensions, or downloads backdoor APKs/executables.'
    ],
    warningSigns: [
      'Masked or shortened URLs received from untrusted contacts without explanation.',
      'Anchor text showing one legitimate URL (e.g., www.google.com) but pointing to an entirely different address when hovered.',
      'Unexpected prompts to download a browser extension, Flash player update, or codec to view content.',
      'Links shared in mass viral messaging chains ("Click here to get free 50GB internet data for 30 days!").'
    ],
    exampleScenario: {
      title: 'The Viral Free Campus Wi-Fi Link',
      context: 'A student college group received a shared message: "Campus Free 5G access coupon! Claim now: bit.ly/free-univ-data-2025".',
      attackerMethod: 'The link redirected users to an ad-farm survey that prompted an auto-download of an intrusive Android adware package.',
      impact: 'Class representatives warned the group and used an unshortener tool to expose the malicious destination.'
    },
    protectionTips: [
      'Hover over hyperlinks on desktop to preview the real destination URL in the status bar before clicking.',
      'Use URL expansion utilities or link scanners (like VirusTotal) to inspect suspicious shortened links safely.',
      'Never enable unknown permissions (like push notifications or location) on unfamiliar websites.',
      'Keep your web browser and operating system updated with the latest security patches.'
    ],
    videos: [
      {
        title: 'What Actually Happens When You Click on a Malicious Link',
        channelName: 'Fireship',
        thumbnailUrl: 'https://img.youtube.com/vi/lGk_f0zJ-bI/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=lGk_f0zJ-bI',
        youtubeId: 'lGk_f0zJ-bI'
      },
      {
        title: 'How to Safely Check Suspicious Shortened Links First',
        channelName: 'ThioJoe Tech',
        thumbnailUrl: 'https://img.youtube.com/vi/7j5kH2b8Psw/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=7j5kH2b8Psw',
        youtubeId: '7j5kH2b8Psw'
      },
      {
        title: 'Drive-By Downloads and Browser Exploit Demonstrations',
        channelName: 'LiveOverflow',
        thumbnailUrl: 'https://img.youtube.com/vi/t8b1m8p3n8k/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=t8b1m8p3n8k',
        youtubeId: 't8b1m8p3n8k'
      }
    ]
  },
  {
    id: 'otp-banking-scams',
    title: 'OTP & Banking Scams',
    category: 'Payment Security',
    shortDesc: 'Social engineering and fake callers tricking victims into handing over One-Time Passwords.',
    iconName: 'CreditCard',
    readTime: '5 min read',
    whatIsIt: 'OTP (One-Time Password) scams are targeted attacks where criminals trick account holders into sharing the transient verification codes sent by banks, payment gateways, or messaging platforms to authorize financial debits or hijack accounts.',
    howItWorks: [
      'The fraudster already possesses your card number or username through prior database leaks or phishing.',
      'They initiate a transaction or password reset, triggering an official OTP SMS from your bank to your phone.',
      'Simultaneously, the scammer calls pretending to be a bank security agent "stopping an unauthorized charge".',
      'They say: "We just sent you a cancellation code. Please read it to me so I can reverse the fraudulent debit."',
      'As soon as you recite the digits, the transaction is finalized.'
    ],
    warningSigns: [
      'Any caller or message requesting your OTP, UPI PIN, CVV, or NetBanking password—no exceptions.',
      'The text of the OTP message clearly reads "for debit of Rs..." or "for login", yet the caller claims it is for a "refund" or "cancellation".',
      'The caller uses intimidating jargon ("account freeze", "compliance violation", "police action").',
      'Claims that screen-sharing apps (AnyDesk, TeamViewer, RustDesk) must be installed to "verify" your bank account.'
    ],
    exampleScenario: {
      title: 'The Fake Debit Cancellation Call',
      context: 'A customer received a call from an alleged "Fraud Prevention Desk": "Someone in another city just attempted a ₹15,000 charge on your debit card. To cancel it, tell me the 6-digit cancellation token sent to your mobile."',
      attackerMethod: 'The incoming SMS was in fact an official transaction authorization OTP for an online gadget purchase initiated by the caller.',
      impact: 'The user read the SMS carefully, saw "OTP for purchase of ₹15,000", hung up immediately, and called their bank\'s toll-free number on the back of the card.'
    },
    protectionTips: [
      'Read the FULL text of every OTP SMS—it specifies whether the code is for a debit, login, or registration.',
      'NEVER share an OTP with anyone under any circumstance—bank staff, police, and tech support never need it.',
      'Remember: You NEVER need to enter a UPI PIN or provide an OTP to RECEIVE money.',
      'Never install screen sharing applications on request from unknown callers.'
    ],
    videos: [
      {
        title: 'How the OTP Banking Scam Works: Step-by-Step Breakdown',
        channelName: 'Finology Legal',
        thumbnailUrl: 'https://img.youtube.com/vi/0p8Kk6jGvU0/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=0p8Kk6jGvU0',
        youtubeId: '0p8Kk6jGvU0'
      },
      {
        title: 'Why You Must NEVER Share OTP or UPI PIN to Receive Money',
        channelName: 'Cyber Peace Foundation',
        thumbnailUrl: 'https://img.youtube.com/vi/3B7wP9tQ2vE/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=3B7wP9tQ2vE',
        youtubeId: '3B7wP9tQ2vE'
      },
      {
        title: 'Fake Bank Support Callers & Screen Share App Traps',
        channelName: 'Scam Alert Network',
        thumbnailUrl: 'https://img.youtube.com/vi/9x4L6rV0hYc/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=9x4L6rV0hYc',
        youtubeId: '9x4L6rV0hYc'
      }
    ]
  },
  {
    id: 'job-internship-scams',
    title: 'Job & Internship Scams',
    category: 'Student Career Safety',
    shortDesc: 'Deceptive employment offers targeting college students to steal money, identities, or labor.',
    iconName: 'Briefcase',
    readTime: '5 min read',
    whatIsIt: 'Job and internship scams are deceptive schemes targeted specifically at students, fresh graduates, and job seekers. Fraudsters post high-paying work-from-home positions, fake campus placements, or paid internships to extract "registration fees" or steal identity records.',
    howItWorks: [
      'Unsolicited job offers sent via WhatsApp, Telegram, or LinkedIn offering high daily compensation for simple tasks (e.g., liking YouTube videos, reviewing hotels, data entry).',
      'The victim is made to complete a few basic tasks and may even be given a small ₹200 payout to build trust.',
      'They are then invited to "VIP tasks" requiring an upfront deposit (e.g., "Pay ₹5,000 to earn ₹8,500").',
      'Alternatively, fake recruiters ask for confidential identity documents (Aadhaar, PAN, bank passbooks) before any interview.'
    ],
    warningSigns: [
      'Offers of very high pay for minimal skill tasks (e.g., "Earn ₹3,000/day by liking videos from home").',
      'Communication strictly through WhatsApp, Telegram, or personal Gmail accounts rather than company email domains.',
      'Job offers issued without any formal interview, portfolio evaluation, or technical assessment.',
      'Demands for "laptop security deposits", "document verification fees", or "training kit charges".'
    ],
    exampleScenario: {
      title: 'The "Part-time YouTube Reviewer" Scam',
      context: 'A sophomore was added to a Telegram group promising ₹150 per Google Maps review. After completing three reviews, they received ₹450 to their UPI.',
      attackerMethod: 'The group admin then presented a "Merchant Prepaid Task" asking the student to deposit ₹10,000 to unlock a ₹16,000 commission payout.',
      impact: 'The student realized this was the textbook task-scam model, refused the transfer, and reported the Telegram channel.'
    },
    protectionTips: [
      'Legitimate employers NEVER ask candidates to pay money for equipment, training, interviews, or placement fees.',
      'Check company careers pages directly to confirm whether the job ID actually exists.',
      'Be cautious of offers made exclusively through instant messaging apps with no formal contract.',
      'Never send photos of your Aadhaar card or PAN card to unverified recruiters.'
    ],
    videos: [
      {
        title: 'Exposing Fake Online Job Offers & Telegram Task Scams',
        channelName: 'Pleasant Green',
        thumbnailUrl: 'https://img.youtube.com/vi/hK1N_4j0vWs/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=hK1N_4j0vWs',
        youtubeId: 'hK1N_4j0vWs'
      },
      {
        title: 'Student Internship & Placement Fraud: Crucial Red Flags',
        channelName: 'Career Edge Security',
        thumbnailUrl: 'https://img.youtube.com/vi/6pW2aZ7nQ0M/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=6pW2aZ7nQ0M',
        youtubeId: '6pW2aZ7nQ0M'
      },
      {
        title: 'Prepaid Task Scams: How Fake YouTube Review Jobs Steal Money',
        channelName: 'Cyber Safety Desk',
        thumbnailUrl: 'https://img.youtube.com/vi/y8m2k5v9q4A/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=y8m2k5v9q4A',
        youtubeId: 'y8m2k5v9q4A'
      }
    ]
  },
  {
    id: 'social-media-scams',
    title: 'Social Media Scams',
    category: 'Social Platform Security',
    shortDesc: 'Account takeover phishing, impersonation of friends, and copyright infringement threats.',
    iconName: 'Share2',
    readTime: '4 min read',
    whatIsIt: 'Social media scams exploit popular platforms like Instagram, WhatsApp, Facebook, and LinkedIn. Attackers use compromised accounts, cloned profiles, fake brand giveaways, or false copyright infringement notices to hijack accounts or trick friends.',
    howItWorks: [
      'Copyright DM Scams: A direct message claims your Instagram profile violates intellectual property and will be deleted within 24 hours unless you log in via a link.',
      'Friend Impersonation: An attacker takes over a classmate\'s account and messages contacts asking for urgent emergency money transfers.',
      'Fake Giveaways & Crypto: Compromised verified accounts post links claiming to double cryptocurrency or give away brand new gadgets.'
    ],
    warningSigns: [
      'DMs from accounts claiming to be "Instagram Help Center" or "Meta Support" via direct message (Meta never DMs users for policy violations).',
      'A friend messaging from an existing or duplicate account asking for money urgently without voice verification.',
      'Messages asking you to take a screenshot of a login SMS and send it back to them to "help them regain their account".',
      'Tags in spam posts promoting trading platforms or luxury shopping giveaways.'
    ],
    exampleScenario: {
      title: 'The "Instagram Copyright Infringement" DM',
      context: 'An active student creator received an Instagram message from "@support_meta_notice_99": "Your post violates copyright rules. Fill this appeal form or your account will be permanently deleted: bit.ly/meta-appeal-case".',
      attackerMethod: 'The form captured the user\'s handle and current password, immediately triggering a two-factor bypass attempt.',
      impact: 'The student checked Instagram\'s official settings (Settings > Security > Emails from Instagram), verified no email was sent, and blocked the scam account.'
    },
    protectionTips: [
      'Meta and social media platforms communicate official copyright warnings via official email and inside account settings, never direct messages.',
      'Never forward a screenshot of an SMS containing a security link or code to a friend.',
      'Enable two-factor authentication using an authenticator app (like Google Authenticator) rather than SMS.',
      'If a friend asks for money over social media, always call them on their known personal phone number to verify their voice.'
    ],
    videos: [
      {
        title: 'Instagram Account Hijacking & Copyright DM Traps',
        channelName: 'Jim Browning',
        thumbnailUrl: 'https://img.youtube.com/vi/8m3K7p1j0xQ/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=8m3K7p1j0xQ',
        youtubeId: '8m3K7p1j0xQ'
      },
      {
        title: 'How Scammers Take Over Accounts and Message Your Friends',
        channelName: 'Cyber Awareness Academy',
        thumbnailUrl: 'https://img.youtube.com/vi/a1B2c3D4e5F/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=a1B2c3D4e5F',
        youtubeId: 'a1B2c3D4e5F'
      },
      {
        title: '2FA vs 2SV: Why Authenticator Apps Beat SMS Verification',
        channelName: 'Security Today',
        thumbnailUrl: 'https://img.youtube.com/vi/3B7wP9tQ2vE/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=3B7wP9tQ2vE',
        youtubeId: '3B7wP9tQ2vE'
      }
    ]
  }
];
