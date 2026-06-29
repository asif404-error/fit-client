"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const Banner = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-orange-500 rounded-full blur-3xl opacity-20"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            🔥 Your Fitness Journey Starts Here
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-black text-white leading-tight mb-6"
        >
          Unlock Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-orange-400">
            Full Potential
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10"
        >
          Join FitNexus and discover world-class fitness classes, expert trainers, and a community that pushes you to be your best self every single day.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/classes" className="btn-primary text-base px-8 py-3">
            Explore Classes
          </Link>
          <Link
            href="/forum"
            className="border border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-lg transition"
          >
            Join Community
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-10 mt-16"
        >
          {[
            { value: "500+", label: "Classes" },
            { value: "50+", label: "Trainers" },
            { value: "10K+", label: "Members" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black text-white">{stat.value}</div>
              <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;