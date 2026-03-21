const appJson = require('./app.json')

module.exports = () => {
	return {
		...appJson.expo,
		android: {
			...appJson.expo.android,
			googleServicesFile: process.env.GOOGLE_SERVICES_JSON || './google-services.json'
		}
	}
}