"use client";

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  X,
 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { FaCoins as FaCoinsIcon } from "react-icons/fa6";

import { getNavItems, type NavItemData, type MenuGroup } from "@/config/navConfig";
import { useUIStore } from "@/store/useUIStore";
import { useHeaderStore } from "@/store/useHeaderStore";

// Simple profile picture placeholder
const DEFAULT_AVATAR = "https://upload.wikimedia.o rg/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

// ---------- NavItem ----------
interface NavItemProps {
  item: NavItemData;
  isCollapsed: boolean;
  pathname: string;
  setTitle: (title: string) => void;
}

const NavItem = ({ item, isCollapsed, pathname, setTitle }: NavItemProps) => {
  const isActive = pathname === item.href;
  const { closeMobileMenu } = useUIStore();

  const handleClick = () => {
    setTitle(item.name);
    closeMobileMenu();
  };

  return (
    <Link
      href={item.href}
      onClick={handleClick}
      className={`
        group relative flex items-center px-3 py-2.5 rounded-lg cursor-pointer
        transition-all duration-300 select-none
        ${isActive
          ? "text-[#6040e3] bg-violet-50/50"
          : "text-slate-600 hover:bg-slate-50 hover:text-[#6040e3]"
        }
      `}
    >
      <div className="flex items-center flex-1 overflow-hidden">
        <item.icon
          className={`
            w-5 h-5 flex-shrink-0 transition-colors duration-300
            ${isActive ? "text-[#6040e3]" : "text-slate-400 group-hover:text-[#6040e3]"}
          `}
        />
        <div
          className={`
            overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[150px] opacity-100 ml-3"}
          `}
        >
          <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>
        </div>
      </div>
    </Link>
  );
};

// ---------- NavContent ----------
interface NavContentProps {
  isCollapsed: boolean;
  pathname: string;
  setTitle: (title: string) => void;
}

