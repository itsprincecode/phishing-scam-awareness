# 🛡️ CyberAware — Phishing, Scam & Fraud Awareness Platform

> A modern cybersecurity awareness platform designed to help users identify phishing, online scams, and digital fraud through interactive learning, real-world detection scenarios, quizzes, and practical safety guidance.

---

## 📌 About the Project

**CyberAware** is a College Extension/Community Engagement Project (CEP) focused on increasing awareness about common digital threats such as phishing, online scams, social engineering, fake websites, malicious links, OTP fraud, job scams, banking scams, and social media fraud.

The platform provides simple and interactive educational content instead of overwhelming users with technical cybersecurity concepts.

Users can:

- Learn about common cyber threats
- Identify suspicious messages and online scenarios
- Test their cybersecurity awareness
- Receive practical safety guidance
- Save their quiz and detection results
- Understand what to do after encountering a suspicious activity

The primary goal is to encourage users to **think before they click, share, pay, or trust**.

---

## 🎯 Project Objectives

The project aims to:

- Increase awareness of phishing, scams, and digital fraud
- Teach users how to recognize common warning signs
- Demonstrate real-world scam scenarios
- Improve users' ability to identify suspicious online activities
- Encourage safer digital habits
- Provide practical steps for responding to suspicious activity
- Promote responsible handling of personal and financial information
- Demonstrate the importance of cybersecurity awareness in everyday digital life

---

## ✨ Key Features

### 📚 Learn

Explore easy-to-understand information about:

- Phishing
- Online Scams
- Digital Fraud
- Social Engineering
- Fake Websites
- Malicious Links
- OTP & Banking Scams
- Job & Internship Scams
- Social Media Scams

Each topic explains:

- What it is
- How it works
- Common warning signs
- Example scenarios
- How to stay protected

---

### 🔍 Detect

An interactive scenario-based module that helps users identify suspicious content.

Users analyze realistic examples such as:

- Fake bank messages
- Prize and lottery scams
- Fake job opportunities
- Account suspension messages
- Suspicious login links
- Urgent payment requests

Users classify each scenario as:

- Safe
- Suspicious
- Scam

The platform then provides an explanation and highlights the warning signs.

---

### 🧠 Cybersecurity Quiz

Test your knowledge through an interactive awareness quiz.

Topics include:

- Phishing
- Scam messages
- OTP fraud
- Password safety
- Social engineering
- QR scams
- Job scams
- Banking scams
- Suspicious links

After completing the quiz, users receive:

- Total score
- Percentage
- Correct and incorrect answers
- Explanations
- Awareness feedback

---

### 🛡️ Safety Center

A practical collection of safety guidelines covering:

- What to do when you receive a suspicious message
- How to identify suspicious links
- What to do after clicking a suspicious link
- What to do if sensitive information was shared
- What to do after a financial fraud incident
- Basic account protection practices

---

### 📊 Result Tracking

The platform can store basic learning activity and assessment results using a database.

Stored information may include:

- Participant name
- Email
- Quiz score
- Detection score
- Activity type
- Completion timestamp

The application is designed to avoid collecting unnecessary sensitive information.

---

## 🧩 Website Modules

| Module | Description |
|---|---|
| 🏠 Home | Introduction and quick access to the platform |
| 📚 Learn | Educational cybersecurity awareness content |
| 🔍 Detect | Interactive phishing and scam detection scenarios |
| 🧠 Quiz | Cybersecurity awareness assessment |
| 🛡️ Safety | Practical safety and response guidance |
| ℹ️ About | Project information and objectives |

---

## 🛠️ Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

### Backend & Database

- Supabase
- PostgreSQL

### Development Tools

- Git
- GitHub
- Visual Studio Code
- npm

---

## 🎨 Design

CyberAware follows a modern cybersecurity-inspired visual design.

### Design Principles

- Minimal interface
- Clean typography
- Strong visual hierarchy
- Responsive layouts
- Accessible contrast
- Subtle animations
- Professional cybersecurity aesthetic
- Mobile-first design

### Color Direction

The visual theme primarily uses:

- Deep Navy
- Cyber Blue
- Cyan / Teal
- White
- Soft Gray
- Subtle Warning Orange
- Controlled Red and Green indicators

The design avoids excessive neon effects and unnecessary visual clutter.

---

## 📱 Responsive Design

CyberAware is designed to work across different screen sizes.

Supported devices include:

- 📱 Mobile phones
- 📲 Tablets
- 💻 Laptops
- 🖥️ Desktop computers

The interface adapts navigation, cards, quizzes, forms, and educational content according to the available screen size.

---

## 🗄️ Database

The project uses **Supabase PostgreSQL** for storing non-sensitive project data.

### Main Tables

#### `users`

Stores basic participant information.

| Field | Description |
|---|---|
| `id` | Unique participant identifier |
| `name` | Participant name |
| `email` | Participant email |
| `created_at` | Registration timestamp |

#### `quiz_results`

Stores quiz performance.

| Field | Description |
|---|---|
| `id` | Unique result identifier |
| `user_id` | Participant reference |
| `score` | Obtained score |
| `total_questions` | Total questions |
| `percentage` | Score percentage |
| `completed_at` | Completion timestamp |

#### `detection_results`

Stores phishing/scam detection performance.

| Field | Description |
|---|---|
| `id` | Unique result identifier |
| `user_id` | Participant reference |
| `score` | Obtained score |
| `total_scenarios` | Number of scenarios |
| `percentage` | Detection percentage |
| `completed_at` | Completion timestamp |

#### `activity_logs`

Stores basic learning activity.

| Field | Description |
|---|---|
| `id` | Activity identifier |
| `user_id` | Participant reference |
| `activity_type` | Type of activity |
| `score` | Optional activity score |
| `created_at` | Activity timestamp |

---

## 🔐 Privacy & Security

CyberAware follows a minimal-data approach.

The application should **never collect or store** sensitive information such as:

- Passwords
- OTPs
- UPI PINs
- Card numbers
- Bank account credentials
- Aadhaar numbers
- Authentication secrets
- Other unnecessary financial information

Only information required for educational activity and project-level result tracking should be stored.

Database access should use appropriate security policies and Row Level Security (RLS).

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git

---

### 1. Clone the Repository

```bash
git clone <your-repository-url>