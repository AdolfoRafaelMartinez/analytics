'use client';

import { WalletGroup } from '@/components/wallet-group';

const coldBalanceHistory = [
  { name: 'Mar 1', uv: 50.00 },
  { name: 'Mar 11', uv: 50.00 },
  { name: 'Mar 1', uv: 50.00 },
  { name: 'Mar 31', uv: 60.00 },
];

const treasuryBalanceHistory = [
    { name: 'Mar 1', uv: 40.00 },
    { name: 'Mar 11', uv: 60.00 },
    { name: 'Mar 1', uv: 55.00 },
    { name: 'Mar 31', uv: 58.00 },
];

const clientBalanceHistory = [
    { name: 'Mar 1', uv: 50.00 },
    { name: 'Mar 11', uv: 50.00 },
    { name: 'Mar 1', uv: 50.00 },
    { name: 'Mar 31', uv: 50.00 },
];

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center gap-8 p-4 sm:p-8 bg-background font-body">
      <div className="flex flex-wrap justify-center gap-8">
        <WalletGroup 
          title="COLD" 
          walletCount={2} 
          btc={3} 
          eth={3} 
          balanceHistory={coldBalanceHistory} 
          transactionsIn={{ eth: 3, btc: 3 }} 
          transactionsOut={{ eth: 0, btc: 0 }}
        />
        <WalletGroup 
          title="TREASURY" 
          walletCount={10} 
          btc={3} 
          eth={3} 
          balanceHistory={treasuryBalanceHistory} 
          transactionsIn={{ eth: 3, btc: 3 }} 
          transactionsOut={{ eth: 0, btc: 0 }}
        />
        <WalletGroup 
          title="CLIENT" 
          walletCount={3000} 
          btc={0} 
          eth={0} 
          balanceHistory={clientBalanceHistory} 
          transactionsIn={{ eth: 3, btc: 3 }} 
          transactionsOut={{ eth: 3, btc: 3 }}
        />
      </div>
    </main>
  );
}