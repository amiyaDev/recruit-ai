import type {
  AtsScore,
  ChatSession,
  InterviewSession,
  Job,
  Resume,
  UserProfile,
} from "@/types/dashboard.types";

export const MOCK_USER: UserProfile = {
  id: "u-1001",
  name: "Sanket Mukherjee",
  email: "sanketmukherjee189@gmail.com",
  role: "user",
  isActive: true,
  isVerified: true,
  createdAt: "2026-05-12T09:00:00Z",
};

export const MOCK_RESUMES: Resume[] = [
  {
    id: "res-1",
    filename: "Sanket_Mukherjee_Senior_Frontend.pdf",
    fileType: "pdf",
    status: "parsed",
    fileSizeLabel: "412 KB",
    parsedData: {
      email: "sanketmukherjee189@gmail.com",
      phone: "+91 98765 43210",
      skills: [
        "React",
        "TypeScript",
        "Next.js",
        "Node.js",
        "GraphQL",
        "Tailwind CSS",
        "PostgreSQL",
        "Docker",
      ],
    },
    rawTextExcerpt:
      "Senior Frontend Engineer with 6+ years building scalable web applications. Led migration of a legacy Angular app to Next.js, cutting bundle size by 38%. Managed a team of 5 engineers, increasing deployment frequency by 40%...",
    createdAt: "2026-08-01T10:15:00Z",
    updatedAt: "2026-08-01T10:16:20Z",
  },
  {
    id: "res-2",
    filename: "Sanket_Resume_v2.docx",
    fileType: "docx",
    status: "parsed",
    fileSizeLabel: "268 KB",
    parsedData: {
      email: "sanketmukherjee189@gmail.com",
      phone: "+91 98765 43210",
      skills: ["Python", "FastAPI", "SQLAlchemy", "Redis", "AWS", "Kubernetes"],
    },
    rawTextExcerpt:
      "Backend-leaning full stack developer focused on Python microservices. Built an async job pipeline processing 10K+ documents/day...",
    createdAt: "2026-07-22T14:40:00Z",
    updatedAt: "2026-07-22T14:41:05Z",
  },
  {
    id: "res-3",
    filename: "Old_Resume_Draft.pdf",
    fileType: "pdf",
    status: "failed",
    fileSizeLabel: "1.1 MB",
    createdAt: "2026-06-30T08:05:00Z",
    updatedAt: "2026-06-30T08:05:40Z",
  },
];

export const MOCK_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Senior Frontend Engineer",
    company: "Northwind Labs",
    status: "ready",
    description:
      "We're looking for a Senior Frontend Engineer to lead our design system and web platform team. You'll own the React/Next.js architecture, mentor mid-level engineers, and partner with product on our GraphQL API layer. Experience with Kubernetes-based deployment pipelines and CI/CD is a strong plus.",
    extractedKeywords: [
      "React",
      "Next.js",
      "TypeScript",
      "GraphQL",
      "Kubernetes",
      "CI/CD Pipelines",
      "Project Management",
      "Design Systems",
    ],
    createdAt: "2026-07-28T11:00:00Z",
  },
  {
    id: "job-2",
    title: "Backend Engineer, Platform",
    company: "Vertex Cloud",
    status: "ready",
    description:
      "Own core platform services written in Python/FastAPI, backed by PostgreSQL and Redis. You'll design async pipelines, work closely with SRE on AWS infrastructure, and improve our vector search stack.",
    extractedKeywords: ["Python", "FastAPI", "PostgreSQL", "Redis", "AWS", "Vector Search"],
    createdAt: "2026-07-15T09:30:00Z",
  },
  {
    id: "job-3",
    title: "Full Stack Developer",
    company: "Bright Path Health",
    status: "processing",
    description:
      "Join a small team building patient-facing tools. Full stack role spanning a Next.js frontend and a Django backend, with a focus on accessibility and HIPAA-compliant data handling.",
    extractedKeywords: [],
    createdAt: "2026-08-05T16:20:00Z",
  },
];

export const MOCK_ATS_SCORES: AtsScore[] = [
  {
    id: "ats-1",
    resumeId: "res-1",
    jobId: "job-1",
    score: 92,
    missingKeywords: ["Kubernetes", "Project Management", "CI/CD Pipelines"],
    suggestions: [
      {
        title: "Quantify results",
        detail:
          'Add metrics to your recent role. Instead of "Improved page load time", use "Reduced page load time by 40%, lifting conversion 15%."',
        icon: "bar_chart",
      },
      {
        title: "Add a tech-stack section",
        detail:
          "Group your skills into categories (Languages, Frameworks, Tools) so ATS parsers can categorize your expertise more reliably.",
        icon: "layers",
      },
      {
        title: "Surface leadership signal",
        detail:
          'The job description emphasizes mentoring. Call out your "managed a team of 5 engineers" line higher up in the experience section.',
        icon: "groups",
      },
    ],
    createdAt: "2026-08-06T12:00:00Z",
  },
  {
    id: "ats-2",
    resumeId: "res-2",
    jobId: "job-2",
    score: 78,
    missingKeywords: ["Vector Search"],
    suggestions: [
      {
        title: "Mention vector search exposure",
        detail:
          "If you've touched Qdrant, pgvector, or similar, add a line — it's an explicit keyword in this job description.",
        icon: "manage_search",
      },
      {
        title: "Lead with async pipeline work",
        detail: "Your document-pipeline bullet is a strong match — move it earlier in the summary.",
        icon: "bolt",
      },
    ],
    createdAt: "2026-07-30T09:12:00Z",
  },
  {
    id: "ats-3",
    resumeId: "res-1",
    jobId: "job-2",
    score: 54,
    missingKeywords: ["Python", "FastAPI", "PostgreSQL", "Redis", "AWS"],
    suggestions: [
      {
        title: "This resume is a weak match",
        detail:
          "Your frontend-focused resume shares little overlap with this backend role — consider using res-2 instead, or tailor a backend-leaning version.",
        icon: "warning",
      },
    ],
    createdAt: "2026-07-18T17:45:00Z",
  },
];

