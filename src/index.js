// https://pixabay.com/api/
// Your API key: 39228516 - 4e11e74abb6ab519ed74b0ef3

// import SlimSelect from 'slim-select';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import { Loading } from 'notiflix/build/notiflix-loading-aio';
// // import 'slim-select/dist/slimselect.css';
// import { fetchBreeds, fetchCatByBreed } from './cat-api';

// import axios from 'axios';
// const instance = axios.create({
//   baseURL: 'https://api.thecatapi.com/v1/',
//   headers: {
//     'x-api-key':
//       'live_5gcBxYGBeGtVnTe4tRQVLU3tQgzVUm9OvGjso2ptqnap9avv66fdGiowLO59glmR',
//   },
// });

function fetchBreeds() {
  return instance
    .get('breeds')
    .then(r => r.data)
    .catch(err => new Error(err.response.statusText));
}

function fetchCatByBreed(breedId) {
  return instance
    .get(`images/search?breed_ids=${breedId}`)
    .then(r => r.data[0])
    .catch(err => new Error(err.response.statusText));
}
~

const select = document.querySelector('.breed-select');
const catContainer = document.querySelector('.cat-info');

fetchBreeds().then(renderCatOption).catch(onRenderError);

select.addEventListener('change', onOptionCLick);

function onOptionCLick(e) {
  const selectedOption = e.currentTarget.value;
  catContainer.innerHTML = '';
  Loading.hourglass();
  fetchCatByBreed(selectedOption).then(renderCatCard).catch(onRenderError);
}

function onRenderError() {
  return Notify.failure('Oops! Something went wrong, please try again.');
}

function renderCatOption(res) {
  const markup = res.map(
    ({ id, name }) => `<option value="${id}">${name}</option>`
  );
  select.insertAdjacentHTML('beforeend', markup);
  new SlimSelect({
    select: select,
    settings: {
      placeholderText: 'Select a cat breed',
      hideSelected: true,
    },
    events: {
      afterChange: fetchBreeds,
    },
  });
