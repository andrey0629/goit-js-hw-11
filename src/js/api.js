import Notiflix from 'notiflix';
const axios = require('axios').default;

export async function fetchImg(typeValue, page) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '39228516-4e11e74abb6ab519ed74b0ef3',
        q: `${typeValue}`,
        page: `${page}`,
        per_page: '40',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
      },
    });

    return response;
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page.'
    );
    return { data: { hits: [] } };
  }
}
