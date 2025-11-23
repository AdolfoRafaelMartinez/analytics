'use client';

import { useState, useEffect } from 'react';
import { Blocks, AlertCircle, RefreshCw, Bitcoin, Search, Copy } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { 
  getEthereumBlockNumber, 
  getBitcoinBlockCount,
  getEthereumTransactionDetails,
  getBitcoinTransactionDetails,
  type TransactionDetails,
  type TransactionDetailsResult,
  type BitcoinTransactionDetails,
  type BitcoinTransactionDetailsResult
} from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';

type Blockchain = 'ethereum' | 'bitcoin';

const blockchainDetails = {
  ethereum: {
    name: 'Ethereum (sepolia)',
    icon: <Blocks className="h-8 w-8 text-primary" />,
    fetchFn: getEthereumBlockNumber,
    description: 'Get the latest block number from the Ethereum Sepolia testnet.',
  },
  bitcoin: {
    name: 'Bitcoin (testnet4)',
    icon: <Bitcoin className="h-8 w-8 text-primary" />,
    fetchFn: getBitcoinBlockCount,
    description: 'Get the latest block count from the Bitcoin testnet4.',
  },
};

interface IFormInput {
  transactionHash: string;
}

interface BlockNumberClientProps {
  selectedChain: Blockchain;
}

