<template>
  <div>
    <h2>Gestion des utilisateurs</h2>

    <!-- Barre de recherche des utilisateurs -->
    <v-row class="my-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="searchQuery"
          label="Rechercher un utilisateur..."
          prepend-inner-icon="mdi-magnify"
          clearable
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn color="primary" @click="openDialog()">Ajouter un utilisateur</v-btn>
      </v-col>
    </v-row>

    <!-- Tableau d'utilisateurs -->
    <v-table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in filteredUsers" :key="index">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <v-btn icon color="blue" @click="openDialog(user, getOriginalIndex(user))">
              ✏️
            </v-btn>
            <v-btn icon color="red" @click="deleteUser(getOriginalIndex(user))">
              🗑️
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Dialog (formulaire utilisateur) -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>{{ editedIndex === null ? 'Ajouter' : 'Modifier' }} un utilisateur</v-card-title>
        <v-card-text>
          <v-text-field v-model="form.name" label="Nom"></v-text-field>
          <v-text-field v-model="form.email" label="Email"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog()">Annuler</v-btn>
          <v-btn color="primary" text @click="saveUser()">Enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// Liste d'utilisateurs (en mémoire)
const users = ref([])
const searchQuery = ref('')

// Utilisateurs filtrés selon la recherche
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.name.toLowerCase().includes(query) || 
    user.email.toLowerCase().includes(query)
  )
})

// Fonction pour obtenir l'index original d'un utilisateur filtré
function getOriginalIndex(user) {
  return users.value.findIndex(u => 
    u.name === user.name && u.email === user.email
  )
}

// Charger depuis localStorage au démarrage
onMounted(() => {
  const data = localStorage.getItem('users')
  if (data) {
    users.value = JSON.parse(data)
  }
})

// Formulaire utilisateur
const form = ref({ name: '', email: '' })

// État du dialog et de l'édition
const dialog = ref(false)
const editedIndex = ref(null)

// Ouvrir le dialog (ajout ou édition)
function openDialog(user = null, index = null) {
  dialog.value = true
  if (user) {
    form.value = { ...user }
    editedIndex.value = index
  } else {
    form.value = { name: '', email: '' }
    editedIndex.value = null
  }
}

function saveToLocalStorage() {
  localStorage.setItem('users', JSON.stringify(users.value))
}

// Fermer le dialog
function closeDialog() {
  dialog.value = false
  form.value = { name: '', email: '' }
  editedIndex.value = null
}

// Enregistrer (ajout ou modification)
function saveUser() {
  if (editedIndex.value === null) {
    users.value.push({ ...form.value }) // Ajout
  } else {
    users.value[editedIndex.value] = { ...form.value } // Modification
  }
  saveToLocalStorage()
  closeDialog()
}

// Supprimer un utilisateur
function deleteUser(index) {
  users.value.splice(index, 1)
  saveToLocalStorage()
}
</script>