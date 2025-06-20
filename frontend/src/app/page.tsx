'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Droplets, Clock, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CTASection } from '@/components/ui/cta-with-rectangle';

export default function HomePage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
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

  const features = [
    {
      icon: <Droplets className="h-8 w-8 text-blue-500 dark:text-blue-400" />,
      title: "Pure & Clean",
      description: "Our water goes through a 7-stage purification process ensuring 99.9% purity."
    },
    {
      icon: <Clock className="h-8 w-8 text-green-500 dark:text-green-400" />,
      title: "Fast Delivery",
      description: "Same-day delivery available. Get your water when you need it most."
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-500 dark:text-purple-400" />,
      title: "Quality Guaranteed",
      description: "100% satisfaction guarantee. We stand behind our water quality."
    },
    {
      icon: <Truck className="h-8 w-8 text-orange-500 dark:text-orange-400" />,
      title: "Reliable Service",
      description: "Consistent delivery schedule. Never run out of clean water again."
    }
  ];

  const benefits = [
    "Free delivery on orders over $50",
    "Flexible subscription plans",
    "24/7 customer support",
    "Eco-friendly packaging",
    "Quality testing reports"
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900/20 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero_image.jpg')] bg-cover bg-center opacity-10 dark:opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
              >
                Pure Water
                <span className="text-blue-600 dark:text-blue-400"> Delivered</span>
                <br />
                Fresh to Your Door
              </motion.h1>
              
              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                Experience the convenience of premium water delivery. Clean, refreshing, 
                and pure water delivered right to your doorstep whenever you need it.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-lg px-8 py-3">
                  Order Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800">
                  View Products
                </Button>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                  <span>Same Day Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                  <span>Quality Guaranteed</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
                <div className="relative z-10">
                <img
                  src="/bottles.webp" 
                  alt="Premium water bottles collection"
                  className="rounded-2xl shadow-2xl object-cover w-full h-96"
                />
                </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 dark:from-blue-600 dark:to-indigo-700 rounded-2xl transform rotate-3 scale-105 opacity-20 dark:opacity-30"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Why Choose AquaNest?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              We're committed to providing you with the highest quality water delivery service
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-full w-fit">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src="/family_water.jpg"
                alt="Happy family drinking water"
                className="rounded-2xl shadow-xl object-cover w-full h-80"
              />
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              variants={staggerContainer}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
              >
                Premium Service,
                <br />
                Unbeatable Value
              </motion.h2>
              
              <motion.p
                variants={fadeInUp}
                className="text-lg text-gray-600 dark:text-gray-300"
              >
                Join thousands of satisfied customers who trust AquaNest for their water needs.
              </motion.p>

              <motion.ul
                variants={staggerContainer}
                className="space-y-3"
              >
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    variants={fadeInUp}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div variants={fadeInUp}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                  Start Your Subscription
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        badge={{
          text: "Get Started Today"
        }}
        title="Ready to Experience Pure Water Delivery?"
        description="Join thousands of satisfied customers and experience the convenience of premium water delivery today."
        action={{
          text: "Order Your First Delivery",
          href: "/products",
          variant: "default"
        }}
        className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-blue-900/20"
        withGlow={true}
      />
    </div>
  );
}
