import _ from "lodash"
import { apiCall } from "@/mixins.js"
import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		allCharacters: [],
		favoriteCharacters: [],
		offset: 0,
		readingList: []
	},
	mutations: {
		addToAllCharactersList(state, payload) {
			state.allCharacters = state.allCharacters.concat(payload)
		},
		addToReadingList(state, payload) {
			state.readingList.push(payload)
		},
		removeFromReadingList(state, payload) {
			state.readingList.splice(_.findIndex(state.readingList, payload), 1)
		},
		replaceAllCharactersList(state, payload) {
			state.allCharacters = payload
		},
		replaceFavoriteCharactersList(state, payload) {
			state.favoriteCharacters = payload
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
		updateOffset(state, payload) {
			state.offset += payload
		}
	},
	actions: {
		addToAllCharactersList({ commit }, payload) {
			commit("addToAllCharactersList", payload)
		},
		replaceAllCharactersList({ commit }, payload) {
			commit("replaceAllCharactersList", payload)
		},
		async updateFavoriteCharactersList({ commit }, payload) {
			if (payload.id === undefined) {
				let characterData = await apiCall.methods.apiCall(payload.resourceURI.replace("http:", "https:"))
				characterData = characterData.data.results[0]
				commit("updateFavoriteCharactersList", characterData)
			} else {
				commit("updateFavoriteCharactersList", payload)
			}
		},
		updateOffset({ commit }, payload) {
			commit("updateOffset", payload)
		},
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
			commit("replaceFavoriteCharactersList", newRanks)
		},
		async updateReadingList({ commit, state }, payload) {
			let comicData = await apiCall.methods.apiCall(payload.resourceURI.replace("http:", "https:"))
			comicData = comicData.data.results[0]
			if (_.find(state.readingList, comicData) === undefined) {
				commit("addToReadingList", comicData)
			} else {
				commit("removeFromReadingList", comicData)
			}
		}
	}
})
