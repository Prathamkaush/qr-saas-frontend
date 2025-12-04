"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function LoginAnimation() {
  return (
    <div className="hidden md:flex items-center justify-center relative w-full h-full bg-blue-50/30 overflow-hidden">
      
      {/* 🔵 BACKGROUND GLOWING EFFECT */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute w-[300px] h-[300px] bg-blue-500 rounded-full blur-[100px] opacity-40 pointer-events-none"
      />

      {/* CONTAINER FOR ICONS */}
      <div className="relative w-[400px] h-[300px] flex items-center justify-center">

        {/* 1️⃣ KEY (Moves Right & Disappears) */}
        <motion.div
          initial={{ x: -150, opacity: 0, rotate: -45 }}
          animate={{ x: -35, opacity: 1, rotate: 0 }} // Moves to center left
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "backOut" }}
          className="absolute z-10"
        >
          {/* Using motion.img to animate opacity out instantly when lock opens */}
          <motion.div
            animate={{ opacity: 0 }} 
            transition={{ delay: 1.8, duration: 0 }} // Disappear exactly when Unlock appears
          >
            <Image src="/anim-key.png" alt="Key" width={100} height={100} />
          </motion.div>
        </motion.div>

        {/* 2️⃣ LOCK (Moves Left & Disappears) */}
        <motion.div
          initial={{ x: 150, opacity: 0 }}
          animate={{ x: 35, opacity: 1 }} // Moves to center right
          transition={{ duration: 1.5, ease: "backOut" }}
          className="absolute z-10"
        >
          <motion.div
            animate={{ opacity: 0 }}
            transition={{ delay: 1.8, duration: 0 }} // Disappear exactly when Unlock appears
          >
             <Image src="/anim-lock.png" alt="Lock" width={100} height={100} />
          </motion.div>
        </motion.div>

        {/* 3️⃣ UNLOCK ICON (Appears after Key meets Lock) */}
        {/* 3️⃣ UNLOCK ICON */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0, 1, 1, 0],       // Hidden -> Visible -> Visible -> Hidden
            scale: [0.5, 1.1, 1, 1.4]    // Small -> Pop Up -> Settle -> Grow out
          }}
          transition={{
            duration: 1.5,               // Total time for unlock animation
            delay: 1.6,                  // Wait for Key/Lock to finish
            times: [0, 0.2, 0.7, 1],     // Timing percentages for the keyframes above
            ease: "easeInOut"
          }}
          className="absolute z-20"
        >
          <Image 
            src="/anim-unlock.png" 
            alt="Unlock" 
            width={130} 
            height={130} 
            className="drop-shadow-lg" // Added shadow for better visibility
          />
        </motion.div>

        {/* 4️⃣ DASHBOARD (Final Reveal) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            delay: 3.2, // Waits for unlock sequence to finish
            duration: 0.8,
            ease: "easeOut"
          }}
          className="absolute z-30 w-full flex justify-center"
        >
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-blue-100 bg-white">
            <Image
              src="/anim-dashboard.png"
              alt="Dashboard Preview"
              width={450}
              height={300}
              className="object-cover"
            />
            {/* Optional: Add a subtle shine over the dashboard */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
          </div>
        </motion.div>

      </div>
    </div>
  );
}