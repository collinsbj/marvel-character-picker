import CryptoJS from "crypto-js"

export const apiCall = {
	methods: {
		async apiCall(baseURL, offset = 0, limit = 20) {
			const timestamp = new Date()
			const hash = CryptoJS.MD5(timestamp + process.env.VUE_APP_PRIVATEAPIKEY + process.env.VUE_APP_PUBLICAPIKEY).toString()
			const params = `?apikey=${process.env.VUE_APP_PUBLICAPIKEY}&hash=${hash}&ts=${timestamp}&offset=${offset}&limit=${limit}`
			const url = baseURL + params

			const results = await fetch(url)
				.then(response => response.json())
				.then(response => response)
				.catch(err => console.log(err))

			return results
		}
	}
}

export const favoritesList = {
	methods: {
		addRemoveCharacterToFavorites(character) {
			this.$store.dispatch("updateFavoriteCharactersList", character)
		},
		isFavorite(character) {
			return _.find(this.favoriteCharacters, character) === undefined ? "" : "#ed161f"
		}
	}
}

export const readingList = {
	methods: {
		addRemoveFromReadingList(comic) {
			this.$store.dispatch("updateReadingList", comic)
		},
		isOnReadingList(comic) {
			return _.findIndex(this.readingList, item => item.title === comic.name) === -1 ? "" : "#ed161f"
		}
	}
}
