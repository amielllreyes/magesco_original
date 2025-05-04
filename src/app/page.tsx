"use client";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex flex-col">
     
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative flex justify-center items-center min-h-screen p-12 md:p-6 sm:p-4 font-bold"
      >
        <div 
          className="absolute inset-0 bg-black/30 z-0" 
          aria-hidden="true"
        />
        <img
          src="/img/MagescoGardenandPoolServices.jpg"
          alt="Magesco Garden and Pool Services"
          className="absolute inset-0 w-full h-full object-cover object-center z-[-1]"
        />
        
        <a 
          href="#next-section" 
          className="absolute bottom-10 animate-bounce flex flex-col items-center z-10 group"
          aria-label="Scroll to next section"
        >
          <h1 className="text-white text-lg md:text-xl font-medium mb-2 group-hover:text-blue-200 transition-colors">
            Learn more about us
          </h1>
          <div className="relative h-20 w-12">
            <svg 
              className="w-12 h-12 text-white group-hover:text-blue-200 transition absolute top-0"
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path fillRule="evenodd" d="M12 14l6-6-1.5-1.5L12 11 7.5 6.5 6 8z"/>
            </svg>
            <svg 
              className="w-12 h-12 text-white/70 group-hover:text-blue-200/70 transition absolute top-4"
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path fillRule="evenodd" d="M12 16.5l6-6-1.5-1.5L12 13.5 7.5 9l-1.5 1.5z"/>
            </svg>
          </div>
        </a>
      </motion.section>

      
      <motion.section 
        id="next-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="flex flex-col justify-center items-center min-h-screen p-12 md:p-6 sm:p-4 bg-lightblue bg-[url('/layeredwaves.svg')] bg-no-repeat bg-bottom bg-cover relative"
      >
        <div className="absolute inset-0 bg-black/5 z-0" aria-hidden="true" />
        
        <motion.h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-[-30px] mb-8 z-10 text-center px-4"
          style={{
            background: "linear-gradient(to right, #3b82f6, #94a3b8)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          Welcome to Magesco Garden and Pool Services
        </motion.h1>
        
        <motion.div 
  className="mt-5 text-xl sm:text-2xl lg:text-3xl font-medium text-center leading-relaxed max-w-4xl lg:max-w-6xl px-4 sm:px-8 md:px-12 lg:px-32 border-l-[12px] border-blue-500 pl-6 sm:pl-10 bg-white/20 backdrop-blur-sm py-8 rounded-r-xl z-10 whitespace-pre-wrap"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ staggerChildren: 0.05 }}
>
  {`Transform your outdoor space with our premium pool and landscaping services. From stunning pools to lush garden designs, we bring your dream backyard to life. Explore our easy-to-use website and discover endless possibilities for your perfect outdoor oasis. Book consultations, browse projects, and get expert advice all in one place. Your beautiful, customized landscape is just a click away!`
    .split(" ").map((word, index) => (
      <motion.span 
        key={index} 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: index * 0.05 }}
      >
        {word}{" "}
      </motion.span>
    ))}
</motion.div>
      </motion.section>

     
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="min-h-screen p-12 md:p-6 sm:p-4 bg-lightblue bg-[url('/layeredwaves.svg')] bg-no-repeat bg-bottom bg-cover relative"
      >
        <div className="absolute inset-0 bg-black/5 z-0" aria-hidden="true" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mt-12 sm:mt-20 mb-16 text-center"
            style={{
              background: "linear-gradient(to right, #3b82f6, #94a3b8)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            Featured Works
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex justify-center items-center"
          >
            <Carousel className="w-full max-w-6xl mx-auto">
              <CarouselContent className="-ml-1">
                {["img/top-1.jpg", "img/top-2.jpg", "img/top-3.jpg", "img/bottom-1.jpg", "img/bottom-2.jpg", "img/bottom-3.jpg"].map((image, index) => (
                  <CarouselItem key={index} className="pl-1 basis-full sm:basis-1/2 lg:basis-1/3">
                    <div className="p-2">
                      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="flex aspect-[4/3] items-center justify-center p-0 relative group">
                          <motion.img 
                            src={`/${image}`} 
                            alt={`Featured work ${index + 1}`} 
                            className="object-cover w-full h-full"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <span className="text-white font-medium text-lg">
                              Project {index + 1}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex left-2" />
              <CarouselNext className="hidden sm:flex right-2" />
            </Carousel>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}