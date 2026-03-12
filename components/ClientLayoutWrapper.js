"use client";

import Header from "./Header";
import SideNav from "./SideNav";
import { useHeaderStore } from "@/store/useHeaderStore";

export default function ClientLayoutWrapper({ children }) {
    const { isCollapsed, setCollapsed } = useHeaderStore();

    return (
        <div className="min-h-full bg-white transition-all duration-500">
            <SideNav
                isCollapsed={isCollapsed}
                setIsCollapsed={setCollapsed}
            />

            <div
                className={`
                    relative min-h-full flex flex-col transition-all duration-300 ease-in-out
                    ml-0 
                    ${isCollapsed ? "md:ml-[4vw]" : "md:ml-[14vw]"}
                `}
            >
                <Header
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setCollapsed}
                />

                <div className="flex-1 px-4 pt-4 pb-4">
                    <main
                        className="
                            h-[calc(100vh-80px)]
                            border border-blue-300/40
                            bg-[#F5F5F7]
                            shadow-inner
                            rounded-2xl
                            overflow-hidden
                            flex
                            flex-col
                        "
                    >
                        <div className="flex-1 overflow-y-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}