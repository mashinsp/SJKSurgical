// pages/index.js
"use client"
import { useState, useEffect, useRef  } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import AOS from "aos";
import 'aos/dist/aos.css';
import { ChevronDown, ArrowRight, ClipboardCheck } from 'lucide-react';
import { Menu, X, Search, Phone, ShoppingCart } from 'lucide-react';

// Navbar Component
const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('home');
    const [searchOpen, setSearchOpen] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [navVisible, setNavVisible] = useState(true);
    const searchInputRef = useRef(null);
  
    // Handle scroll effects - enhanced to hide on scroll down, show on scroll up
    useEffect(() => {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        
        // Determine if navbar should be visible (hide on scroll down, show on scroll up)
        if (currentScrollY > lastScrollY && currentScrollY > 150) {
          setNavVisible(false);
        } else {
          setNavVisible(true);
        }
        
        setLastScrollY(currentScrollY);
        setIsScrolled(currentScrollY > 10);
        
        // Set active section based on scroll position
        const sections = ['home', 'about', 'products', 'innovation', 'testimonials', 'contact'];
        for (const section of sections.reverse()) {
          const element = document.getElementById(section);
          if (element && window.scrollY >= element.offsetTop - 100) {
            setActiveLink(section);
            break;
          }
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);
  
    // Focus search input when opened
    useEffect(() => {
      if (searchOpen && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [searchOpen]);
  
    // Close mobile menu when window resizes to desktop size
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 768 && mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [mobileMenuOpen]);
  
    // Lock body scroll when mobile menu is open
    useEffect(() => {
      if (mobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [mobileMenuOpen]);
  
    const navLinks = [
      { id: 'home', label: 'Home' },
      { id: 'about', label: 'About' },
      { id: 'products', label: 'Products', hasDropdown: true },
      { id: 'innovation', label: 'Innovation' },
      { id: 'testimonials', label: 'Testimonials' },
    ];
  
    const handleLinkClick = (id: any) => {
      setActiveLink(id);
      setMobileMenuOpen(false);
      
      // Smooth scroll to the section
      const element = document.getElementById(id);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    };
  
    return (
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
        } ${
          navVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo and Branding */}
          <div className="flex items-center space-x-2">
            <Link href="#home" className="flex items-center" onClick={() => handleLinkClick('home')}>
              <div className="relative w-10 h-10 md:w-12 md:h-12 transition-all duration-300">
                <Image
                  src="/logo.png"
                  alt="Company Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className={`ml-2 font-bold text-lg transition-all duration-300 ${
                isScrolled ? 'text-blue-600' : 'text-gray-800'
              }`}>
                SJK
                <span className="text-blue-600 pl-2">Surgical</span>
              </div>
            </Link>
          </div>
  
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div key={link.id} className="relative group">
                <Link 
                  href={`#${link.id}`}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:bg-blue-50 flex items-center ${
                    activeLink === link.id ? 'text-blue-600' : 'text-gray-700'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.id);
                  }}
                >
                  {link.label}
                  {link.hasDropdown && (
                    <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180" />
                  )}
                </Link>
                
                {/* Active indicator */}
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left transition-all duration-300 ${
                  activeLink === link.id ? 'scale-x-100' : 'scale-x-0'
                }`}></div>
                
                {/* Dropdown for Products */}
                {link.hasDropdown && (
                  <div className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left -translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="py-1 divide-y divide-gray-100">
                      <Link href="#surgical-tools" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                        Surgical Tools
                      </Link>
                      <Link href="#monitoring-devices" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                        Monitoring Devices
                      </Link>
                      <Link href="#specialty-instruments" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                        Specialty Instruments
                      </Link>
                      <Link href="#product-catalog" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 font-medium text-blue-600">
                        View Full Catalog
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
  
          {/* Desktop Right Side Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Search Bar */}
            <div className="relative">
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {/* Search dropdown */}
              <div className={`absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg ${
                searchOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
              } transition-all duration-200 transform origin-top-right z-50`}>
                <div className="flex items-center p-2 border-b">
                  <Search className="w-4 h-4 text-gray-400 mr-2" />
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full p-1 focus:outline-none"
                    onBlur={() => setSearchOpen(false)}
                  />
                  <button 
                    onClick={() => setSearchOpen(false)} 
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-2 text-xs text-gray-500">
                  Try searching for "surgical scissors" or "clamps"
                </div>
              </div>
            </div>
            
            {/* Contact Button */}
            <a 
              href="#contact" 
              className="flex items-center text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('contact');
              }}
            >
              <Phone className="w-4 h-4 mr-1" />
              Get in Touch
            </a>
            
            {/* Shopping Cart */}
            <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">2</span>
            </button>
          </div>
  
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              className={`p-2 rounded-md focus:outline-none transition-colors ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-800 hover:bg-white/20'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
  
        {/* Mobile Menu Overlay */}
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
  
        {/* Mobile Menu Panel */}
        <div 
          className={`fixed top-0 right-0 w-3/4 max-w-sm h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-end p-4 border-b">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="px-4 py-6">
            <div className="flex items-center mb-6">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.png"
                  alt="Company Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="ml-2 font-bold text-lg">
                SurgicalTech<span className="text-blue-600">Pro</span>
              </div>
            </div>
            
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    activeLink === link.id 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.id);
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <a href="#contact" className="flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  Contact Us
                </a>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search products"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  };
  
const Hero = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [activeButton, setActiveButton] = useState<string | null>(null)
  
    // Handle scroll effect
    useEffect(() => {
      const handleScroll = () => {
        setScrollPosition(window.scrollY);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    // Floating text message animation
    const [showMessage, setShowMessage] = useState(false);
    useEffect(() => {
      const timer = setTimeout(() => setShowMessage(true), 1500);
      return () => clearTimeout(timer);
    }, []);
  
    return (
      <section
        id="home"
        className="relative h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden"
      >
        {/* Enhanced dynamic background with parallax effect */}
        <div 
          className="absolute w-full h-full"
          style={{ transform: `translateY(${scrollPosition * 0.1}px)` }}
        >
          <div className="absolute right-0 top-0 w-1/2 h-full bg-blue-100 rounded-bl-full opacity-50 transition-all duration-700 hover:bg-blue-200"></div>
          <div className="absolute -right-10 bottom-10 w-64 h-64 bg-blue-200 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute left-10 top-20 w-32 h-32 bg-blue-100 rounded-full opacity-50 animate-bounce"></div>
          
          {/* Add floating particles/circles */}
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className={`absolute w-${2 + (i % 4)} h-${2 + (i % 4)} bg-blue-${100 + ((i % 4) * 100)} rounded-full opacity-${20 + (i * 10)}`}
              style={{
                top: `${10 + (i * 10)}%`,
                left: `${5 + (i * 12)}%`,
                animation: `float ${5 + i}s ease-in-out infinite alternate`
              }}
            ></div>
          ))}
        </div>
  
        <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12 items-center z-10">
          {/* Left Side: Enhanced Hero Text with Animations */}
          <div
            className="max-w-lg"
            data-aos="fade-right"
            data-aos-duration="1000"
          >

            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Precision <span className="text-blue-600 relative">
                Surgical
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-blue-400 rounded"></span>
              </span> Instruments for Modern Healthcare
            </h1>
            
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Elevating surgical outcomes with cutting-edge instruments designed for precision, reliability, and optimal patient care.
            </p>
            
            {/* Enhanced buttons with hover effects and icons */}
            <div className="flex flex-wrap gap-4">
              <button 
                className={`bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-700 transform hover:-translate-y-1 transition duration-300 flex items-center gap-2 ${activeButton === 'explore' ? 'ring-4 ring-blue-200' : ''}`}
                onMouseEnter={() => setActiveButton('explore')}
                onMouseLeave={() => setActiveButton(null)}
              >
                Explore Products
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                className={`border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transform hover:-translate-y-1 transition duration-300 flex items-center gap-2 ${activeButton === 'catalog' ? 'ring-4 ring-blue-200' : ''}`}
                onMouseEnter={() => setActiveButton('catalog')}
                onMouseLeave={() => setActiveButton(null)}
              >
                Request Catalog
                <ClipboardCheck className="w-4 h-4" />
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-8 flex items-center gap-4">
              <div className="text-gray-500 text-sm flex items-center">
                <span className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </span>
                <span>Trusted by 500+ healthcare providers</span>
              </div>
            </div>
          </div>
  
          {/* Right Side: Enhanced Hero Image with Animation and Interaction */}
          <div
            className="hidden md:block relative"
            data-aos="fade-left"
            data-aos-duration="1000"
          >
            <div className="relative">
              {/* Animated blue box behind the image */}
              <div 
                className={`absolute -right-6 -bottom-6 w-48 h-48 bg-blue-500 rounded-xl transform transition-all duration-500 shadow-xl z-0 ${isImageLoaded ? 'rotate-12 scale-110' : 'rotate-0 scale-100'}`}
              ></div>
              
              {/* Improved image container with subtle shadow and border */}
              <div className="relative w-full h-96 bg-white rounded-xl overflow-hidden shadow-2xl z-10 transition-all duration-500 border border-gray-100">
                {/* Enhanced overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-transparent to-blue-50/30 opacity-90 mix-blend-overlay"></div>
                
                {/* Image with loading state */}
                <div className="relative w-full h-full bg-gray-100 rounded-xl overflow-hidden">
                  <Image
                    src="/sjk-pic2.jpg"
                    alt="Advanced surgical instruments in a modern operating room"
                    fill
                    priority
                    className={`object-cover transition-all duration-700 ${isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                    onLoadingComplete={() => setIsImageLoaded(true)}
                  />
                  
                  {/* Loading indicator */}
                  {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                {/* Floating information tag that appears after image loads */}
                {showMessage && isImageLoaded && (
                  <div className="absolute bottom-0 left-0 bg-white rounded-tr-lg shadow-lg p-3 z-20 animate-fadeIn ">
                    <div className="text-sm font-medium text-gray-900">Premium Quality</div>
                    <div className="text-xs text-gray-500">ISO 13485 Certified</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
  
        {/* Enhanced Scroll Down Indicator with text and interaction */}
        <div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer group"
          onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})}
        >
          <span className="text-sm text-blue-600 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Discover More</span>
          <ChevronDown className="w-8 h-8 text-blue-600 animate-bounce group-hover:text-blue-800 transition-colors duration-300" />
        </div>
        
        {/* Add a global animation keyframe for floating elements */}
        <style jsx global>{`
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
            100% { transform: translateY(5px) rotate(-5deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}</style>
      </section>
    );
  };
// About Section
const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About SJK Surgical</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600">
            With over 30 years of excellence in surgical innovation, SJK Surgical is committed to advancing healthcare through precision-engineered instruments that empower medical professionals.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div 
            className="bg-blue-50 rounded-xl p-8 shadow-lg transform transition duration-500 hover:-translate-y-2 hover:shadow-xl" 
            data-aos="fade-up" 
            data-aos-delay="100"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Assured</h3>
            <p className="text-gray-600">
              Every instrument undergoes rigorous testing and quality control to ensure optimal performance in critical surgical settings.
            </p>
          </div>
          
          <div 
            className="bg-blue-50 rounded-xl p-8 shadow-lg transform transition duration-500 hover:-translate-y-2 hover:shadow-xl" 
            data-aos="fade-up" 
            data-aos-delay="200"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Innovative Design</h3>
            <p className="text-gray-600">
              Our research team collaborates with leading surgeons to develop ergonomic, efficient instruments that advance surgical capabilities.
            </p>
          </div>
          
          <div 
            className="bg-blue-50 rounded-xl p-8 shadow-lg transform transition duration-500 hover:-translate-y-2 hover:shadow-xl" 
            data-aos="fade-up" 
            data-aos-delay="300"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Global Standards</h3>
            <p className="text-gray-600">
              Compliant with international medical device standards, our instruments are trusted by healthcare professionals worldwide.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Products Section
const Products = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'general', name: 'General Surgery' },
    { id: 'cardiac', name: 'Cardiac' },
    { id: 'orthopedic', name: 'Orthopedic' },
    { id: 'neuro', name: 'Neurosurgery' },
  ];
  
  const products = [
    {
      id: 1,
      name: 'Precision Scalpel Pro',
      category: 'general',
      description: 'Ergonomic handle with interchangeable surgical blades for precise incisions.',
      image: '/placeholder.jpg',
    },
    {
      id: 2,
      name: 'NeuroGrip Forceps',
      category: 'neuro',
      description: 'Ultra-precise forceps designed for delicate neurosurgical procedures.',
      image: '/placeholder.jpg',
    },
    {
      id: 3,
      name: 'OrthoClamp System',
      category: 'orthopedic',
      description: 'Adjustable titanium clamps for stable bone fixation during orthopedic surgery.',
      image: '/placeholder.jpg',
    },
    {
      id: 4,
      name: 'CardioValve Retractor',
      category: 'cardiac',
      description: 'Specialized retractor for optimal visualization during heart valve procedures.',
      image: '/placeholder.jpg',
    },
    {
      id: 5,
      name: 'SurgiFlex Scissors',
      category: 'general',
      description: 'Premium surgical scissors with micro-serrated edges for clean tissue division.',
      image: '/placeholder.jpg',
    },
    {
      id: 6,
      name: 'NeuroPrecision Drill',
      category: 'neuro',
      description: 'High-speed precision drill for cranial procedures with vibration dampening.',
      image: '/placeholder.jpg',
    },
  ];
  
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);
  
  return (
    <section id="products" className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Premium Instruments</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600">
            Browse our extensive collection of surgical instruments, designed for precision, reliability, and exceptional performance.
          </p>
        </div>
        
        <div className="flex justify-center mb-12 overflow-x-auto py-2">
          <div className="flex space-x-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-blue-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg transform transition duration-500 hover:-translate-y-2 hover:shadow-xl"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="h-56 bg-gray-200 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-lg">Product Image</span>
                </div>
              </div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs uppercase font-semibold tracking-wide mb-2">
                  {categories.find(cat => cat.id === product.category)?.name}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <button className="text-blue-600 font-medium hover:text-blue-800 flex items-center">
                  View Details
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-blue-50 transform hover:-translate-y-1 transition duration-300">
            View Full Catalog
          </button>
        </div>
      </div>
    </section>
  );
};

// Innovation Section
const Innovation = () => {
  return (
    <section id="innovation" className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute -right-32 -top-32 w-96 h-96 bg-blue-50 rounded-full opacity-50"></div>
        <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-blue-50 rounded-full opacity-50"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Innovation in Motion</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600">
            Discover how our cutting-edge technology is transforming surgical outcomes and redefining industry standards.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div data-aos="fade-right">
            <div className="relative">
              <div className="w-full h-96 bg-gray-200 rounded-xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-transparent opacity-50"></div>
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-lg">Innovation Image</span>
                </div>
              </div>
              <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-blue-600 rounded-lg transform -rotate-12 shadow-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">2025</span>
              </div>
            </div>
          </div>
          
          <div data-aos="fade-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Next-Generation Surgical Precision</h3>
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Smart Instrument Technology</h4>
                  <p className="text-gray-600">
                    Our integrated sensor technology provides real-time feedback to surgeons, enhancing precision and reducing procedure time.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Advanced Materials</h4>
                  <p className="text-gray-600">
                    Utilizing aerospace-grade titanium alloys and carbon composites for lightweight, durable instruments with superior performance.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Eco-Conscious Manufacturing</h4>
                  <p className="text-gray-600">
                    Commitment to sustainable production processes and reusable instrument designs that reduce medical waste.
                  </p>
                </div>
              </div>
            </div>
            
            <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-700 transform hover:-translate-y-1 transition duration-300">
              Explore Our Technology
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      content: "The precision and durability of MediSurge instruments have significantly improved our surgical outcomes. Their innovative designs make complex procedures more efficient.",
      author: "Dr. Sarah Johnson",
      role: "Chief of Surgery, Metro Medical Center",
    },
    {
      id: 2,
      content: "As a cardiovascular specialist, I require instruments with exceptional precision. MediSurge consistently delivers products that exceed our demanding standards.",
      author: "Dr. Michael Chen",
      role: "Cardiovascular Surgeon, Heart Institute",
    },
    {
      id: 3,
      content: "The ergonomic design of MediSurge's neurosurgical instruments has reduced hand fatigue during long procedures, allowing for greater precision when it matters most.",
      author: "Dr. Emily Rodriguez",
      role: "Neurosurgeon, University Hospital",
    },
  ];
  
  return (
    <section id="testimonials" className="py-20 bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-4">What Medical Professionals Say</h2>
          <div className="w-20 h-1 bg-white mx-auto mb-6"></div>
          <p className="text-blue-100">
            Trusted by leading surgeons and medical institutions worldwide for delivering exceptional quality and innovation.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white text-gray-800 rounded-xl p-8 shadow-lg transform transition duration-500 hover:-translate-y-2 hover:shadow-xl"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <svg className="w-12 h-12 text-blue-400 mb-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C21.739 6.122 20 8.713 20 12.078V14h2.995v7h-8.978zm-14 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.757 6.122 6 8.713 6 12.078V14h3v7H.017z" />
              </svg>
              <p className="text-gray-600 mb-6">{testimonial.content}</p>
              <div>
                <h4 className="font-bold text-gray-900">{testimonial.author}</h4>
                <p className="text-blue-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16" data-aos="fade-up">
          <h3 className="text-2xl font-bold mb-8">Trusted by Leading Medical Institutions</h3>
          <div className="flex flex-wrap justify-center gap-12">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="w-32 h-16 bg-blue-500 bg-opacity-50 rounded-lg flex items-center justify-center">
                <span className="text-white">Logo</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact Section
const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600">
            Have questions about our products or want to request a demonstration? Our team is here to help.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div data-aos="fade-right">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Dr. John Smith"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="john@hospital.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">Hospital/Organization</label>
                <input
                  type="text"
                  id="organization"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Metropolitan Hospital"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Product Inquiry"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  
                  aria-rowcount={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Tell us about your specific needs or questions..."
                ></textarea>
              </div>
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="consent"
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="consent" className="ml-2 block text-sm text-gray-600">
                  I consent to MediSurge processing my data to respond to my inquiry, in accordance with the Privacy Policy.
                </label>
              </div>
              
              <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-700 transform hover:-translate-y-1 transition duration-300">
                Send Message
              </button>
            </form>
          </div>
          
          <div data-aos="fade-left">
            <div className="bg-blue-50 p-8 rounded-xl shadow-lg h-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600">+1 (800) 555-0123</p>
                    <p className="text-gray-600">Mon-Fri, 8:00 AM - 6:00 PM EST</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">info@medisurge.com</p>
                    <p className="text-gray-600">support@medisurge.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Headquarters</h4>
                    <p className="text-gray-600">123 MedTech Boulevard</p>
                    <p className="text-gray-600">Boston, MA 02115, USA</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="font-semibold text-gray-900 mb-4">Connect With Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.01 10.01 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.16a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// FAQ Section
const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  const faqs = [
    {
      question: "What materials are your instruments made from?",
      answer: "Our premium surgical instruments are crafted from medical-grade stainless steel, titanium alloys, and specialized composites. All materials meet or exceed international standards for medical devices, ensuring durability, precision, and biocompatibility."
    },
    {
      question: "Do you offer customization for specific surgical needs?",
      answer: "Yes, we provide customization services for healthcare facilities with specialized requirements. Our engineering team works directly with surgical departments to design and manufacture instruments tailored to specific procedures or surgeon preferences."
    },
    {
      question: "What is your warranty policy?",
      answer: "MediSurge offers a comprehensive 5-year warranty on all standard surgical instruments against manufacturing defects. Our premium line carries a lifetime warranty. Detailed warranty information is included with each product and available upon request."
    },
    {
      question: "How do I properly care for and maintain my instruments?",
      answer: "We recommend following our detailed care guidelines included with each purchase. Generally, instruments should be cleaned immediately after use, properly sterilized according to hospital protocols, and stored in a clean, dry environment. We also offer maintenance workshops and resources on our website."
    },
    {
      question: "Do you offer training for your specialized instruments?",
      answer: "Yes, we provide comprehensive training programs for our advanced and specialized instruments. These can be conducted on-site at your facility or through our virtual training platform. Contact our education department to schedule a session."
    }
  ];
  
  const toggleFAQ = (index : any) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600">
            Find answers to the most common questions about our products, services, and policies.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto" data-aos="fade-up">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="mb-4 border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left bg-white hover:bg-blue-50 transition flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                <svg 
                  className={`w-5 h-5 text-blue-600 transform transition-transform ${activeIndex === index ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ${
                  activeIndex === index ? 'max-h-96 py-4' : 'max-h-0'
                }`}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12" data-aos="fade-up">
          <p className="text-gray-600 mb-6">Still have questions? Our support team is ready to assist you.</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-700 transform hover:-translate-y-1 transition duration-300">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

// Newsletter Section
const Newsletter = () => {
  return (
    <section className="py-16 bg-blue-600">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden" data-aos="zoom-in">
          <div className="grid md:grid-cols-2">
            <div className="p-10 flex items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated on Medical Innovations</h3>
                <p className="text-gray-600 mb-6">
                  Subscribe to our newsletter to receive updates on new products, surgical techniques, and exclusive educational content.
                </p>
                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition whitespace-nowrap">
                    Subscribe
                  </button>
                </form>
                <p className="text-sm text-gray-500 mt-4">
                  We respect your privacy and will never share your information.
                </p>
              </div>
            </div>
            <div className="bg-blue-100 p-10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-200 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Subscriber Benefits</h4>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Early product announcements</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Exclusive educational content</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Special event invitations</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Industry insights & trends</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-2xl font-bold mb-6">MediSurge</h4>
            <p className="text-gray-400 mb-6">
              Advancing surgical care through innovation and precision engineering since 1992.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.01 10.01 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.16a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <ul>
              <li className="mb-2">
                <Link legacyBehavior href="#home">
                  <a className="hover:underline">Home</a>
                </Link>
              </li>
              <li className="mb-2">
                <Link legacyBehavior href="#about">
                  <a className="hover:underline">About</a>
                </Link>
              </li>
              <li className="mb-2">
                <Link legacyBehavior href="#products">
                  <a className="hover:underline">Products</a>
                </Link>
              </li>
              <li className="mb-2">
                <Link legacyBehavior href="#innovation">
                  <a className="hover:underline">Innovation</a>
                </Link>
              </li>
              <li className="mb-2">
                <Link legacyBehavior href="#contact">
                  <a className="hover:underline">Contact</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Resources</h4>
            <ul>
              <li className="mb-2"><a href="#" className="hover:underline">FAQs</a></li>
              <li className="mb-2"><a href="#" className="hover:underline">Support</a></li>
              <li className="mb-2"><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li className="mb-2"><a href="#" className="hover:underline">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Subscribe</h4>
            <p className="text-gray-400 mb-4">Sign up for our newsletter for the latest updates.</p>
            <form className="flex">
              <input type="email" placeholder="Email address" className="w-full px-3 py-2 rounded-l-lg border border-gray-600 focus:outline-none" />
              <button type="submit" className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700 transition">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} MediSurge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Main Page Component
export default function Home() {
  useEffect(() => {
    AOS.init({
      once: true, // whether animation should happen only once
      duration: 800,
    });
  }, []);
  
  return (
    <>
      <Head>
        <title>SJK Surgical | Surgical Instruments</title>
        <meta name="description" content="Precision surgical instruments for modern healthcare." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Products />
        <Innovation />
        <Testimonials />
        <Contact />
        <FAQ />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
