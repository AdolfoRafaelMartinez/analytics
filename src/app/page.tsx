'use client';

import { useState } from 'react';
import { BlockNumberClient } from '@/components/block-number-client';
import { WalletBalanceClient } from '@/components/wallet-balance-client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';

type Blockchain = 'ethereum' | 'bitcoin';

export default function Home() {
  const [selectedChain, setSelectedChain] = useState<Blockchain>('ethereum');

  return (
    <main className="flex min-h-screen w-full flex-col items-center gap-8 p-4 sm:p-8 bg-background font-body">
      <div className="w-full max-w-md space-y-4">
        <Card className="p-4 bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg">
          <label htmlFor="blockchain-select" className="text-sm font-medium text-muted-foreground mb-2 block">
            Select Blockchain
          </label>
          <Select value={selectedChain} onValueChange={(value) => setSelectedChain(value as Blockchain)}>
            <SelectTrigger id="blockchain-select" className="w-full">
              <SelectValue placeholder="Select a blockchain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ethereum">Ethereum (sepolia)</SelectItem>
              <SelectItem value="bitcoin">Bitcoin (testnet4)</SelectItem>
            </SelectContent>
          </Select>
        </Card>
        <WalletBalanceClient selectedChain={selectedChain} />
        <BlockNumberClient selectedChain={selectedChain} />
      </div>
      <footer className="text-center text-muted-foreground text-xs sm:text-sm">
        <p>
          Powered by{' '}
          <a
            href="https://www.quicknode.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            QuickNode
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
