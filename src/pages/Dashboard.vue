<template>
  <div>
    <h2 class="mb-6">Tableau de bord</h2>

    <!-- Statistiques -->
    <v-row dense>
      <v-col cols="12" md="3">
        <v-card color="indigo lighten-4" class="pa-4">
          <v-card-title>Utilisateurs</v-card-title>
          <v-card-text class="text-h5">{{ totalUsers }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="deep-purple lighten-4" class="pa-4">
          <v-card-title>Commandes</v-card-title>
          <v-card-text class="text-h5">{{ totalOrders }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="green lighten-4" class="pa-4">
          <v-card-title>Chiffre d'affaires (€)</v-card-title>
          <v-card-text class="text-h5">{{ totalRevenue.toFixed(2) }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="red lighten-4" class="pa-4">
          <v-card-title>Produits faibles stock</v-card-title>
          <v-card-text class="text-h5">{{ lowStock.length }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Graphique -->
    <v-card class="my-6" style="height: 300px;">
      <v-card-title>Commandes par mois</v-card-title>
      <v-card-text style="height: 250px;">
        <Bar :data="chartData" :options="chartOptions" />
      </v-card-text>
    </v-card>

    <!-- Dernières commandes -->
    <v-card class="mb-6">
      <v-card-title>Dernières commandes</v-card-title>
      <v-list>
        <v-list-item v-for="(order, index) in latestOrders" :key="index">
          <div>
            <strong>{{ order.client }}</strong> – {{ order.total.toFixed(2) }} € – {{ formatDate(order.date) }}
          </div>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- Accès rapide -->
    <v-row dense>
      <v-col cols="12" sm="4">
        <v-btn block color="primary" to="/users">Gérer les utilisateurs</v-btn>
      </v-col>
      <v-col cols="12" sm="4">
        <v-btn block color="primary" to="/articles">Gérer les articles</v-btn>
      </v-col>
      <v-col cols="12" sm="4">
        <v-btn block color="primary" to="/orders">Voir les commandes</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const totalUsers = ref(0)
const totalOrders = ref(0)
const totalRevenue = ref(0)
const latestOrders = ref([])
const lowStock = ref([])

// DONNÉES GRAPHIQUE (objets simples)
const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Commandes',
      backgroundColor: '#3f51b5',
      data: [],
    },
  ],
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      suggestedMax: 10
    }
  }
}

onMounted(() => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const orders = JSON.parse(localStorage.getItem('orders') || '[]')
  const articles = JSON.parse(localStorage.getItem('articles') || '[]')

  totalUsers.value = users.length
  totalOrders.value = orders.length
  totalRevenue.value = orders.reduce((sum, order) => sum + order.total, 0)
  latestOrders.value = orders.slice(-5).reverse()
  lowStock.value = articles.filter((a) => a.stock <= 5)

  // Groupe par mois
  const monthMap = {}
  for (const order of orders) {
    const date = order.date ? new Date(order.date) : new Date()
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    monthMap[key] = (monthMap[key] || 0) + 1
  }

  chartData.value.labels = Object.keys(monthMap)
  chartData.value.datasets[0].data = Object.values(monthMap)

  console.log('LABELS:', chartData.value.labels)
  console.log('DATA:', chartData.value.datasets[0].data)
})

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR')
}
</script>

<style scoped>
.v-card-text {
  font-weight: bold;
}
</style>
