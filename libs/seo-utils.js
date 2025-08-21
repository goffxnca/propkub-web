const genPageTitle = (title) => {
  return title
    ? `${title.substring()} | PropKub.com`
    : 'PropKub.com - ลงประกาศขาย/ให้เช่า คอนโด บ้าน ที่ดินฟรี';
};

const genPropertyTitleMeta = (title) => {
  return title ? `${title.substring(0, 65)}` : '';
};

const genPropertyDescriptionMeta = (htmlDesc) => {
  return htmlDesc.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 170);
};

function getCanonicalUrl(fullUrl) {
  return fullUrl.split('?')[0];
}

export {
  genPageTitle,
  genPropertyTitleMeta,
  genPropertyDescriptionMeta,
  getCanonicalUrl
};
