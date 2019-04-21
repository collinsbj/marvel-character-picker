import Vue from "vue"
import Router from "vue-router"
import Home from "@/views/Home.vue"
import Picker from "@/views/Picker.vue"

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: "/",
			redirect: "/picker"
		},
		{
			path: "/home",
			name: "Home",
			component: Home
		},
		{
			path: "/picker/",
			name: "Picker",
			component: Picker
		}
	]
})
