import Notiflix from 'notiflix';
import { page } from './index.js';
import { perPage } from './index.js';
const axios = require('axios').default;
export async function fetchImg(typeValue) {
  const response = await axios.get('https://pixabay.com/api/', {
    params: {
      key: '39228516-4e11e74abb6ab519ed74b0ef3',
      q: `${typeValue}`,
      page: `${page}`,
      per_page: `${perPage}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    },
  });
  if (response.data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query.Please try again.'
    );
    return;
  }
  if (page === 1) {
    Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
  }
  return response;
}
