import { useEffect, useState } from 'react'
import { VendorClient } from './Vendor.client'
import { useChain } from '@cosmos-kit/react'
import { ExecuteMsg } from './Vendor.types'
import { v4 } from 'uuid'
import { create as createIpfsHttpClient } from 'ipfs-http-client'

const projectId = '2NnaQcF892SLyv6mlK5M5T30IWn'
const projectSecret = 'be03b526dbc0166285c3bb69fb3f37ef'

const ipfs = createIpfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    Authorization: `Basic ${Buffer.from(
      `${projectId}:${projectSecret}`
    ).toString('base64')}`,
  },
})

interface VendNFTProps {
  onTokenIdGenerated: (tokenId: string, ipfsUri: string, product: any) => void
}

const VendNFT: React.FC<VendNFTProps> = ({ onTokenIdGenerated }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    ipfsUri: '',
  })
  const [client, setClient] = useState<VendorClient | null>(null)
  const chain = useChain('silk')
  const [image, setImage] = useState<File | null>(null)

  const storeMetadata = async (updatedProduct: any) => {
    console.log('storeMetadata called')
    const metadata = {
      name: updatedProduct.name,
      description: updatedProduct.description,
      image: `${updatedProduct.image}`,
      attributes: [
        {
          trait_type: 'Rarity',
          value: 'Rare',
        },
      ],
      commercejs_data: {
        price: updatedProduct.price,
        inventory: '10',
      },
    }

    console.log('Metadata:', metadata)

    const { path } = await ipfs.add(JSON.stringify(metadata))
    const ipfsUri = `ipfs://${path}`
    setProduct({ ...updatedProduct, ipfsUri })
    return ipfsUri
  }

  const uploadAsset = async (file: File) => {
    const readFileAsDataURL = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = () => {
          reader.abort()
          reject(new Error('Error reading file'))
        }
        reader.onload = () => {
          resolve(reader.result as string)
        }
        reader.readAsDataURL(file)
      })

    const base64File = await readFileAsDataURL(file)
    console.log('Base64 file:', base64File)
    const base64Content = base64File.split(',')[1]

    const assetFormData = new FormData()
    assetFormData.append('contents', base64Content)
    assetFormData.append('filename', file.name)

    try {
      const assetResponse = await fetch('https://api.chec.io/v1/assets', {
        method: 'POST',
        headers: {
          'X-Authorization':
            'sk_test_50710564340abadaa7b44536ce7b9d71a3db77deca5a5',
        },
        body: assetFormData,
      })

      if (!assetResponse.ok) {
        const errorData = await assetResponse.json()
        console.error('Error uploading asset:', errorData)
        throw new Error(
          `Error uploading asset: ${errorData.error.message} - ${JSON.stringify(
            errorData.error.errors
          )}`
        )
      }

      return await assetResponse.json()
    } catch (error) {
      console.error('Error uploading asset:', error)
      throw error
    }
  }

  useEffect(() => {
    async function initializeClient() {
      const signer = await chain.getOfflineSigner()
      const apiUrl = 'http://localhost:26657'
      const scc = await chain.getSigningCosmWasmClient()

      const contractAddress =
        'silk1zwv6feuzhy6a9wekh96cd57lsarmqlwxdypdsplw6zhfncqw6ftq6j2xc8'
      if (chain.address) {
        setClient(new VendorClient(scc, chain.address, contractAddress))
      } else {
        // Handle the undefined chain.address situation here, e.g., show an error message
      }
    }

    if (chain.address) {
      initializeClient()
    }
  }, [chain])
  const createProduct = async (
    tokenId: string,
    ipfsUri: string,
    uploadedAsset: any
  ) => {
    if (!product) return

    const formData: FormData = new FormData()
    formData.append('product[name]', product.name)
    formData.append('product[description]', product.description)
    formData.append('product[price]', product.price.toString())

    formData.append('product[meta][ipfs_uri]', product.ipfsUri)
    formData.append('product[meta][ipfs_uri]', ipfsUri)
    formData.append('product[meta][tokenId]', tokenId)

    if (uploadedAsset) {
      formData.append('assets[0][id]', uploadedAsset.id)
    }

    try {
      const productResponse = await fetch('https://api.chec.io/v1/products', {
        method: 'POST',
        headers: {
          'X-Authorization':
            'sk_test_50710564340abadaa7b44536ce7b9d71a3db77deca5a5',
        },
        body: formData,
      })

      const productData = await productResponse.json()
      console.log('New product added:', productData)
    } catch (error) {
      console.error('Error adding new product:', error)
    }
  }
  const customGas = 1000000 // Set a custom gas value (adjust this according to your needs)
  const customFee = 5 // Set a custom fee value (adjust this according to your needs)

  const handleNft = async () => {
    if (!client || !chain.address || !product) {
      // Handle the undefined client or chain.address situation here, e.g., show an error message
      return
    }

    try {
      const tokenId = v4() // Replace with a unique token ID
      const owner = chain.address // Replace with the appropriate owner address

      if (!image) {
        console.error('Error: No image file selected.')
        return
      }

      // Upload the image asset and update the product
      const uploadedAsset = await uploadAsset(image)
      const updatedProduct = { ...product, image: uploadedAsset.id }

      // Call storeMetadata() with the updated product and get the IPFS URI
      const tokenUri = await storeMetadata(updatedProduct)

      // Update the state with the uploaded image
      setProduct(updatedProduct)

      console.log('Token URI:', tokenUri)

      // Set the metadata for the NFT
      const extension = {
        description: `Item: Name: ${updatedProduct.name} Description: ${
          updatedProduct.description
        } Price: ${updatedProduct.price.toString()}`,
        royalty_percentage: 10,
        royalty_payment_address:
          'cosmos1ef6qca767g5gh5rqc34d976za6mqakeyege0tm',
      }

      const customFeeObj = {
        gas: customGas.toString(),
        amount: [{ amount: customFee.toString(), denom: 'stake' }],
      }
      console.log('Minting NFT with tokenId:', tokenId)
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
      console.log('Minting result:', result) // Log the minting result
      const realTokenId = result.events[10].attributes[4].value
      // Inside the handleNft function in the VendNFT component
      onTokenIdGenerated(realTokenId, tokenUri, updatedProduct)

      await createProduct(tokenId, tokenUri, uploadedAsset)
    } catch (error) {
      console.error('Error minting NFT:', error)
    } finally {
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files?.[0] || null)
  }

  return (
    <div className="container">
      <div className="mb-4">
        <label>Name</label>
        <input
          type="text"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label>Description</label>
        <input
          type="text"
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
        />
      </div>
      <div className="mb-4">
        <label>Price</label>
        <input
          type="number"
          value={product.price}
          onChange={(e) =>
            setProduct({ ...product, price: parseFloat(e.target.value) })
          }
        />
      </div>
      <div className="mb-4">
        <label>Image</label>
        <input type="file" onChange={handleFileChange} />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleNft}
      >
        Mint NFT and Create Product
      </button>
    </div>
  )
}

export default VendNFT
