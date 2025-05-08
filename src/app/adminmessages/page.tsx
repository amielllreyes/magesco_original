'use client';
import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '@/config/firebaseConfig';
import { FiUser, FiMessageSquare, FiSend } from 'react-icons/fi';

type Message = {
  id: string;
  text: string;
  senderId: string;
  senderEmail: string;
  timestamp: any;
  read: boolean;
  isAdmin: boolean;
  recipientEmail?: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser?.email) return;

    let unsubscribe: (() => void) | undefined;

    if (selectedUser) {
      // Create separate queries instead of using 'or'
      const q1 = query(
        collection(db, "messages"),
        where("senderEmail", "==", selectedUser),
        orderBy("timestamp", "asc")
      );
      
      const q2 = query(
        collection(db, "messages"),
        where("recipientEmail", "==", selectedUser),
        where("isAdmin", "==", true),
        orderBy("timestamp", "asc")
      );

      // Listen to both queries and merge results
      const unsubscribe1 = onSnapshot(q1, snapshot1 => {
        const sentMessages = snapshot1.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }) as Message);
        
        const unsubscribe2 = onSnapshot(q2, snapshot2 => {
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
          
          // Mark admin messages as read
          allMessages.forEach(msg => {
            if (msg.isAdmin && !msg.read) {
              updateDoc(doc(db, "messages", msg.id), { read: true });
            }
          });
        });
        
        unsubscribe = () => {
          unsubscribe1();
          unsubscribe2();
        };
      });
    } else {
      // For all messages, we just use a simple query
      const q = query(
        collection(db, "messages"),
        orderBy("timestamp", "asc")
      );
      
      unsubscribe = onSnapshot(q, snapshot => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }) as Message);
        
        setMessages(msgs);
        
        msgs.forEach(msg => {
          if (msg.isAdmin && !msg.read) {
            updateDoc(doc(db, "messages", msg.id), { read: true });
          }
        });
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser, selectedUser]);

  const markAsRead = async (messageId: string) => {
    try {
      await updateDoc(doc(db, "messages", messageId), { read: true });
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedUser || !currentUser?.email) return;
    
    try {
      await addDoc(collection(db, "messages"), {
        text: replyText,
        senderId: currentUser.uid,
        senderEmail: currentUser.email,
        recipientEmail: selectedUser,
        timestamp: serverTimestamp(),
        read: false,
        isAdmin: true
      });
      setReplyText('');
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  const filteredMessages = selectedUser
    ? messages.filter(msg => 
        msg.senderEmail === selectedUser || 
        (msg.isAdmin && msg.recipientEmail === selectedUser)
      )
    : messages;

  const groupedMessages = filteredMessages.reduce((acc, message) => {
    const lastGroup = acc[acc.length - 1];
    if (lastGroup && lastGroup[0].isAdmin === message.isAdmin) {
      lastGroup.push(message);
    } else {
      acc.push([message]);
    }
    return acc;
  }, [] as Message[][]);

  const uniqueSenders = Array.from(new Set(
    messages
      .filter(msg => !msg.isAdmin)
      .map(msg => msg.senderEmail)
      .filter(Boolean)
  ));

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Customer Messages</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/4 bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-4 text-lg">Customers</h2>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedUser(null)}
              className={`w-full text-left p-3 rounded flex items-center ${
                !selectedUser ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
              }`}
            >
              <FiUser className="mr-2" />
              All Messages ({messages.length})
            </button>
            
            {uniqueSenders.map(email => (
              <button
                key={email}
                onClick={() => setSelectedUser(email)}
                className={`w-full text-left p-3 rounded flex justify-between items-center ${
                  selectedUser === email ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center truncate">
                  <FiUser className="mr-2 flex-shrink-0" />
                  <span className="truncate">{email}</span>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {messages.filter(m => m.senderEmail === email).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-4 text-lg">
            {selectedUser ? `Conversation with ${selectedUser}` : 'All Messages'}
          </h2>
          
          {filteredMessages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No messages found</p>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {groupedMessages.map((messageGroup, i) => (
                <div 
                  key={i} 
                  className={`flex flex-col ${messageGroup[0].isAdmin ? 'items-start' : 'items-end'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-4 ${
                      messageGroup[0].isAdmin ? 'bg-blue-100 text-blue-800' : 'bg-blue-600 text-white'
                    }`}
                  >
                    {messageGroup.map((message, j) => (
                      <div 
                        key={message.id} 
                        className={j > 0 ? 'mt-2' : ''}
                        onClick={() => !message.read && markAsRead(message.id)}
                      >
                        <p className="whitespace-pre-wrap break-words">{message.text}</p>
                        {j === messageGroup.length - 1 && (
                          <div className="text-xs opacity-70 mt-1">
                            {message.timestamp?.toDate().toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedUser && (
            <div className="mt-4 flex items-center">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Type your reply..."
                onKeyDown={(e) => e.key === 'Enter' && sendReply()}
              />
              <button
                onClick={sendReply}
                className="bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700 transition"
              >
                <FiSend />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}