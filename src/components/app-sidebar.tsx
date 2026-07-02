import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Newspaper, Home, Globe, Hash, Link2, Briefcase } from 'lucide-react'

const items = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
  },
  {
    title: 'News Feed',
    url: '/news',
    icon: Newspaper,
  },
  {
    title: 'Countries',
    url: '/countries',
    icon: Globe,
  },
  {
    title: 'Topics',
    url: '/topics',
    icon: Hash,
  },
  {
    title: 'Sources',
    url: '/sources',
    icon: Link2,
  },
  {
    title: 'Competitors',
    url: '/competitors',
    icon: Briefcase,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Economics News Agent</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <a href={item.url} className="flex items-center gap-2 w-full h-full">
                      <item.icon />
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
