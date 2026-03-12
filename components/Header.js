"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Menu } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useHeaderStore } from "@/store/useHeaderStore";

const Header = () => {
    const { data: session } = useSession();
    const { toggleMobileMenu } = useUIStore();
    const { title, isCollapsed, toggleCollapse } = useHeaderStore();

    // Keyboard shortcut: Ctrl+K to toggle sidebar collapse
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === "k") {
                e.preventDefault();
                toggleCollapse();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleCollapse]);

    return (
        <nav className="sticky top-0 -mb-4 w-full h-14 transition-all duration-300 bg-white/75 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 z-50">
            <div className="relative h-full flex items-center justify-between px-4 sm:px-6">
                {/* Left side */}
                <div className="flex items-center gap-4">
                    
                    {/* Desktop collapse button */}
                    <button
                        className="hidden md:flex group relative items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100/80 transition-all duration-200 active:scale-95"
                        onClick={toggleCollapse}
                        aria-label="Toggle sidebar"
                    >
                        <svg
                            className={`w-5 h-5 transition-transform duration-300 ${
                                isCollapsed ? "rotate-180" : ""
                            }`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <rect
                                x="3"
                                y="3"
                                width="18"
                                height="18"
                                rx="2"
                                strokeOpacity="0.5"
                            />
                            <path d="M9 3V21" strokeOpacity="0.5" />
                            <path
                                d="M13 12H17M15 10L13 12L15 14"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="group-hover:stroke-slate-900"
                            />
                        </svg>
                    </button>

                    {/* Mobile menu button */}
                    <button
                        className="block md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                        onClick={toggleMobileMenu}
                        aria-label="Open mobile menu"
                    >
                        <Menu className="w-5 h-5" strokeWidth={2} />
                    </button>

                    {/* Divider */}
                    <div className="w-px h-5 bg-slate-200 hidden md:block" />

                    {/* Page title */}
                    <div className="flex items-center gap-2 select-none">
                        <h1 className="text-slate-800 text-sm font-semibold tracking-tight">
                            {title}
                        </h1>
                    </div>
                </div>

                {/* Right side */}
                <div />
            </div>
        </nav>
    );
};

export default Header;