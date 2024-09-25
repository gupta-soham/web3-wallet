"use client";
import { useState, useEffect } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Button } from "./ui/button";

export function SolWallet({ mnemonic }: { mnemonic: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState<string[]>([]);

  useEffect(() => {
    const storedKeys = localStorage.getItem("solAddresses");
    if (storedKeys) {
      setPublicKeys(JSON.parse(storedKeys));
      setCurrentIndex(JSON.parse(storedKeys).length);
    }
  }, []);

  async function genSOLaddress() {
    const seed = await mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, Buffer.from(seed).toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret).publicKey.toBase58();
    const newKeys = [...publicKeys, keypair];
    setPublicKeys(newKeys);
    setCurrentIndex(currentIndex + 1);
    localStorage.setItem("solAddresses", JSON.stringify(newKeys));
  }

  return (
    <div className="space-y-4">
      <Button onClick={() => genSOLaddress()} className="w-full">
        Add SOL wallet
      </Button>
      {publicKeys.map((publicKey) => (
        <div key={publicKey} className="p-2 bg-muted rounded-md break-all">
          {publicKey}
        </div>
      ))}
    </div>
  );
}
