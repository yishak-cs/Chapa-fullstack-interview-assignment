import {
  Users2,
  Home,
  Building2,
  DoorOpen,
  CircleDollarSign,
} from "lucide-react"

import { NavUser } from "@/Components/nav-user"
import { NavProjects } from "@/Components/nav-projects"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/Components/ui/sidebar"

import { User } from "@/types"

// Define the type for navigation items
interface NavigationItem {
  name: string;
  url: string;
  icon: any;
}

// Define the type for role navigation
interface RoleNavigation {
  navMain: NavigationItem[];
}

// Define navigation items for each role
const roleNavigation: Record<string, RoleNavigation> = {
  super_admin: {
    navMain: [
      {
        name: "Users",
        url: "/users",
        icon: Users2,
      },
    ],
  },
  admin: {
    navMain: [
      {
        name: "Users",
        url: "/users",
        icon: Users2,
      },
    ],
  },
};

// Common navigation items for all roles
const commonNavigation = {
  projects: [
    {
      name: "Home",
      url: "/dashboard",
      icon: Home,
    }
  ]
};

interface AppSidebarProps {
  user?: User;
  [key: string]: any;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const currentUser = user;
  const userRole = currentUser?.role;

  console.log("Current user role:", userRole);

  // Get navigation for current role, fallback to empty objects if role doesn't exist
  const currentNavigation: RoleNavigation =
    userRole && roleNavigation[userRole as keyof typeof roleNavigation]
      ? roleNavigation[userRole as keyof typeof roleNavigation]
      : { navMain: [] };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader style={{ marginTop: '10px', marginLeft: '10px' }}>
        <div className="container flex h-16 gap-2 items-center group-data-[collapsible=icon]:hidden">

          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-400 shadow-lg">
            <CircleDollarSign className="h-6 w-6 text-white drop-shadow-md absolute transform -translate-y-[1px]" />
            <div className="absolute inset-0 rounded-lg bg-white/10 backdrop-blur-[1px] opacity-20"></div>
          </div>
          <span className="text-xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400 drop-shadow-sm">CHAPA</span>

        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={commonNavigation.projects} label="Home" />
        {currentNavigation.navMain && currentNavigation.navMain.length > 0 &&
          <NavProjects projects={currentNavigation.navMain} label="User" />}
      </SidebarContent>
      <SidebarFooter>
        {currentUser && <NavUser user={currentUser} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
