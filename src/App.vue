<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Gestion commerciale - Admin</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" text>Tableau de bord</v-btn>
      <v-btn to="/users" text>Utilisateurs</v-btn>
      <v-btn v-if="auth.role === 'admin'" to="/users" text>Utilisateurs</v-btn>
      <v-btn to="/articles" text>Articles</v-btn>
      <v-btn to="/orders" text>Commandes</v-btn>
      <v-btn text v-if="auth.isAuthenticated" @click="logout">Déconnexion</v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="mt-5">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const auth = useAuthStore()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>
