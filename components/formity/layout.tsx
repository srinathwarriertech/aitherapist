import type { ReactNode } from "react";

interface LayoutProps {
  heading: string;
  description: string;
  fields: ReactNode[];
  button: ReactNode;
  back?: ReactNode;
  page?: number;
}

export default function Layout({
  heading,
  description,
  fields,
  button,
  back,
  page
}: LayoutProps) {
  return (
    <div className="relative flex h-full w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-md shrink-0">
        {back && <div className="left-4 top-5 py-4">{back}</div>}
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm text-gray-600">
            <span>Step {page} of 8</span>
            <span>{Math.round((page / 8) * 100)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(page / 8) * 100}%` }}
            />
          </div>
        </div>



        <h1 className="mb-3 text-center text-3xl top-100">
          {heading}
        </h1>
        <p className="mb-6 text-center text-base">
          {description}
        </p>
        <div className="scrollbar-hide mb-4 max-h-200 overflow-auto">
          <div className="space-y-12 pt-2 py-12">{fields}</div>
        </div>
        {button}
      </div>
    </div>
  );
}
