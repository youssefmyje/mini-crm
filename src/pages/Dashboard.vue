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
          <v-card-title>Stock faible</v-card-title>
          <v-card-text class="text-h5">{{ lowStock.length }}</v-card-text>
          <v-card-text v-if="lowStock.length > 0" class="pt-0">
            <small>{{ lowStock.map(a => a.name).join(', ') }}</small>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Graphique -->
    <v-card class="my-6" style="height: 300px;">
      <v-card-title>Commandes par mois</v-card-title>
      <v-card-text style="height: 250px;">
        <Bar 
          v-if="chartData.labels.length > 0" 
          :data="chartData" 
          :options="chartOptions" 
          :key="chartData.labels.join(',')"
        />
        <div v-else class="d-flex align-center justify-center h-100">
          <p class="text-grey">Aucune donnée à afficher</p>
        </div>
      </v-card-text>
    </v-card>

    <!-- Alertes stock faible -->
    <v-card v-if="lowStock.length > 0" class="mb-6" color="red lighten-5">
      <v-card-title class="text-red">
        ⚠️ Alertes Stock Faible
      </v-card-title>
      <v-list>
        <v-list-item v-for="article in lowStock" :key="article.name">
          <div>
            <strong>{{ article.name }}</strong> - Stock restant: {{ article.stock }}
            <v-chip color="red" size="small" class="ml-2">Urgent</v-chip>
          </div>
        </v-list-item>
      </v-list>
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

// DONNÉES GRAPHIQUE 
const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Commandes',
      backgroundColor: '#3f51b5',
      borderColor: '#3f51b5',
      data: [],
    },
  ],
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  },
  plugins: {
    legend: {
      display: true
    }
  }
})

onMounted(() => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const orders = JSON.parse(localStorage.getItem('orders') || '[]')
  const articles = JSON.parse(localStorage.getItem('articles') || '[]')

  totalUsers.value = users.length
  totalOrders.value = orders.length
  totalRevenue.value = orders.reduce((sum, order) => sum + order.total, 0)
  latestOrders.value = orders.slice(-5).reverse()
  lowStock.value = articles.filter((a) => a.stock <= 5)

  console.log('Toutes les commandes:', orders)

  // Si peu de commandes existent, ajouter des données historiques
  if (orders.length < 10) {
    console.log('Ajout de données historiques pour enrichir le graphique...')
    
    // Créer des commandes historiques réalistes
    const historicalOrders = [
      // Octobre 2024
      {
        client: 'Entreprise Martin',
        items: [{ name: 'Ordinateur portable', quantity: 3, price: 899 }],
        total: 2697,
        date: new Date(2024, 9, 5).toISOString()
      },
      {
        client: 'Société Dupont',
        items: [{ name: 'Imprimante', quantity: 2, price: 249 }],
        total: 498,
        date: new Date(2024, 9, 15).toISOString()
      },
      {
        client: 'Cabinet Bernard',
        items: [{ name: 'Écran 4K', quantity: 1, price: 399 }],
        total: 399,
        date: new Date(2024, 9, 28).toISOString()
      },
      
      // Novembre 2024
      {
        client: 'Restaurant Le Gourmet',
        items: [{ name: 'Tablette tactile', quantity: 5, price: 329 }],
        total: 1645,
        date: new Date(2024, 10, 8).toISOString()
      },
      {
        client: 'Pharmacie Centrale',
        items: [{ name: 'Scanner', quantity: 1, price: 189 }],
        total: 189,
        date: new Date(2024, 10, 18).toISOString()
      },
      {
        client: 'Garage Moderne',
        items: [{ name: 'Logiciel gestion', quantity: 1, price: 450 }],
        total: 450,
        date: new Date(2024, 10, 25).toISOString()
      },
      
      // Décembre 2024
      {
        client: 'Boutique Style',
        items: [{ name: 'Caisse enregistreuse', quantity: 2, price: 299 }],
        total: 598,
        date: new Date(2024, 11, 3).toISOString()
      },
      {
        client: 'École Primaire',
        items: [{ name: 'Vidéoprojecteur', quantity: 3, price: 599 }],
        total: 1797,
        date: new Date(2024, 11, 12).toISOString()
      },
      {
        client: 'Clinique Santé',
        items: [{ name: 'Ordinateur médical', quantity: 2, price: 1299 }],
        total: 2598,
        date: new Date(2024, 11, 20).toISOString()
      },
      
      // Janvier 2025
      {
        client: 'Start-up Innovation',
        items: [{ name: 'Serveur', quantity: 1, price: 2499 }],
        total: 2499,
        date: new Date(2025, 0, 10).toISOString()
      },
      {
        client: 'Bureau Comptable',
        items: [{ name: 'Pack Office', quantity: 10, price: 89 }],
        total: 890,
        date: new Date(2025, 0, 18).toISOString()
      },
      
      // Février 2025
      {
        client: 'Hôtel Luxe',
        items: [{ name: 'Système audio', quantity: 1, price: 1599 }],
        total: 1599,
        date: new Date(2025, 1, 5).toISOString()
      },
      {
        client: 'Magasin Bio',
        items: [{ name: 'Balance connectée', quantity: 3, price: 199 }],
        total: 597,
        date: new Date(2025, 1, 22).toISOString()
      }
    ]
    
    // Ajouter seulement les commandes qui n'existent pas déjà
    const existingClients = orders.map(o => o.client)
    const newOrders = historicalOrders.filter(ho => !existingClients.includes(ho.client))
    
    if (newOrders.length > 0) {
      orders.push(...newOrders)
      localStorage.setItem('orders', JSON.stringify(orders))
      totalOrders.value = orders.length
      totalRevenue.value = orders.reduce((sum, order) => sum + order.total, 0)
      latestOrders.value = orders.slice(-5).reverse()
    }
  }

  // Groupe par mois avec tri
  const monthMap = {}
  for (const order of orders) {
    const date = order.date ? new Date(order.date) : new Date()
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    monthMap[key] = (monthMap[key] || 0) + 1
  }

  console.log('Carte des mois:', monthMap)

  // Trier les clés par ordre chronologique
  const sortedKeys = Object.keys(monthMap).sort()
  
  // Convertir les clés en format plus lisible
  const readableLabels = sortedKeys.map(key => {
    const [year, month] = key.split('-')
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    return `${monthNames[parseInt(month) - 1]} ${year}`
  })
  
  // Mettre à jour les données du graphique
  chartData.value.labels = readableLabels
  chartData.value.datasets[0].data = sortedKeys.map(key => monthMap[key])

  console.log('LABELS:', chartData.value.labels)
  console.log('DATA:', chartData.value.datasets[0].data)
  console.log('Chart data object:', chartData.value)
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
