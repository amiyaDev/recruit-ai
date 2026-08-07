"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type ScrollRevealProps<T extends React.ElementType> = {
  as?: T;
  children: React.ReactNode;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function ScrollReveal<T extends React.ElementType = "div">({
  as,
  children,
  className,
  ...props
}: ScrollRevealProps<T>) {
  const Tag = (as || "div") as React.ElementType;
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn("scroll-reveal", visible && "visible", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
