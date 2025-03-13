import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CardWithFormProps {
  name: string;
  onNameChange: (value: string) => void;
  onSubmit: () => void;
}

export function JoinCard({ name, onNameChange, onSubmit }: CardWithFormProps) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Join Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  onNameChange(e.target.value);
                  console.log("Server: Name changed: " + e.target.value);
                }}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex w-full">
        <Button onClick={onSubmit}>Join</Button>
      </CardFooter>
    </Card>
  );
}
