import {
  Users2,
  Home,
  Building2,
  HandshakeIcon,
  DoorOpen,
  Signature,
  BanknoteIcon,
  UtilityPole,
  LucideBriefcaseBusiness,
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
  navMain?: NavigationItem[];
  CP?: NavigationItem[];
  issues?: NavigationItem[];
}

// Define navigation items for each role
const roleNavigation: Record<string, RoleNavigation> = {
  business_owner: {
    navMain: [
      {
        name: "Businesses", // Changed from "Tenants" for business_owner
        url: "/business-owner/businesses/all",
        icon: LucideBriefcaseBusiness,
      },
      {
        name: "Users",
        url: "/business-owner/users/all",
        icon: Users2,
      },

    ],
    CP: [
      {
        name: "Contracts",
        url: "/business-owner/contracts",
        icon: Signature,
      },
      {
        name: "Payments",
        url: "/business-owner/payments/all",
        icon: BanknoteIcon,
      }
    ],
    issues: [
      {
        name: "Maintenance Requests",
        url: "/maintenance-request",
        icon: UtilityPole
      }
    ]
  },
  building_owner: {
    navMain: [
      {
        name: "Tenants",
        url: "/businesses/all",
        icon: HandshakeIcon,
      },
      {
        name: "Users",
        url: "/users/all",
        icon: Users2,
      },
      {
        name: "Units",
        url: "/units/all",
        icon: DoorOpen,
      },
    ],
    CP: [
      {
        name: "Contracts",
        url: "/contracts/all",
        icon: Signature,
      },
      {
        name: "Payments",
        url: "/payments/all",
        icon: BanknoteIcon,
      }
    ],
    issues: [
      {
        name: "Maintenance Requests",
        url: "/maintenance-request",
        icon: UtilityPole
      }
    ]
  },
  building_manager: {
    navMain: [
      {
        name: "Tenants",
        url: "/businesses/all",
        icon: HandshakeIcon,
      },
      {
        name: "Users",
        url: "/users/all",
        icon: Users2,
      },
      {
        name: "Units",
        url: "/units/all",
        icon: DoorOpen,
      },
    ],
    // No CP section for building_manager
    issues: [
      {
        name: "Maintenance Requests",
        url: "/maintenance-request",
        icon: UtilityPole
      }
    ]
  },
  business_staff: {
    navMain: [
      // No tenants, users for business_staff
      {
        name: "Units",
        url: "#",
        icon: DoorOpen,
      },
    ],
    // No CP section for business_staff
    issues: [
      {
        name: "Maintenance Requests",
        url: "#",
        icon: UtilityPole
      }
    ]
  }
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
    : {};
  
  console.log("Current navigation:", currentNavigation);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader style={{ marginTop: '10px', marginLeft: '10px' }}>
        <div className="container flex h-16 gap-3 items-center group-data-[collapsible=icon]:hidden">

          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-700 shadow-lg">
            <Building2 className="h-6 w-6 text-white drop-shadow-md absolute transform -translate-y-[1px]" />
            <div className="absolute inset-0 rounded-lg bg-white/10 backdrop-blur-[1px] opacity-20"></div>
          </div>
          <span className="text-xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 drop-shadow-sm">Biqiltuu</span>

        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={commonNavigation.projects} label="Home" />
      </SidebarContent>
      <SidebarFooter>
        {currentUser && <NavUser user={currentUser} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
