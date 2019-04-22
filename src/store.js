import Vue from "vue"
import Vuex from "vuex"
import _ from "lodash"
import { apiCall } from "@/mixins.js"

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		allCharacters: [],
		favoriteCharacters: [],
		readingList: [],
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
				payload.rank = state.favoriteCharacters.length + 1
				state.favoriteCharacters.push(payload)
			} else {
				state.favoriteCharacters.splice(_.findIndex(state.favoriteCharacters, payload), 1)
				const localFavoriteCharacters = state.favoriteCharacters.sort((a, b) => a.rank - b.rank)
				state.favoriteCharacters = localFavoriteCharacters.map((character, index) => {
					character.rank = index + 1
					return character
				})
			}
		},
		removeFromReadingList(state, payload) {
			state.readingList.splice(_.findIndex(state.readingList, payload), 1)
		},
		addToReadingList(state, payload) {
			state.readingList.push(payload)
		},
		updateFavoriteCharacters(state, payload) {
			state.favoriteCharacters = payload
		}
	},
	actions: {
		updateRanks({ commit, state }, payload) {
			let newRanks = []
			if (payload.oldRank > payload.newRank) {
				newRanks = state.favoriteCharacters.map(character => {
					if (character.rank < payload.oldRank && character.rank >= payload.newRank && character.name !== payload.characterName) {
						character.rank++
					} else if (character.name === payload.characterName) {
						character.rank = payload.newRank
					}
					return character
				})
			} else {
				newRanks = state.favoriteCharacters.map(character => {
					if (character.rank > payload.oldRank && character.rank <= payload.newRank && character.name !== payload.characterName) {
						character.rank--
					} else if (character.name === payload.characterName) {
						character.rank = payload.newRank
					}
					return character
				})
			}
			commit("updateFavoriteCharacters", newRanks)
		},
		addToAllCharacters({ commit }, payload) {
			commit("addToAllCharacters", payload)
		},
		updateAllCharacters({ commit }, payload) {
			commit("updateAllCharacters", payload)
		},
		updateOffset({ commit }, payload) {
			commit("updateOffset", payload)
		},
		async updateFavoriteCharactersList({ commit }, payload) {
			if (payload.id === undefined) {
				let characterData = await apiCall.methods.apiCall(payload.resourceURI)
				characterData = characterData.data.results[0]
				commit("updateFavoriteCharactersList", characterData)
			} else {
				commit("updateFavoriteCharactersList", payload)
			}
		},
		async updateReadingList({ commit, state }, payload) {
			let comicData = await apiCall.methods.apiCall(payload.resourceURI)
			comicData = comicData.data.results[0]
			if (_.find(state.readingList, comicData) === undefined) {
				commit("addToReadingList", comicData)
			} else {
				commit("removeFromReadingList", comicData)
			}
		}
	}
})
