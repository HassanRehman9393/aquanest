'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FAQ } from '@/components/ui/faq-section';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };
  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: 'Phone',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      description: 'Call us for immediate assistance'
    },
    {
      icon: <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />,
      title: 'Email',
      details: ['info@aquanest.com', 'support@aquanest.com'],
      description: 'Send us an email anytime'
    },
    {
      icon: <MapPin className="h-6 w-6 text-red-600 dark:text-red-400" />,
      title: 'Address',
      details: ['123 Water Street', 'Clean City, CC 12345'],
      description: 'Visit our headquarters'
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      title: 'Business Hours',
      details: ['Mon-Fri: 8AM-8PM', 'Sat-Sun: 9AM-6PM'],
      description: 'We\'re here when you need us'
    }
  ];

  const subjects = [
    'General Inquiry',
    'Product Information',
    'Order Support',
    'Delivery Issues',
    'Quality Concerns',
    'Billing Questions',
    'Partnership Opportunities',
    'Other'  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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
              Contact <span className="text-blue-600 dark:text-blue-400">Us</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Have questions? Need support? We're here to help! Get in touch with our 
              friendly customer service team.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {contactInfo.map((info, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="text-center hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-full w-fit">
                      {info.icon}
                    </div>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">{info.title}</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">{info.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-gray-700 dark:text-gray-300 font-medium">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>      {/* Contact Form and Map */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-lg bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 dark:text-white">Send us a Message</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <CheckCircle className="h-16 w-16 text-green-500 dark:text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Thank you for contacting us. We'll respond within 24 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-900 dark:text-white">Full Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-900 dark:text-white">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-gray-900 dark:text-white">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 (555) 123-4567"
                            className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-gray-900 dark:text-white">Subject *</Label>
                          <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                            <SelectTrigger className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                              {subjects.map((subject) => (
                                <SelectItem key={subject} value={subject} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700">
                                  {subject}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-gray-900 dark:text-white">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us how we can help you..."
                          className="resize-none bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        size="lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Map and Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">                {/* Interactive Map */}
                <Card className="shadow-lg bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">Visit Our Office</CardTitle>
                    <CardDescription>
                      Find us at our headquarters in the heart of the city
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg overflow-hidden h-64 w-full">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.123456789!2d-74.0059731!3d40.7127753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316b7b4f05%3A0x5e5b6f2b5b8f8f8f!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1640995200000!5m2!1sen!2sus"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="AquaNest Office Location"
                      />
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                        <span className="text-sm">123 Water Street, Clean City, CC 12345</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card className="shadow-lg bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <CardHeader>
                    <CardTitle className="text-xl text-red-700 dark:text-red-400">Emergency Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-600 dark:text-red-400 mb-3">
                      For urgent delivery issues or quality concerns:
                    </p>
                    <div className="space-y-2">
                      <p className="font-semibold text-red-700 dark:text-red-400">
                        📞 Emergency Hotline: +1 (555) 911-AQUA
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Available 24/7 for emergency situations
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />
    </div>
  );
}
