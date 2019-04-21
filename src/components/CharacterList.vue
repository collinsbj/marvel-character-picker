<template>
	<div>
		<div v-if="loading">
			loading
		</div>
		<div v-if="!loading">
			<v-container grid-list-md>
				<v-layout
					row
					wrap
				>
					<v-flex
						sm4
						xs12
						v-for="character in characterReturn"
						:key="character.name"
					>
						<v-card>
							<v-btn
								icon
								@click="openCharacterDataDialog(character)"
							>
								<v-icon>info</v-icon>
							</v-btn>
							<v-btn
								icon
								@click="addRemoveCharacterToFavorites(character)"
							>
								<v-icon :color="isFavorite(character)">
									star
								</v-icon>
							</v-btn>
							<v-img :src="`${character.thumbnail.path}.${character.thumbnail.extension}`" />
							<v-card-title class="title">
								{{ character.name }}
							</v-card-title>
							<v-card-text>
								{{ character.description === "" ? "No Description Available" : character.description }}
							</v-card-text>
						</v-card>
					</v-flex>
				</v-layout>
			</v-container>
		</div>
		<div
			style="height: 10px;"
			v-if="!viewHandlerLoading"
			v-view="viewHandler"
		/>
		<v-dialog v-model="characterDataDialog">
			<v-card>
				<v-card-title class="display-1">
					<v-img
						max-height="80px"
						max-width="80px"
						contain
						position="left"
						:src="dialogData.imageURL"
					/>
					<span class="ml-4">
						{{ dialogData.name }}
					</span>
				</v-card-title>
				<v-card-text class="title">
					{{ dialogData.name }} <span class="subheading">appeared in</span> {{ dialogData.comicData.available }} <span class="subheading">comics:</span>
					<v-list>
						<v-tooltip
							allow-overflow
							top
							v-for="comic in dialogData.comicData.items"
							:key="comic.name"
						>
							<template v-slot:activator="{ on }">
								<v-list-tile
									@mouseenter="getComicData(comic)"
									@mouseleave="eraseComicData"
									v-on="on"
									@click=""
								>
									<v-list-tile-title>
										{{ comic.name }}
									</v-list-tile-title>
									<v-list-tile-avatar>
										<v-btn icon>
											<v-icon>chrome_reader_mode</v-icon>
										</v-btn>
									</v-list-tile-avatar>
								</v-list-tile>
							</template>
							<img
								style="max-height: 150px; max-width: 150px;"
								:src="comicImgURL"
							>
						</v-tooltip>
					</v-list>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import { mapState } from "vuex"
import { apiCall } from "@/mixins.js"
import _ from "lodash"

export default {
	name: "CharacterList",
	props: ["listType"],
	mixins: [apiCall],
	data() {
		return {
			loadingComicData: false,
			loading: true,
			viewHandlerLoading: true,
			characterDataDialog: false,
			comicImgURL: "",
			dialogData: {
				name: "",
				imageURL: "",
				comicData: {
					available: 0,
					items: []
				}
			}
		}
	},
	async created() {
		this.loading = true
		if (this.allCharacters.length === 0) {
			const characters = await this.apiCall("http://gateway.marvel.com/v1/public/characters")
			this.$store.dispatch("updateAllCharacters", characters.data.results)
			this.$store.dispatch("updateOffset", characters.data.count)
		}
		this.loading = false
		this.viewHandlerLoading = false
	},
	computed: {
		...mapState({
			allCharacters: state => state.allCharacters,
			favoriteCharacters: state => state.favoriteCharacters,
			offset: state => state.offset
		}),
		characterReturn() {
			if (this.listType === "favorites") {
				return this.favoriteCharacters.sort((a, b) => {
					const nameA = a.name.toUpperCase() // ignore upper and lowercase
					const nameB = b.name.toUpperCase() // ignore upper and lowercase
					if (nameA < nameB) {
						return -1
					}
					if (nameA > nameB) {
						return 1
					}

					// names must be equal
					return 0
				})
			}
			return this.allCharacters
		}
	},
	methods: {
		async getComicData(comic) {
			this.loadingComicData = true
			const comicData = await this.apiCall(comic.resourceURI)
			console.log("COMIC", comicData)
			this.comicImgURL = `${comicData.data.results[0].thumbnail.path}.${comicData.data.results[0].thumbnail.extension}`
			this.loadingComicData = false
			console.log("HIIHIHIH")
		},
		eraseComicData() {
			this.comicImgURL = ""
		},
		async viewHandler(event) {
			if ((event.type === "progress" || event.type === "enter") && event.percentInView > 0) {
				this.viewHandlerLoading = true
				const characters = await this.apiCall("http://gateway.marvel.com/v1/public/characters", this.offset)
				await this.$store.dispatch("addToAllCharacters", characters.data.results)
				await this.$store.dispatch("updateOffset", characters.data.count)
				this.viewHandlerLoading = false
			}
		},
		openCharacterDataDialog(character) {
			this.dialogData = {
				name: character.name,
				imageURL: `${character.thumbnail.path}.${character.thumbnail.extension}`,
				comicData: {
					available: character.comics.available,
					items: character.comics.items
				}
			}
			this.characterDataDialog = true
		},
		addRemoveCharacterToFavorites(character) {
			this.$store.dispatch("updateFavoriteCharactersList", character)
		},
		isFavorite(character) {
			return _.find(this.favoriteCharacters, character) === undefined ? "" : "yellow"
		}
	}
}
</script>

<style>

</style>
