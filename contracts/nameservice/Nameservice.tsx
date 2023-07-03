import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { NameserviceClient } from './Nameservice.client'
import { useChain } from '@cosmos-kit/react'
import { Coin, ExecuteMsg } from './Nameservice.types'
import { v4 } from 'uuid'

interface RegisterForm {
  name: string
}

interface TransferForm {
  name: string
  to: string
}

const Nameservice: React.FC = () => {
  const [client, setClient] = useState<NameserviceClient | null>(null)
  const chain = useChain('silk')

  useEffect(() => {
    async function initializeClient() {
      const signer = await chain.getOfflineSigner()
      const apiUrl = 'http://localhost:26657'
      const scc = await chain.getSigningCosmWasmClient()

      const contractAddress =
        'silk1aakfpghcanxtc45gpqlx8j3rq0zcpyf49qmhm9mdjrfx036h4z5scvm74h'
      if (chain.address) {
        setClient(new NameserviceClient(scc, chain.address, contractAddress))
      } else {
        // Handle the undefined chain.address situation here, e.g., show an error message
      }
    }

    if (chain.address) {
      initializeClient()
    }
  }, [chain])

  const { register: registerRegister, handleSubmit: handleSubmitRegister } =
    useForm<RegisterForm>()
  const { register: registerTransfer, handleSubmit: handleSubmitTransfer } =
    useForm<TransferForm>()

  const purchasePrice: Coin = { amount: '1000', denom: 'stake' }
  const transferPrice: Coin = { amount: '500', denom: 'stake' }

  const customGas = 150000 // Set a custom gas value (adjust this according to your needs)
  const customFee = 5 // Set a custom fee value (adjust this according to your needs)

  const handleRegister = async ({ name }: RegisterForm) => {
    if (!client) {
      // Handle the undefined client situation here, e.g., show an error message
      return
    }

    try {
      const result = await client.register(
        { name },
        {
          gas: customGas.toString(), // Use custom gas value
          amount: [{ denom: 'stake', amount: customFee.toString() }],
        }, // Use custom gas and fee values
        undefined,
        [purchasePrice]
      )
      console.log('Registration result:', result)
    } catch (error) {
      console.error('Error registering domain:', error)
    }
  }

  const handleTransfer = async ({ name, to }: TransferForm) => {
    if (!client) {
      // Handle the undefined client situation here, e.g., show an error message
      return
    }

    try {
      const result = await client.transfer(
        { name, to },
        {
          gas: customGas.toString(), // Use custom gas value
          amount: [{ denom: 'stake', amount: customFee.toString() }],
        }, // Use custom gas and fee values
        undefined,
        [transferPrice]
      )
      console.log('Transfer result:', result)
    } catch (error) {
      console.error('Error transferring domain:', error)
    }
  }

  return (
    <div className="container">
      <div className="row">
        <h2>Register a domain</h2>
        <form onSubmit={handleSubmitRegister(handleRegister)}>
          <input
            className="input"
            placeholder="Domain name"
            {...registerRegister('name', { required: true })}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Register
          </button>
        </form>
      </div>
      <div className="row">
        <h2>Transfer a domain</h2>
        <form onSubmit={handleSubmitTransfer(handleTransfer)}>
          <input
            className="input"
            placeholder="Domain name"
            {...registerTransfer('name', { required: true })}
          />
          <input
            className="input"
            placeholder="Recipient address"
            {...registerTransfer('to', { required: true })}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Transfer
          </button>
        </form>
      </div>
    </div>
  )
}

export default Nameservice
