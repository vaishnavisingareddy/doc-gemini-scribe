
import { Users, FileText, UserCheck } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { TabType } from '@/pages/DoctorPortal';

interface DoctorSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const sidebarItems = [
  {
    title: 'Patients List',
    icon: Users,
    tab: 'patients' as TabType,
  },
  {
    title: 'Prescriptions',
    icon: FileText,
    tab: 'prescriptions' as TabType,
  },
  {
    title: 'Patient Details',
    icon: UserCheck,
    tab: 'patient-details' as TabType,
  },
];

export function DoctorSidebar({ activeTab, onTabChange }: DoctorSidebarProps) {
  return (
    <Sidebar className="w-64">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.tab}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.tab)}
                    className={`w-full justify-start ${
                      activeTab === item.tab
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