const TransactionDetailRow = ({ label, value, isHash = false }: { label: string; value: string | number | null | undefined; isHash?: boolean }) => {
  if (value === null || value === undefined) return null;

  const displayValue = typeof value === 'number' ? value.toLocaleString() : value;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayValue.toString());
  };

  return (
    <div className="flex justify-between items-start py-2 border-b border-border/50 text-sm">
      <span className="font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-right font-mono break-all ${isHash ? 'text-primary' : ''}`}>
          {displayValue}
        </span>
        {isHash && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
            <Copy className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};

export function BlockNumberClient({ selectedChain }: BlockNumberClientProps) {
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Ethereum Tx states
  const [txDetails, setTxDetails] = useState<TransactionDetails | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [txLoading, setTxLoading] = useState<boolean>(false);
  
  // Bitcoin Tx states
  const [btxDetails, setBtxDetails] = useState<BitcoinTransactionDetails | null>(null);
  const [btxError, setBtxError] = useState<string | null>(null);
  const [btxLoading, setBtxLoading] = useState<boolean>(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<IFormInput>();

  useEffect(() => {
    // Reset all state when the chain changes
    setBlockNumber(null);
    setError(null);
    setLoading(false);
    setTxDetails(null);
    setTxError(null);
    setTxLoading(false);
    setBtxDetails(null);
    setBtxError(null);
    setBtxLoading(false);
    reset(); // Clear form input
  }, [selectedChain, reset]);


  const handleFetchBlockNumber = async () => {
    setLoading(true);
    setError(null);
    
    const fetchFn = blockchainDetails[selectedChain].fetchFn;
    const result = await fetchFn();

    if (result.error) {
      setError(result.error);
      setBlockNumber(null);
    } else {
      setBlockNumber(result.data);
    }
    setLoading(false);
  };

  const onTxSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (selectedChain === 'ethereum') {
      setTxLoading(true);
      setTxError(null);
      setTxDetails(null);
      const result: TransactionDetailsResult = await getEthereumTransactionDetails(data.transactionHash);
      if (result.error) {
        setTxError(result.error);
        setTxDetails(null);
      } else if (result.data) {
        setTxDetails(result.data);
      } else {
        setTxError('Transaction not found.');
      }
      setTxLoading(false);
    } else if (selectedChain === 'bitcoin') {
      setBtxLoading(true);
      setBtxError(null);
      setBtxDetails(null);
      const result: BitcoinTransactionDetailsResult = await getBitcoinTransactionDetails(data.transactionHash);
      if (result.error) {
        setBtxError(result.error);
        setBtxDetails(null);
      } else if (result.data) {
        setBtxDetails(result.data);
      } else {
        setBtxError('Transaction not found.');
      }
      setBtxLoading(false);
    }
  };
  
  const details = blockchainDetails[selectedChain];
  const isLoading = txLoading || btxLoading;

  return (
    <div className="space-y-8">
      <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {details.icon}
            </div>
            <div className="flex flex-col flex-grow">
              <CardTitle className="text-2xl sm:text-3xl font-headline">{details.name} Height Now</CardTitle>
              <CardDescription className="text-sm">
                {details.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="min-h-[160px] flex items-center justify-center p-6">
          {loading && !blockNumber && (
            <div className="w-full space-y-4" aria-label="Loading block number">
              <Skeleton className="h-16 w-3/4 mx-auto" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
            </div>
          )}
          {!loading && error && (
            <Alert variant="destructive" className="w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Fetching Data</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {blockNumber !== null && !error && (
            <div className="text-center transition-all duration-300 ease-in-out">
              <p className="text-sm text-muted-foreground">Latest Block Number</p>
              <p className="text-6xl sm:text-7xl font-bold text-primary font-headline tracking-tighter">
                {blockNumber.toLocaleString()}
              </p>
              {!loading && (
                <p className="text-xs text-accent-foreground mt-2 bg-accent/20 rounded-full px-3 py-1 inline-block animate-in fade-in-50">
                  Successfully retrieved
                </p>
              )}
            </div>
          )}
          {!loading && !error && blockNumber === null && (
            <div className="text-center text-muted-foreground">
              <p>Click the button below to fetch the current block number.</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleFetchBlockNumber}
            disabled={loading}
            className="w-full text-lg font-bold py-7"
            size="lg"
          >
            <RefreshCw
              className={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`}
            />
            {loading ? 'Fetching...' : 'Get Latest Block'}
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle>{details.name} Transaction Explorer</CardTitle>
          <CardDescription>Enter a transaction hash/ID to view its details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onTxSubmit)} className="flex items-start gap-2">
            <div className="w-full">
              <Input
                {...register('transactionHash', { 
                  required: 'Transaction hash/ID is required',
                  pattern: {
                    value: selectedChain === 'ethereum' ? /^0x([A-Fa-f0-9]{64})$/ : /^[a-fA-F0-9]{64}$/,
                    message: `Invalid ${details.name} transaction format`
                  }
                })}
                placeholder={selectedChain === 'ethereum' ? '0x...' : 'Enter transaction ID...'}
                className="font-mono"
              />
              {errors.transactionHash && (
                <p className="text-destructive text-xs mt-1">{errors.transactionHash.message}</p>
              )}
            </div>
            <Button type="submit" disabled={isLoading} size="lg" className="h-10">
              <Search className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </form>

          {isLoading && (
            <div className="mt-6 w-full space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          )}
          
          {selectedChain === 'ethereum' && txError && (
            <Alert variant="destructive" className="mt-6 w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Fetching Transaction</AlertTitle>
              <AlertDescription>{txError}</AlertDescription>
            </Alert>
          )}

          {selectedChain === 'bitcoin' && btxError && (
            <Alert variant="destructive" className="mt-6 w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Fetching Transaction</AlertTitle>
              <AlertDescription>{btxError}</AlertDescription>
            </Alert>
          )}

          {selectedChain === 'ethereum' && txDetails && !txError && (
            <div className="mt-6 space-y-1">
              <TransactionDetailRow label="From" value={txDetails.from} isHash />
              <TransactionDetailRow label="To" value={txDetails.to} isHash />
              <TransactionDetailRow label="Value (ETH)" value={txDetails.value ? (parseInt(txDetails.value, 16) / 1e18).toFixed(8) : '0'} />
              <TransactionDetailRow label="Block Number" value={txDetails.blockNumber ? parseInt(txDetails.blockNumber, 16) : 'Pending'} />
              <TransactionDetailRow label="Gas Price (Gwei)" value={txDetails.gasPrice ? (parseInt(txDetails.gasPrice, 16) / 1e9).toFixed(4) : '0'} />
              <TransactionDetailRow label="Transaction Hash" value={txDetails.hash} isHash />
            </div>
          )}

          {selectedChain === 'bitcoin' && btxDetails && !btxError && (
            <div className="mt-6 space-y-1">
              <TransactionDetailRow label="TxID" value={btxDetails.txid} isHash />
              <TransactionDetailRow label="Confirmations" value={btxDetails.confirmations} />
              <TransactionDetailRow label="Size (bytes)" value={btxDetails.size} />
              <TransactionDetailRow label="Total Output (BTC)" value={btxDetails.vout ? btxDetails.vout.reduce((sum, out) => sum + out.value, 0) : 0} />
              <TransactionDetailRow label="Block Hash" value={btxDetails.blockhash} isHash />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
