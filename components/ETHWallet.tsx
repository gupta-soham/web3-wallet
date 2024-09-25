"use client";
import { useState, useEffect } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import { Button } from "./ui/button";

export const EthWallet = ({ mnemonic }: { mnemonic: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState<string[]>([]);
  
  useEffect(() => {
    const storedAddresses = localStorage.getItem('ethAddresses');
    if (storedAddresses) {
      setAddresses(JSON.parse(storedAddresses));
      setCurrentIndex(JSON.parse(storedAddresses).length);
    }
  }, []);

  async function genETHaddress() {
    const seed = await mnemonicToSeed(mnemonic);
    const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
    const hdNode = HDNodeWallet.fromSeed(seed);
    const privateKey = hdNode.derivePath(derivationPath).privateKey;
    const wallet = new Wallet(privateKey);
    const newAddresses = [...addresses, wallet.address];
    setAddresses(newAddresses);
    setCurrentIndex(currentIndex + 1);
    localStorage.setItem('ethAddresses', JSON.stringify(newAddresses));
  }

  return (
    <div className="space-y-4">
      <Button onClick={() => genETHaddress()} className="w-full">Add ETH wallet</Button>
      {addresses.map((address) => (
        <div key={address} className="p-2 bg-muted rounded-md break-all">
          {address}
        </div>
      ))}
    </div>
  );
};