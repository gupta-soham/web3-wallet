import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useToast } from "@/hooks/use-toast";

interface AddPasswordProps {
  onPasswordSet: (password: string) => void;
}

export default function AddPassword({ onPasswordSet }: AddPasswordProps) {
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    onPasswordSet(password);
    toast({
      title: "Password Set",
      description: "Your wallet password has been set successfully.",
    });
    localStorage.setItem("walletPassword", password);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter Wallet Password</CardTitle>
        <CardDescription>Due to inactivity (10 minutes)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Enter Password"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        <Button onClick={handleSave}>Save Password</Button>
      </CardContent>
    </Card>
  );
}
