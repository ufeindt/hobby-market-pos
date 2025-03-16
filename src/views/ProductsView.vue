<script setup lang="ts">
import { ref } from 'vue'

import { db } from '../db'

const status = ref('')
const newProductTitle = ref('')

async function addProduct() {
  try {
    // Add the new friend!
    const id = await db.products.add({
      title: newProductTitle.value,
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
</template>
