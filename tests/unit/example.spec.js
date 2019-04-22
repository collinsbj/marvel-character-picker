import { expect } from "chai"
import { shallowMount, createLocalVue } from "@vue/test-utils"
import Vuex from "vuex"
import store from "@/store.js"
import CharacterList from "@/components/CharacterList.vue"

const localVue = createLocalVue()
localVue.use(Vuex)

describe("Home", () => {
	const localStore = store

	beforeEach(() => {
		localStore.replaceState({
			allCharacters: [],
			favoriteCharacters: [],
			readingList: [],
			offset: 0
		})
	})

	it("store starts empty", () => {
		expect(localStore.state.allCharacters.length).to.equal(0)
		expect(localStore.state.favoriteCharacters.length).to.equal(0)
		expect(localStore.state.readingList.length).to.equal(0)
	})
	it("update offset", () => {
		localStore.commit("updateOffset", 20)
		expect(localStore.state.offset).to.equal(20)
	})
	it("add character", () => {
		localStore.commit("addToAllCharactersList", [{ name: "Iron Man" }, { name: "Thor" }])
		expect(localStore.state.allCharacters).to.deep.equal([{ name: "Iron Man" }, { name: "Thor" }])
	})
	it("updates all characters", () => {
		localStore.commit("replaceAllCharactersList", [{ name: "Iron Man" }, { name: "Thor" }, { name: "Hulk" }])
		expect(localStore.state.allCharacters).to.deep.equal([{ name: "Iron Man" }, { name: "Thor" }, { name: "Hulk" }])
	})
	it("adds to favorites list", () => {
		localStore.commit("updateFavoriteCharactersList", { name: "Iron Man" })
		expect(localStore.state.favoriteCharacters).to.deep.equal([{ name: "Iron Man", rank: 1 }])
	})
	it("removes from favorites list", () => {
		localStore.commit("updateFavoriteCharactersList", { name: "Iron Man" })
		localStore.commit("updateFavoriteCharactersList", { name: "Iron Man", rank: 1 })
		expect(localStore.state.favoriteCharacters).to.deep.equal([])
	})
	it("adds to reading list", () => {
		localStore.commit("addToReadingList", { title: "Hulk #1" })
		expect(localStore.state.readingList).to.deep.equal([{ title: "Hulk #1" }])
	})
	it("updates character ranks", () => {
		localStore.replaceState({
			allCharacters: [],
			favoriteCharacters: [{ name: "Iron Man", rank: 1 }, { name: "Hulk", rank: 2 }],
			readingList: [],
			offset: 0
		})
		localStore.dispatch("updateRanks", { characterName: "Iron Man", oldRank: 1, newRank: 2 })
		expect(localStore.state.favoriteCharacters).to.deep.equal([{ name: "Iron Man", rank: 2 }, { name: "Hulk", rank: 1 }])
	})
	it("sorts favorite characters by rank appropriately", () => {
		localStore.replaceState({
			allCharacters: [],
			favoriteCharacters: [{ name: "Iron Man", rank: 2 }, { name: "Hulk", rank: 1 }],
			readingList: [],
			offset: 0
		})
		const wrapper = shallowMount(CharacterList, { store: localStore, localVue, propsData: { listType: "favorites" } })
		expect(wrapper.vm.charactersByRank).to.deep.equal([{ name: "Hulk", rank: 1 }, { name: "Iron Man", rank: 2 }])
	})
	it("sorts favorite characters by name appropriately", () => {
		localStore.replaceState({
			allCharacters: [],
			favoriteCharacters: [{ name: "Iron Man", rank: 1 }, { name: "Hulk", rank: 2 }],
			readingList: [],
			offset: 0
		})
		const wrapper = shallowMount(CharacterList, { store: localStore, localVue, propsData: { listType: "favorites" } })
		expect(wrapper.vm.charactersByName).to.deep.equal([{ name: "Hulk", rank: 2 }, { name: "Iron Man", rank: 1 }])
	})
})
