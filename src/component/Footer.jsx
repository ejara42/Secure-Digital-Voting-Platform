import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaTelegramPlane,
  FaShieldAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaChevronRight,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 to-gray-950 border-t border-gray-800 overflow-hidden">

      {/* Enhanced Decorative Elements */}
      <div className="absolute top-0 left-0 w-full overflow-hidden rotate-180">
        <svg
          className="w-full h-32 md:h-40"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39 56.39C180.36 82.27 76.62 98.38 0 108.22V0h1200v27.35c-95.31 33.22-261.94 66.65-456.68 46.49C603.93 56.92 464.39 28.51 321.39 56.39z"
            className="fill-gray-800 opacity-30"
          />
        </svg>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gray-900 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gray-800 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-20 grid gap-12 md:grid-cols-3 text-gray-300">

        {/* Enhanced Identity Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gray-800 rounded-xl blur-lg opacity-50"></div>
              <FaShieldAlt className="relative text-gray-200 text-3xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
                Ethiopia National Online Election System
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full mt-3"></div>
            </div>
          </div>

          <p className="text-base leading-relaxed text-gray-300 bg-gray-800/40 backdrop-blur-sm p-5 rounded-xl border border-gray-700/50 shadow-lg">
            A secure, transparent, and verifiable digital voting platform
            designed to protect democratic integrity and voter confidence.
            Empowering every citizen with accessible and trustworthy elections.
          </p>

          <div className="flex items-center gap-3 text-base">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-full blur-sm opacity-50"></div>
              <FaLock className="relative text-emerald-400 text-lg" />
            </div>
            <div>
              <span className="text-gray-200 font-semibold">System Status: </span>
              <span className="text-emerald-400 font-medium">Operational & Secure</span>
            </div>
          </div>
        </div>

        {/* Enhanced Contact Section */}
        <div>
          <h3 className="text-base font-semibold uppercase tracking-wider text-gray-200 mb-7 relative inline-block">
            Official Contact
            <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-gray-600 to-transparent"></span>
          </h3>

          <ul className="space-y-5">
            {[
              {
                icon: <FaEnvelope className="text-gray-300" />,
                label: "Email Address",
                content: (
                  <a
                    href="mailto:info@nationalelection.et"
                    className="text-gray-100 hover:text-white font-medium transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group"
                  >
                    info@nationalelection.et
                    <FaChevronRight className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ),
              },
              {
                icon: <FaMapMarkerAlt className="text-gray-300" />,
                label: "Headquarters Address",
                content: "National Election Board of Ethiopia, Addis Ababa",
              },
              {
                icon: <FaClock className="text-gray-300" />,
                label: "Support Service Hours",
                content: "Monday – Friday, 9:00 AM – 5:00 PM Local Time",
              },
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-4 group">
                <div className="mt-1 p-3 bg-gray-800/50 rounded-lg shadow-md border border-gray-700/50">
                  {item.icon}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-400 mb-1">{item.label}</div>
                  <div className="text-base text-gray-100 mt-1 leading-snug">{item.content}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Enhanced Social Section */}
        <div>
          <h3 className="text-base font-semibold uppercase tracking-wider text-gray-200 mb-7 relative inline-block">
            Official Channels
            <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-gray-600 to-transparent"></span>
          </h3>

          <p className="text-base text-gray-300 mb-7 leading-relaxed">
            Stay updated with official announcements, election information,
            and real-time updates through our verified channels.
          </p>

          <div className="flex gap-3 flex-wrap mb-8">
            {[
              {
                icon: <FaFacebookF />,
                label: "Facebook",
                bg: "bg-gray-800 hover:bg-gray-700",
                border: "border border-gray-700",
              },
              {
                icon: <FaInstagram />,
                label: "Instagram",
                bg: "bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800",
                border: "border border-gray-700",
              },
              {
                icon: <FaTwitter />,
                label: "Twitter",
                bg: "bg-gray-800 hover:bg-gray-700",
                border: "border border-gray-700",
              },
              {
                icon: <FaTelegramPlane />,
                label: "Telegram",
                bg: "bg-gray-800 hover:bg-gray-700",
                border: "border border-gray-700",
              },
            ].map((item, i) => (
              <a
                key={i}
                href="#"
                aria-label={item.label}
                className={`
                  relative group
                  w-14 h-14 rounded-xl
                  flex items-center justify-center
                  text-gray-300 text-xl
                  transition-all duration-300
                  ${item.bg} ${item.border}
                  shadow-lg hover:shadow-xl
                  transform hover:-translate-y-1
                  overflow-hidden
                `}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Icon */}
                <div className="relative z-10 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>

                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 
                              bg-gray-900 text-gray-100 text-sm px-4 py-2 rounded-lg
                              opacity-0 group-hover:opacity-100 transition-all duration-300
                              whitespace-nowrap pointer-events-none border border-gray-700
                              shadow-2xl">
                  {item.label}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 
                                w-3 h-3 bg-gray-900 transform rotate-45 border-b border-r border-gray-700"></div>
                </div>
              </a>
            ))}
          </div>

          {/* Quick Links */}
          <div className="pt-6 border-t border-gray-700/50">
            <div className="text-sm font-semibold text-gray-300 mb-4">Important Links</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { text: "Privacy Policy", icon: <FaCheckCircle className="text-xs" /> },
                { text: "Terms of Service", icon: <FaCheckCircle className="text-xs" /> },
                { text: "Accessibility", icon: <FaCheckCircle className="text-xs" /> },
                { text: "Help Center", icon: <FaCheckCircle className="text-xs" /> },
              ].map((link, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-sm text-gray-300 hover:text-white transition-all duration-300 
                           flex items-center gap-2 group hover:translate-x-1"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400">
                    {link.icon}
                  </span>
                  <span className="hover:underline">{link.text}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Bar */}
      <div className="relative border-t border-gray-800 bg-gray-900/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-base text-gray-400 text-center lg:text-left">
              © {currentYear} National Election Board of Ethiopia • All Rights Reserved •
              <span className="text-gray-300 font-medium ml-2">Secure Digital Voting Platform</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-sm font-semibold text-emerald-400 bg-gray-800/60 px-4 py-2.5 rounded-full 
                           flex items-center gap-3 border border-gray-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span>ISO 27001 Certified</span>
                </div>
                <div className="h-4 w-px bg-gray-700"></div>
                <div className="text-gray-300 font-normal">Version 2.1.4</div>
              </div>

              <div className="hidden md:block text-sm text-gray-500">
                <span className="text-gray-400 font-medium">Last Updated: </span>
                {currentYear}-12-15
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-6 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="relative">
                <div className="absolute inset-0 bg-gray-800 rounded-full blur-sm"></div>
                <FaShieldAlt className="relative text-gray-500" />
              </div>
              <span>End-to-End Encrypted</span>
            </div>
            <div className="h-4 w-px bg-gray-800 hidden sm:block"></div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="relative">
                <div className="absolute inset-0 bg-gray-800 rounded-full blur-sm"></div>
                <FaLock className="relative text-gray-500" />
              </div>
              <span>Government Certified Security</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}