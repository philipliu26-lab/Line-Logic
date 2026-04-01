/**
 * Supports GitHub Pages project URLs: set EXPO_ROUTER_BASE_PATH=/your-repo-name when building.
 * Omit locally / on Netlify (root URL) so assets load from /.
 */
const appJson = require('./app.json');

const baseUrl = process.env.EXPO_ROUTER_BASE_PATH || '';

module.exports = {
  expo: {
    ...appJson.expo,
    experiments: {
      ...appJson.expo.experiments,
      ...(baseUrl ? { baseUrl } : {}),
    },
  },
};
