import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function Home() {
  return (
    <div className="relative h-screen overflow-hidden p-4 flex flex-col">
      {/* Top Card that fills remaining space */}
      <div className="flex-1 overflow-hidden">
        <Card className="h-full bg-green-900 overflow-auto">
          <CardContent>
            <p>Card Content</p>
            {/* Lots of content here will scroll inside this card */}
          </CardContent>
        </Card>
      </div>

      {/* Fixed footer (non-growing) */}
      <div className="mt-3">
        <Card className="py-3">
          <div className="flex gap-2 justify-center">
            <Button variant="default">Action 1</Button>
            <Button variant="secondary">Action 2</Button>
            <Button variant="ghost">Action 3</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
