<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card width="400">
      <v-card-title>Connexion</v-card-title>
      <v-card-text>
        <v-text-field v-model="username" label="Nom d'utilisateur" required></v-text-field>
        <v-text-field v-model="password" label="Mot de passe" type="password" required></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="login">Se connecter</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')

function login() {
  const VALID_USERNAME = 'admin'
  const VALID_PASSWORD = '123456'

  if (username.value === VALID_USERNAME && password.value === VALID_PASSWORD) {
    auth.login()
    router.push('/')
  } else {
    alert('Nom d’utilisateur ou mot de passe incorrect')
  }
}
</script>
