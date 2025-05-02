import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { Menu, X, BookOpen, Users, Award, HelpCircle, ChevronDown, CheckCircle, TrendingUp, Share2, Facebook, Twitter, Linkedin, Instagram, Star, Send, ChevronLeft, ChevronRight, PlayCircle, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

// Navigation items
const navigation = [
  { name: 'Features', href: '#features', icon: <CheckCircle className="mr-2 h-4 w-4" /> },
  { name: 'Classes', href: '#classes', icon: <BookOpen className="mr-2 h-4 w-4" /> },
  { name: 'Quizzes', href: '#quizzes', icon: <HelpCircle className="mr-2 h-4 w-4" /> },
  { name: 'Developers', href: '#testimonials', icon: <Star className="mr-2 h-4 w-4" /> },
];

// Features
const features = [
  {
    name: 'Easy Quiz Creation',
    description: 'Craft engaging quizzes with diverse question types in minutes using our intuitive drag-and-drop editor.',
    icon: <HelpCircle className="h-10 w-10 text-white" />,
    bgColor: 'bg-cyan-500',
    image: 'https://i.postimg.cc/7ZWwj6bL/lifewithaless-on-instagram.jpg',
  },
  {
    name: 'Class Management',
    description: 'Organize students into classes for seamless assignment tracking and personalized learning paths.',
    icon: <Users className="h-10 w-10 text-white" />,
    bgColor: 'bg-teal-500',
    image: 'https://i.postimg.cc/76kN2Xz5/fcb3e0fc-0747-4a43-bc0a-4a6c1fd539d0.jpg',
  },
  {
    name: 'Real-Time Analytics',
    description: 'Gain instant insights into student performance with detailed, exportable reports and visualizations.',
    icon: <TrendingUp className="h-10 w-10 text-white" />,
    bgColor: 'bg-cyan-600',
    image: 'https://i.postimg.cc/nr7ZPFzR/a8503f84-9d4c-4feb-84fd-62ae57538d20.jpg',
  },
  {
    name: 'Seamless Sharing',
    description: 'Share quizzes and results effortlessly with students or colleagues via email, links, or LMS integration.',
    icon: <Share2 className="h-10 w-10 text-white" />,
    bgColor: 'bg-teal-600',
    image: 'https://i.postimg.cc/7YWd28Zb/guys-I-m-an-academic-weapon-now.jpg',
  },
];

// Testimonials
const testimonials = [
  {
    name: 'Ariel Angelo Elca',
    role: 'Frontend Developer',
    quote: 'AssessMate has transformed how I manage assessments. The analytics are a game-changer!',
    avatar: 'https://i.postimg.cc/KjYhjSHz/1DX27756.jpg',
  },
  {
    name: 'Antoinette Rubio',
    role: 'Backend Developer',
    quote: 'Creating quizzes is so intuitive, and my students love the instant feedback.',
    avatar: 'https://i.postimg.cc/wjzMx3kT/484016061-23969060456027510-3881263770936862817-n.jpg',
  },
  {
    name: 'Hannah Grace Sacamay',
    role: 'Mobile Developer',
    quote: 'The platform is so easy to use, and I can track my progress effortlessly.',
    avatar: 'https://i.postimg.cc/xCvF2xjd/490542684-4200961300225225-793411418213641628-n.jpg',
  },
];

// Stats
const stats = [
  { label: 'Quizzes Created', value: '10000', display: '10,000+' },
  { label: 'Students Reached', value: '50000', display: '50,000+' },
  { label: 'Classes Managed', value: '2000', display: '2,000+' },
  { label: 'Countries Served', value: '30', display: '30+' },
];

// FAQs
const faqs = [
  {
    question: 'How easy is it to create a quiz?',
    answer: 'With AssessMate’s drag-and-drop editor, you can create engaging quizzes in minutes, with support for multiple-choice, true/false, and open-ended questions.',
  },
  {
    question: 'Can I integrate with my LMS?',
    answer: 'Yes, AssessMate supports seamless integration with popular LMS platforms like Canvas, Moodle, and Blackboard.',
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Absolutely! We offer a 14-day free trial with no credit card required, so you can explore all features risk-free.',
  },
];

// Footer navigation
const footerNavigation = {
  solutions: [
    { name: 'Quiz Maker', href: '#' },
    { name: 'Classroom Tools', href: '#' },
    { name: 'Student Tracking', href: '#' },
    { name: 'Analytics', href: '#' },
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'Documentation', href: '#' },
    { name: 'API Status', href: '#' },
    { name: 'Contact Us', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Press', href: '#' },
  ],
  legal: [
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
    { name: 'Accessibility', href: '#' },
  ],
  social: [
    { name: 'Facebook', href: '#', icon: (props) => <Facebook {...props} /> },
    { name: 'Instagram', href: '#', icon: (props) => <Instagram {...props} /> },
    { name: 'Twitter', href: '#', icon: (props) => <Twitter {...props} /> },
    { name: 'LinkedIn', href: '#', icon: (props) => <Linkedin {...props} /> },
  ],
};

// Memoized Feature Card for performance
const FeatureCard = memo(({ feature, idx, currentFeature, setCurrentFeature }) => (
  <div
    className={`w-full flex-shrink-0 lg:flex lg:items-center lg:gap-x-12 p-8 transition-all duration-500 ${
      idx === currentFeature ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
    }`}
  >
    <div className="lg:w-1/2">
      <div className={`inline-flex rounded-full p-4 ${feature.bgColor} shadow-md mb-6 transform hover:scale-110 transition-transform duration-300`}>
        {feature.icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{feature.name}</h3>
      <p className="mt-4 text-gray-600">{feature.description}</p>
      <button
        onClick={() => setCurrentFeature(idx)}
        className="mt-6 text-sm font-medium text-cyan-600 hover:text-cyan-800 flex items-center"
        aria-label={`Learn more about ${feature.name}`}
      >
        Learn more <ChevronRight className="ml-1 h-4 w-4" />
      </button>
    </div>
    <div className="mt-8 lg:mt-0 lg:w-1/2">
      <img
        src={feature.image}
        alt={`${feature.name} screenshot`}
        className="w-full h-64 object-cover rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>
  </div>
));

// Memoized Testimonial Card
const TestimonialCard = memo(({ testimonial }) => (
  <div
    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
    role="article"
    aria-labelledby={`testimonial-${testimonial.name}`}
  >
    <div className="flex items-center mb-4">
      <img
        src={testimonial.avatar}
        alt={`${testimonial.name}'s avatar`}
        className="h-12 w-12 rounded-full object-cover"
        loading="lazy"
      />
      <div className="ml-4">
        <p id={`testimonial-${testimonial.name}`} className="text-lg font-semibold text-gray-900">{testimonial.name}</p>
        <p className="text-sm text-gray-500">{testimonial.role}</p>
      </div>
    </div>
    <p className="text-gray-600 italic">"{testimonial.quote}"</p>
    <div className="mt-4 flex justify-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" aria-hidden="true" />
      ))}
    </div>
  </div>
));

