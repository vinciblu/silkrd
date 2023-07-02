import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { NftClient } from './Nft.client'
import React from 'react'
import { useChain } from '@cosmos-kit/react'
import { v4 } from 'uuid'
import { RootState } from "../../store/index";
import { cartActions } from '../../store/cart-slice'

interface NFTprops {
  mintNft?: boolean
  paymentSuccessful?: boolean
}

const NFT: React.FC<NFTprops> = ({ mintNft }) => {
  const dispatch = useDispatch()
  const cart = useSelector((state: RootState) => state.cart);
  const [loading, setLoading] = useState(false)
  const [client, setClient] = useState<NftClient | null>(null)
  const chain = useChain('silk')

  useEffect(() => {
    async function initializeClient() {
      const signer = await chain.getOfflineSigner()
      const scc = await chain.getSigningCosmWasmClient()

      const contractAddress =
        'cosmos10qt8wg0n7z740ssvf3urmvgtjhxpyp74hxqvqt7z226gykuus7eqn0j5zt'
      if (chain.address) {
        setClient(new NftClient(scc, chain.address, contractAddress))
      } else {
        // Handle the undefined chain.address situation here, e.g., show an error message
      }
    }

    if (chain.address) {
      initializeClient()
    }
  }, [chain])

  const customGas = 1000000 // Set a custom gas value (adjust this according to your needs)
  const customFee = 5 // Set a custom fee value (adjust this according to your needs)

  const handleNft = async () => {
    if (!client || !chain.address) {
      // Handle the undefined client or chain.address situation here, e.g., show an error message
      return
    }
    setLoading(true)

    try {
      const tokenId = v4() // Replace with a unique token ID
      const owner = chain.address // Replace with the appropriate owner address
      const tokenUri = 'https://example.com/token_uri' // Replace with the appropriate token URI
      const lineItemsString = cart.items
        ? cart.items
            .map(
              (item: { name: any; quantity: any }) =>
                `${item.name} (x${item.quantity})`
            )
            .join(', ')
        : ''

      // Set the metadata for the NFT
      const extension = {
        description: `Items: ${lineItemsString} 
        Order ID: ${v4()},`,
        // Add other metadata fields as necessary
      }

      const customFeeObj = {
        gas: customGas.toString(),
        amount: [{ amount: customFee.toString(), denom: 'stake' }],
      }

      // Mint the NFT
      const result = await client.mint(
        {
          tokenId,
          owner,
          tokenUri,
          extension,
        },
        customFeeObj
      )

      console.log('Minting result:', result)
      dispatch(cartActions.clearCart())
    } catch (error) {
      console.error('Error minting NFT:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mintNft) {
      handleNft()
    }
  }, [mintNft])

  return (
    <button
      id="mint-nft"
      disabled={loading || !client}
      onClick={handleNft}
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
        loading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
      }`}
    >
      {loading ? 'Minting...' : 'Mint Receipt'}
    </button>
  )
}

export default NFT
