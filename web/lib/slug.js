// "Planning Sprints: A How-To" -> "planning-sprints-a-how-to" (the characters Strapi allows in a UID).
export const slugify = text =>
  String(text || '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
