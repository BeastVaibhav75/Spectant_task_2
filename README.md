# Intern Assignment: Build, Break & Explain

## Project Overview
This project is a simple **Feedback Form System** consisting of a Next.js frontend and an Express backend. It was built as part of an intern assignment to evaluate full-stack development skills, testing mindset, and architectural decision-making.

### Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, Axios
- **Backend**: Node.js, Express, `express-rate-limit`
- **Storage**: Local JSON file (`feedback.json`)

---

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Backend Setup
```bash
cd backend
npm install
node index.js
```
The server will run on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:3000`.

---

## 1. Break Your Own System: Failure Analysis
Here are 10 ways this system could fail or be compromised:

1.  **Storage Race Conditions**: Since it uses a plain JSON file, concurrent write requests could lead to data corruption or lost entries.
2.  **Memory Exhaustion**: If 10,000+ users submit large feedback strings, the JSON file could grow too large to be read/written synchronously.
3.  **Client-Side Validation Bypass**: Malicious users can bypass the UI and send invalid JSON or massive payloads directly to the `/feedback` endpoint.
4.  **No User Authentication**: Anyone can submit feedback, leading to potential spam from anonymous bots.
5.  **Sensitive Data Exposure**: If the `feedback.json` file is accidentally served statically or committed to git, user emails and feedback become public.
6.  **Rate Limit Evasion**: Attackers could use distributed proxies or VPNs to bypass the IP-based rate limiting.
7.  **Server Crashes**: Uncaught exceptions during file I/O could crash the Node.js process.
8.  **CORS Misconfiguration**: Overly permissive CORS settings (`*`) could allow unauthorized domains to interact with the API.
9.  **No Content Sanitization**: Feedback text isn't sanitized for XSS, which could be dangerous if displayed in an admin dashboard later.
10. **Dependency Vulnerabilities**: Outdated packages in `node_modules` could contain known security flaws.

---

## 2. Improved Implementation
I have implemented the following top 3 fixes:

### Fix 1: Rate Limiting
- **Problem**: Susceptibility to spam and DoS attacks.
- **Solution**: Added `express-rate-limit` to restrict each IP to 5 submissions per 15 minutes.
- **Why**: Protects server resources and prevents the database from being flooded with junk data.

### Fix 2: Persistent Storage
- **Problem**: Data loss whenever the server restarted (initial in-memory array).
- **Solution**: Implemented a file-based storage system using `feedback.json`.
- **Why**: Essential for any real-world application to ensure data survives process restarts.

### Fix 3: Strict Input Validation & Length Limits
- **Problem**: Large payloads or invalid data types could crash the system.
- **Solution**: Added strict type checks and character limits (100 for Name, 2000 for Feedback) on the backend.
- **Why**: Ensures predictable data structures and prevents resource exhaustion from massive text inputs.

---

## 3. Explanation of Approach

### Design Philosophy
I designed the system to be **simple yet robust**. I chose a modern tech stack (Next.js + Tailwind) for the frontend to provide a high-quality user experience while keeping the backend lightweight with Express.

### Trade-offs
- **JSON vs Database**: I chose a JSON file over a database like PostgreSQL for this task to ensure a "zero-config" setup for the reviewer.
- **Manual Validation vs Libraries**: I used native JS checks and Regex for validation to minimize dependency overhead for a small feature.

### Future Improvements (Given more time)
- **Database Integration**: Migrate to MongoDB or PostgreSQL for better concurrency handling.
- **Admin Dashboard**: Build a protected route to view and manage feedback entries.
- **Automated Testing**: Add Jest and Playwright tests for unit and E2E coverage.

---

## 4. Scale Thinking (10,000+ Users)
If 10,000 users were to use this system simultaneously:

1.  **File System Bottleneck**: The `fs.writeFileSync` operation is blocking and would slow down the entire server. A dedicated database would be mandatory.
2.  **Concurrency Issues**: Multiple users writing to the same file at once would result in "permission denied" errors or data loss.
3.  **Horizontal Scaling**: A single Node.js instance wouldn't suffice. We would need a Load Balancer and multiple app instances.
4.  **Distributed Rate Limiting**: The current rate limiter is local. We would need to move the rate-limit state to **Redis** so it's shared across all server instances.
