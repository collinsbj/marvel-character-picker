<template>
	<v-container grid-list-md>
		<v-layout
			row
			wrap
		>
			<v-flex
				sm4
				xs12
				v-for="comic in readingList"
				:key="comic.title"
			>
				<v-card>
					<v-btn
						icon
						@click="openComicDialog(comic)"
					>
						<v-icon>
							info
						</v-icon>
					</v-btn>
					<v-btn
						icon
						@click="addRemoveCFromReadingList(comic)"
					>
						<v-icon>
							chrome_reader_mode
						</v-icon>
					</v-btn>
					<v-img :src="`${comic.thumbnail.path}.${comic.thumbnail.extension}`" />
					<v-card-title class="title">
						{{ comic.title }}
					</v-card-title>
					<v-card-text>
						{{ comic.description === "" ? "No Description Available" : comic.description }}
					</v-card-text>
					<v-card-text>
						Characters:
						<v-list>
							<v-list-tile v-for="character in comic.characters.items">
								{{ character.name }}
							</v-list-tile>
						</v-list>
					</v-card-text>
					<v-card-text>
						Page Count: {{ comic.pageCount }}
					</v-card-text>
				</v-card>
			</v-flex>
		</v-layout>

		<v-dialog v-model="comicDialog">
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
						{{ dialogData.title }}
					</span>
				</v-card-title>
				<v-card-text>
					{{ dialogData.description }}
				</v-card-text>
				<v-card-text class="title">
					<span class="subheading">Page Count: </span>{{ dialogData.pageCount }}
				</v-card-text>
				<v-card-text class="title">
					<span class="subheading">Characters that appear in</span> {{ dialogData.title }}:
					<v-list>
						<v-tooltip
							allow-overflow
							top
							v-for="character in dialogData.characters"
							:key="character.name"
						>
							<template v-slot:activator="{ on }">
								<v-list-tile
									@mouseenter="getCharacterData(character)"
									@mouseleave="eraseCharacterData"
									v-on="on"
									@click=""
								>
									<v-list-tile-title>
										{{ character.name }}
									</v-list-tile-title>
									<v-list-tile-avatar>
										<v-tooltip top>
											<template v-slot:activator="{ on }">
												<v-btn
													icon
													v-on="on"
													@click="addRemoveCharacterToFavorites(character)"
												>
													<v-icon :color="isFavorite(character)">
														star
													</v-icon>
												</v-btn>
											</template>
											<span>Add to favorites list</span>
										</v-tooltip>
									</v-list-tile-avatar>
								</v-list-tile>
							</template>
							<img
								style="max-height: 150px; max-width: 150px;"
								:src="characterImgURL"
							>
						</v-tooltip>
					</v-list>
				</v-card-text>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script>
import { mapState } from "vuex"
import { apiCall } from "@/mixins.js"
import _ from "lodash"

export default {
	name: "ReadingList",
	mixins: [apiCall],
	data() {
		return {
			comicDialog: false,
			characterImgURL: "",
			dialogData: {
				imageURL: "",
				title: "",
				description: "",
				pageCount: "",
				characters: []
			}
		}
	},
	computed: {
		...mapState({
			readingList: state => state.readingList,
			favoriteCharacters: state => state.favoriteCharacters
		})
	},
	methods: {
		async getCharacterData(character) {
			const characterData = await this.apiCall(character.resourceURI)
			this.characterImgURL = `${characterData.data.results[0].thumbnail.path}.${characterData.data.results[0].thumbnail.extension}`
		},
		eraseCharacterData() {
			this.characterImgURL = ""
		},
		openComicDialog(comic) {
			this.dialogData = {
				imageURL: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
				title: comic.title,
				description: comic.description,
				pageCount: comic.pageCount,
				characters: comic.characters.items
			}
			this.comicDialog = true
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
