<template>
  <div>
    <h2>Gestion des commandes</h2>

    <v-btn color="primary" class="my-4" @click="openDialog()">Créer une commande</v-btn>

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
        <tr v-for="(order, index) in orders" :key="index">
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
            <v-btn icon color="red" @click="deleteOrder(index)">🗑️</v-btn>
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
              <v-col cols="8">{{ article.name }} ({{ article.price }} €)</v-col>
              <v-col cols="4">
                <v-text-field
                  type="number"
                  min="0"
                  v-model.number="quantities[article.name]"
                  label="Qté"
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
import { ref, onMounted } from 'vue'

// Données de base
const users = ref([])
const articles = ref([])
const orders = ref([])
const dialog = ref(false)
const newOrder = ref({ client: '', items: [], total: 0 })
const quantities = ref({})

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

  for (const article of articles.value) {
    const qty = quantities.value[article.name]
    if (qty && qty > 0) {
      items.push({
        name: article.name,
        quantity: qty,
        price: article.price,
      })
      total += qty * article.price
    }
  }

  if (!newOrder.value.client || items.length === 0) {
    alert('Veuillez sélectionner un client et au moins un article.')
    return
  }

  orders.value.push({
    client: newOrder.value.client.name || newOrder.value.client,
    items,
    total,
    date: new Date().toISOString(), // ✅ Ajout de la date ici
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
