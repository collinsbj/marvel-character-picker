<template>
	<div>
		<v-toolbar
			height="90"
			app
			tabs
			color="#ed161f"
		>
			<v-toolbar-title>
				<v-layout
					row
					align-center
				>
					<img
						style="height: 90px"
						src="../assets/1200px-MarvelLogo.svg.png"
					>
					<div
						style="color: #ed161f;font-size:90px; text-transform: uppercase; letter-spacing: -6px; font-family: 'Oswald', sans-serif; font-weight: bold; background-color:white;"
						class="mb-2 pr-2"
					>
						Character Picker
					</div>
				</v-layout>
			</v-toolbar-title>
			<template v-slot:extension>
				<v-tabs
					fixed-tabs
					v-model="active"
					color="#ed161f"
					dark
				>
					<v-tabs-slider color="white" />
					<v-tab>
						All Characters
					</v-tab>
					<v-tab>
						Favorite Characters
					</v-tab>
					<v-tab>
						Reading List
					</v-tab>
				</v-tabs>
			</template>
		</v-toolbar>
		<v-tabs-items v-model="active">
			<v-tab-item
				lazy
				:value="0"
			>
				<character-list :list-type="'all'" />
			</v-tab-item>
			<v-tab-item
				lazy
				:value="1"
			>
				<character-list :list-type="'favorites'" />
			</v-tab-item>
			<v-tab-item
				lazy
				:value="2"
			>
				<reading-list />
			</v-tab-item>
		</v-tabs-items>
	</div>
</template>

<script>
export default {
	name: "Home",
	components: {
		CharacterList: () => import("@/components/CharacterList.vue"),
		ReadingList: () => import("@/components/ReadingList.vue")
	},
	data() {
		return {
			active: null
		}
	}
}
</script>

<style>

</style>
