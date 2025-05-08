'use client'; 

import { motion } from 'framer-motion';

export default function AboutUs() {

  const floatVariants = {
    initial: { y: 0 },
    float: {
      y: [-5, 5, -5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen p-6 sm:p-12 bg-lightblue bg-[url('/layeredwaves.svg')] bg-no-repeat bg-bottom bg-cover overflow-hidden">

      <motion.div 
        initial="initial"
        animate="float"
        variants={floatVariants}
        className="text-center mb-12 sm:mb-16 mt-8"
      >
        <h1 className="text-6xl sm:text-8xl font-bold from-blue-500 to-slate-400 bg-gradient-to-br text-transparent bg-clip-text mb-4 sm:mb-6">
          ABOUT US
        </h1>
        <p className="text-lg sm:text-xl text-white max-w-2xl mx-auto">
        Welcome to Magesco Garden and Pool Services! An all-inclusive service store that delivers both exceptional swimming pool and landscaping service needs and affordable swimming pool and landscaping products, without sacrificing the quality and durability on both products and services.        </p>
      </motion.div>


      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 w-full max-w-6xl"
      >
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02 }}
          className="bg-white/30 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl border border-white/20 w-full transition-all duration-300"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Our Mission</h2>
          </div>
          <p className="text-gray-700 pl-0 sm:pl-14">
          MAGESCO Garden and Pool Services is dedicated in providing quality services and products to its clients together with a good and lasting after service that builds relationship and partnership.

It is our mission to competently maintain high quality and affordable construction services, maintenance services and products align with swimming pool and landscape needs. Together with this is a mission for a long and lasting client relationship in terms of after service and technical support.

Our challenge is to continually develop these high standards in customer services and products as well as promoting personal employee growth.          </p>
        </motion.div>

        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02 }}
          className="bg-white/30 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl border border-white/20 w-full transition-all duration-300"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Our Vision</h2>
          </div>
          <p className="text-gray-700 pl-0 sm:pl-14">
          MAGESCO Garden and Pool Services envisioned itself to be the best Land Developer in terms of Swimming Pool construction, Landscape development and Home Improvement in the Philippines.

MAGESCO Garden and Pool Services also wants to become the best in terms of quality maintenance services, both in providing its clients manpower for services and in-house maintenance for their home and business as well.          </p>
        </motion.div>
      </motion.div>

  
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-8 sm:mt-12"
      >
        
      </motion.div>
    </main>
  );
}