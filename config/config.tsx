// config.ts
import { Config } from './config.d'

const config: Config = {
  features: ['no-legacy-stdTx'],
  chainId: 'silk',
  chainName: 'silk',
  rpc: 'http://localhost:26657',
  rest: 'http://localhost:1317',
  stakeCurrency: {
    coinDenom: 'SILK',
    coinMinimalDenom: 'silk',
    coinDecimals: 0,
  },
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: 'silk',
    bech32PrefixAccPub: 'silkpub',
    bech32PrefixValAddr: 'silkvaloper',
    bech32PrefixValPub: 'silkvaloperpub',
    bech32PrefixConsAddr: 'silkvalcons',
    bech32PrefixConsPub: 'silkvalconspub',
  },
  currencies: [
    {
      coinDenom: 'SILK',
      coinMinimalDenom: 'silk',
      coinDecimals: 0,
    },
    {
      coinDenom: 'TOKEN',
      coinMinimalDenom: 'token',
      coinDecimals: 0,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: 'SILK',
      coinMinimalDenom: 'silk',
      coinDecimals: 0,
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.04,
      },
    },
    {
      coinDenom: 'TOKEN',
      coinMinimalDenom: 'token',
      coinDecimals: 0,
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.04,
      },
    },
  ],
  coinType: 118,
  beta: true,
}

export default config
