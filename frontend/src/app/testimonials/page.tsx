'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TestimonialsColumn } from '@/components/ui/testimonials-columns';
import { Droplets, Award, Users } from 'lucide-react';

const testimonials = [
  {
    text: "AquaNest has completely transformed our office hydration experience. The water quality is exceptional and the delivery service is always on time. Our team feels more energized and productive!",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    name: "Sarah Johnson",
    role: "Office Manager",
    rating: 5,
  },
  {
    text: "I've been using AquaNest for my home for over a year now. The taste is incredible and knowing it's purified gives me peace of mind for my family. Highly recommend!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "Michael Chen",
    role: "Family Dad",
    rating: 5,
  },
  {
    text: "The convenience of AquaNest's delivery service is unmatched. Always fresh, always pure, and the customer service team is fantastic. Best water delivery in the city!",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    name: "Emma Wilson",
    role: "Busy Professional",
    rating: 5,
  },
  {
    text: "As a restaurant owner, water quality is crucial for our business. AquaNest provides consistently pure water that enhances the taste of our beverages and cooking.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    name: "David Rodriguez",
    role: "Restaurant Owner",
    rating: 5,
  },
  {
    text: "The alkaline water from AquaNest has made a noticeable difference in my health and energy levels. The delivery team is professional and the bottles are always clean.",
    image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
    name: "Jessica Martinez",
    role: "Fitness Enthusiast",
    rating: 4,
  },
  {
    text: "AquaNest's customer service is outstanding. When I had a scheduling issue, they resolved it immediately. The water quality is top-notch and reasonably priced.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    name: "Robert Thompson",
    role: "Small Business Owner",
    rating: 5,
  },
  {
    text: "I love the eco-friendly approach of AquaNest. The reusable bottles and sustainable practices make me feel good about my choice. Plus, the water tastes amazing!",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    name: "Lisa Anderson",
    role: "Environmental Advocate",
    rating: 5,
  },
  {
    text: "Our gym members constantly compliment the water quality. AquaNest has helped us maintain high standards and keep our clients happy and hydrated.",
    image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    name: "Mark Stevens",
    role: "Gym Owner",
    rating: 4,
  },
  {
    text: "The subscription service is so convenient! I never have to worry about running out of water. AquaNest has simplified my life while providing excellent quality.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
    name: "Amanda Foster",
    role: "Working Mother",
    rating: 5,
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export default function TestimonialsPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-blue-900/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div variants={fadeInUp} className="flex justify-center mb-6">
              <div className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Customer Testimonials
              </div>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              What Our Customers Say
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12"
            >
              Discover why thousands of customers trust AquaNest for their premium water delivery needs. Real stories from real people.
            </motion.p>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
            >
              <div className="text-center">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">10,000+</div>
                  <div className="text-gray-600 dark:text-gray-300">Happy Customers</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <Award className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">4.9/5</div>
                  <div className="text-gray-600 dark:text-gray-300">Average Rating</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <Droplets className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">1M+</div>
                  <div className="text-gray-600 dark:text-gray-300">Gallons Delivered</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Columns */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[600px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
          </div>        </div>
      </section>
    </div>
  );
}
