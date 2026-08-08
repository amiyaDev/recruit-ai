import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getInterviewById } from "@/constants/dashboard-mock-data";

export async function generateMetadata({
  params,
}: PageProps<"/interviews/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: getInterviewById(id) ? "Interview Practice - RecruitAI" : "Interview - RecruitAI" };
}

const QUESTION_TYPE_META: Record<string, { label: string; icon: string }> = {
  technical: { label: "Technical", icon: "code" },
  behavioral: { label: "Behavioral", icon: "diversity_3" },
};

export default async function InterviewPracticePage({ params }: PageProps<"/interviews/[id]">) {
  const { id } = await params;
  const session = getInterviewById(id);
  if (!session) notFound();

  const currentIndex = Math.max(
    session.questions.findIndex((q) => !q.userAnswer),
    0
  );
  const current = session.questions[currentIndex];
  const total = session.questions.length;
  const typeMeta = QUESTION_TYPE_META[current.questionType];

  return (
    <div className="flex flex-col items-center gap-stack-lg">
      <header className="flex flex-col items-center text-center gap-stack-sm w-full">
        <Link
          href="/interviews"
          className="self-start font-label-sm text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Exit session
        </Link>
        <h2 className="font-headline-md text-headline-md text-primary tracking-tight mt-stack-sm">
          Question {currentIndex + 1} of {total}
        </h2>
        <div className="flex items-center gap-2 bg-muted/60 p-2 rounded-full border border-border">
          {session.questions.map((q, i) => (
            <div
              key={q.id}
              className={`w-8 h-2 rounded-full transition-colors ${
                i <= currentIndex ? "bg-gradient-to-r from-primary to-tertiary-fixed-dim" : "bg-border"
              }`}
            />
          ))}
        </div>
      </header>

      <div className="w-full max-w-4xl">
        <div className="shadcn-card rounded-2xl p-stack-lg flex flex-col gap-stack-lg">
          <div className="flex justify-between items-start">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-tertiary-container/10 border border-tertiary-container/20 text-tertiary font-label-sm text-label-sm gap-2">
              <span className="material-symbols-outlined text-[16px]">{typeMeta.icon}</span>
              {typeMeta.label}
            </span>
            <button
              type="button"
              className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-muted"
              aria-label="Read question aloud"
            >
              <span className="material-symbols-outlined">volume_up</span>
            </button>
          </div>

          <h3 className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-foreground leading-tight tracking-tight">
            &ldquo;{current.questionText}&rdquo;
          </h3>

          <div className="relative">
            <label className="sr-only" htmlFor="answer-input">
              Your answer
            </label>
            <textarea
              id="answer-input"
              rows={6}
              defaultValue={current.userAnswer}
              placeholder="Type your response here or use voice input... (be sure to include context, action, and result)"
              className="w-full bg-muted/40 border border-border rounded-xl p-stack-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                type="button"
                className="p-2.5 rounded-full bg-card text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors shadow-sm border border-border"
                title="Record voice"
              >
                <span className="material-symbols-outlined">mic</span>
              </button>
              <button
                type="button"
                className="p-2.5 rounded-full bg-card text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors shadow-sm border border-border"
                title="AI hint"
              >
                <span className="material-symbols-outlined">lightbulb</span>
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-stack-sm border-t border-border">
            <button
              type="button"
              disabled={currentIndex === 0}
              className="text-muted-foreground hover:text-primary disabled:opacity-40 disabled:pointer-events-none transition-colors font-label-sm text-sm uppercase tracking-wider flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-muted"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Previous
            </button>
            {currentIndex === total - 1 ? (
              <Link
                href={`/interviews/${session.id}/results`}
                className="px-8 py-3.5 rounded-xl shadcn-btn-primary font-label-sm text-sm uppercase tracking-widest flex items-center gap-3 font-bold"
              >
                Finish &amp; evaluate
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
              </Link>
            ) : (
              <button
                type="button"
                className="px-8 py-3.5 rounded-xl shadcn-btn-primary font-label-sm text-sm uppercase tracking-widest flex items-center gap-3 font-bold"
              >
                Next question
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-stack-lg text-center text-muted-foreground font-label-sm text-sm flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[16px]">timer</span>
          Suggested time: 3-5 minutes
        </div>
      </div>
    </div>
  );
}
