import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import GameSettings from "./tablerules/GameSettings";
import TrainingSettings from "./tablerules/TrainingSettings";
import BettingSettings from "./tablerules/BettingSettings";

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <div className="mt-16" />
      <SidebarHeader>
        <h1 className="text-lg font-bold text-primary tracking-wider">
          Table Rules
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <Accordion type="single" collapsible className="w-full px-2 ">
          <AccordionItem value="item-1">
            {/* Game Settings */}
            <AccordionTrigger className="no-underline">
              <h1 className="font-bold text-primary no-underline">
                Game Settings
              </h1>
            </AccordionTrigger>

            <AccordionContent>
              <GameSettings />
            </AccordionContent>
          </AccordionItem>

          {/* Training Settings */}
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <h1 className="font-bold text-primary no-underline">
                Training Settings
              </h1>
            </AccordionTrigger>
            <AccordionContent>
              <TrainingSettings />
            </AccordionContent>
          </AccordionItem>

          {/* Betting Settings */}
          <AccordionItem value="item-3">
            <AccordionTrigger>
              <h1 className="font-bold text-primary no-underline">
                Betting Settings
              </h1>
            </AccordionTrigger>
            <AccordionContent>
              <BettingSettings />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SidebarContent>
      <SidebarFooter>THis is the footer</SidebarFooter>
    </Sidebar>
  );
}
