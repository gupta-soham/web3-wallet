"use client";
import { useState, useEffect, useCallback } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { encrypt, decrypt } from "@/utils/encryption";
import AddPassword from "./AddPassword";
import CopyToClipboard from "@/utils/copyToClipboard";
import { useToast } from "@/hooks/use-toast";

export function SolWallet({
  mnemonic,
}: {
  mnemonic: string;
}) {
  const [wallets, setWallets] = useState<
    { publicKey: string; encryptedPrivateKey: string }[]
  >([]);
  const [showPrivateKey, setShowPrivateKey] = useState<{
    [key: string]: boolean;
  }>({});
  const [password, setPassword] = useState("");
  const [isPasswordSet, setIsPasswordSet] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedWallets = localStorage.getItem(`solWallets_0`);
    if (storedWallets) {
      setWallets(JSON.parse(storedWallets));
    }
    const storedPassword = localStorage.getItem("walletPassword");
    if (storedPassword) {
      setPassword(storedPassword);
      setIsPasswordSet(true);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      localStorage.removeItem("walletPassword");
      setPassword("");
      setIsPasswordSet(false);
    }, 600000);

    return () => clearInterval(timer);
  }, []);

  const decryptPrivateKey = useCallback((encryptedPrivateKey: string) => {
    if (!isPasswordSet) {
      return { decrypted: null, error: "Password not set" };
    }
    try {
      const decrypted = decrypt(encryptedPrivateKey, password);
      return { decrypted, error: null };
    } catch {
      return { decrypted: null, error: "Decryption failed" };
    }
  }, [isPasswordSet, password]);

  async function genSOLaddress() {
    if (!isPasswordSet) {
      toast({
        title: "Password Required",
        description: "Please set a wallet password first.",
        variant: "destructive",
      });
      return;
    }

    const seed = await mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/0'/${wallets.length}'`;
    const derivedSeed = derivePath(path, Buffer.from(seed).toString("hex")).key;
    const keypair = Keypair.fromSeed(derivedSeed);
    const encryptedPrivateKey = encrypt(
      Buffer.from(keypair.secretKey).toString("hex"),
      password
    );
    const newWallet = {
      publicKey: keypair.publicKey.toBase58(),
      encryptedPrivateKey,
    };
    const newWallets = [...wallets, newWallet];
    setWallets(newWallets);
    localStorage.setItem(
      `solWallets_0`,
      JSON.stringify(newWallets)
    );
  }

  const deleteWallet = (publicKeyToDelete: string) => {
    const newWallets = wallets.filter((w) => w.publicKey !== publicKeyToDelete);
    setWallets(newWallets);
    localStorage.setItem(
      `solWallets_0`,
      JSON.stringify(newWallets)
    );
  };

  const togglePrivateKey = (publicKey: string) => {
    if (!isPasswordSet) {
      toast({
        title: "Password Required",
        description: "Please set a wallet password to view private keys.",
        variant: "destructive",
      });
      return;
    }
    setShowPrivateKey((prev) => ({ ...prev, [publicKey]: !prev[publicKey] }));
  };

  const handlePasswordSet = (newPassword: string) => {
    setPassword(newPassword);
    setIsPasswordSet(true);
    localStorage.setItem("walletPassword", newPassword);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Solana Wallets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isPasswordSet && (
          <AddPassword onPasswordSet={handlePasswordSet} />
        )}
        <Button onClick={genSOLaddress} disabled={!isPasswordSet}>Add SOL Wallet</Button>
        {wallets.map((wallet) => (
          <Card key={wallet.publicKey} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Public Key:</p>
                <p className="text-sm break-all">{wallet.publicKey}</p>
              </div>
              <div className="flex space-x-2">
                <CopyToClipboard
                  content={wallet.publicKey}
                  time={1200}
                  small={true}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => deleteWallet(wallet.publicKey)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
            <div className="mt-2">
              <p className="font-semibold">Private Key:</p>
              <div className="flex items-center space-x-2">
                <Input
                  type={showPrivateKey[wallet.publicKey] ? "text" : "password"}
                  value={
                    showPrivateKey[wallet.publicKey] && isPasswordSet
                      ? decryptPrivateKey(wallet.encryptedPrivateKey).decrypted || "************************"
                      : "************************"
                  }
                  readOnly
                  className="flex-grow"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => togglePrivateKey(wallet.publicKey)}
                  disabled={!isPasswordSet}
                >
                  {showPrivateKey[wallet.publicKey] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <CopyToClipboard
                  content={wallet.encryptedPrivateKey}
                  time={1200}
                  small={true}
                  disabled={!isPasswordSet}
                />
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}