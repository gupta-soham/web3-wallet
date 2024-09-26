"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateMnemonic } from "bip39";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Lock } from "lucide-react";
import CopyToClipboard from "@/utils/copyToClipboard";

export default function Home() {
  const [seedPhrase, setSeedPhrase] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const generateSeedPhrase = () => {
    const newSeedPhrase = generateMnemonic();
    setSeedPhrase(newSeedPhrase);
  };

  const createOrImportWallet = () => {
    if (seedPhrase && password && password === confirmPassword) {
      localStorage.setItem("mnemonic", seedPhrase);
      localStorage.setItem("walletPassword", password);
      router.push("/dashboard");
    } else if (!seedPhrase) {
      generateSeedPhrase();
    } else if (!password) {
      alert("Please enter a password.");
    } else if (password !== confirmPassword) {
      alert("Passwords do not match.");
    } else if (
      seedPhrase.split(" ").length !== 12 ||
      seedPhrase.split(" ").length !== 24
    ) {
      alert("Please enter a 12 or 24 word seed phrase or generate one.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl sm:text-4xl font-bold mb-2">
            Web3 Wallet
          </CardTitle>
          <CardDescription className="text-lg sm:text-xl">
            Import or create a new wallet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Enter seed phrase"
              value={seedPhrase}
              onChange={(e) => setSeedPhrase(e.target.value)}
              className="flex-grow"
            />
            <Button
              onClick={generateSeedPhrase}
              className="w-full sm:w-auto"
              variant="outline"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate New Phrase
            </Button>
          </div>

          {seedPhrase && (
            <div className="bg-white p-6 rounded-lg shadow-inner">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Your Seed Phrase
                </h3>
                <CopyToClipboard content={seedPhrase} time={1800} small={false} />
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {seedPhrase.split(" ").map((word, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 rounded-lg text-center shadow-sm transition-all duration-200 hover:shadow-md hover:bg-gray-100"
                  >
                    <p className="font-medium text-gray-800">{word}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button onClick={createOrImportWallet} className="w-full" size="lg">
            <Lock className="mr-2 h-5 w-5" />
            Create/Import Wallet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
