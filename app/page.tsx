"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { generateMnemonic } from "bip39";
import { Clipboard, ClipboardCheck, RefreshCw, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [seedPhrase, setSeedPhrase] = useState("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const generateSeedPhrase = () => {
    const newSeedPhrase = generateMnemonic();
    setSeedPhrase(newSeedPhrase);
  };

  const createOrImportWallet = () => {
    if (seedPhrase === "") {
      generateSeedPhrase();
      return;
    }
    if (
      seedPhrase.split(" ").length === 12 ||
      seedPhrase.split(" ").length === 24
    ) {
      localStorage.setItem("mnemonic", seedPhrase);
      router.push("/dashboard");
    } else {
      alert("Please enter 12 or 24 word seed phrase or generate one.");
    }
  };

  const copySeedPhrase = () => {
    navigator.clipboard.writeText(seedPhrase);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1800);
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copySeedPhrase}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {copied ? (
                    <>
                      <ClipboardCheck className="h-4 w-4 mr-2 text-green-500" />
                      <p className="text-green-500 font-medium">Copied</p>
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
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

          <Button onClick={createOrImportWallet} className="w-full" size="lg">
            <Wallet className="mr-2 h-5 w-5" />
            Create / Import Wallet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
