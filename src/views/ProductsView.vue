<script setup lang="ts">
import { liveQuery } from 'dexie'
import type { Observable } from 'rxjs'
import { ref } from 'vue'
import { useObservable } from '@vueuse/rxjs'

import { db, type Product } from '@/db'
import ProductEdit from '@/components/ProductEdit.vue'

const products = useObservable<Product[]>(liveQuery(() => db.products.toArray()))
const status = ref('')
const newProductTitle = ref('')

async function addProduct() {
  try {
    const timestamp = new Date()
    const id = await db.products.add({
      title: newProductTitle.value,
      variants: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    })

    status.value = `Friend ${newProductTitle.value} successfully added. Got id ${id}`

    // Reset form:
    newProductTitle.value = ''
  } catch (error) {
    status.value = `Failed to add ${newProductTitle.value}: ${error}`
  }
}
</script>

<template>
  <div>
    <div v-for="product in products">
      <ProductEdit :key="product.id" :product="product" />
    </div>
    <fieldset>
      <legend>Add new Product</legend>
      <label>
        Title:
        <input v-model="newProductTitle" type="text" />
      </label>
      <br />
      <button @click="addProduct">Add Product</button>
      <p>{{ status }}</p>
    </fieldset>
  </div>
</template>
