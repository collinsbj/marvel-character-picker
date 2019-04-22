<template>
	<v-container grid-list-md>
		<v-layout
			column
			align-center
			text-sm-center
			v-if="readingList.length === 0"
		>
			You reading list is empty...<br>
			Head over to 'All Characters' to add some comics to your list!
		</v-layout>
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
				<v-hover>
					<v-card
						slot-scope="{ hover }"
						:class="`elevation-${hover ? 12 : 2}`"
						@click="openComicDialog(comic)"
					>
						<v-img
							height="250"
							:src="`${comic.thumbnail.path}.${comic.thumbnail.extension}`"
						/>
						<div
							v-if="hover"
							style="background-color: rgba(237,22,31, .4); top: 0; left: 0; position: absolute; height: 250px; width: 100%;"
						/>
						<v-card-text
							class="title"
							style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"
						>
							{{ comic.title }}
						</v-card-text>
						<v-card-text style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
							{{ comic.description === "" ? "No Description Available" : comic.description }}
						</v-card-text>
						<v-card-actions>
							<v-spacer />
							<v-tooltip top>
								<template v-slot:activator="{ on }">
									<v-btn
										v-on="on"
										icon
										@click.stop="addRemoveFromReadingList(comic)"
									>
										<v-icon color="#ed161f">
											list
										</v-icon>
									</v-btn>
								</template>
								<span>Remove from your reading list</span>
							</v-tooltip>
						</v-card-actions>
					</v-card>
				</v-hover>
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
					<v-spacer />
					<v-btn
						icon
						@click="comicDialog = false"
					>
						<v-icon>close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					{{ dialogData.description }}
				</v-card-text>
				<v-divider />
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
											<span>{{ isFavorite(character) === "" ? "Add to your favorites list" : "Remove from your favorites list" }}</span>
										</v-tooltip>
									</v-list-tile-avatar>
								</v-list-tile>
							</template>
							<v-progress-circular
								v-if="characterImgURL === ''"
								:indeterminate="true"
							/>
							<img
								v-else
								style="max-height: 150px; max-width: 150px;"
								:src="characterImgURL"
							>
						</v-tooltip>
					</v-list>
				</v-card-text>
				<v-card-text class="title">
					<span class="subheading">Page Count: </span>{{ dialogData.pageCount }}
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
			return _.find(this.favoriteCharacters, character) === undefined ? "" : "#ed161f"
		},
		isOnReadingList(comic) {
			return _.findIndex(this.readingList, item => item.title === comic.name) === -1 ? "" : "#ed161f"
		}
	}
}
</script>

<style>

</style>
