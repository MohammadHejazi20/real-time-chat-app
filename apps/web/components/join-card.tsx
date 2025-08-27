import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Sparkles } from "lucide-react";

interface CardWithFormProps {
  name: string;
  onNameChange: (value: string) => void;
  onSubmit: () => void;
}

export function JoinCard({ name, onNameChange, onSubmit }: CardWithFormProps) {
  return (
    <Card className="w-[400px] shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
      <CardHeader className="text-center space-y-4 pb-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
          <MessageCircle className="h-8 w-8 text-white" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome to ChatApp
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Join the conversation and connect with others in real-time
          </CardDescription>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            Real-time Chat
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Modern UI
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Your Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your display name"
                value={name}
                onChange={(e) => {
                  onNameChange(e.target.value);
                }}
                className="h-12 text-base"
                autoFocus
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex w-full pt-2">
        <Button 
          onClick={onSubmit} 
          disabled={!name.trim()}
          className="w-full h-12 text-base font-medium"
          size="lg"
        >
          Join Chat Room
        </Button>
      </CardFooter>
    </Card>
  );
}
