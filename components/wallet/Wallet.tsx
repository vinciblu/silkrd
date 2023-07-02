import { Keplr } from '@keplr-wallet/types'
import { ChainInfo } from '@keplr-wallet/types'

import React, { MouseEventHandler, useEffect, useState } from 'react'
import s from './Wallet.module.css'
import { useChain } from '@cosmos-kit/react'
import {
  ChainName,
  WalletConnectOptions,
  WalletModalProps,
} from '@cosmos-kit/core'
import { chainName, silk } from '../../config/silk'
import customChainToChainInfo from './Chain'

export const Wallet = ({ chainName }: { chainName: string }) => {
  const { connect, openView, status, username, address, message, wallet } =
    useChain('silk')
  const [clicked, setClicked] = useState(false)

  async function setupKeplr() {
    if (typeof (window as any).keplr !== 'undefined') {
      const keplr: Keplr = (window as any).keplr
      try {
        const chainInfo = customChainToChainInfo(silk)
        await keplr.experimentalSuggestChain(chainInfo)
      } catch (error) {
        console.error('Failed to setup Keplr:', error)
      }
    } else {
      console.error('Keplr not found. Please install the extension.')
    }
  }

  // Events
  const onClickConnect: MouseEventHandler = async (e) => {
    e.preventDefault()
    await setupKeplr()
    await connect()
    setClicked(true)
  }

  useEffect(() => {
    setupKeplr()
  }, [])

  return (
    <div className="flex justify-center">
      <button className={`${s.root} ${s.ghost} mr-4`} onClick={onClickConnect}>
        {clicked ? 'My Wallet' : 'Connect Wallet'}
      </button>
      <style>{`
        .${s.root} {
          border: none;
          border-radius: 4px;
          color: #fff;
          cursor: pointer;
          font-family: 'Quantico' sans-s;
          font-size: 16px;
          font-weight: 600;
          white-space: nowrap;
          padding: 12px 24px;
          transition: background-color 0.2s ease-in-out;
          width: 185px;
        }

        .${s.root}:hover {
          background-color: hotpink;
        }
      `}</style>
    </div>
  )
}

export default Wallet
