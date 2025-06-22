'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Droplets, Globe, CheckCircle, Heart, Target, Eye, Clock, Truck, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SafeImage } from '@/components/ui/SafeImage';
import { AquaNestDeliveryTimeline } from '@/components/ui/aquanest-delivery-timeline';

export default function AboutPage() {
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
  const deliverySteps = [
    {
      step: 1,
      title: 'Choose',
      subtitle: 'Select Your Water',
      description: 'Browse our premium water selection and choose the perfect option for your needs. From purified to alkaline, we have it all.',
      icon: 'droplets',
      color: 'blue'
    },
    {
      step: 2,
      title: 'Schedule',
      subtitle: 'Pick Your Time',
      description: 'Schedule your delivery at your convenience. Same-day, weekly, or monthly - we deliver on your schedule.',
      icon: 'clock',
      color: 'green'
    },
    {
      step: 3,
      title: 'Deliver',
      subtitle: 'Enjoy Fresh Water',
      description: 'Our delivery team brings your premium water right to your door. Fresh, pure, and ready to enjoy.',
      icon: 'truck',
      color: 'purple'
    }
  ];

  const values = [
    {
      icon: <Droplets className="h-8 w-8 text-blue-500" />,
      title: 'Purity',
      description: 'We are committed to delivering the highest quality water through rigorous testing and advanced purification processes.'
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: 'Care',
      description: 'Every customer matters to us. We provide personalized service and support to ensure your complete satisfaction.'
    },
    {
      icon: <Globe className="h-8 w-8 text-green-500" />,
      title: 'Sustainability',
      description: 'We are dedicated to protecting our environment through eco-friendly practices and sustainable operations.'
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from water quality to customer service and delivery reliability.'
    }  ];  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: '/women.png',
      bio: 'Former water industry executive with 15+ years of experience in sustainable water solutions.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: '/person.png',
      bio: 'Technology leader specializing in logistics optimization and quality assurance systems.'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Head of Operations',
      image: '/women2.png',
      bio: 'Operations expert ensuring seamless delivery and customer satisfaction across all markets.'
    },
    {
      name: 'David Kim',
      role: 'Quality Director',
      image: '/person2.png',
      bio: 'Water quality specialist with advanced degrees in environmental science and chemistry.'
    }
  ];

  return (
    <div className="min-h-screen">      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center space-y-8"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white"
            >
              About <span className="text-blue-600 dark:text-blue-400">AquaNest</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              For over 7 years, we've been dedicated to bringing you the purest, freshest water 
              with unmatched convenience and reliability. Our mission is simple: to provide 
              exceptional water delivery service that you can trust.
            </motion.p>
          </motion.div>
        </div>
      </section>      {/* Mission, Vision, Values */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            <motion.div variants={fadeInUp} className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-300">
                To provide premium water delivery services that enhance the health and convenience 
                of our customers while maintaining the highest standards of quality and sustainability.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
              <p className="text-gray-600 dark:text-gray-300">
                To become the most trusted name in water delivery, setting the standard for 
                quality, service, and environmental responsibility in our industry.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Promise</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Every drop of water we deliver meets our rigorous quality standards, backed by 
                our commitment to exceptional customer service and reliable delivery.
              </p>
            </motion.div>
          </motion.div>        </div>
      </section>

      {/* Delivery Process */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">          <motion.div
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              How We Deliver Excellence
            </motion.h2>            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Experience our interactive 4-step delivery process - click on each step to explore how we bring premium water to your door and ensure your complete satisfaction
            </motion.p>
          </motion.div>          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <AquaNestDeliveryTimeline />
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
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
              Our Values
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              The principles that guide everything we do and every decision we make.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                  <CardHeader>
                    <div className="mx-auto mb-4">
                      {React.cloneElement(value.icon, {
                        className: value.icon.props.className.replace('text-blue-500', 'text-blue-500 dark:text-blue-400')
                          .replace('text-red-500', 'text-red-500 dark:text-red-400')
                          .replace('text-green-500', 'text-green-500 dark:text-green-400')
                          .replace('text-yellow-500', 'text-yellow-500 dark:text-yellow-400')
                      })}
                    </div>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>      {/* Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800">
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
              Meet Our Team
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              The passionate professionals behind AquaNest's success.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div key={index} variants={fadeInUp}>                <Card className="text-center hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                  <CardHeader>
                    <SafeImage
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-gray-200 dark:border-slate-600"
                      fallbackSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
                    />
                    <CardTitle className="text-xl text-gray-900 dark:text-white">{member.name}</CardTitle>
                    <CardDescription className="text-blue-600 dark:text-blue-400 font-medium">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}          </motion.div>
        </div>
      </section>
    </div>
  );
}
