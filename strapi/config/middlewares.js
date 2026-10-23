// CORS_ORIGINS: "https://*.example.com,http://localhost:*" -> one RegExp per entry (same rule as tbbe).
// An entry https://*.example.com allows example.com and every sub-domain; host:* allows any port;
// anything else must match exactly. Unset = localhost only.
const DEFAULT_ORIGINS = 'http://localhost:*';
const escape = (text) => text.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
// Strapi's own address (PUBLIC_URL) is always allowed: its admin panel sends it as the Origin of every login.
const ownOrigin = (() => { try { return new URL(process.env.PUBLIC_URL).origin; } catch (e) { return ''; } })();
const allowedOrigins = [process.env.CORS_ORIGINS || DEFAULT_ORIGINS, ownOrigin].join(',')
  .split(',')
  .map((entry) => entry.trim().replace(/\/+$/, ''))
  .filter(Boolean)
  .map((entry) => {
    const m = entry.match(/^(https?):\/\/\*\.(.+)$/);           // https://*.example.com
    if (m) return new RegExp(`^${m[1]}:\\/\\/(?:[^/]+\\.)?${escape(m[2])}$`);
    const port = entry.match(/^(https?:\/\/[^/:]+):\*$/);          // http://localhost:*
    if (port) return new RegExp(`^${escape(port[1])}(?::\\d+)?$`);
    return new RegExp(`^${escape(entry)}$`);
  });

module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      // Return a list, never false (an empty list makes Strapi answer "<origin> is not a valid origin").
      origin: (ctx) => {
        const requestOrigin = ctx.request.header.origin;
        return requestOrigin && allowedOrigins.some((pattern) => pattern.test(requestOrigin)) ? [requestOrigin] : [];
      },
      credentials: true,
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
