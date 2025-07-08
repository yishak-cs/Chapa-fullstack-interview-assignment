import React from "react"
import { AppSidebar } from "@/Components/app-sidebar"
import { Separator } from "@/Components/ui/separator"


import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/Components/ui/sidebar"

import { User } from "@/types"

interface AuthenticatedProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  user: User;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}



export default function Authenticated({ children, header, user }: AuthenticatedProps) {
  const authenticatedUser = user;

  return (
    <SidebarProvider>
      <AppSidebar user={authenticatedUser} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="ml-2">{header}</div>
          </div>
        </header>
        <main>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
