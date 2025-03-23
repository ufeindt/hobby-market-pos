import Dexie, { type EntityTable } from 'dexie'

interface BaseRecord {
  createdAt: Date
  updatedAt: Date
}

interface Checkout extends BaseRecord {
  id: number
  discounts: Discount[]
  lines: CheckoutLine[]
}

interface CheckoutLine extends BaseRecord {
  id: number
  discounts: Discount[]
  lineTotal: number
  quantity: number
  sku: string
  unitPrice: number
  variant: Variant
}

interface Discount {
  amount?: number
  percentage?: number
  title: string
}

interface Product extends BaseRecord {
  id: number
  title: string
  variants: Variant[]
}

interface Sale extends BaseRecord {
  id: number
  checkoutId: number
  discounts: Discount[]
  lines: CheckoutLine[]
  paymentId: string
}

interface StoreConfig extends BaseRecord {
  id: number
  storeName: string
  swishNumber: string
}

interface Variant {
  price: number
  sku: string
  title: string
}

const db = new Dexie('POSDatabase') as Dexie & {
  checkout: EntityTable<Checkout, 'id'>
  products: EntityTable<Product, 'id'>
  sales: EntityTable<Sale, 'id'>
  storeConfig: EntityTable<StoreConfig, 'id'>
}

db.version(1).stores({
  checkout: '++id, discounts, lines',
  products: '++id, title, variants',
  sales: '++id, checkoutId, discounts, lines, paymentId',
  storeConfig: '++id, storeName, swishNumber',
})

export type { Checkout, CheckoutLine, Discount, Product, Sale, StoreConfig, Variant }
export { db }
