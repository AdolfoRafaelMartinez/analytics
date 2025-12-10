'use client';

import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface WalletGroupProps {
  title: string;
  walletCount: number;
  btc: number;
  eth: number;
  balanceHistory: any[];
  transactionsIn: { eth: number; btc: number };
  transactionsOut: { eth: number; btc: number };
}

export function WalletGroup({ title, walletCount, btc, eth, balanceHistory, transactionsIn, transactionsOut }: WalletGroupProps) {
  return (
    <Card className="w-full max-w-sm p-4 bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="text-right">
          <p className="text-lg font-bold">{walletCount}</p>
          <p className="text-sm text-muted-foreground">Wallets</p>
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Assets</p>
        <div className="flex gap-4 my-2">
          <div className="flex-1 p-2 border rounded-md">
            <p className="text-2xl font-bold">{btc}</p>
            <p className="text-sm text-muted-foreground">BTC</p>
          </div>
          <div className="flex-1 p-2 border rounded-md">
            <p className="text-2xl font-bold">{eth}</p>
            <p className="text-sm text-muted-foreground">ETH</p>
          </div>
        </div>
      </div>

      <div className="my-4">
        <p className="text-sm text-muted-foreground">Balance History</p>
        <div style={{ width: '100%', height: 100 }} className="my-2">
            <ResponsiveContainer>
                <LineChart data={balanceHistory} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" strokeWidth={2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Transaction History</p>
        <div className="flex justify-between items-center my-2">
          <div className="p-2 border rounded-md text-center">
            <p className="text-lg font-bold">{transactionsOut.eth} ETH</p>
            <p className="text-lg font-bold">{transactionsOut.btc} BTC</p>
          </div>
          <p className="text-muted-foreground">OUT</p>
          <p className="text-muted-foreground">IN</p>
          <div className="p-2 border rounded-md text-center">
            <p className="text-lg font-bold">{transactionsIn.eth} ETH</p>
            <p className="text-lg font-bold">{transactionsIn.btc} BTC</p>
          </div>
        </div>
      </div>
    </Card>
  );
}