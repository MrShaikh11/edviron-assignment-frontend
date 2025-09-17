import ModeToggle from "@/components/ModeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { School, Notebook, Computer } from "lucide-react";
import { Alumni_Sans_Inline_One } from "next/font/google";
import Link from "next/link";
const items = [
  {
    title: "All Transactions",
    url: "/transactions",
    icon: Notebook,
  },
  {
    title: "Transaction Detail (School)",
    url: "/transaction-school",
    icon: School,
  },
  {
    title: "Transaction Status Check",
    url: "/transaction-status-check",
    icon: Computer,
  },
];
const alumni = Alumni_Sans_Inline_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-alumni",
});
export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <SidebarMenu className="flex flex-row justify-between w-full">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/admin"
                className={`${alumni.className} font-normal tracking-wide cursor-pointer`}
              >
                <div className="text-3xl">Edviron</div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.title === "Inbox" && (
                    <SidebarMenuBadge>24</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <ModeToggle />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
