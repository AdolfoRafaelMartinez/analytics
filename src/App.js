import React from 'react';
import LinkCard from './components/LinkCard';

function App() {
  const walletLinks = [
    { href: '/create_wallet', text: 'Create HD Wallet' },
    { href: '/load_hd_wallet', text: 'Load HD Wallet' },
  ];

  const bitcoinLinks = [
    { href: '/get_latest_btc_block', text: 'Latest Block' },
    { href: '/get_btc_block_by_hash', text: 'Block by Hash' },
    { href: '/get_btc_balance', text: 'Balance' },
    { href: '/transfer_btc', text: 'Transfer' },
    { href: '/get_btc_transactions_by_block', text: 'Transactions by Block' },
    { href: '/get_btc_transaction_by_hash', text: 'Transaction by Hash' },
  ];

  const ethereumLinks = [
    { href: '/get_latest_eth_block', text: 'Latest Block' },
    { href: '/get_eth_block_by_hash', text: 'Block by Hash' },
    { href: '/get_eth_balance', text: 'Balance' },
    { href: '/transfer_eth', text: 'Transfer' },
    { href: '/get_transaction_by_hash_page', text: 'Transaction' },
    { href: '/get_eth_transactions', text: 'Transactions by Address' },
    { href: '/get_block_transactions_page', text: 'Transactions by Block' },
  ];

  return (
    <div>
      <h1>Digital Assets Analytics</h1>
      <div className="columns-container">
        <LinkCard title="Wallet" links={walletLinks} />
        <LinkCard title="Bitcoin" links={bitcoinLinks} />
        <LinkCard title="Ethereum" links={ethereumLinks} />
      </div>
    </div>
  );
}

export default App;
