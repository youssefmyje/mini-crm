<template>
  <div>
    <h2>Gestion des articles</h2>

    <v-btn color="primary" class="my-4" @click="openDialog()">Ajouter un article</v-btn>

    <v-table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Prix (€)</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(article, index) in articles" :key="index">
          <td>{{ article.name }}</td>
          <td>{{ article.price.toFixed(2) }}</td>
          <td>{{ article.stock }}</td>
          <td>
            <v-btn icon color="blue" @click="openDialog(article, index)">✏️</v-btn>
            <v-btn icon color="red" @click="deleteArticle(index)">🗑️</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Dialog pour ajout/modification -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>{{ editedIndex === null ? 'Ajouter' : 'Modifier' }} un article</v-card-title>
        <v-card-text>
          <v-text-field v-model="form.name" label="Nom"></v-text-field>
          <v-text-field v-model="form.price" label="Prix (€)" type="number"></v-text-field>
          <v-text-field v-model="form.stock" label="Stock" type="number"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog()">Annuler</v-btn>
          <v-btn color="primary" text @click="saveArticle()">Enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const articles = ref([])
const dialog = ref(false)
const form = ref({ name: '', price: 0, stock: 0 })
const editedIndex = ref(null)

// Chargement des articles depuis localStorage
onMounted(() => {
  const data = localStorage.getItem('articles')
  if (data) {
    articles.value = JSON.parse(data)
  }
})

function saveToLocalStorage() {
  localStorage.setItem('articles', JSON.stringify(articles.value))
}

function openDialog(article = null, index = null) {
  dialog.value = true
  if (article) {
    form.value = { ...article }
    editedIndex.value = index
  } else {
    form.value = { name: '', price: 0, stock: 0 }
    editedIndex.value = null
  }
}

function closeDialog() {
  dialog.value = false
  form.value = { name: '', price: 0, stock: 0 }
  editedIndex.value = null
}

function saveArticle() {
  form.value.price = parseFloat(form.value.price)
  form.value.stock = parseInt(form.value.stock)

  if (editedIndex.value === null) {
    articles.value.push({ ...form.value })
  } else {
    articles.value[editedIndex.value] = { ...form.value }
  }
  saveToLocalStorage()
  closeDialog()
}

function deleteArticle(index) {
  articles.value.splice(index, 1)
  saveToLocalStorage()
}
</script>
