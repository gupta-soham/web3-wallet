"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
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
      <Card className="mt-4">
        <CardContent className="p-6">
          <Tabs defaultValue="eth" className="w-full">
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
