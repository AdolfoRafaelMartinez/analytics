'use client';

import { useState, useEffect } from 'react';
import { Wallet, AlertCircle, RefreshCw, Search } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { 
  getEthereumBalance,
  getBitcoinBalance,
  type WalletBalance,
  type WalletBalanceResult
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
    name: 'Ethereum',
    fetchFn: getEthereumBalance,
    placeholder: 'Enter Ethereum address (0x...)',
    validation: /^0x[a-fA-F0-9]{40}$/,
    validationMsg: 'Invalid Ethereum address format.',
  },
  bitcoin: {
    name: 'Bitcoin',
    fetchFn: getBitcoinBalance,
    placeholder: 'Enter Bitcoin address...',
    validation: /.*/, // No specific validation for this example
    validationMsg: 'Invalid Bitcoin address format.',
  },
};

interface IFormInput {
  walletAddress: string;
}

interface WalletBalanceClientProps {
  selectedChain: Blockchain;
}

export function WalletBalanceClient({ selectedChain }: WalletBalanceClientProps) {
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit, formState: { errors }, reset, clearErrors } = useForm<IFormInput>();

  useEffect(() => {
    // Reset state when the chain changes
    setBalance(null);
    setError(null);
    setLoading(false);
    reset();
    clearErrors();
  }, [selectedChain, reset, clearErrors]);

  const onAddressSubmit: SubmitHandler<IFormInput> = async (data) => {
    setLoading(true);
    setError(null);
    setBalance(null);
    
    const details = blockchainDetails[selectedChain];
    const result: WalletBalanceResult = await details.fetchFn(data.walletAddress);

    if (result.error) {
      setError(result.error);
      setBalance(null);
    } else {
      setBalance(result.data);
    }
    setLoading(false);
  };
  
  const details = blockchainDetails[selectedChain];

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-sm border-primary/10">
      <CardHeader>
        <CardTitle>{details.name} Wallet Balance</CardTitle>
        <CardDescription>Enter a wallet address to check its balance.</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[160px]">
        <form onSubmit={handleSubmit(onAddressSubmit)} className="flex items-start gap-2">
          <div className="w-full">
            <Input
              {...register('walletAddress', { 
                required: 'Wallet address is required',
                pattern: {
                  value: details.validation,
                  message: details.validationMsg,
                }
              })}
              placeholder={details.placeholder}
              className="font-mono"
            />
            {errors.walletAddress && (
              <p className="text-destructive text-xs mt-1">{errors.walletAddress.message}</p>
            )}
          </div>
          <Button type="submit" disabled={loading} size="lg" className="h-10">
            <Search className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </form>

        {loading && (
          <div className="mt-6 w-full space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-6 w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Fetching Balance</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {balance && !error && (
          <div className="mt-6 text-center transition-all duration-300 ease-in-out animate-in fade-in-50">
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-4xl font-bold text-primary font-headline tracking-tighter">
              {balance.balance} {balance.symbol}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
