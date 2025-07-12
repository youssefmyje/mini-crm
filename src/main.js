import { createApp } from 'vue'
import App from './App.vue'

// 👇 AJOUTE CECI
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Router
import router from './router'

// Instances
const app = createApp(App)
const pinia = createPinia()
const vuetify = createVuetify({ components, directives })

// 👇 ACTIVE LES PLUGINS ICI
app.use(pinia)
app.use(router)
app.use(vuetify)

// 👇 MONTE L’APP
app.mount('#app')
