import Home from "@/views/Home.vue"
import Router from "vue-router"
import Vue from "vue"

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: "/",
			redirect: "/home"
		},
		{
			path: "/home",
			name: "Home",
			component: Home
		}
	]
})
