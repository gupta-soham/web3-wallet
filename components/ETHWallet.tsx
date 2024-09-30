"use client";
import { useState, useEffect, useCallback } from "react";
import { mnemonicToSeed } from "bip39";
import { HDNodeWallet } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { encrypt, decrypt } from "@/utils/encryption";
import AddPassword from "./AddPassword";
import CopyToClipboard from "@/utils/copyToClipboard";
import { useToast } from "@/hooks/use-toast";

export const EthWallet = ({ mnemonic }: { mnemonic: string }) => {
  const [addresses, setAddresses] = useState<
    { address: string; encryptedPrivateKey: string }[]
  >([]);
  const [showPrivateKey, setShowPrivateKey] = useState<{
    [key: string]: boolean;
  }>({});
  const [password, setPassword] = useState("");
  const [isPasswordSet, setIsPasswordSet] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedAddresses = localStorage.getItem(`ethAddresses_0`);
    if (storedAddresses) {
      setAddresses(JSON.parse(storedAddresses));
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

  async function genETHaddress() {
    if (!isPasswordSet) {
      toast({
        title: "Password Required",
        description: "Please set a wallet password first.",
        variant: "destructive",
      });
      return;
    }

    const seed = await mnemonicToSeed(mnemonic);
    const hdNode = HDNodeWallet.fromSeed(seed);
    const wallet = hdNode.derivePath(`m/44'/60'/0'/${addresses.length}`);
    const encryptedPrivateKey = encrypt(wallet.privateKey, password);
    const newAddress = { address: wallet.address, encryptedPrivateKey };
    const newAddresses = [...addresses, newAddress];
    setAddresses(newAddresses);
    localStorage.setItem(`ethAddresses_0`, JSON.stringify(newAddresses));
  }

  const deleteAddress = (addressToDelete: string) => {
    const newAddresses = addresses.filter((a) => a.address !== addressToDelete);
    setAddresses(newAddresses);
    localStorage.setItem(`ethAddresses_0`, JSON.stringify(newAddresses));
  };

  const togglePrivateKey = (address: string) => {
    if (!isPasswordSet) {
      toast({
        title: "Password Required",
        description: "Please set a wallet password to view private keys.",
        variant: "destructive",
      });
      return;
    }
    setShowPrivateKey((prev) => ({ ...prev, [address]: !prev[address] }));
  };

  const handlePasswordSet = (newPassword: string) => {
    setPassword(newPassword);
    setIsPasswordSet(true);
    localStorage.setItem("walletPassword", newPassword);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ethereum Wallets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isPasswordSet && <AddPassword onPasswordSet={handlePasswordSet} />}
        <Button onClick={genETHaddress} disabled={!isPasswordSet}>
          Add ETH Wallet
        </Button>
        {addresses.map((wallet) => (
          <Card key={wallet.address} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Public Key:</p>
                <p className="text-sm break-all">{wallet.address}</p>
              </div>
              <div className="flex space-x-2">
                <CopyToClipboard
                  content={wallet.address}
                  time={1200}
                  small={true}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => deleteAddress(wallet.address)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
            <div className="mt-2">
              <p className="font-semibold">Private Key:</p>
              <div className="flex items-center space-x-2">
                <Input
                  type={showPrivateKey[wallet.address] ? "text" : "password"}
                  value={
                    showPrivateKey[wallet.address] && isPasswordSet
                      ? decryptPrivateKey(wallet.encryptedPrivateKey).decrypted || "************************"
                      : "************************"
                  }
                  readOnly
                  className="flex-grow"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => togglePrivateKey(wallet.address)}
                  disabled={!isPasswordSet}
                >
                  {showPrivateKey[wallet.address] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <CopyToClipboard
                  content={decryptPrivateKey(wallet.encryptedPrivateKey).decrypted || "************************"}
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
};