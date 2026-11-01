export function slugify(text = '') {
  return text
    .normalize('NFKD') // split accents off letters (é -> e + ´)
    .replace(/[̀-ͯ]/g, '') // drop the accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // keep only letters, numbers, spaces, dashes
    .replace(/[\s-]+/g, '-') // spaces (or many dashes) -> one dash
    .replace(/^-+|-+$/g, ''); // no dash at the start or end
}
