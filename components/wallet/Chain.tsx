import { Chain } from '@chain-registry/types'
import { CustomChain } from '../../config/silk'
import { ChainInfo } from '@keplr-wallet/types'

function customChainToChainInfo(chain: CustomChain): ChainInfo {
  const defaultStakeCurrency = {
    coinDenom: 'SILK',
    coinMinimalDenom: 'silk',
    coinDecimals: 0,
  }

  return {
    chainId: chain.chain_id,
    chainName: chain.chain_name,
    rpc: 'http://localhost:26657',
    rest: 'http://localhost:1317',
    bech32Config: {
      bech32PrefixAccAddr: chain.bech32_prefix,
      bech32PrefixAccPub: `${chain.bech32_prefix}pub`,
      bech32PrefixValAddr: `${chain.bech32_prefix}valoper`,
      bech32PrefixValPub: `${chain.bech32_prefix}valoperpub`,
      bech32PrefixConsAddr: `${chain.bech32_prefix}valcons`,
      bech32PrefixConsPub: `${chain.bech32_prefix}valconspub`,
    },
    bip44: {
      coinType: chain.slip44,
    },
    coinType: chain.slip44,
    stakeCurrency: chain.stakeCurrency || defaultStakeCurrency,
    currencies: [chain.stakeCurrency || defaultStakeCurrency],
    feeCurrencies: [
      {
        coinMinimalDenom: (chain.stakeCurrency || defaultStakeCurrency)
          .coinMinimalDenom,
        coinDenom: (chain.stakeCurrency || defaultStakeCurrency).coinDenom,
        coinDecimals: (chain.stakeCurrency || defaultStakeCurrency)
          .coinDecimals,
      },
    ],
  }
}

export default customChainToChainInfo
