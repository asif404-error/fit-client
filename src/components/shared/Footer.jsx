import Link from "next/link";
import { FaXTwitter, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          <div>
            <Link href="/" className="flex items-center gap-1 mb-3">
              <span className="text-2xl font-black text-indigo-400">Fit</span>
              <span className="text-2xl font-black text-orange-400">Nexus</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your ultimate fitness companion. Discover classes, connect with trainers, and achieve your goals.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/classes", label: "All Classes" },
                { href: "/forum", label: "Community Forum" },
                { href: "/login", label: "Login" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-indigo-400 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>📧 support@fitnexus.com</li>
              <li>📞 +1 (800) 123-4567</li>
              <li>📍 123 Fitness Ave, New York, NY</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4 text-xl">
              <a href="#" className="hover:text-indigo-400 transition"><FaXTwitter /></a>
              <a href="#" className="hover:text-blue-400 transition"><FaFacebook /></a>
              <a href="#" className="hover:text-pink-400 transition"><FaInstagram /></a>
              <a href="#" className="hover:text-red-400 transition"><FaYoutube /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FitNexus. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;