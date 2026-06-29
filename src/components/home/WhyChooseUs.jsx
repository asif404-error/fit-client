"use client";
import { motion } from "framer-motion";
import { FiAward, FiUsers, FiCalendar, FiShield } from "react-icons/fi";

const features = [
  { icon: <FiAward size={28} />, title: "Expert Trainers", desc: "All trainers are vetted and certified professionals." },
  { icon: <FiUsers size={28} />, title: "Community Driven", desc: "Join thousands of members supporting each other." },
  { icon: <FiCalendar size={28} />, title: "Flexible Scheduling", desc: "Book classes that fit your busy lifestyle." },
  { icon: <FiShield size={28} />, title: "Safe & Secure", desc: "Your data and payments are always protected." },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Why Choose FitNexus?</h2>
          <p className="section-subtitle">Everything you need to crush your fitness goals</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-xl mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">{f.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;