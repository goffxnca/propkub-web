const genPageTitle = (title?: string) => {
  return title
    ? `${title} | PropKub.com`
    : 'PropKub.com - ลงประกาศขาย/ให้เช่า คอนโด บ้าน ที่ดินฟรี';
};

const genPropertyTitleMeta = (title?: string) => {
  return title ? `${title.substring(0, 65)}` : '';
};

const genPropertyDescriptionMeta = (htmlDesc: string) => {
  return htmlDesc.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 170);
};

function getCanonicalUrl(fullUrl: string) {
  return fullUrl.split('?')[0];
}

export {
  genPageTitle,
  genPropertyTitleMeta,
  genPropertyDescriptionMeta,
  getCanonicalUrl
};
