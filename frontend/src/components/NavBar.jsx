import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useTranslation } from "react-i18next";
import API from "../api/api";

export default function NavBar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || null);
  const [langOpen, setLangOpen] = useState(false);

  const langRef = useRef();
  const searchRef = useRef();
  const debounceTimer = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const close = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Role sync from localStorage
  useEffect(() => {
    const handleStorageChange = () => setUserRole(localStorage.getItem("role"));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Dynamic search with debounce
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const q = search.toLowerCase();
        const results = [];

        // Search static pages
        const pages = [
          { label: "Home", path: "/", type: "page" },
          { label: "Ballots", path: "/ballots", type: "page" },
          { label: "Candidates", path: "/candidates", type: "page" },
          { label: "Results", path: "/results", type: "page" },
          { label: "Login", path: "/login", type: "page" },
          { label: "Register", path: "/register", type: "page" },
        ];
        pages.forEach((p) => {
          if (p.label.toLowerCase().includes(q)) results.push(p);
        });

        // Search ballots from API
        try {
          const ballotRes = await API.get("/ballots");
          ballotRes.data.forEach((b) => {
            if (b.title?.toLowerCase().includes(q) || b.status?.toLowerCase().includes(q)) {
              results.push({ label: b.title, sub: `Ballot • ${b.status}`, path: `/results/${b._id}`, type: "ballot" });
            }
          });
        } catch { /* silent fail */ }

        // Search candidates from API
        try {
          const candRes = await API.get("/candidates");
          candRes.data.forEach((c) => {
            if (
              c.name?.toLowerCase().includes(q) ||
              c.party?.toLowerCase().includes(q) ||
              c.region?.toLowerCase().includes(q)
            ) {
              results.push({
                label: c.name,
                sub: `Candidate • ${c.party || "Independent"}`,
                path: "/candidates",
                type: "candidate",
              });
            }
          });
        } catch { /* silent fail */ }

        setSearchResults(results.slice(0, 8)); // max 8 results
        setSearchOpen(results.length > 0);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  }, [search]);

  const handleResultClick = (path) => {
    navigate(path);
    setSearch("");
    setSearchResults([]);
    setSearchOpen(false);
  };

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

  // Icon for search result type
  const typeIcon = (type) => {
    switch (type) {
      case "ballot": return "🗳️";
      case "candidate": return "👤";
      case "page": return "📄";
      default: return "🔍";
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-green-50/80 backdrop-blur-xl border-b border-green-200 shadow-soft transition-all duration-300">
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
          <div className="hidden md:block relative" ref={searchRef}>
            <div className="relative group">
              <input
                id="navbar-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
                placeholder={t("search_placeholder", "Search...")}
                autoComplete="off"
                className="input-field py-2 pr-10 w-72 bg-white border-green-200 focus:bg-white text-sm rounded-full transition-all duration-300 focus:w-80"
              />
              <span className="absolute right-4 top-2.5 text-slate-400 group-focus-within:text-green-500 transition-colors">
                {searchLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                ) : "🔍"}
              </span>
            </div>

            {/* SEARCH DROPDOWN */}
            {searchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-green-100 overflow-hidden z-50 animate-fade-in">
                {searchResults.length === 0 && !searchLoading ? (
                  <div className="px-4 py-3 text-sm text-slate-400 text-center">No results found</div>
                ) : (
                  <ul>
                    {searchResults.map((result, i) => (
                      <li key={i}>
                        <button
                          onClick={() => handleResultClick(result.path)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors text-left group"
                        >
                          <span className="text-lg flex-shrink-0">{typeIcon(result.type)}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-slate-800 group-hover:text-green-700 truncate">
                              {result.label}
                            </div>
                            {result.sub && (
                              <div className="text-xs text-slate-400 truncate">{result.sub}</div>
                            )}
                          </div>
                          <span className="text-xs text-green-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            Go →
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="px-4 py-2 bg-green-50/50 border-t border-green-100 text-xs text-slate-400 text-right">
                  Press Enter to search
                </div>
              </div>
            )}
          </div>

          {/* LANGUAGE DROPDOWN */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-green-200 rounded-full text-sm font-medium text-slate-700 hover:bg-green-100 hover:border-green-300 transition-all"
            >
              <span>🌐</span>
              <span className="uppercase">{i18n.language || "en"}</span>
            </button>

            <ul
              className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-green-100 overflow-hidden transition-all duration-200 ${langOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
            >
              {["en", "am", "om"].map((lng) => (
                <li
                  key={lng}
                  onClick={() => changeLanguage(lng)}
                  className="px-4 py-3 hover:bg-green-50 cursor-pointer text-sm font-medium text-slate-700 hover:text-green-600 transition-colors flex items-center justify-between"
                >
                  <span>{lng === "en" ? "English" : lng === "am" ? "Amharic" : "Afan Oromo"}</span>
                  {i18n.language === lng && <span className="text-green-600">✓</span>}
                </li>
              ))}
            </ul>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-green-100 text-slate-600"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            {drawerOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* DESKTOP NAV */}
      <nav className="hidden md:block border-t border-green-100 bg-green-50" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6">
          <ul className="flex justify-end gap-2 py-2 overflow-x-auto">
            {visibleLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  {item.action ? (
                    <button
                      onClick={item.action}
                      className="px-5 py-3 text-base font-medium text-slate-600 hover:text-red-600 transition-colors rounded-md hover:bg-green-100"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className={`block px-5 py-3 text-base font-medium border-b-2 transition-all duration-200 rounded-md hover:bg-green-100 ${isActive ? "border-green-500 text-green-700 bg-green-50/50" : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-green-100/50"}`}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
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

            {/* Mobile Search */}
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidates, ballots..."
                className="w-full px-4 py-2 rounded-xl border border-green-200 text-sm focus:outline-none focus:border-green-400 bg-green-50"
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-sm">🔍</span>
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
    </header>
  );
}
