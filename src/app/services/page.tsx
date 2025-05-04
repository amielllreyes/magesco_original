'use client';
import { motion } from "framer-motion";
import { useState } from "react";

const services = [
  {
    title: "Pool Repair & Maintenance",
    description: "Professional pool repair services to keep your swimming pool in perfect condition year-round.",
    image: "/poolrepair.jpg"
  },
  {
    title: "Landscape Design",
    description: "Custom landscape designs tailored to your property's unique characteristics and personal style.",
    image: "/landscapedesignbg.jpg"
  },
  {
    title: "Garden Services",
    description: "Complete garden maintenance including planting, pruning, and seasonal care.",
    image: "/gardenservicebg.jpg"
  }
];

export default function Services() {
  const [activeService, setActiveService] = useState(0);
  const [pausedRows, setPausedRows] = useState<{ [key: number]: boolean }>({});

  return (
    <main className="flex flex-col bg-lightblue">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        className="relative flex flex-col justify-center items-center min-h-screen px-6 sm:px-12 bg-[url('/layeredwaves.svg')] bg-no-repeat bg-bottom bg-cover text-center"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-7xl md:text-8xl font-bold from-blue-500 to-slate-400 bg-gradient-to-br text-transparent bg-clip-text mb-6"
          >
            <span className="block">Transform Your</span>
            <span className="block">Outdoor Space</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl sm:text-2xl text-white mt-8 max-w-2xl mx-auto"
          >
            Premium landscaping and pool services to create your perfect outdoor oasis
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-10"
        >
          <a href="#services" className="flex flex-col items-center group">
            <span className="text-white text-lg mb-2 group-hover:text-blue-200 transition">Explore Services</span>
            <svg className="w-10 h-10 text-white group-hover:text-blue-200 group-hover:animate-bounce transition" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </a>
        </motion.div>
      </motion.section>

 
      <motion.section 
        id="services"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-20 px-6 sm:px-12 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-center mb-16 text-gray-800"
          >
            Our <span className="text-blue-600">Services</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      


      <motion.section
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
  className="py-20 px-6 sm:px-12 bg-white"
>
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-gray-800">
      Our <span className="text-blue-600">Work</span>
    </h2>

    <div className="relative w-full overflow-hidden space-y-6">

      <motion.div
        className="flex gap-6"
        animate={{ x: ["0%", "-100%"] }}
        transition={{
          repeat: Infinity,
          duration: 60, 
          ease: "linear",
          repeatType: "loop",
        }}
        style={{
          animationPlayState: pausedRows[0] ? "paused" : "running",
        }}
        onMouseEnter={() => setPausedRows((prev) => ({ ...prev, 0: true }))}
        onMouseLeave={() => setPausedRows((prev) => ({ ...prev, 0: false }))}
      >
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`top-${i}`}
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 w-80 h-64 rounded-2xl overflow-hidden shadow-md"
          >
            <img
              src={`/img/top-${i + 1}.jpg`}
              alt={`Our work sample ${i + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}
      
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`top-dup-${i}`}
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 w-80 h-64 rounded-2xl overflow-hidden shadow-md"
            aria-hidden="true"
          >
            <img
              src={`/images/gallery/top-${i + 1}.jpg`}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}
      </motion.div>

      
      <motion.div
        className="flex gap-6"
        animate={{ x: ["-100%", "0%"] }} 
        transition={{
          repeat: Infinity,
          duration: 60,
          ease: "linear",
          repeatType: "loop",
        }}
        style={{
          animationPlayState: pausedRows[1] ? "paused" : "running",
        }}
        onMouseEnter={() => setPausedRows((prev) => ({ ...prev, 1: true }))}
        onMouseLeave={() => setPausedRows((prev) => ({ ...prev, 1: false }))}
      >
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`bottom-${i}`}
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 w-80 h-64 rounded-2xl overflow-hidden shadow-md"
          >
            <img
              src={`/img/bottom-${i + 1}.jpg`}
              alt={`Our work sample ${i + 11}`} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}
       
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`bottom-dup-${i}`}
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 w-80 h-64 rounded-2xl overflow-hidden shadow-md"
            aria-hidden="true"
          >
            <img
              src={`/images/gallery/bottom-${i + 1}.jpg`}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  </div>
</motion.section>

     
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 px-6 sm:px-12 bg-blue-600 text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Transform Your Space?</h2>
          <p className="text-xl mb-8 opacity-90">
            Contact us today for a free consultation and let's create your dream outdoor living area.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg">
              Call Now
            </button>
            <a 
              href="mailto:amielreyes471@gmail.com" 
              className="px-8 py-3 bg-transparent border-2 border-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition"
            >
              Email Us
            </a>
          </div>
        </div>
      </motion.section>
    </main>
  );
}