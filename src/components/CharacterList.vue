<template>
	<div>
		<v-container v-if="listType === 'favorites' && favoriteCharacters.length === 0">
			<v-layout
				align-center
				column
				text-sm-center
			>
				You don't currently have any favorite Marvel characters...<br>
				Head over to 'All Characters' to select some!
			</v-layout>
		</v-container>
		<v-container
			grid-list-md
			v-if="!loading"
		>
			<v-select
				label="Sort By"
				:items="['Name', 'Rank', 'Appearances']"
				v-if="listType === 'favorites' && favoriteCharacters.length !== 0"
				v-model="sortingMethod"
			/>
			<v-layout
				row
				wrap
			>
				<v-flex
					:key="character.name"
					sm4
					v-for="character in charactersDisplay"
					xs12
				>
					<v-hover>
						<v-card
							:class="`elevation-${hover ? 12 : 2}`"
							max-height="500px"
							slot-scope="{ hover }"
							style="overflow: hidden"
						>
							<div @click="openCharacterDataDialog(character)">
								<v-img
									height="250"
									:src="`${character.thumbnail.path}.${character.thumbnail.extension}`"
								/>

								<div
									style="background-color: rgba(237,22,31, .4); top: 0; left: 0; position: absolute; height: 250px; width: 100%;"
									v-if="hover"
								/>
								<v-card-text
									class="title"
									style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"
								>
									{{ character.name }}
								</v-card-text>
								<v-card-text style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
									{{ character.description === "" ? "No Description Available" : character.description }}
								</v-card-text>
							</div>
							<v-card-actions>
								<v-select
									box
									@change="rankChange(character,$event)"
									label="Rank"
									:items="numberOfFavoriteCharacters"
									style="width: 1px;"
									:value="character.rank"
									v-if="listType === 'favorites'"
								/>
								<v-spacer />
								<v-tooltip top>
									<template v-slot:activator="{ on }">
										<v-btn
											@click.stop="addRemoveCharacterToFavorites(character)"
											icon
											v-on="on"
										>
											<v-icon :color="isFavorite(character)">
												star
											</v-icon>
										</v-btn>
									</template>
									<span>{{ isFavorite(character) === "" ? "Add to your favorites" : "Remove from your favorites" }}</span>
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
		<v-container v-if="(loading || viewHandlerLoading) && listType === 'all'">
			<v-layout
				align-center
				column
			>
				Loading characters...
				<v-progress-linear
					color="#ed161f"
					:indeterminate="true"
				/>
			</v-layout>
		</v-container>
		<v-dialog v-model="characterDataDialog">
			<v-card>
				<v-card-title class="display-1">
					<v-img
						contain
						max-height="80px"
						max-width="80px"
						position="left"
						:src="dialogData.imageURL"
					/>
					<span class="ml-4">
						{{ dialogData.name }}
					</span>
					<v-spacer />
					<v-btn
						@click="characterDataDialog = false"
						icon
					>
						<v-icon>close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					{{ dialogData.description }}
				</v-card-text>
				<v-divider />
				<v-card-text class="title">
					{{ dialogData.name }} <span class="subheading">has appeared in</span> {{ dialogData.comicData.available }} <span class="subheading">comics:</span>
					<v-list>
						<v-tooltip
							allow-overflow
							:key="comic.name"
							top
							v-for="comic in dialogData.comicData.items"
						>
							<template v-slot:activator="{ on }">
								<v-list-tile
									@click=""
									@mouseenter="getComicData(comic)"
									@mouseleave="eraseComicData"
									v-on="on"
								>
									<v-list-tile-title>
										{{ comic.name }}
									</v-list-tile-title>
									<v-list-tile-avatar>
										<v-tooltip top>
											<template v-slot:activator="{ on }">
												<v-btn
													@click="addRemoveFromReadingList(comic)"
													icon
													v-on="on"
												>
													<v-icon :color="isOnReadingList(comic)">
														list
													</v-icon>
												</v-btn>
											</template>
											<span>{{ isOnReadingList(comic) === "" ? "Add to your reading list" : "Remove from your reading list" }}</span>
										</v-tooltip>
									</v-list-tile-avatar>
								</v-list-tile>
							</template>
							<v-progress-circular
								:indeterminate="true"
								v-if="comicImgURL === ''"
							/>
							<img
								:src="comicImgURL"
								style="max-height: 150px; max-width: 150px;"
								v-else
							>
						</v-tooltip>
					</v-list>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import _ from "lodash"
import { apiCall, favoritesList, readingList } from "@/mixins.js"
import { mapState } from "vuex"

export default {
	name: "CharacterList",
	props: ["listType"],
	mixins: [apiCall, favoritesList, readingList],
	data() {
		return {
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
			},
			loading: true,
			sortingMethod: "Rank",
			viewHandlerLoading: true
		}
	},
	async created() {
		this.loading = true
		if (this.allCharacters.length === 0) {
			const characters = await this.apiCall("https://gateway.marvel.com/v1/public/characters")
			this.$store.dispatch("replaceAllCharactersList", characters.data.results)
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
		charactersByAppearances() {
			return this.favoriteCharacters.sort((a, b) => a.comics.available + b.comics.available)
		},
		charactersByName() {
			return this.favoriteCharacters.sort((a, b) => {
				const nameA = a.name.toUpperCase()
				const nameB = b.name.toUpperCase()
				if (nameA < nameB) {
					return -1
				}
				if (nameA > nameB) {
					return 1
				}

				return 0
			})
		},
		charactersByRank() {
			return this.favoriteCharacters.sort((a, b) => a.rank - b.rank)
		},
		charactersDisplay() {
			if (this.listType === "favorites") {
				if (this.sortingMethod === "Rank") {
					return this.charactersByRank
				} if (this.sortingMethod === "Name") {
					return this.charactersByName
				} if (this.sortingMethod === "Appearances") {
					return this.charactersByAppearances
				}
			}
			return this.allCharacters
		},
		numberOfFavoriteCharacters() {
			return this.favoriteCharacters.map((item, index) => index + 1)
		}
	},
	methods: {
		eraseComicData() {
			this.comicImgURL = ""
		},
		async getComicData(comic) {
			const comicData = await this.apiCall(comic.resourceURI.replace("http:", "https:"))
			this.comicImgURL = `${comicData.data.results[0].thumbnail.path}.${comicData.data.results[0].thumbnail.extension}`
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
		rankChange(character, newRank) {
			if (character.rank !== newRank) {
				this.$store.dispatch("updateRanks", { characterName: character.name, oldRank: character.rank, newRank })
			}
		},
		async viewHandler(event) {
			if ((event.type === "progress" || event.type === "enter") && event.percentInView > 0 && event.scrollValue > 0) {
				this.viewHandlerLoading = true
				const characters = await this.apiCall("https://gateway.marvel.com/v1/public/characters", this.offset)
				await this.$store.dispatch("addToAllCharactersList", characters.data.results)
				await this.$store.dispatch("updateOffset", characters.data.count)
				this.viewHandlerLoading = false
			}
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
