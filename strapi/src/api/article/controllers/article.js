'use strict';

/**
 * article controller
 *
 * Strapi 5 returns drafts to anyone who asks with ?status=draft. Visitors without a login (the Public role)
 * only ever get published articles; signed-in editors (Content Editor role) still see drafts.
 */

const { createCoreController } = require('@strapi/strapi').factories;

// The Public role counts as authenticated in Strapi, but with no credentials (no user, no API token).
const publishedOnlyForPublic = (ctx) => {
  if (!ctx.state.auth?.credentials) {
    ctx.query = { ...ctx.query, status: 'published' };
  }
};

module.exports = createCoreController('api::article.article', () => ({
  async find(ctx) {
    publishedOnlyForPublic(ctx);
    return super.find(ctx);
  },
  async findOne(ctx) {
    publishedOnlyForPublic(ctx);
    return super.findOne(ctx);
  },
}));