export const MOCK_INTERVIEWS: InterviewSession[] = [
  {
    id: "int-1",
    resumeId: "res-1",
    jobId: "job-1",
    difficulty: "medium",
    status: "in_progress",
    createdAt: "2026-08-07T18:00:00Z",
    questions: [
      {
        id: "q-1",
        sessionId: "int-1",
        questionType: "behavioral",
        questionText:
          "Tell me about a time you had to push back on a product decision for technical reasons. How did you handle it?",
        userAnswer:
          "On a previous project, product wanted real-time sync without a queue. I proposed a phased rollout with an interim polling solution to de-risk it, and we shipped on time.",
      },
      {
        id: "q-2",
        sessionId: "int-1",
        questionType: "technical",
        questionText:
          "Tell me about a time you solved a complex technical challenge. How did you approach the problem and what was the outcome?",
      },
      {
        id: "q-3",
        sessionId: "int-1",
        questionType: "technical",
        questionText: "How would you design a component library that needs to support both light and dark themes across five product teams?",
      },
      {
        id: "q-4",
        sessionId: "int-1",
        questionType: "behavioral",
        questionText: "Describe a situation where you disagreed with a teammate's code review feedback. What did you do?",
      },
      {
        id: "q-5",
        sessionId: "int-1",
        questionType: "technical",
        questionText: "What tradeoffs would you consider when choosing between server components and client components in a Next.js app?",
      },
    ],
  },
  {
    id: "int-2",
    resumeId: "res-2",
    jobId: "job-2",
    difficulty: "hard",
    status: "completed",
    overallScore: 81,
    overallSummary:
      "Strong technical depth on async systems and clear communication. Could sharpen answers around failure-mode tradeoffs and give more concrete metrics.",
    createdAt: "2026-07-20T13:00:00Z",
    questions: [
      {
        id: "q-6",
        sessionId: "int-2",
        questionType: "technical",
        questionText: "Walk me through how you'd design a rate limiter for a public API.",
        userAnswer: "I'd use a token bucket backed by Redis, keyed per API key, with a sliding window fallback for burst traffic.",
        aiFeedback: "Solid default choice. Would have liked a note on clock-drift handling across Redis replicas.",
        score: 85,
      },
      {
        id: "q-7",
        sessionId: "int-2",
        questionType: "behavioral",
        questionText: "Tell me about a production incident you handled.",
        userAnswer: "A queue backlog caused stale data for ~20 minutes; I added a lag alert and a dead-letter queue afterward.",
        aiFeedback: "Good root-cause instinct. Add the user-facing impact number next time for stronger context.",
        score: 77,
      },
    ],
  },
];

export const MOCK_CHATS: ChatSession[] = [
  {
    id: "chat-1",
    resumeId: "res-1",
    title: "Tailoring resume for Northwind Labs",
    createdAt: "2026-08-06T15:00:00Z",
    messages: [
      {
        id: "m-1",
        sessionId: "chat-1",
        role: "assistant",
        content:
          "Hello! I've analyzed the Senior Frontend resume you uploaded. It looks solid, especially the microservices migration work. How can I help you tailor it further?",
        createdAt: "2026-08-06T15:00:05Z",
      },
      {
        id: "m-2",
        sessionId: "chat-1",
        role: "user",
        content:
          "Let's highlight the leadership metrics. I managed a team of 5 engineers but it doesn't stand out enough right now.",
        createdAt: "2026-08-06T15:01:00Z",
      },
      {
        id: "m-3",
        sessionId: "chat-1",
        role: "assistant",
        content:
          "Great idea — quantifying leadership impact matters a lot for senior roles. Here are a few directions we could take that bullet.",
        createdAt: "2026-08-06T15:01:40Z",
        suggestionChips: ["Focus on team velocity", "Focus on mentorship", "Focus on project delivery"],
      },
    ],
  },
  {
    id: "chat-2",
    resumeId: "res-2",
    title: "Should I learn Go or stay deep in Python?",
    createdAt: "2026-07-25T09:00:00Z",
    messages: [
      {
        id: "m-4",
        sessionId: "chat-2",
        role: "user",
        content: "Given my backend resume, does it make sense to pick up Go, or double down on Python?",
        createdAt: "2026-07-25T09:00:10Z",
      },
      {
        id: "m-5",
        sessionId: "chat-2",
        role: "assistant",
        content:
          "Your resume already shows strong FastAPI/async depth — that's transferable. Go is worth it if you're targeting infra-heavy roles; otherwise, deepening distributed-systems fundamentals in Python will compound faster for you right now.",
        createdAt: "2026-07-25T09:00:50Z",
      },
    ],
  },
];

export function getResumeById(id: string) {
  return MOCK_RESUMES.find((r) => r.id === id);
}

export function getJobById(id: string) {
  return MOCK_JOBS.find((j) => j.id === id);
}

export function getAtsScoreById(id: string) {
  return MOCK_ATS_SCORES.find((s) => s.id === id);
}

export function getInterviewById(id: string) {
  return MOCK_INTERVIEWS.find((i) => i.id === id);
}

export function getChatById(id: string) {
  return MOCK_CHATS.find((c) => c.id === id);
}
