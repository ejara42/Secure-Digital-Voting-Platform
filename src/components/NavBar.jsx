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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-soft transition-all duration-300">
      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* LOGO SECTION */}
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="transition-transform duration-300 group-hover:scale-105">
            <Logo size={50} />
          </div>

          <div className="overflow-hidden">
            <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              {t("app_name", "Ethiopia Election")}
            </h1>

            <p className="text-slate-500 text-sm font-medium">
              Secure Digital Voting Platform
            </p>
          </div>
        </div>

        {/* SEARCH + LANG + MOBILE */}
        <div className="flex items-center gap-3 relative">

          {/* DESKTOP SEARCH */}
          <div className="hidden md:block relative group">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search_placeholder")}
              className="input-field py-2 pr-10 w-64 bg-slate-50 border-slate-200 focus:bg-white text-sm rounded-full transition-all duration-300"
            />
            <span className="absolute right-4 top-2.5 text-slate-400 group-focus-within:text-primary-500 transition-colors">🔍</span>
          </div>

          {/* LANGUAGE DROPDOWN */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <span>🌐</span>
              <span className="uppercase">{i18n.language || "en"}</span>
            </button>

            <ul
              className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-200 ${langOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
            >
              {["en", "am", "om"].map((lng) => (
                <li
                  key={lng}
                  onClick={() => changeLanguage(lng)}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors flex items-center justify-between"
                >
                  <span>{lng === "en" ? "English" : lng === "am" ? "Amharic" : "Afan Oromo"}</span>
                  {i18n.language === lng && <span className="text-primary-600">✓</span>}
                </li>
              ))}
            </ul>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-slate-100 text-slate-600"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            {drawerOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* DESKTOP NAV */}
      <nav className="hidden md:block border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <ul className="flex gap-1 py-1 overflow-x-auto">
            {visibleLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  {item.action ? (
                    <button
                      onClick={item.action}
                      className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                        ? "border-primary-500 text-primary-700 bg-primary-50/50"
                      : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                        }`}
                    >
                  {item.name}
                </Link>
              )
            }
                </li>
          );
            })}
        </ul>
      </div>
    </nav>

      {/* MOBILE DRAWER */ }
  <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
    {/* Backdrop */}
    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />

    {/* Drawer Content */}
    <div className={`absolute top-0 left-0 w-[80%] max-w-sm h-full bg-white shadow-2xl transition-transform duration-300 ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
          <Logo size={40} />
          <div className="font-heading font-bold text-lg text-slate-900">Ethiopia Election</div>
        </div>

        <div className="flex flex-col gap-2">
          {visibleLinks.map((item) => (
            item.action ? (
              <button
                key={item.name}
                onClick={() => { item.action(); setDrawerOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
              >
                {item.name}
              </button>
            ) : (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
                className={`block px-4 py-3 rounded-xl font-medium transition-all ${location.pathname === item.path
                  ? "bg-primary-50 text-primary-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                {item.name}
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  </div>
    </header >
  );
}
