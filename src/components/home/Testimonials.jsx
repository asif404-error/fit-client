"use client";
import { motion } from "framer-motion";

const testimonials = [
  { name: "Sarah M.", role: "Member", text: "FitNexus completely transformed my fitness routine. The trainers are world-class!", avatar: "https://i.pravatar.cc/100?img=1" },
  { name: "James R.", role: "Member", text: "Best platform for finding quality fitness classes. Highly recommend!", avatar: "https://i.pravatar.cc/100?img=3" },
  { name: "Priya K.", role: "Trainer", text: "As a trainer, FitNexus gave me the tools to grow my classes and reach more students.", avatar: "https://i.pravatar.cc/100?img=5" },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">What Our Members Say</h2>
          <p className="section-subtitle">Real stories from our amazing community</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card p-6"
            >
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-5">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white text-sm">{t.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;