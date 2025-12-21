import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useTranslation } from "react-i18next";

export default function NavBar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || null);
  const [langOpen, setLangOpen] = useState(false);

  const langRef = useRef();

  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setLangOpen(false);
  };

  const navItems = [
    { name: t("home"), path: "/" },
    { name: t("ballots"), path: "/ballots" },
    { name: t("vote"), path: "/vote" },
    { name: t("candidates"), path: "/candidates" },
    { name: t("results"), path: "/results" },
    { name: t("admin"), path: "/admin", roles: ["admin"] },
    { name: t("login"), path: "/login", roles: ["guest"] },
    {
      name: t("logout"),
      path: "/",
      roles: ["admin", "voter"],
      action: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setUserRole(null);
        navigate("/");
      },
    },
  ];

  const visibleLinks = navItems.filter((item) => {
    if (!item.roles) return true;
    if (item.roles.includes("admin") && userRole === "admin") return true;
    if (item.roles.includes("voter") && userRole === "voter") return true;
    if (item.roles.includes("guest") && !userRole) return true;
    return false;
  });

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 border-b border-teal-200 shadow-lg animate-navFade">
      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* LOGO SECTION */}
        <div className="flex items-center gap-4">
          <div className="animate-softBounce">
            <Logo size={60} />
          </div>

          <div className="overflow-hidden">
            <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-teal-700 to-emerald-600 bg-clip-text text-transparent animate-slideUp">
              የኢትዮጵያ ኦንላይን የምርጫ ሥርዓት
            </h1>

            <p className="text-gray-600 text-sm animate-fadeSlow">
              Ethiopia Online National Election System
            </p>
          </div>
        </div>

        {/* SEARCH + LANG + MOBILE */}
        <div className="flex items-center gap-4 relative">

          {/* DESKTOP SEARCH */}
          <div className="hidden md:block relative group">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search_placeholder")}
              className="border border-teal-300 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 w-64 text-sm shadow transition-all duration-300 focus:ring-2 focus:ring-teal-500 group-hover:scale-105"
            />
            <span className="absolute right-4 top-2 text-gray-500">🔍</span>
          </div>

          {/* MOBILE SEARCH */}
          <button
            className="md:hidden px-3 py-2 rounded-full border border-teal-400 bg-white/70 hover:bg-teal-100 transition-all duration-300 hover:scale-110"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          >
            🔍
          </button>

          {/* LANGUAGE DROPDOWN */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="px-4 py-2 bg-teal-600 text-white rounded-full shadow hover:bg-teal-700 transition-all duration-300 hover:scale-105"
            >
              🌐 {t("language")}
            </button>

            <ul
              className={`absolute right-0 mt-3 w-40 bg-white/90 backdrop-blur-xl border rounded-lg shadow-xl transition-all duration-300 overflow-hidden ${langOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                }`}
            >
              {["en", "am", "om"].map((lng) => (
                <li
                  key={lng}
                  onClick={() => changeLanguage(lng)}
                  className="px-4 py-2 hover:bg-teal-100 cursor-pointer transition-all hover:pl-6"
                >
                  {lng === "en" ? "English" : lng === "am" ? "Amharic" : "Afan Oromo"}
                </li>
              ))}
            </ul>
          </div>

          {/* MOBILE MENU */}
          <button
            className="md:hidden px-3 py-2 rounded-full border border-teal-400 bg-white/70 hover:bg-teal-100 transition-all duration-300 hover:scale-110"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            {drawerOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH BAR */}
      {mobileSearchOpen && (
        <div className="md:hidden px-6 pb-4 animate-slideDown">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search_placeholder")}
            className="w-full border border-teal-300 bg-white/70 backdrop-blur rounded-full px-4 py-2 text-sm shadow focus:ring-2 focus:ring-teal-500"
          />
        </div>
      )}

      {/* DESKTOP MENU */}
      <nav className="hidden md:block bg-gradient-to-r from-teal-600 to-emerald-600 shadow-inner">
        <ul className="max-w-7xl mx-auto flex gap-8 py-3 text-white justify-center">
          {visibleLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name} className="relative group">
                {item.action ? (
                  <button
                    onClick={item.action}
                    className="px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300 group-hover:scale-110"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`px-4 py-2 rounded-full transition-all duration-300 ${isActive
                      ? "bg-white text-teal-700 font-bold shadow-md scale-110"
                      : "hover:bg-white/20 hover:scale-110"
                      }`}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 left-0 w-72 h-full bg-gradient-to-b from-teal-700 to-emerald-600 text-white shadow-2xl rounded-r-2xl z-50 transform transition-transform duration-300 ${drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-6 flex flex-col gap-4">
          {visibleLinks.map((item) =>
            item.action ? (
              <button
                key={item.name}
                onClick={() => {
                  item.action();
                  setDrawerOpen(false);
                }}
                className="px-4 py-3 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-300 hover:scale-105"
              >
                {item.name}
              </button>
            ) : (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
                className={`px-4 py-3 rounded-lg transition-all duration-300 ${location.pathname === item.path
                  ? "bg-white text-teal-700 font-bold scale-110"
                  : "hover:bg-white/20 hover:scale-105"
                  }`}
              >
                {item.name}
              </Link>
            )
          )}
        </div>
      </div>

      {/* OVERLAY */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn"
          onClick={() => setDrawerOpen(false)}
        ></div>
      )}

      {/* BEAUTIFUL CUSTOM ANIMATIONS */}
      <style>{`
        @keyframes navFade {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-navFade { animation: navFade 0.7s ease-out; }

        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(25px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 1s ease-out; }

        @keyframes fadeSlow {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fadeSlow { animation: fadeSlow 1.5s ease-out; }

        @keyframes softBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-softBounce { animation: softBounce 3s infinite ease-in-out; }

        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.4s ease-out; }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn .5s ease; }
      `}</style>
    </header>
  );
}
