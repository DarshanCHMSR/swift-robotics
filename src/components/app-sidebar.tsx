import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { Newspaper, Home, Globe, Hash, Link2, Briefcase, Server, TrendingUp, Cpu } from 'lucide-react'

const items = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'News Feed', url: '/news', icon: Newspaper },
  { title: 'Countries', url: '/countries', icon: Globe },
  { title: 'Topics', url: '/topics', icon: Hash },
  { title: 'Sources', url: '/sources', icon: Link2 },
  { title: 'Competitors', url: '/competitors', icon: Briefcase },
]

const systemItems = [
  { title: 'Architecture', url: '/architecture', icon: Server },
  { title: 'Future Pipeline', url: '/future', icon: TrendingUp },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r shadow-sm">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-primary">
          <Cpu className="w-6 h-6" />
          <span>EconMonitor AI</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-4 mb-2">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="transition-all hover:bg-primary/10 hover:text-primary">
                    <a href={item.url} className="flex items-center gap-3 w-full h-full font-medium">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-6 mb-2">System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="transition-all hover:bg-primary/10 hover:text-primary">
                    <a href={item.url} className="flex items-center gap-3 w-full h-full font-medium">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
