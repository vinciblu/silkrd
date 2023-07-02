import { Chain, AssetList } from '@chain-registry/types'
import { useChain } from '@cosmos-kit/react'

export const chainName = 'silk'

export type CustomChain = Chain & {
  stakeCurrency: {
    coinDenom: string
    coinMinimalDenom: string
    coinDecimals: number
  }
}

export const silk: CustomChain = {
  $schema:
    'https://ipfs.io/ipfs/QmQ9YaKYepE4GWrSRAuT3dgvNL8PSEdN4f6obtivEmLkxU',
  chain_name: 'silk',
  status: 'live',
  network_type: 'testnet',
  pretty_name: 'silk',
  chain_id: 'silk-da-vinci',
  bech32_prefix: 'silk',
  node_home: '$HOME/.wasmd',
  key_algos: ['secp256k1'],
  slip44: 118,
  fees: {
    fee_tokens: [
      {
        denom: 'SILK',
        fixed_min_gas_price: 0,
        low_gas_price: 0,
        average_gas_price: 0.025,
        high_gas_price: 0.04,
      },
    ],
  },
  stakeCurrency: {
    coinDenom: 'SILK',
    coinMinimalDenom: 'silk',
    coinDecimals: 0,
  },
  staking: {
    staking_tokens: [
      {
        denom: 'SILK',
      },
    ],
  },
  apis: {
    rpc: [
      {
        address: 'http://localhost:26657',
      },
    ],
    rest: [
      {
        address: 'http://localhost:1317',
      },
    ],
    grpc: [
      {
        address: 'http://localhost:9090',
      },
    ],
  },
}

export const silkAssets: AssetList = {
  $schema: './chain.schema.json',
  chain_name: 'silk',
  assets: [
    {
      description: 'The native token of Celeswasm',
      denom_units: [
        {
          denom: 'SILK',
          exponent: 0,
          aliases: [],
        },
        {
          denom: 'silk',
          exponent: 6,
          aliases: [],
        },
      ],
      base: 'silk',
      name: 'Silk',
      display: 'silk',
      symbol: 'SILK',
    },
  ],
}
