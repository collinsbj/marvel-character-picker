<template>
	<div>
		<v-toolbar
			app
			tabs
		>
			<v-toolbar-title>
				Marvel Character Picker
			</v-toolbar-title>
			<template v-slot:extension>
				<v-tabs
					fixed-tabs
					v-model="active"
				>
					<v-tab>
						Character Picker
					</v-tab>
					<v-tab>
						Fav Picker
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
