interface WalletBalance {
  currency: string;
  amount: number;
  //CHANGE: add blockchain to this interface
}
interface FormattedWalletBalance {
  //CHANGE: FormattedWalletBalance should extend WalletBalance
  //CHANGE: add usdValue to this interface
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();
  
    // CHANGE: Move this to a constant object outside the component to avoid recreation on each render
    const getPriority = (blockchain: any): number => {
      switch (blockchain) {
        case 'Osmosis':
          return 100
        case 'Ethereum':
          return 50
        case 'Arbitrum':
          return 30
        case 'Zilliqa':
          return 20
        case 'Neo':
          return 20
        default:
          return -99
      }
    }
  
    // CHANGE: Fix logical errors in filter and sort functions
    // CHANGE: Combine filtering, sorting, and formatting into one operation
    const sortedBalances = useMemo(() => {
      return balances.filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (lhsPriority > -99) {
           if (balance.amount <= 0) {
             return true;
           }
        }
        return false
      }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
    }, [balances, prices]);
  
    // CHANGE: Remove this as it's unused
    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed()
      }
    })
  
    // CHANGE: Use formattedBalances instead of sortedBalances
    // CHANGE: Pre-calculate usdValue to avoid multiple price lookups
    // CHANGE: Use a more specific key for list items
    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow 
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      )
    })
  
    return (
      <div {...rest}>
        {rows}
      </div>
    )
  }
  
  // CHANGE: Memoize WalletRow component to prevent unnecessary re-renders