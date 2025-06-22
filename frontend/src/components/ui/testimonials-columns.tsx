"use client";
import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
  rating: number;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>      <motion.div
        animate={{
          y: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role, rating }, i) => (
                <div 
                  className="p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30 shadow-lg shadow-blue-500/10 dark:shadow-blue-400/5 max-w-xs w-full bg-white dark:bg-slate-900" 
                  key={i}
                >
                  <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                    "{text}"
                  </div>
                  
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className={`h-4 w-4 ${
                          starIndex < rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>                  <div className="flex items-center gap-3">
                    <Image
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover border-2 border-blue-100 dark:border-blue-800"
                    />
                    <div className="flex flex-col">
                      <div className="font-semibold tracking-tight leading-5 text-gray-900 dark:text-white">
                        {name}
                      </div>
                      <div className="leading-5 text-blue-600 dark:text-blue-400 tracking-tight text-sm font-medium">
                        {role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