export default function AssessMateLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [visibleSections, setVisibleSections] = useState({});
  const featureSectionRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const demoModalRef = useRef(null);

  // Theme-aware class
  const themeClass = isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-b from-white to-cyan-50';

  // Handle scroll for header and parallax
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      const hero = document.querySelector('.hero-bg');
      if (hero) {
        hero.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate feature carousel with progress
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
      setProgress(0);
    }, 5000);
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 2, 100));
    }, 100);
    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  // Lazy-load sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  // Smooth scroll handler
  const handleSmoothScroll = useCallback((e, href) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  }, []);

  // Newsletter form submission
  const handleNewsletterSubmit = useCallback((e) => {
    e.preventDefault();
    alert(`Subscribed with ${newsletterEmail}!`);
    setNewsletterEmail('');
  }, [newsletterEmail]);

  // Feature carousel navigation
  const nextFeature = useCallback(() => {
    setCurrentFeature((prev) => (prev + 1) % features.length);
    setProgress(0);
  }, []);
  const prevFeature = useCallback(() => {
    setCurrentFeature((prev) => (prev - 1 + features.length) % features.length);
    setProgress(0);
  }, []);

  // Focus trap for mobile menu and modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setShowDemoModal(false);
      }
      if ((mobileMenuOpen || showDemoModal) && e.key === 'Tab') {
        const focusableElements = (mobileMenuOpen ? mobileMenuRef : demoModalRef).current.querySelectorAll(
          'a[href], button, input, [tabindex="0"]'
        );
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, showDemoModal]);

  // Animated stats
  const animatedStats = useMemo(() => stats.map((stat) => ({
    ...stat,
    current: visibleSections['stats'] ? parseInt(stat.value) : 0,
  })), [visibleSections]);

  useEffect(() => {
    if (visibleSections['stats']) {
      const timers = stats.map((stat, idx) => {
        const start = 0;
        const end = parseInt(stat.value);
        const duration = 2000;
        const increment = end / (duration / 16);
        let current = start;
        return setInterval(() => {
          current = Math.min(current + increment, end);
          animatedStats[idx].current = Math.floor(current);
        }, 16);
      });
      return () => timers.forEach(clearInterval);
    }
  }, [visibleSections, animatedStats]);

  return (
    <div className={`${themeClass} min-h-screen transition-colors duration-300`}>
      {/* Theme Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? '🌞' : '🌙'}
      </button>

      {/* Header */}
      <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-md' : 'bg-white dark:bg-gray-900'}`}>
        <nav aria-label="Global" className="flex items-center justify-between p-4 lg:px-8 max-w-7xl mx-auto">
          <div className="flex lg:flex-1">
            <a href="#" className="flex items-center group" aria-label="AssessMate Home">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Award className="h-7 w-7 text-white" />
              </div>
              <span className="ml-3 text-2xl font-extrabold text-cyan-800 dark:text-cyan-200 group-hover:text-cyan-900 dark:group-hover:text-cyan-300 transition-colors">AssessMate</span>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-cyan-700 dark:text-cyan-200 hover:bg-cyan-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Open mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-7 w-7" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className="relative text-sm font-semibold text-cyan-700 dark:text-cyan-200 hover:text-cyan-900 dark:hover:text-cyan-300 group flex items-center px-4 py-2 rounded-lg transition-colors"
                aria-label={`Navigate to ${item.name}`}
              >
                {React.cloneElement(item.icon, { className: 'mr-2 h-4 w-4 text-cyan-600 dark:text-cyan-300 group-hover:text-cyan-800 dark:group-hover:text-cyan-400' })}
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-teal-500 dark:from-cyan-400 dark:to-teal-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-x-6">
            <Link
              to="/login"
              className="text-sm font-semibold text-cyan-700 dark:text-cyan-200 hover:text-cyan-900 dark:hover:text-cyan-300 flex items-center px-4 py-2 rounded-lg hover:bg-cyan-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Log in to AssessMate"
            >
              Log in <span className="ml-1">→</span>
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-xl shadow-md transform hover:scale-105 transition-all duration-300"
              aria-label="Sign up for AssessMate"
            >
              Sign Up
            </Link>
          </div>
        </nav>
        {mobileMenuOpen && (
          <div className="lg:hidden animate-slide-in-right" ref={mobileMenuRef}>
            <div className="fixed inset-0 z-50 bg-gray-900/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
            <div className="fixed inset-y-0 right-0 z-50 w-80 bg-white dark:bg-gray-800 px-6 py-6 shadow-xl" role="dialog" aria-label="Mobile navigation menu">
              <div className="flex items-center justify-between">
                <a href="#" className="flex items-center" aria-label="AssessMate Home">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-md">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <span className="ml-3 text-xl font-bold text-cyan-800 dark:text-cyan-200">AssessMate</span>
                </a>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close mobile menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-8 space-y-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className="flex items-center px-4 py-3 text-base font-semibold text-cyan-800 dark:text-cyan-200 hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label={`Navigate to ${item.name}`}
                  >
                    {React.cloneElement(item.icon, { className: 'mr-3 h-5 w-5 text-cyan-600 dark:text-cyan-300' })}
                    {item.name}
                  </a>
                ))}
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-base font-semibold text-cyan-800 dark:text-cyan-200 hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Log in to AssessMate"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-lg text-center transition-all"
                  aria-label="Sign up for AssessMate"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section with Parallax */}
        <div className="relative isolate pt-20 sm:pt-28 lg:pt-36 pb-16 lg:pb-24 overflow-hidden">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-60 hero-bg transition-transform duration-100"
            aria-hidden="true"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-cyan-600 to-teal-400 dark:from-cyan-800 dark:to-teal-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-16 items-center animate-fade-in-up">
              <div className="text-center lg:text-left lg:col-span-7">
                <div className="flex items-center justify-center lg:justify-start mb-6">
                  <span className="inline-flex items-center rounded-full bg-cyan-100 dark:bg-cyan-900 px-3 py-1 text-sm font-medium text-cyan-800 dark:text-cyan-200">
                    <span className="flex h-2 w-2 rounded-full bg-cyan-600 dark:bg-cyan-400 mr-2 animate-pulse"></span>
                    New: Quiz Creations
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  <span className="block">AssessMate</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-teal-700 dark:from-cyan-500 dark:to-teal-500">Your All-in-One Assessment Platform</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-700 dark:text-gray-200 max-w-xl mx-auto lg:mx-0">
                  Empower educators with intuitive tools to create quizzes, manage classes, and gain deep insights into student performance.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                  <Link
                    to="/register"
                    className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    aria-label="Start for free with AssessMate"
                  >
                    Start for Free
                  </Link>
                  <button
                    onClick={() => setShowDemoModal(true)}
                    className="text-lg font-semibold text-cyan-700 dark:text-cyan-200 hover:text-cyan-900 dark:hover:text-cyan-300 flex items-center gap-2 group"
                    aria-label="Watch AssessMate demo"
                  >
                    Watch Demo <PlayCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
                  </button>
                </div>
                <div className="mt-8 flex items-center justify-center lg:justify-start text-sm text-gray-500 dark:text-gray-300">
                  <CheckCircle className="mr-2 h-4 w-4 text-cyan-600 dark:text-cyan-400" /> No credit card required
                  <span className="mx-3">•</span>
                  <CheckCircle className="mr-2 h-4 w-4 text-cyan-600 dark:text-cyan-400" /> 14-day free trial
                </div>
              </div>
              <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-5">
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-cyan-100 dark:ring-cyan-700 transform lg:-rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="https://i.postimg.cc/j2XWF4Ck/My-Office.jpg"
                    alt="AssessMate Dashboard"
                    className="w-full h-96 object-cover opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-800/50 dark:from-gray-900/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white max-w-xs">
                    <p className="text-lg font-semibold">Interactive Dashboard</p>
                    <p className="text-sm">Manage everything in one place</p>
                    <div className="mt-4 flex items-center">
                      <div className="flex -space-x-2">
                        {testimonials.slice(0, 3).map((t, i) => (
                          <img
                            key={i}
                            className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-700"
                            src={t.avatar}
                            alt={`${t.name}'s avatar`}
                            loading="lazy"
                          />
                        ))}
                      </div>
                      <p className="ml-4 text-xs">Trusted by 50,000+ educators</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Modal */}
        {showDemoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm" ref={demoModalRef} role="dialog" aria-labelledby="demo-modal-title">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-3xl w-full mx-4 relative animate-fade-in-up">
              <button
                onClick={() => setShowDemoModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close demo modal"
              >
                <X className="h-6 w-6" />
              </button>
              <h2 id="demo-modal-title" className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AssessMate Demo</h2>
              <div className="relative w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src="https://i.postimg.cc/7YWd28Zb/guys-I-m-an-academic-weapon-now.jpg"
                  alt="AssessMate demo preview"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayCircle className="h-16 w-16 text-white opacity-80 hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-200">Experience how AssessMate streamlines quiz creation and class management.</p>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Close demo modal"
                >
                  Close
                </button>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-lg transition-all"
                  aria-label="Start for free from demo modal"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Feature Carousel Section */}
        <section id="features" className="bg-white dark:bg-gray-800 py-20 sm:py-32" ref={featureSectionRef}>
          {visibleSections['features'] && (
            <div className="mx-auto max-w-7xl px-6 lg:px-8 animate-fade-in-up">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-base font-semibold text-cyan-600 dark:text-cyan-400">Powerful Tools</h2>
                <p className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
                  Elevate Your Teaching Experience
                </p>
                <p className="mt-6 text-lg text-gray-600 dark:text-gray-200">
                  Discover a suite of features designed to simplify assessments and enhance learning outcomes.
                </p>
              </div>
              <div className="mt-16 relative">
                <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-gray-700 dark:to-gray-600">
                  <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentFeature * 100}%)` }}>
                    {features.map((feature, idx) => (
                      <FeatureCard key={feature.name} feature={feature} idx={idx} currentFeature={currentFeature} setCurrentFeature={setCurrentFeature} />
                    ))}
                  </div>
                  <button
                    onClick={prevFeature}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-cyan-100 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Previous feature"
                  >
                    <ChevronLeft className="h-6 w-6 text-cyan-600 dark:text-cyan-200" />
                  </button>
                  <button
                    onClick={nextFeature}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-cyan-100 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Next feature"
                  >
                    <ChevronRight className="h-6 w-6 text-cyan-600 dark:text-cyan-200" />
                  </button>
                </div>
                <div className="mt-4 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-cyan-600 dark:bg-cyan-400 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="mt-6 flex justify-center space-x-2">
                  {features.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setCurrentFeature(idx); setProgress(0); }}
                      className={`h-2 w-2 rounded-full ${currentFeature === idx ? 'bg-cyan-600 dark:bg-cyan-400' : 'bg-gray-300 dark:bg-gray-500'} transition-colors`}
                      aria-label={`Go to feature ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Stats Section */}
        <section id="stats" className="bg-gradient-to-r from-cyan-800 to-teal-800 dark:from-cyan-900 dark:to-teal-900 py-16 sm:py-24">
          {visibleSections['stats'] && (
            <div className="mx-auto max-w-7xl px-6 lg:px-8 animate-fade-in-up">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">AssessMate by the Numbers</h2>
                <p className="mt-4 text-lg text-cyan-100">Join a global community of educators and students.</p>
              </div>
              <>
                {animatedStats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-4xl font-bold text-white animate-[count-up_2s_ease-out]">{stat.current.toLocaleString()}+</p>
                    <p className="mt-2 text-cyan-200">{stat.label}</p>
                  </div>
                ))}
              </>
            </div>
          )}
        </section>

        {/* Classes Section */}
        <section id="classes" className="bg-cyan-50 dark:bg-gray-700 py-20 sm:py-32">
          {visibleSections['classes'] && (
            <div className="mx-auto max-w-7xl px-6 lg:px-8 animate-fade-in-up">
              <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 items-center">
                <div className="lg:pr-8">
                  <h2 className="text-base font-semibold text-cyan-600 dark:text-cyan-400">Class Management</h2>
                  <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                    Organize Your Students Seamlessly
                  </p>
                  <p className="mt-6 text-lg text-gray-600 dark:text-gray-200">
                    Create virtual classrooms, assign quizzes, and track student progress with ease.
                  </p>
                  <div className="mt-10 space-y-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-cyan-500 dark:bg-cyan-600 text-white">
                          <Users className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Virtual Classrooms</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-200">Group students for efficient management.</p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 dark:bg-teal-600 text-white">
                          <Send className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Assignment Distribution</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-200">Send quizzes to entire classes instantly.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Link
                      to="/register"
                      className="inline-flex px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-xl shadow-md transition-all duration-300"
                      aria-label="Get started with class management"
                    >
                      Try Class Management
                    </Link>
                  </div>
                </div>
                <div className="mt-12 sm:mt-16 lg:mt-0">
                  <div className="relative rounded-2xl shadow-xl overflow-hidden transform lg:rotate-3 hover:rotate-0 transition-transform duration-500">
                    <img
                      src="https://i.postimg.cc/76kN2Xz5/fcb3e0fc-0747-4a43-bc0a-4a6c1fd539d0.jpg"
                      alt="Class management dashboard"
                      className="w-full h-80 object-cover opacity-90"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-800/50 dark:from-gray-900/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-lg font-semibold">Class Dashboard</p>
                      <p className="text-sm">Manage all your classes in one place</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Quizzes Section */}
        <section id="quizzes" className="bg-white dark:bg-gray-800 py-20 sm:py-32">
          {visibleSections['quizzes'] && (
            <div className="mx-auto max-w-7xl px-6 lg:px-8 animate-fade-in-up">
              <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 items-center">
                <div className="lg:order-2 lg:pl-8">
                  <h2 className="text-base font-semibold text-cyan-600 dark:text-cyan-400">Quiz Creation</h2>
                  <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                    Craft Engaging Assessments
                  </p>
                  <p className="mt-6 text-lg text-gray-600 dark:text-gray-200">
                    Design quizzes that captivate students and provide instant feedback.
                  </p>
                  <div className="mt-10 space-y-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 dark:bg-teal-600 text-white">
                          <HelpCircle className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Diverse Question Types</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-200">From multiple-choice to open-ended questions.</p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-cyan-600 dark:bg-cyan-700 text-white">
                          <TrendingUp className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Instant Feedback</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-200">Provide real-time results to students.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Link
                      to="/register"
                      className="inline-flex px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-xl shadow-md transition-all duration-300"
                      aria-label="Get started with quiz creation"
                    >
                      Create Your First Quiz
                    </Link>
                  </div>
                </div>
                <div className="mt-12 sm:mt-16 lg:mt-0 lg:order-1">
                  <div className="relative rounded-2xl shadow-xl overflow-hidden transform lg:-rotate-3 hover:rotate-0 transition-transform duration-500">
                    <img
                      src="https://i.postimg.cc/7YWd28Zb/guys-I-m-an-academic-weapon-now.jpg"
                      alt="Quiz creation interface"
                      className="w-full h-80 object-cover opacity-90"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-teal-800/50 dark:from-gray-900/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-lg font-semibold">Quiz Creator</p>
                      <p className="text-sm">Build engaging quizzes in minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* FAQ Section */}
        <section id="faqs" className="bg-white dark:bg-gray-800 py-20 sm:py-32">
          {visibleSections['faqs'] && (
            <div className="mx-auto max-w-7xl px-6 lg:px-8 animate-fade-in-up">
              <div className="text-center">
                <h2 className="text-base font-semibold text-cyan-600 dark:text-cyan-400">Frequently Asked Questions</h2>
                <p className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
                  Got Questions? We’ve Got Answers
                </p>
                <p className="mt-6 text-lg text-gray-600 dark:text-gray-200">
                  Learn more about how AssessMate can transform your teaching experience.
                </p>
              </div>
              <div className="mt-16 max-w-3xl mx-auto space-y-4">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden"
                    role="region"
                    aria-labelledby={`faq-${idx}`}
                  >
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                      className="w-full px-6 py-4 flex justify-between items-center text-left text-lg font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      aria-expanded={expandedFAQ === idx}
                      aria-controls={`faq-answer-${idx}`}
                      id={`faq-${idx}`}
                    >
                      <span>{faq.question}</span>
                      {expandedFAQ === idx ? (
                        <Minus className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                      ) : (
                        <Plus className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                      )}
                    </button>
                    {expandedFAQ === idx && (
                      <div id={`faq-answer-${idx}`} className="px-6 pb-4 text-gray-600 dark:text-gray-200 animate-fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="bg-white dark:bg-gray-800 py-20 sm:py-32">
          {visibleSections['testimonials'] && (
            <div className="mx-auto max-w-7xl px-6 lg:px-8 animate-fade-in-up">
              <div className="text-center">
                <h2 className="text-base font-semibold text-cyan-600 dark:text-cyan-400">What Our Users Say</h2>
                <p className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">Meet Our Developers</p>
                <p className="mt-6 text-lg text-gray-600 dark:text-gray-200">Hear from our community about how AssessMate transforms education.</p>
              </div>
              <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.name} testimonial={testimonial} />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section id="cta" className="bg-gradient-to-r from-cyan-700 to-teal-700 dark:from-cyan-800 dark:to-teal-800 py-20 sm:py-32">
          {visibleSections['cta'] && (
            <div className="mx-auto max-w-7xl px-6 lg:px-8 animate-fade-in-up">
              <div className="text-center">
                <h2 className="text-4xl font-extrabold text-white sm:text-5xl">Ready to Transform Your Assessments?</h2>
                <p className="mt-6 text-lg text-cyan-100 max-w-2xl mx-auto">
                  Join thousands of educators using AssessMate to create, manage, and analyze assessments with ease.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
                  <Link
                    to="/register"
                    className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    aria-label="Get started with AssessMate"
                  >
                    Get Started Now
                  </Link>
                  <button
                    onClick={() => setShowDemoModal(true)}
                    className="px-8 py-4 text-lg font-semibold text-cyan-700 dark:text-cyan-200 bg-white dark:bg-gray-700 hover:bg-cyan-50 dark:hover:bg-gray-600 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    aria-label="Watch a demo of AssessMate"
                  >
                    Watch Demo
                  </button>
                </div>
                <div className="mt-8 flex items-center justify-center text-sm text-cyan-100">
                  <CheckCircle className="mr-2 h-4 w-4" /> No credit card required
                  <span className="mx-3">•</span>
                  <CheckCircle className="mr-2 h-4 w-4" /> 14-day free trial
                  <span className="mx-3">•</span>
                  <CheckCircle className="mr-2 h-4 w-4" /> Cancel anytime
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-cyan-900 to-teal-900 dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8">
              <a href="#" className="flex items-center" aria-label="AssessMate Home">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center shadow-lg">
                  <Award className="h-7 w-7 text-white" />
                </div>
                <span className="ml-3 text-2xl font-bold text-white">AssessMate</span>
              </a>
              <p className="text-sm leading-6 text-cyan-100">
                Empowering educators with cutting-edge assessment tools for a brighter future.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg bg-cyan-800 dark:bg-gray-700 text-white border border-cyan-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400"
                  required
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-lg text-white flex items-center"
                  aria-label="Subscribe to newsletter"
                >
                  <Send className="h-5 w-5 mr-2" /> Subscribe
                </button>
              </form>
              <div className="flex space-x-6">
                {footerNavigation.social.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-cyan-200 hover:text-white transform hover:scale-110 transition-all duration-300"
                    aria-label={`Follow us on ${item.name}`}
                  >
                    <item.icon className="h-7 w-7" />
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-white">Solutions</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.solutions.map((item) => (
                      <li key={item.name}>
                        <a href={item.href} className="text-sm text-cyan-100 hover:text-white transition-colors">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold text-white">Support</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.support.map((item) => (
                      <li key={item.name}>
                        <a href={item.href} className="text-sm text-cyan-100 hover:text-white transition-colors">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-white">Company</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.company.map((item) => (
                      <li key={item.name}>
                        <a href={item.href} className="text-sm text-cyan-100 hover:text-white transition-colors">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold text-white">Legal</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.legal.map((item) => (
                      <li key={item.name}>
                        <a href={item.href} className="text-sm text-cyan-100 hover:text-white transition-colors">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t border-cyan-800 dark:border-gray-700 pt-8">
            <p className="text-xs text-cyan-200 text-center">© {new Date().getFullYear()} AssessMate Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Sticky CTA Button */}
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
        <Link
          to="/register"
          className="px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center"
          aria-label="Start for free with AssessMate"
        >
          <Award className="h-5 w-5 mr-2" /> Start Free
        </Link>
      </div>

      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-50">
        <div
          className="h-full bg-cyan-600 dark:bg-cyan-400 transition-all duration-100"
          style={{
            width: `${
              (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            }%`,
          }}
        ></div>
      </div>
    </div>
  );
}