<template>
	<div>
		<v-tabs v-model="active">
			<v-tab>
				Character Picker
			</v-tab>
			<v-tab>
				Fav Picker
			</v-tab>
			<v-tab>
				Reading List
			</v-tab>
			<v-tab-item lazy>
				<character-list :list-type="'all'" />
			</v-tab-item>
			<v-tab-item lazy>
				<character-list :list-type="'favorites'" />
			</v-tab-item>
			<v-tab-item lazy>
				<reading-list />
			</v-tab-item>
		</v-tabs>
	</div>
</template>

<script>
export default {
	name: "CharPicker",
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
