// Every value comes from .env at run time (one image for every server).
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  // 1339 in dev, so it does not clash with tbbe (1337, 1338)
  port: env.int('PORT', 1339),
  // Strapi's own public address, e.g. https://blogapi.example.com (used in links Strapi builds, e.g. email).
  // Empty = Strapi works it out per request.
  url: env('PUBLIC_URL', ''),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
