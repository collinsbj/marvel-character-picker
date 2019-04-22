<template>
	<v-container grid-list-md>
		<v-layout
			align-center
			column
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
				:key="comic.title"
				sm4
				v-for="comic in readingList"
				xs12
			>
				<v-hover>
					<v-card
						:class="`elevation-${hover ? 12 : 2}`"
						@click="openComicDialog(comic)"
						slot-scope="{ hover }"
					>
						<v-img
							height="250"
							:src="`${comic.thumbnail.path}.${comic.thumbnail.extension}`"
						/>
						<div
							style="background-color: rgba(237,22,31, .4); top: 0; left: 0; position: absolute; height: 250px; width: 100%;"
							v-if="hover"
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
										@click.stop="addRemoveFromReadingList(comic)"
										icon
										v-on="on"
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
						contain
						max-height="80px"
						max-width="80px"
						position="left"
						:src="dialogData.imageURL"
					/>
					<span class="ml-4">
						{{ dialogData.title }}
					</span>
					<v-spacer />
					<v-btn
						@click="comicDialog = false"
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
					<span class="subheading">Characters that appear in</span> {{ dialogData.title }}:
					<v-list>
						<v-tooltip
							allow-overflow
							:key="character.name"
							top
							v-for="character in dialogData.characters"
						>
							<template v-slot:activator="{ on }">
								<v-list-tile
									@click=""
									@mouseenter="getCharacterData(character)"
									@mouseleave="eraseCharacterData"
									v-on="on"
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
								:indeterminate="true"
								v-if="characterImgURL === ''"
							/>
							<img
								:src="characterImgURL"
								style="max-height: 150px; max-width: 150px;"
								v-else
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
import _ from "lodash"
import { apiCall, favoritesList, readingList } from "@/mixins.js"
import { mapState } from "vuex"

export default {
	name: "ReadingList",
	mixins: [apiCall, favoritesList, readingList],
	data() {
		return {
			characterImgURL: "",
			comicDialog: false,
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
			favoriteCharacters: state => state.favoriteCharacters,
			readingList: state => state.readingList
		})
	},
	methods: {
		eraseCharacterData() {
			this.characterImgURL = ""
		},
		async getCharacterData(character) {
			const characterData = await this.apiCall(character.resourceURI.replace("http:", "https:"))
			this.characterImgURL = `${characterData.data.results[0].thumbnail.path}.${characterData.data.results[0].thumbnail.extension}`
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
		}
	}
}
</script>
