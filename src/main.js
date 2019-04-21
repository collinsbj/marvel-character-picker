import Vue from "vue"
import './plugins/vuetify'
import Vuetify from "vuetify"
import checkView from "vue-check-view"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import "./plugins/vuetify"
import "vuetify/dist/vuetify.min.css"

Vue.use(checkView)
Vue.use(Vuetify)

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app")
