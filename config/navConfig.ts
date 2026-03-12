import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Users,
  Megaphone,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItemData {
  name: string;
  href: string;
  icon: LucideIcon;
}

export interface MenuGroup {
  title: string;
  items: NavItemData[];
}

export const getNavItems = (): MenuGroup[] => {
  return [
    {
      title: "Main",
      items: [
        // { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Appointments", href: "/appointments", icon: Calendar },
        { name: "Lead List", href: "/leads", icon: ClipboardList },
        { name: "Patients", href: "/patients", icon: Users },
        { name: "Campaigns", href: "/campaigns", icon: Megaphone },
        { name: "Reports", href: "/reports", icon: BarChart3 },
        { name: "Settings", href: "/settings", icon: Settings },
      ],
    },
  ];
};