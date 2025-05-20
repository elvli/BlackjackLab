import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <div className="mt-16"/>
      <SidebarHeader>This is the Header</SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>THis is the footer</SidebarFooter>
    </Sidebar>
  );
}
