import swell from '../../swell'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import BackButton from '../../components/BackButton'

export default function Product({ product }) {
  const router = useRouter()
  const [selectedSize, setSelectedSize] = useState(
    product.options?.[0]?.values?.[0]?.name || '' // Default to the first available size, if present
  )

  async function checkout(productId) {
    if (!selectedSize) {
      alert('Please select a size before proceeding to checkout.')
      return
    }

    await swell.cart.setItems([]) // Clear existing items
    await swell.cart.addItem({
      product_id: productId,
      quantity: 1,
      options: [
        {
          name: 'Size',
          value: selectedSize,
        },
      ],
    })
    const cart = await swell.cart.get()
    router.push(cart.checkout_url)
  }

  return (
    <div className="flex h-screen flex-col justify-between">
      <BackButton to="/" />
      <div className="mx-auto mt-16 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mx-auto flex flex-col sm:flex-row">
          <Image
            alt="Basketball"
            className="rounded-lg"
            src={product.images?.[0]?.file?.url || '/placeholder.png'} // Fallback to placeholder if no image
            width={560}
            height={640}
            objectFit="cover"
          />
          <div className="mt-10 flex flex-col sm:mt-0 sm:ml-10">
            <h1 className="mt-1 text-4xl font-bold uppercase text-gray-900 sm:text-5xl sm:tracking-tight lg:text-5xl">
              {product.name}
            </h1>
            <h1 className="mt-3 text-4xl font-bold text-gray-500 sm:text-3xl sm:tracking-tight lg:text-3xl">
              ${product.price}
            </h1>

            {/* Size Selector */}
            {product.options?.[0]?.values?.length > 0 ? (
              <div className="mt-5">
                <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                  Select Size
                </label>
                <select
                  id="size"
                  name="size"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  {product.options[0].values.map((option) => (
                    <option key={option.id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="mt-5 text-sm text-gray-500">No size options available for this product.</p>
            )}

            <button
              className="mt-5 rounded-md border border-transparent bg-orange-600 px-4 py-3 font-medium text-white shadow-sm hover:bg-orange-400 sm:px-8"
              onClick={() => checkout(product.id)}
            >
              Checkout
            </button>

            <div className="mt-10 mb-5 border-t border-gray-200 pt-10 font-bold">
              Description
            </div>
            <p className="max-w-xl">{product.description}</p>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps({ params }) {
  const swellProduct = await swell.products.get(params.slug)
  return {
    props: {
      product: swellProduct,
    },
  }
}

export async function getStaticPaths() {
  const swellProducts = await swell.products.list()
  let fullPaths = []
  for (let product of swellProducts.results) {
    fullPaths.push({ params: { slug: product.id } })
  }

  return {
    paths: fullPaths,
    fallback: 'blocking',
  }
}
