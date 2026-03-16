"use client";

import { useSession } from "next-auth/react";
import Header from "./Header";
import SideNav from "./SideNav";
import { useHeaderStore } from "@/store/useHeaderStore";

export default function ClientLayoutWrapper({ children }) {
    const { status, data: session } = useSession();


    const { isCollapsed, setCollapsed } = useHeaderStore();

       if (!session) {
        return (
            <div className="h-full bg-gray-50/50">
                {children}
            </div>
        );
    }
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
                            h-[calc(100vh-70px)]
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