import { randomBytes } from 'crypto';

export function generatePassword(length = 6): string {
  return randomBytes(length).toString('base64').slice(0, length);
}

export function truncEmail(email: string): string {
  if (!email) return '';
  const atIndex = email.indexOf('@');
  if (atIndex <= 5) {
    return `${email.substring(0, 1)}xxx@${email.split('@')[1]}`;
  }
  return `${email.substring(0, 5)}xxx@${email.split('@')[1]}`;
}

export function truncToken(token: string): string {
  if (!token) return '';
  return `${token.substring(0, 8)}...`;
}

export function genSlug(text: string, id: string) {
  let slug = '';

  slug = text
    .trim() //remove white space at start & end
    .toLowerCase() //set EN characters to lower case
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ''
    ) //remove all emoji icons
    .replaceAll(' ', '-') //replace any space to dash
    .replaceAll('@', 'แอท')
    .replaceAll('%', 'เปอร์เซนต์')
    .replaceAll('&', 'แอนด์')
    .replaceAll('/', 'ทับ')
    .replaceAll(/[`~!@#$%^&*()_+=[\]{};:'"\\|/,.<>?\s]/g, '')
    .replaceAll(/\s\s+/g, '-') //remove consecutive whitespace to one dash
    .replaceAll(/-+/g, '-') //remove consecutive dashes to one dash
    .replaceAll(/^-+/g, '') //remove dash at start of string
    .replaceAll(/-+$/g, ''); //remove dash at end of string

  return slug.substring(0, 70) + '_' + id;
}
