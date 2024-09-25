"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { EthWallet } from "@/components/ETHWallet";
import { SolWallet } from "@/components/SOLWallet";

export default function Dashboard() {
  const [mnemonic, setMnemonic] = useState("");

  const router = useRouter();

  useEffect(() => {
    const storedMnemonic = localStorage.getItem("mnemonic");
    if (!storedMnemonic) {
      router.push("/");
    } else {
      setMnemonic(storedMnemonic);
    }
  }, [router]);

  if (!mnemonic) return null;

  return (
    <div className="container mx-auto mt-5">
      <Navbar />
      <Card className="w-[350px] mx-auto mt-4">
        <CardHeader>
          <CardTitle>Wallet Dashboard</CardTitle>
          <CardDescription>Manage your crypto assets</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="eth">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="eth">Ethereum</TabsTrigger>
              <TabsTrigger value="sol">Solana</TabsTrigger>
            </TabsList>
            <TabsContent value="eth">
              <EthWallet mnemonic={mnemonic} />
            </TabsContent>
            <TabsContent value="sol">
              <SolWallet mnemonic={mnemonic} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
