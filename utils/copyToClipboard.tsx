"use client";
import { Button } from "@/components/ui/button";
import { CheckCheck, Clipboard, ClipboardCheck, Copy } from "lucide-react";
import { useState } from "react";

interface CopyToClipboardProps {
  content: string;
  time: number;
  small: boolean;
  disabled?: boolean;
}

export default function CopyToClipboard({
  content,
  time,
  small,
  disabled = false,
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);

  const copyContent = (content: string, time: number) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, time);
  };

  return (
    <>
      {small ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyContent(content, time)}
          className="text-gray-500 hover:text-gray-700"
          disabled={disabled}
        >
          {copied ? (
            <CheckCheck className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      ) : (
        <Button
          variant="ghost"
          onClick={() => copyContent(content, time)}
          className="text-gray-500 hover:text-gray-700"
          disabled={disabled}
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
      )}
    </>
  );
}
