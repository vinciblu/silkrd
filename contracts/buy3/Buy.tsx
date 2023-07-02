import { useState, useEffect } from 'react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useChain } from '@cosmos-kit/react'
import { BuyClient } from './Buy.client'
import EthCrypto from 'eth-crypto'
import { v4 } from 'uuid'
import { cartActions } from '../../store/cart-slice'
import { ICart } from '../../lib/types/cart'
import { RootState } from "../../store/index";

interface BuyButtonProps {
  cartPrice: number
  tokenIds: (string | undefined)[]
}

const Buy: React.FC<BuyButtonProps> = ({ cartPrice, tokenIds }) => {
  const dispatch = useDispatch()
  const cart = useSelector((state: RootState) => state.cart);
  const [dataToEncrypt, setDataToEncrypt] = useState('')
  const [loading, setLoading] = useState(false)
  const [client, setClient] = useState<BuyClient | null>(null)
  const chain = useChain('silk')

  useEffect(() => {
    async function initializeClient() {
      const signer = await chain.getOfflineSigner()
      const apiUrl = 'http://localhost:26657'
      const scc = await chain.getSigningCosmWasmClient()

      const contractAddress =
        'cosmos1999u8suptza3rtxwk7lspve02m406xe7l622erg3np3aq05gawxs8h8m5j'
      if (chain.address) {
        setClient(new BuyClient(scc, chain.address, contractAddress))
      } else {
        // Handle the undefined chain.address situation here, e.g., show an error message
      }
    }

    if (chain.address) {
      initializeClient()
    }
  }, [chain])

  const customGas = 1500000
  const customFee = 5

  const handleBuy = async () => {
    if (!client) return

    setLoading(true)

    try {
      const alicePublicKey =
        '02927277215d94bb11d9ffb4f82183938d10ac2066df070c73411cc50b388af5f8'
      const cartPriceUsdClean = cartPrice
      console.log('Cart price USD:', cartPriceUsdClean)
      console.log('Data to encrypt:', dataToEncrypt)

      const encryptedData = EthCrypto.encryptWithPublicKey(
        alicePublicKey,
        JSON.stringify(dataToEncrypt)
      )
      const encryptedDataHex = EthCrypto.cipher.stringify(await encryptedData)
      console.log('Encrypted data:', encryptedDataHex)
      const tokenIdsFiltered = tokenIds.filter(
        (id): id is string => id !== undefined
      )
      const result = await client.buyAndStoreData(
        {
          cartPriceUsd: cartPriceUsdClean.toString(),
          encryptedData: encryptedDataHex,
          buyTokenIds: tokenIdsFiltered,
        },
        {
          gas: customGas.toString(),
          amount: [{ denom: 'stake', amount: customFee.toString() }],
        },
        undefined,
        [{ amount: cartPrice.toString(), denom: 'stake' }]
      )

      if (result) {
        const order = {
          id: v4(),
          totalQuantity: cart.totalQuantity, // From cart state
          totalAmount: cart.totalAmount, // From cart state
          items: cart.items, // From cart state
        }

        // Dispatch the actions to the store
        dispatch(cartActions.clearCart())
      }
    } catch (error) {
      console.error('Error during buy:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="submit"
        disabled={loading || !client}
        onClick={handleBuy}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
          loading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
        }`}
      >
        {loading ? 'Buying...' : 'Pay with $ilk'}
      </button>
    </div>
  )
}

export default Buy
