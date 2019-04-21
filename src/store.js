import Vue from "vue"
import Vuex from "vuex"
import _ from "lodash"

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		allCharacters: [],
		favoriteCharacters: [],
		offset: 0
	},
	mutations: {
		addToAllCharacters(state, payload) {
			state.allCharacters = state.allCharacters.concat(payload)
		},
		updateAllCharacters(state, payload) {
			state.allCharacters = payload
		},
		updateOffset(state, payload) {
			state.offset += payload
		},
		updateFavoriteCharactersList(state, payload) {
			if (_.find(state.favoriteCharacters, payload) === undefined) {
				state.favoriteCharacters.push(payload)
			} else {
				state.favoriteCharacters.splice(_.findIndex(state.favoriteCharacters, payload), 1)
			}
		}
	},
	actions: {
		addToAllCharacters({ commit }, payload) {
			commit("addToAllCharacters", payload)
		},
		updateAllCharacters({ commit }, payload) {
			commit("updateAllCharacters", payload)
		},
		updateOffset({ commit }, payload) {
			commit("updateOffset", payload)
		},
		updateFavoriteCharactersList({ commit }, payload) {
			commit("updateFavoriteCharactersList", payload)
		}
	}
})
