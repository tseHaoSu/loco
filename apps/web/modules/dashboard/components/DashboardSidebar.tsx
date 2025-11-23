"use client";

import { UserButton } from "@clerk/nextjs";
import { OrganizationSwitcher } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import {
  InboxIcon,
  LibraryBig,
  Palette,
  LayoutDashboard,
  Mic,
  CreditCardIcon,
} from "lucide-react";
import Link from "next/link"; // ✅ Add this
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/theme-toggle";

const customerSupportItems = [
  {
    title: "Conversation",
    url: "/conversations",
    icon: InboxIcon,
  },
  {
    title: "Knowledge Base",
    url: "/files",
    icon: LibraryBig,
  },
];

const configurationItems = [
  {
    title: "Widget Customization",
    url: "/customization",
    icon: Palette,
  },
  {
    title: "Integrations",
    url: "/integrations",
    icon: LayoutDashboard,
  },
  {
    title: "Voice Assistant",
    url: "/plugins/vapi",
    icon: Mic,
  },
];

const accountItems = [
  {
    title: "Plans & Billing",
    url: "/billing",
    icon: CreditCardIcon,
  },
];

const SidebarHeaderContent = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between '} gap-2`}>
      <SidebarMenu className={isCollapsed ? '' : 'flex-1'}>
        <SidebarMenuItem>
          <SidebarMenuButton asChild size="lg" isActive={false}>
            <Link href="/" className="flex items-center gap-2">
              {isCollapsed ? (
                <span className="text-2xl font-extrabold">L</span>
              ) : (
                <span className="text-2xl font-extrabold">Loco</span>
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      {!isCollapsed && <ModeToggle />}
    </div>
  );
};

const SidebarOrganizationSwitcher = () => {
  return (
    <div className="px-2 pb-2">
      <OrganizationSwitcher
        hidePersonal
        skipInvitationScreen
        appearance={{
          elements: {
            rootBox: "w-full! h-8!",
            avatarBox: "size-4! rounded-sm!",
            organizationSwitcherTrigger: "w-full! justify-start! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:justify-center!",
            organizationPreview: "group-data-[collapsible=icon]:justify-center! gap-2!",
            organizationPreviewTextContainer: "group-data-[collapsible=icon]:hidden! text-xs! font-medium! text-sidebar-foreground!",
            organizationSwitcherTriggerIcon: "group-data-[collapsible=icon]:hidden! ml-auto! text-sidebar-foreground!"
          }
        }}
      />
    </div>
  );
};

const SidebarFooterContent = () => {
  return (
    <div>
      <UserButton
        showName
        appearance={{
          elements: {
            rootBox: "w-full! h-8!",
            userButtonTrigger: "w-full! p-2! hover:bg-sidebar-accent! hover:text-sidebar-accent-foreground! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
            userButtonBox: "w-full! flex-row-reverse! justify-end! gap-2! group-data-[collapsible=icon]:justify-center! text-sidebar-foreground!",
            userButtonOuterIdentifier: "pl-0! group-data-[collapsible=icon]:hidden! text-xs! font-medium!",
          }
        }}
      />
    </div>
  );
};


export const DashboardSidebar = () => {
  const pathname = usePathname();
  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(url);
  };
  return (
    <Sidebar collapsible="icon" className="group">
      <SidebarHeader>
        <SidebarHeaderContent />
      </SidebarHeader>
      <SidebarOrganizationSwitcher />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Customer Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {customerSupportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configurationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterContent />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