const NavContent = ({ isCollapsed, pathname, setTitle }: NavContentProps) => {
  const menuGroups = getNavItems();

  return (
    <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto overflow-x-hidden scrollbar-hide">
      {menuGroups.map((group, idx) => (
        <div key={idx}>
          {/* Group title */}
          <div className="mb-2 h-[16px] flex items-center w-full overflow-hidden">
            <h3
              className={`
                font-bold uppercase tracking-wider text-slate-400 text-[11px] px-3 w-full whitespace-nowrap
                transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${isCollapsed ? "opacity-0 translate-x-[-10px] pointer-events-none" : "opacity-100 translate-x-0"}
              `}
            >
              {group.title}
            </h3>
          </div>

          <div className="space-y-0.5">
            {group.items.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                isCollapsed={isCollapsed}
                pathname={pathname}
                setTitle={setTitle}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Footer links (Support & Upgrade) */}
      <div className="pt-4 border-t border-slate-100">
        <Link
          href="/support"
          className="flex items-center px-3 py-2 mx-1 text-slate-600 hover:text-[#6040e3] rounded-lg hover:bg-slate-50 transition-all duration-300"
        >
          <HelpCircle className="w-5 h-5 flex-shrink-0" />
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[100px] opacity-100 ml-3"}
            `}
          >
            <span className="text-sm font-medium whitespace-nowrap">Support</span>
          </div>
        </Link>

        <Link
          href="/upgrade"
          className="flex items-center px-3 py-2 mx-1 mt-1 text-slate-600 hover:text-[#6040e3] rounded-lg hover:bg-slate-50 transition-all duration-300"
        >
          <FaCoinsIcon className="text-yellow-500 flex-shrink-0" size={16} />
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[100px] opacity-100 ml-3"}
            `}
          >
            <span className="text-sm font-medium whitespace-nowrap">Upgrade</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

// ---------- Profile Section ----------
interface ProfileSectionProps {
  collapsed: boolean;
  userImg: string;
  userName: string;
  userEmail: string;
}

const ProfileSection = ({ collapsed, userImg, userName, userEmail }: ProfileSectionProps) => {
  const { closeMobileMenu } = useUIStore();

  return (
    <Link
      href="/settings"
      onClick={closeMobileMenu}
      className="relative mx-3 mb-4 p-2 rounded-xl flex items-center cursor-pointer border border-transparent transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] bg-slate-50 hover:bg-slate-100 hover:border-slate-200 overflow-hidden"
    >
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <Image
          src={userImg}
          alt="User"
          width={40}
          height={40}
          className="rounded-full border-2 border-white shadow-sm"
        />
      </div>

      <div
        className={`
          flex flex-col justify-center overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${collapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[150px] opacity-100 ml-3"}
        `}
      >
        <p className="font-bold text-sm text-slate-800 truncate whitespace-nowrap">{userName}</p>
        <p className="text-[10px] font-medium text-slate-500 truncate whitespace-nowrap">{userEmail}</p>
      </div>
    </Link>
  );
};

// ---------- Main SideNav Component ----------
const SideNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const { isCollapsed, setTitle, setCollapsed } = useHeaderStore();

  const [isPinnedClosed, setIsPinnedClosed] = useState(isCollapsed);
  const [isHovering, setIsHovering] = useState(false);

  // Sync collapsed state with pinning behaviour
  useEffect(() => {
    if (!isHovering) setIsPinnedClosed(isCollapsed);
  }, [isCollapsed, isHovering]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (isPinnedClosed) setCollapsed(false);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (isPinnedClosed) setCollapsed(true);
  };

  // User info
  const userImg = session?.user?.image || DEFAULT_AVATAR;
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "user@example.com";

  // Update header title based on current route
  useEffect(() => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    const title = lastSegment
      ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
      : "Dashboard";
    setTitle(title);
  }, [pathname, setTitle]);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          hidden md:flex fixed left-0 top-0 bg-white h-screen z-10 flex-col justify-between
          transition-[width,box-shadow] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
          ${isCollapsed ? "w-[5vw]" : "w-[15vw]"}
          ${isPinnedClosed && !isCollapsed ? "shadow-2xl shadow-slate-200/50" : ""}
        `}
      >
        <div className="flex flex-col h-full overflow-hidden w-full">
          {/* Logo */}
          <Link href="/dashboard" className="h-16 flex items-center flex-shrink-0 px-5">
            <div className="flex items-center">
              <div className=" p-2 rounded-lg  shadow-inner shrink-0 transition-transform duration-300 hover:scale-105">
                <Image
                  src="logo.png"
                  alt="logo"
                  width={20}
                  height={20}
                />
              </div>
              <div
                className={`
                  overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]
                  ${isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[150px] opacity-100 ml-3"}
                `}
              >
                <h1 className="text-xl font-bold tracking-tight whitespace-nowrap">
                  <span className="text-black">Dent</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-400 ">
                    Flow
                  </span>
                </h1>
              </div>
            </div>
          </Link>

          <NavContent
            isCollapsed={isCollapsed}
            pathname={pathname}
            setTitle={setTitle}
          />

          {/* Profile footer */}
          <div className="mt-auto pt-2 bg-white/50 backdrop-blur-sm">
            <ProfileSection
              collapsed={isCollapsed}
              userImg={userImg}
              userName={userName}
              userEmail={userEmail}
            />
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <div
          className={`
            fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity duration-300
            ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
          `}
          onClick={closeMobileMenu}
        />
        <aside
          className={`
            fixed top-0 right-0 h-full w-[85vw] max-w-[300px] bg-white z-50 shadow-2xl flex flex-col
            transform transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="bg-[#0a0015] p-2 rounded-lg shadow-lg shadow-violet-200">
                <Image
                  src="logo.png"
                  alt="logo"
                  width={20}
                  height={20}
                />
              </div>
              <span className="font-bold text-lg text-slate-800">Dent Flow</span>
            </div>
            <button
              onClick={closeMobileMenu}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <NavContent isCollapsed={false} pathname={pathname} setTitle={setTitle} />
          </div>

          <div className="border-t border-slate-100 p-4 pb-safe bg-slate-50">
            <ProfileSection
              collapsed={false}
              userImg={userImg}
              userName={userName}
              userEmail={userEmail}
            />
          </div>
        </aside>
      </div>
    </>
  );
};

export default SideNav;