import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  href,
}: {
  name: string;
  className: string;
  background: ReactNode;
  href: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl cursor-pointer",
      // light styles - AquaNest theme
      "bg-white [box-shadow:0_0_0_1px_rgba(59,130,246,.08),0_2px_4px_rgba(59,130,246,.1),0_12px_24px_rgba(59,130,246,.1)]",
      // dark styles - AquaNest theme  
      "transform-gpu dark:bg-slate-900 dark:[border:1px_solid_rgba(59,130,246,.2)] dark:[box-shadow:0_-20px_80px_-20px_#3b82f61f_inset]",
      "transition-all duration-300 hover:scale-105 hover:shadow-xl",
      className,
    )}
    onClick={() => window.location.href = href}
  >
    <div className="relative w-full h-full overflow-hidden">
      {background}
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300" />
      
      {/* Product name overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-2xl font-bold mb-2 transform transition-transform duration-300 group-hover:translate-y-[-8px]">
          {name}
        </h3>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center text-blue-200">
            <span className="text-sm">Browse Products</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export { BentoCard, BentoGrid };
