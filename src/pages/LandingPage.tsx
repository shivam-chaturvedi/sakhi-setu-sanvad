import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Users, BookOpen, Brain, Phone, MapPin, Clock, Star, Sparkles, ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Background3D from '@/components/3D/Background3D';
import ParticlesBackground from '@/components/3D/Particles';
import ResponsiveHeader from '@/components/ResponsiveHeader';
import ResponsiveFooter from '@/components/ResponsiveFooter';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-light/20 via-pink-light/20 to-neon-purple/10 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 border-4 border-neon-pink/30 border-t-neon-pink rounded-full animate-spin"></div>
          <p className="text-neon-pink dark:text-neon-pink font-medium">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  const features = [
    {
      icon: Heart,
      title: 'Symptom Tracking',
      description: 'Track your menopause symptoms with AI-powered insights',
      color: 'text-neon-pink',
      bgColor: 'bg-neon-pink/10 dark:bg-neon-pink/20'
    },
    {
      icon: Brain,
      title: 'AI Analytics',
      description: 'Get personalized recommendations based on your data',
      color: 'text-neon-purple',
      bgColor: 'bg-neon-purple/10 dark:bg-neon-purple/20'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with other women going through similar experiences',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: BookOpen,
      title: 'Educational Resources',
      description: 'Access expert talks, videos, and articles in Marathi & Hindi',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: Phone,
      title: 'Voice Assistant',
      description: 'Interact with our Marathi chatbot for instant support',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      icon: MapPin,
      title: 'PHC Directory',
      description: 'Find nearby Primary Health Centers and healthcare providers',
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    }
  ];


  const floatingElements = [
    { icon: Heart, delay: 0, x: 10, y: 20, size: 'w-8 h-8' },
    { icon: Sparkles, delay: 0.5, x: 80, y: 30, size: 'w-6 h-6' },
    { icon: Users, delay: 1, x: 20, y: 70, size: 'w-7 h-7' },
    { icon: Brain, delay: 1.5, x: 70, y: 80, size: 'w-5 h-5' },
    { icon: Shield, delay: 2, x: 30, y: 40, size: 'w-6 h-6' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-light/20 via-pink-light/20 to-neon-purple/10 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden">

      {/* Responsive Header */}
      <ResponsiveHeader />
      
      {/* 3D Background */}
      <Background3D />
      
      {/* Particles Background */}
      <ParticlesBackground />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-neon-pink/20 dark:bg-neon-pink/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-80 h-80 bg-neon-purple/20 dark:bg-neon-purple/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-72 h-72 bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating Icons */}
        {floatingElements.map((element, index) => {
          const Icon = element.icon;
          return (
            <motion.div
              key={index}
              className={`absolute text-neon-pink/30 dark:text-neon-pink/20 ${element.size}`}
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4 + index,
                repeat: Infinity,
                ease: "easeInOut",
                delay: element.delay,
              }}
            >
              <Icon className="w-full h-full" />
            </motion.div>
          );
        })}

        {/* Animated Particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-pink/40 dark:bg-neon-pink/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>


      {/* Hero Section */}
      <motion.section
        id="home"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 px-6 py-20 pt-32 text-center"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-left lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Badge className="mb-4 bg-neon-pink/10 dark:bg-neon-pink/20 text-neon-pink dark:text-neon-pink border-neon-pink/30 dark:border-neon-pink/50">
                  🛡️ Trusted by 10,000+ Women
                </Badge>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
              >
                Your Journey Through
                <span className="bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent"> Menopause</span>
                <br />Starts Here
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
              >
                Personalized, culturally relevant wellness support for women in India.
                Track symptoms, get AI insights, and connect with a supportive community.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/auth')}
                    className="bg-gradient-to-r from-neon-purple to-neon-pink hover:from-purple-dark hover:to-pink-dark text-white text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => navigate('/auth')}
                    className="text-lg px-8 py-3 border-2 border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-white transition-all duration-300"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right side - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="relative"
            >
              <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/home-main.png"
                  alt="MyMenoSakhi - Menopause Support"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              {/* Floating elements around the image */}
              <motion.div
                className="absolute -top-4 -right-4 w-20 h-20 bg-neon-pink/20 rounded-full blur-xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-neon-purple/20 rounded-full blur-xl"
                animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 px-6 py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for Your Menopause Journey
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Comprehensive support designed specifically for Indian women
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <motion.div
                        className={`w-16 h-16 mx-auto mb-4 rounded-full ${feature.bgColor} flex items-center justify-center`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className={`w-8 h-8 ${feature.color}`} />
                      </motion.div>
                      <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{feature.title}</h4>
                      <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>


      {/* CTA Section */}
      <motion.section
        id="about"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 px-6 py-16 bg-gradient-to-r from-neon-purple to-neon-pink text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-3xl font-bold mb-4"
          >
            Ready to Take Control of Your Menopause Journey?
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-xl mb-8 opacity-90"
          >
            Join thousands of women who are already using MyMenoSakhi to navigate menopause with confidence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-white text-neon-pink hover:bg-gray-100 text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        id="testimonials"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-br from-purple-light/20 via-pink-light/20 to-neon-purple/10 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of women who have found support and guidance through their menopause journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                location: "Mumbai, India",
                content: "MyMenoSakhi has been a lifesaver during my menopause journey. The symptom tracking and AI insights helped me understand my body better.",
                rating: 5
              },
              {
                name: "Anita Patel",
                location: "Delhi, India",
                content: "The community support is incredible. I never felt alone in this journey thanks to the amazing women I've connected with here.",
                rating: 5
              },
              {
                name: "Sunita Reddy",
                location: "Bangalore, India",
                content: "The educational resources and expert guidance have empowered me to take control of my health and well-being.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-neon-pink/10 dark:bg-neon-pink/20 rounded-full flex items-center justify-center mr-3">
                    <Heart className="w-5 h-5 text-neon-pink" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-white dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Have questions? We're here to help you on your menopause journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-neon-pink/10 dark:bg-neon-pink/20 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-neon-pink" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Phone Support</h3>
                  <p className="text-gray-600 dark:text-gray-300">+91 98765 43210</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mon-Fri, 9AM-6PM IST</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-neon-pink/10 dark:bg-neon-pink/20 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-neon-pink" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Office Address</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    123 Health Street<br />
                    Mumbai, Maharashtra 400001<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-neon-pink/10 dark:bg-neon-pink/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-neon-pink" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Response Time</h3>
                  <p className="text-gray-600 dark:text-gray-300">Within 24 hours</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">We respond to all inquiries promptly</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-neon-pink focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-neon-pink focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-neon-pink focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                <Button className="w-full bg-gradient-to-r from-neon-purple to-neon-pink hover:from-purple-dark hover:to-pink-dark text-white py-3 text-lg">
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Responsive Footer */}
      <ResponsiveFooter />
    </div>
  );
};

export default LandingPage;