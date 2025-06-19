import React from 'react';
import Link from 'next/link';
import { Droplets, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 dark:bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 dark:bg-blue-500 p-2 rounded-full">
                <Droplets className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">AquaNest</span>
            </div>
            <p className="text-gray-400 dark:text-gray-300 text-sm">
              Your trusted partner for premium water delivery services. 
              Clean, fresh, and pure water delivered right to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-300 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-300 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-300 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">
                  Water Delivery
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">
                  Subscription Plans
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">
                  Water Quality Testing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">
                  Emergency Supply
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 dark:text-blue-300" />
                <span className="text-gray-400 dark:text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 dark:text-blue-300" />
                <span className="text-gray-400 dark:text-gray-300">info@aquanest.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 dark:text-blue-300 mt-0.5" />
                <span className="text-gray-400 dark:text-gray-300">
                  123 Water Street<br />
                  Clean City, CC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 dark:border-slate-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 dark:text-gray-300 text-sm">
            © {currentYear} AquaNest. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
