# **AI-Infused Interview System – Documentation**

## **1. Project Overview**

The **AI-Infused Interview System** is a full-stack web application that streamlines the hiring process using **AI-powered asynchronous interviews**.

- **Recruiters** can post jobs, view applications, and review AI-generated interview reports.
- **Candidates** can browse jobs, apply with resumes, attend AI chatbot interviews, and access their reports.

The AI interviewer evaluates candidate responses based on job descriptions and resumes, then generates a structured interview report.

---

## **2. Features**

### **Candidate**

- Signup/Login with role selection (`candidate`)
- Browse and apply for jobs
- Upload and manage resumes
- Attend **AI-powered asynchronous interviews**
- View AI-generated reports
- Dashboard for application tracking
- Profile management

### **Recruiter**

- Signup/Login with role selection (`recruiter`)
- Post, update, and delete jobs
- View job applications
- Access candidate AI interview reports
- Manage applicant statuses (shortlist/reject)
- Dashboard for job and candidate management
- Profile management

---

## **3. Tech Stack**

### **Frontend**

- Next.js (App Router)
- Tailwind CSS
- Axios for API calls

### **Backend**

- Express.js
- PostgreSQL (via Prisma ORM)
- Redis for DB-level caching
- OpenAI GPT-4 Turbo for AI Interviews & Reports
- JWT authentication

### **Storage**

- AWS S3 (for resumes)

---

## **4. Database Design**

Instead of text tables, the **official ERD diagram** is available here:

📌 [ERD Diagram (PNG)](https://github.com/KoustavDev/ai-interview-system/tree/main/Frontend/public/images/ERD.png)

This diagram shows all relationships between `Users`, `Jobs`, `Applications`, `AIInterviews`, `AIChatMessages`, and `AIReports`.

---

## **5. API Documentation**

All backend endpoints are documented in Postman:

📌 [Postman API Documentation](https://documenter.getpostman.com/view/41937939/2sB3HtGxBq)

The Postman docs include:

- Authentication endpoints
- Candidate APIs (Jobs, Applications, Interviews, Reports)
- Recruiter APIs (Jobs, Applications, Reports)
- Request/response examples

---

## **6. AI Integration**

The system uses GPT-4 Turbo for:

1. **Asynchronous Chat Interviews** – Context-aware Q\&A based on resumes and job descriptions.
2. **Interview Reports** – Scoring (0–100), candidate evaluation, and summary.

AI conversation design ensures:

- One question at a time
- Professional tone
- Concise questions (<50 words)
- Completion signal `[INTERVIEW_COMPLETE]`

---

## **7. Caching Strategy**

- **Redis** is used for DB-level caching.
- **Cache TTL**:

  - Jobs: 10 minutes
  - Profiles: 15 minutes

- Cache is invalidated on updates/deletes.

---

## **8. Frontend Routes**

### **Candidate**

- `/dashboard` → Browse jobs
- `/jobs/:id` → Job details
- `/applications` → Applications list
- `/interviews/:id` → AI Interview session
- `/reports/:id` → AI report
- `/profile` → Profile management

### **Recruiter**

- `/dashboard` → Job and candidate stats
- `/jobs` → Recruiter’s job list
- `/jobs/post` → Post a job
- `/applications/:jobId` → Job applications
- `/reports/:id` → AI reports
- `/profile` → Recruiter profile

---

## **9. Security**

- JWT authentication
- Role-based access control
- Bcrypt password hashing
- Input validation on all endpoints

---

## **10. Deployment**

- **Frontend**: Vercel
- **Backend**: AWS EC2
- **Database**: Neon DB
- **Cache**: Aivel redis
- **Storage**: AWS S3

---
