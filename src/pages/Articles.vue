<template>
  <div>
    <h2>Gestion des articles</h2>

    <!-- Barre de recherche et bouton d'ajout -->
    <v-row class="my-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="searchQuery"
          label="Rechercher un article..."
          prepend-inner-icon="mdi-magnify"
          clearable
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn color="primary" @click="openDialog()">Ajouter un article</v-btn>
      </v-col>
    </v-row>

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
        <tr v-for="(article, index) in filteredArticles" :key="index">
          <td>{{ article.name }}</td>
          <td>{{ article.price.toFixed(2) }}</td>
          <td>
            <span :class="article.stock <= 5 ? 'text-red font-weight-bold' : ''">
              {{ article.stock }}
              <v-chip v-if="article.stock <= 5" color="red" size="x-small" class="ml-2">
                Stock faible
              </v-chip>
            </span>
          </td>
          <td>
            <v-btn icon color="blue" @click="openDialog(article, index)">✏️</v-btn>
            <v-btn icon color="green" @click="openStockDialog(article, index)" title="Ajouter du stock">📦</v-btn>
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

    <!-- Dialog pour ajout du stock -->
    <v-dialog v-model="stockDialog" max-width="400px">
      <v-card>
        <v-card-title>Ajouter du stock</v-card-title>
        <v-card-text>
          <p><strong>Article:</strong> {{ stockForm.name }}</p>
          <p><strong>Stock actuel:</strong> {{ stockForm.currentStock }}</p>
          <v-text-field 
            v-model="stockForm.addQuantity" 
            label="Quantité à ajouter" 
            type="number" 
            min="1"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeStockDialog()">Annuler</v-btn>
          <v-btn color="primary" text @click="addStock()">Ajouter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const articles = ref([])
const searchQuery = ref('')
const dialog = ref(false)
const stockDialog = ref(false)
const form = ref({ name: '', price: 0, stock: 0 })
const stockForm = ref({ name: '', currentStock: 0, addQuantity: 1, index: null })
const editedIndex = ref(null)

// Articles filtrés selon la recherche
const filteredArticles = computed(() => {
  if (!searchQuery.value) return articles.value
  
  const query = searchQuery.value.toLowerCase()
  return articles.value.filter(article => 
    article.name.toLowerCase().includes(query)
  )
})

// Chargement des articles depuis localStorage
onMounted(() => {
  const data = localStorage.getItem('articles')
  if (data) {
    articles.value = JSON.parse(data)
  } else {
    // Créer des articles d'exemple si aucun n'existe
    const sampleArticles = [
      { name: 'Ordinateur portable', price: 899, stock: 15 },
      { name: 'Imprimante', price: 249, stock: 8 },
      { name: 'Écran 4K', price: 399, stock: 12 },
      { name: 'Tablette tactile', price: 329, stock: 6 },
      { name: 'Scanner', price: 189, stock: 4 },
      { name: 'Logiciel gestion', price: 450, stock: 20 },
      { name: 'Caisse enregistreuse', price: 299, stock: 3 },
      { name: 'Vidéoprojecteur', price: 599, stock: 7 },
      { name: 'Serveur', price: 2499, stock: 2 },
      { name: 'Pack Office', price: 89, stock: 25 }
    ]
    articles.value = sampleArticles
    saveToLocalStorage()
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

function openStockDialog(article, index) {
  stockForm.value = {
    name: article.name,
    currentStock: article.stock,
    addQuantity: 1,
    index: index
  }
  stockDialog.value = true
}

function closeStockDialog() {
  stockDialog.value = false
  stockForm.value = { name: '', currentStock: 0, addQuantity: 1, index: null }
}

function addStock() {
  const index = stockForm.value.index
  const quantityToAdd = parseInt(stockForm.value.addQuantity)
  
  if (quantityToAdd > 0) {
    articles.value[index].stock += quantityToAdd
    saveToLocalStorage()
  }
  
  closeStockDialog()
}
</script>
