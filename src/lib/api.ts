export type ProductsResponse = {
  products: Array<{
    id: number
    title: string
    description: string
    price: number
    discountPercentage: number
    rating: number
    stock: number
    brand?: string
    category: string
    thumbnail: string
  }>
  total: number
  skip: number
  limit: number
}

export async function fetchProducts(limit = 12): Promise<ProductsResponse> {
  const res = await fetch(`https://dummyjson.com/products?limit=${limit}`)
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }
  return (await res.json()) as ProductsResponse
}

