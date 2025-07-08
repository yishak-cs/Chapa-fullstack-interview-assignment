"use client"

import {
    type LucideIcon,
} from "lucide-react"

import { Link, usePage } from "@inertiajs/react"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/Components/ui/sidebar"

interface NavProjectsProps {
    projects: {
        name: string
        url: string
        icon: LucideIcon
    }[]
    label?: string;
}

export function NavProjects({ projects, label }: NavProjectsProps) {
    const { isMobile } = useSidebar()
    const { url: currentUrl } = usePage()

    const isActive = (path: string) => {
        const normalizedCurrentUrl = currentUrl.replace(/\/$/, '')
        const normalizedPath = path.replace(/\/$/, '')

        // Check if the path is exactly the current URL
        if (normalizedPath === normalizedCurrentUrl) return true

        // Check if the current URL starts with the path (for nested routes)
        // But only if the path is not just "/"
        if (normalizedPath !== '/' && normalizedCurrentUrl.startsWith(normalizedPath)) {
            // Make sure it's a complete path segment match
            const nextChar = normalizedCurrentUrl.charAt(normalizedPath.length)
            return nextChar === '' || nextChar === '/'
        }

        return false
    }

    return (
        <SidebarGroup >
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {projects.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={isActive(item.url)}>
                            <Link href={item.url}>
                                <item.icon />
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
