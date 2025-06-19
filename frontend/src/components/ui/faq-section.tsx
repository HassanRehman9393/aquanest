"use client";

import { PhoneCall, Droplets } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs?: FAQItem[];
}

function FAQ({ faqs }: FAQProps) {
  const defaultFAQs: FAQItem[] = [
    {
      question: "What are your delivery hours?",
      answer: "We deliver Monday through Sunday, 8AM to 8PM. Same-day delivery is available for orders placed before 2PM."
    },
    {
      question: "How do I track my order?",
      answer: "You'll receive a tracking link via SMS and email once your order is dispatched. You can also call our customer service for real-time updates."
    },
    {
      question: "What if I'm not satisfied with my order?",
      answer: "We offer a 100% satisfaction guarantee. If you're not happy with your order, contact us within 24 hours for a full refund or replacement."
    },
    {
      question: "Do you offer subscription services?",
      answer: "Yes! We offer flexible subscription plans with discounts up to 20%. You can modify or cancel your subscription anytime."
    },
    {
      question: "What water purification methods do you use?",
      answer: "We use advanced multi-stage filtration including reverse osmosis, UV sterilization, and mineral enhancement to ensure the highest quality water."
    },
    {
      question: "How do I schedule recurring deliveries?",
      answer: "You can easily set up recurring deliveries through our website or mobile app. Choose your preferred frequency and we'll handle the rest automatically."
    },
    {
      question: "What sizes and types of water do you offer?",
      answer: "We offer various sizes from 1-gallon to 5-gallon bottles, including purified water, alkaline water, and spring water options."
    },
    {
      question: "Is there a minimum order requirement?",
      answer: "No minimum order required! Whether you need one bottle or fifty, we're happy to deliver. Bulk orders qualify for additional discounts."
    }
  ];

  const faqData = faqs || defaultFAQs;
  return (
    <div className="w-full py-20 lg:py-32 bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="flex gap-8 flex-col">
            <div className="flex gap-6 flex-col">
              <div>
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700">
                  <Droplets className="w-3 h-3 mr-1" />
                  FAQ
                </Badge>
              </div>
              <div className="flex gap-4 flex-col">
                <h4 className="text-3xl md:text-4xl lg:text-5xl tracking-tight max-w-xl text-left font-bold text-gray-900 dark:text-white">
                  Everything you need to know about{" "}
                  <span className="text-blue-600 dark:text-blue-400">AquaNest</span>
                </h4>
                <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-normal text-gray-600 dark:text-gray-300 text-left">
                  We're here to make your water delivery experience as smooth as possible. 
                  Find answers to the most common questions about our services, delivery process, 
                  and water quality standards.
                </p>
              </div>
              <div className="pt-4">
                <Button 
                  className="gap-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
                  variant="default"
                  size="lg"
                >
                  <PhoneCall className="w-4 h-4" />
                  Any questions? Reach out
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={"index-" + index}
                  className="border-b border-gray-200 dark:border-slate-700"
                >
                  <AccordionTrigger className="text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-gray-900 dark:text-white font-semibold py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}

export { FAQ };
