import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Example() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Example</CardTitle></CardHeader>
        <CardContent className="space-x-2">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </CardContent>
      </Card>
    </div>
  );
}
