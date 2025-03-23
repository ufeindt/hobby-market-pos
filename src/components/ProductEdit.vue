<script lang="ts" setup>
import { IconCheck, IconEdit, IconPlus, IconTrash, IconX } from '@tabler/icons-vue'
import { ref } from 'vue'

import { db, type Product, type Variant } from '@/db'

const { product } = defineProps<{
  product: Product
}>()

const editProduct = ref<{ title: string; variants: Variant[] }>(product)
const isEditing = ref(false)

function addVariant() {
  if (!editProduct.value.variants) {
    editProduct.value.variants = []
  }
  editProduct.value.variants.push({ title: '', price: 0, sku: '' })
}

async function deleteProduct() {
  await db.products.delete(product.id)
}

function toggleEdit() {
  editProduct.value = {
    title: product.title,
    variants: [],
  }

  if (product.variants) {
    editProduct.value.variants = product.variants.map((v) => ({ ...v }))
  }

  isEditing.value = !isEditing.value
}

async function updateProduct() {
  const timestamp = new Date()
  const updateVariants: { [key: string]: Variant } = {}
  if (editProduct.value.variants) {
    for (const [index, variant] of editProduct.value.variants.entries()) {
      updateVariants[`variants.${index}`] = {
        title: variant.title,
        price: variant.price,
        sku: variant.sku,
      }
    }
  }
  console.log(editProduct.value)
  console.log(Array.from(editProduct.value.variants.values()).map((v) => ({ ...v })))

  await db.products.update(product.id, {
    title: editProduct.value.title,
    updatedAt: timestamp,
    variants: Array.from(editProduct.value.variants.values()).map((v) => ({ ...v })),
  })
  toggleEdit()
}
</script>

<template>
  <div class="container">
    <div class="product">
      <div v-if="!isEditing">{{ product.title }}</div>
      <div v-else>
        <input v-model="editProduct.title" type="text" />
      </div>
      <div v-if="!isEditing" class="buttons">
        <div @click="toggleEdit">
          <IconEdit />
        </div>
      </div>
      <div v-else class="buttons">
        <div @click="toggleEdit">
          <IconX />
        </div>
        <div @click="deleteProduct">
          <IconTrash />
        </div>
        <div @click="updateProduct">
          <IconCheck />
        </div>
      </div>
    </div>
    <div class="variants">
      <template v-if="editProduct.variants.length > 0">
        <div class="variant-header">SKU</div>
        <div class="variant-header">Title</div>
        <div class="variant-header">Price</div>
        <div></div>
      </template>

      <template v-if="!isEditing" v-for="variant in product.variants">
        <div>{{ variant.sku }}</div>
        <div>{{ variant.title }}</div>
        <div>{{ variant.price }}</div>
        <div></div>
      </template>

      <template v-else v-for="(variant, index) in editProduct.variants">
        <div><input v-model="variant.sku" type="text" /></div>
        <div><input v-model="variant.title" type="text" /></div>
        <div><input v-model="variant.price" type="number" /></div>
        <div class="variant-delete" @click="() => editProduct.variants.splice(index, 1)">
          <IconTrash />
        </div>
      </template>

      <div v-if="isEditing" class="variant-add" @click="addVariant"><IconPlus /> Add Variant</div>
    </div>
  </div>
</template>

<style scoped>
.container {
  background-color: var(--color-background-mute);
  border: 0.25rem solid var(--color-background-soft);
  border-radius: 1rem;
  padding-block: 1rem;
}

.buttons {
  display: flex;
  gap: 0.5rem;
}

.buttons > div {
  cursor: pointer;
}

.product {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  padding-inline: 1rem;
}

.variant-add {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.variant-delete {
  cursor: pointer;
}

.variant-header {
  font-weight: bold;
}

.variants {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 3rem;
  gap: 0.5rem;
  padding-inline: 2rem;
}
</style>
