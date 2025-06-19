import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ProductBentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[28rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className,
      )}
    >
      {children}
    </div>
  );
};

const ProductBentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  price,
  originalPrice,
  category,
  size,
}: {
  name: string;
  className?: string;
  background: ReactNode;
  Icon: any;
  description: string;
  href?: string;
  cta: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  size?: string;
}) => (  <div
    key={name}
    className={cn(
      "group relative col-span-1 flex flex-col overflow-hidden rounded-xl",
      // light styles - AquaNest theme
      "bg-white [box-shadow:0_0_0_1px_rgba(59,130,246,.08),0_2px_4px_rgba(59,130,246,.1),0_12px_24px_rgba(59,130,246,.1)]",
      // dark styles - AquaNest theme
      "transform-gpu dark:bg-slate-900 dark:[border:1px_solid_rgba(59,130,246,.2)] dark:[box-shadow:0_-20px_80px_-20px_#3b82f61f_inset]",
      "transition-all duration-300 hover:scale-105",
      className,
    )}
  >
    {/* Large Background Image Area */}
    <div className="relative h-64 overflow-hidden">
      {background}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      
      {/* Category Badge */}
      <div className="absolute top-3 right-3">
        <span className="text-xs font-medium text-white bg-blue-600/80 backdrop-blur-sm px-3 py-1 rounded-full">
          {category}
        </span>
      </div>

      {/* Icon in top left */}
      <div className="absolute top-3 left-3">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>

    {/* Compact Content Area */}
    <div className="flex flex-col justify-between flex-1 p-4">
      <div className="space-y-2">
        {/* Title and Size */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
            {name}
          </h3>
          {size && (
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {size}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {description}
        </p>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            ${price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Sticky CTA Button - Always Visible */}
      <div className="mt-4">
        <Button 
          size="sm" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
        >
          {cta}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>

    {/* Hover overlay */}
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-blue-50/10 group-hover:dark:bg-blue-900/5" />
  </div>
);

export { ProductBentoCard, ProductBentoGrid };
