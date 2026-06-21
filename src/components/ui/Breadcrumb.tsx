import Link from "next/link";
import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export function Breadcrumb({ items, separator = "/", className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex text-sm font-medium ${className}`}>
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !item.active && !isLast ? (
                <Link
                  href={item.href}
                  className="text-slate-500 hover:text-[#2563EB] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={`${item.active || isLast ? "text-slate-900 font-bold" : "text-slate-500"}`}>
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className="text-slate-400 select-none">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Icon variant for separator
export function ChevronSeparator() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
