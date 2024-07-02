import React, { useMemo, useCallback } from 'react';

interface WalletBalance {
  blockchain: string;
  currency: string;
  amount: number;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

interface Props extends BoxProps {}

const BLOCKCHAIN_PRIORITIES: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = useCallback((blockchain: string): number => {
    return BLOCKCHAIN_PRIORITIES[blockchain] || -99;
  }, []);

  const formattedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => getPriority(balance.blockchain) > -99 && balance.amount > 0)
      .sort((a: WalletBalance, b: WalletBalance) => {
        const priorityDiff = getPriority(b.blockchain) - getPriority(a.blockchain);
        return priorityDiff !== 0 ? priorityDiff : b.amount - a.amount;
      })
      .map((balance: WalletBalance): FormattedWalletBalance => ({
        ...balance,
        formatted: balance.amount.toFixed(2),
        usdValue: (prices[balance.currency] || 0) * balance.amount,
      }));
  }, [balances, prices, getPriority]);

  return (
    <div {...rest}>
      {formattedBalances.map((balance: FormattedWalletBalance) => (
        <MemoizedWalletRow
          key={`${balance.blockchain}-${balance.currency}`}
          className={classes.row}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
};

const MemoizedWalletRow = React.memo(WalletRow);

export default WalletPage;