<template>
	<div>
			<v-container grid-list-md  v-if="!loading">
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
					<v-hover>

						<v-card
						      slot-scope="{ hover }"
							max-height="500px"
							style="overflow: hidden"
							      :class="`elevation-${hover ? 12 : 2}`"
								 @click="openCharacterDataDialog(character)"
						>
							<v-img
								height="250"
								:src="`${character.thumbnail.path}.${character.thumbnail.extension}`"
							/>
							<div v-if="hover" style="background-color: rgba(237,22,31, .4); top: 0; left: 0; position: absolute; height: 250px; width: 100%;">
								</div>
							<v-card-text
								class="title"
								style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"
							>
								{{ character.name }}
							</v-card-text>
							<v-card-text style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
								{{ character.description === "" ? "No Description Available" : character.description }}
							</v-card-text>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-tooltip>
									<template v-slot="activator">
							<v-btn
								icon
								@click.stop="addRemoveCharacterToFavorites(character)"
							>
								<v-icon :color="isFavorite(character)">
									star
								</v-icon>
							</v-btn>
							</template>
							<span>Add to favorites</span>
							</v-tooltip>
								</v-card-actions>
						</v-card>
					</v-hover>
					</v-flex>
				</v-layout>
			</v-container>
		<div
			style="height: 10px;"
			v-if="!viewHandlerLoading"
			v-view="viewHandler"
		/>
		<v-container v-if="loading || viewHandlerLoading">
				<v-layout column align-center>
					Loading characters...
			  <v-progress-linear :indeterminate="true"></v-progress-linear>
			  </v-layout>
				</v-container>
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
				<v-card-text>
					{{ dialogData.description }}
				</v-card-text>
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
										<v-tooltip top>
											<template v-slot:activator="{ on }">
												<v-btn
													icon
													v-on="on"
													@click="addRemoveFromReadingList(comic)"
												>
													<v-icon :color="isOnReadingList(comic)">
														chrome_reader_mode
													</v-icon>
												</v-btn>
											</template>
											<span>Add to reading list</span>
										</v-tooltip>
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
			loading: true,
			viewHandlerLoading: true,
			characterDataDialog: false,
			comicImgURL: "",
			dialogData: {
				description: "",
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
			readingList: state => state.readingList,
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
			const comicData = await this.apiCall(comic.resourceURI)
			this.comicImgURL = `${comicData.data.results[0].thumbnail.path}.${comicData.data.results[0].thumbnail.extension}`
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
				description: character.description,
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
		},
		isOnReadingList(comic) {
			return _.findIndex(this.readingList, item => item.title === comic.name) === -1 ? "" : "yellow"
		},
		addRemoveFromReadingList(comic) {
			this.$store.dispatch("updateReadingList", comic)
		}
	}
}
</script>

<style>
.elevation-12 {
	box-shadow: 0 7px 8px -4px rgba(0,0,0,.5),0 12px 17px 2px rgba(0,0,0,.44),0 5px 22px 4px rgba(0,0,0,.42)!important;
	cursor: pointer;
}
</style>
