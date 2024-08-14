const { defineConfig } = require('@vue/cli-service')

module.exports = {
  defineConfig({transpileDependencies: true }),
  env: {
    VUE_APP_GENIUS_API_KEY: process.env.VUE_APP_GENIUS_API_KEY,
    VUE_APP_GENIUS_CLIENT_ID: process.env.VUE_APP_GENIUS_CLIENT_ID,
  }
}