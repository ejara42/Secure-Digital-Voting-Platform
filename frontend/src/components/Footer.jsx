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
    <footer className="relative bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 border-t border-gray-800 overflow-hidden">

      {/* ================= BACKGROUND DECOR ================= */}
      <div className="absolute inset-0 pointer-events-none">
        {/* soft grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
        {/* glow */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid gap-14 md:grid-cols-3 text-gray-300">

        {/* ========== IDENTITY ========= */}
        <div className="space-y-7">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600/20 to-emerald-600/20 border border-gray-700 shadow-lg">
              <FaShieldAlt className="text-3xl text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-100 leading-tight">
                National Online Election System
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Federal Democratic Republic of Ethiopia
              </p>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mt-3" />
            </div>
          </div>

          <p className="text-gray-300 leading-relaxed bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800 shadow-lg">
            A nationally trusted digital election platform ensuring
            transparency, integrity, and secure participation for every
            eligible citizen.
          </p>

          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-400 font-medium">
              System Operational & Secure
            </span>
          </div>
        </div>

        {/* ========== CONTACT ========= */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-200 mb-8">
            Official Contact
          </h3>

          <ul className="space-y-6">
            <ContactItem
              icon={<FaEnvelope />}
              label="Email"
              content={
                <a
                  href="mailto:info@nationalelection.et"
                  className="hover:text-white transition flex items-center gap-2"
                >
                  info@nationalelection.et
                  <FaChevronRight className="text-xs opacity-60" />
                </a>
              }
            />
            <ContactItem
              icon={<FaMapMarkerAlt />}
              label="Address"
              content="National Election Board of Ethiopia, Addis Ababa"
            />
            <ContactItem
              icon={<FaClock />}
              label="Support Hours"
              content="Mon – Fri • 9:00 AM – 5:00 PM"
            />
          </ul>
        </div>

        {/* ========== SOCIAL & LINKS ========= */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-200 mb-8">
            Official Channels
          </h3>

          <p className="text-gray-300 mb-8 leading-relaxed">
            Follow verified government channels for official election updates
            and announcements.
          </p>

          <div className="flex gap-4 mb-10">
            {[FaFacebookF, FaInstagram, FaTwitter, FaTelegramPlane].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-14 h-14 rounded-xl flex items-center justify-center
                             bg-gray-900 border border-gray-800 text-gray-300
                             hover:text-white hover:border-emerald-500/50
                             hover:-translate-y-1 transition-all duration-300 shadow-lg"
                >
                  <Icon className="text-xl" />
                </a>
              )
            )}
          </div>

          <div className="pt-6 border-t border-gray-800">
            <div className="grid grid-cols-2 gap-4">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Accessibility",
                "Help Center",
              ].map((text, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
                >
                  <FaCheckCircle className="text-emerald-400 text-xs" />
                  {text}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="relative border-t border-gray-800 bg-gray-950/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row items-center justify-between gap-6">

          <p className="text-gray-400 text-sm text-center lg:text-left">
            © {currentYear} National Election Board of Ethiopia •
            <span className="text-gray-300 ml-1">
              Secure Digital Voting Infrastructure
            </span>
          </p>

          <div className="flex items-center gap-4">
            <Badge icon={<FaShieldAlt />} text="ISO 27001" />
            <Badge icon={<FaLock />} text="End-to-End Encrypted" />
          </div>
        </div>
      </div>
    </footer>
  );
}


function ContactItem({ icon, label, content }) {
  return (
    <li className="flex items-start gap-4">
      <div className="p-3 bg-gray-900 rounded-lg border border-gray-800">
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-400">{label}</div>
        <div className="text-gray-100 mt-1">{content}</div>
      </div>
    </li>
  );
}

function Badge({ icon, text }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 border border-gray-800 text-sm text-gray-300">
      {icon}
      {text}
    </div>
  );
}
