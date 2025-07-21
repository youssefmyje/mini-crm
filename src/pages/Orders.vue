<template>
  <div>
    <h2>Gestion des commandes</h2>

    <!-- Barre de recherche et bouton d'ajout -->
    <v-row class="my-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="searchQuery"
          label="Rechercher une commande..."
          prepend-inner-icon="mdi-magnify"
          clearable
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn color="primary" @click="openDialog()">Créer une commande</v-btn>
      </v-col>
    </v-row>

    <!-- Liste des commandes -->
    <v-table>
      <thead>
        <tr>
          <th>Client</th>
          <th>Articles</th>
          <th>Total (€)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(order, index) in filteredOrders" :key="index">
          <td>{{ order.client }}</td>
          <td>
            <ul>
              <li v-for="item in order.items" :key="item.name">
                {{ item.name }} x {{ item.quantity }}
              </li>
            </ul>
          </td>
          <td>{{ order.total.toFixed(2) }}</td>
          <td>
            <v-btn icon color="red" @click="deleteOrder(getOriginalIndex(order))">🗑️</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Formulaire commande -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>Nouvelle commande</v-card-title>
        <v-card-text>
          <v-select
            label="Client"
            :items="users"
            item-title="name"
            item-value="name"
            v-model="newOrder.client"
            return-object
          ></v-select>

          <v-divider class="my-4"></v-divider>

          <div v-for="(article, index) in articles" :key="index" class="mb-2">
            <v-row>
              <v-col cols="6">
                <span>{{ article.name }} ({{ article.price }} €)</span>
                <br>
                <small :class="article.stock <= 5 ? 'text-red' : 'text-grey'">
                  Stock: {{ article.stock }}
                  <span v-if="article.stock <= 5" class="text-red font-weight-bold"> - Stock faible!</span>
                </small>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="number"
                  min="0"
                  :max="article.stock"
                  v-model.number="quantities[article.name]"
                  label="Qté"
                  :disabled="article.stock === 0"
                  :error="quantities[article.name] > article.stock"
                  :error-messages="quantities[article.name] > article.stock ? 'Stock insuffisant' : ''"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog()">Annuler</v-btn>
          <v-btn color="primary" text @click="saveOrder()">Valider</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// Données de base
const users = ref([])
const articles = ref([])
const orders = ref([])
const searchQuery = ref('')
const dialog = ref(false)
const newOrder = ref({ client: '', items: [], total: 0 })
const quantities = ref({})

// Commandes filtrées selon la recherche
const filteredOrders = computed(() => {
  if (!searchQuery.value) return orders.value
  
  const query = searchQuery.value.toLowerCase()
  return orders.value.filter(order => 
    order.client.toLowerCase().includes(query) ||
    order.items.some(item => item.name.toLowerCase().includes(query))
  )
})

// Fonction pour obtenir l'index original d'une commande filtrée
function getOriginalIndex(order) {
  return orders.value.findIndex(o => 
    o.client === order.client && 
    o.total === order.total && 
    o.date === order.date
  )
}

// Chargement des clients et articles depuis localStorage
onMounted(() => {
  const u = localStorage.getItem('users')
  if (u) users.value = JSON.parse(u)

  const a = localStorage.getItem('articles')
  if (a) {
    articles.value = JSON.parse(a)
    articles.value.forEach((art) => (quantities.value[art.name] = 0))
  }

  const o = localStorage.getItem('orders')
  if (o) orders.value = JSON.parse(o)
})

// Sauvegarde des commandes
function saveToLocalStorage() {
  localStorage.setItem('orders', JSON.stringify(orders.value))
}

// Ouvrir/fermer la modale
function openDialog() {
  newOrder.value = { client: '', items: [], total: 0 }
  for (const name in quantities.value) {
    quantities.value[name] = 0
  }
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
}

// Valider la commande
function saveOrder() {
  const items = []
  let total = 0
  let stockErrors = []

  // Vérifier d'abord que tous les articles ont assez de stock
  for (const article of articles.value) {
    const qty = quantities.value[article.name]
    if (qty && qty > 0) {
      if (qty > article.stock) {
        stockErrors.push(`Stock insuffisant pour ${article.name} (disponible: ${article.stock}, demandé: ${qty})`)
      } else {
        items.push({
          name: article.name,
          quantity: qty,
          price: article.price,
        })
        total += qty * article.price
      }
    }
  }

  if (stockErrors.length > 0) {
    alert('Erreurs de stock:\n' + stockErrors.join('\n'))
    return
  }

  if (!newOrder.value.client || items.length === 0) {
    alert('Veuillez sélectionner un client et au moins un article.')
    return
  }

  // Réduire le stock des articles commandés
  for (const item of items) {
    const article = articles.value.find(a => a.name === item.name)
    if (article) {
      article.stock -= item.quantity
    }
  }

  // Sauvegarder les articles mis à jour
  localStorage.setItem('articles', JSON.stringify(articles.value))

  orders.value.push({
    client: newOrder.value.client.name || newOrder.value.client,
    items,
    total,
    date: new Date().toISOString(),
  })

  saveToLocalStorage()
  closeDialog()
}


// Supprimer une commande
function deleteOrder(index) {
  orders.value.splice(index, 1)
  saveToLocalStorage()
}
</script>
