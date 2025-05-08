'use client';
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";

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

type Message = {
  id: string;
  text: string;
  senderId: string;
  senderEmail: string;
  recipientEmail?: string;
  timestamp: any;
  read: boolean;
  isAdmin?: boolean;
};

export default function Services() {
  const [activeService, setActiveService] = useState(0);
  const [pausedRows, setPausedRows] = useState<{ [key: number]: boolean }>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser?.email) return;

    // Create a query for messages sent by the user
    const q1 = query(
      collection(db, "messages"),
      where("senderEmail", "==", currentUser.email),
      orderBy("timestamp", "asc")
    );

    // Create a separate query for messages received by the user
    const q2 = query(
      collection(db, "messages"),
      where("recipientEmail", "==", currentUser.email),
      orderBy("timestamp", "asc")
    );

    // Listen to both queries and merge the results
    const unsubscribe1 = onSnapshot(q1, (snapshot1) => {
      const sentMessages = snapshot1.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as Message);
      
      const unsubscribe2 = onSnapshot(q2, (snapshot2) => {
        const receivedMessages = snapshot2.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }) as Message);
        
        // Combine and sort all messages by timestamp
        const allMessages = [...sentMessages, ...receivedMessages].sort((a, b) => {
          // Handle missing timestamps
          if (!a.timestamp) return 1;
          if (!b.timestamp) return -1;
          return a.timestamp.seconds - b.timestamp.seconds;
        });
        
        setMessages(allMessages);
      });
      
      return () => unsubscribe2();
    });

    return () => unsubscribe1();
  }, [currentUser]);

  const sendMessage = async () => {
    if (newMessage.trim() === '' || !currentUser?.email) return;
    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        senderId: currentUser.uid,
        senderEmail: currentUser.email,
        recipientEmail: "amielreyes471@gmail.com", 
        timestamp: serverTimestamp(),
        read: false,
        isAdmin: false
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

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

      {/* Services Section */}
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

      {/* Our Work Section */}
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
            {/* Top Row */}
            <motion.div
              className="flex gap-6"
              animate={{ x: ["0%", "-100%"] }}
              transition={{ repeat: Infinity, duration: 60, ease: "linear", repeatType: "loop" }}
              style={{ animationPlayState: pausedRows[0] ? "paused" : "running" }}
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
            </motion.div>

            {/* Bottom Row */}
            <motion.div
              className="flex gap-6"
              animate={{ x: ["-100%", "0%"] }}
              transition={{ repeat: Infinity, duration: 60, ease: "linear", repeatType: "loop" }}
              style={{ animationPlayState: pausedRows[1] ? "paused" : "running" }}
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
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Chat Button and Window */}
      {!isChatOpen ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <button 
            onClick={toggleChat}
            className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 w-80 max-w-full bg-white shadow-2xl rounded-t-lg overflow-hidden flex flex-col z-50"
          style={{ height: isMinimized ? "60px" : "400px" }}
        >
          <div 
            className="bg-blue-600 text-white px-4 py-3 font-bold flex justify-between items-center cursor-pointer"
            onClick={toggleMinimize}
          >
            <span>Chat with us</span>
            <div className="flex items-center space-x-2">
              <button onClick={(e) => { e.stopPropagation(); toggleMinimize(); }} className="text-white hover:text-blue-200">
                {isMinimized ? <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" /></svg> 
                : <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>}
              </button>
              <button onClick={(e) => { e.stopPropagation(); toggleChat(); }} className="text-white hover:text-blue-200">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" /></svg>
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
                {messages.length === 0 && (
                  <div className="bg-blue-100 text-blue-800 p-3 rounded-lg max-w-xs">
                    Welcome to our support chat! How can we assist you today? Feel free to inquire now, and we'll be happy to help with any questions or concerns.
                  </div>
                )}
                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`p-3 rounded-lg max-w-xs ${msg.isAdmin ? 'bg-blue-100 text-blue-800' : 'ml-auto bg-blue-600 text-white'}`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp?.toDate()?.toLocaleTimeString() || 'Just now'}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t bg-white flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 p-2 text-sm border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Type your message..."
                  onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </main>
  );
}