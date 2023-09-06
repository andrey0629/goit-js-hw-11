import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import axios from 'axios';
// const response = axios.create({
//   baseURL: 'https://pixabay.com/api/',
//   headers: {
//     key: '39228516 - 4e11e74abb6ab519ed74b0ef3',
//   },
// });
const axios = require('axios').default;

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
// const catContainer = document.querySelector('.cat-info');

// const LOCALSTORAGE_KEY = 'user_searchQuery';

// let userText = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || {};

// const form = document.querySelector('.form');
// form.addEventListener('submit', handlerSubmit);

// function handlerSubmit(evt) {
//   evt.preventDefault();
// }
const guard = document.querySelector('.js-guard');
let page = 30;
let gallerys;

form.addEventListener('input', handlerInput);
form.addEventListener('submit', handlerSubmit);

// const input = document.querySelector('input');
// const userText = input.value;
// form.elements.searchQuery.value = userText.searchQuery || '';

// function handlerSubmit(evt) {
//   evt.preventDefault();
//   let input = evt.target.elements.input.value;
let input = document.querySelector('input');
let search = input.value;
let observer = null;

function handlerInput(evt) {
  search[evt.target.name] = evt.target.value;
  // localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(userText));
  // console.log(search);
}

function handlerSubmit(evt) {
  evt.preventDefault();
  let search = input.value;
  Loading.circle('Loading...');
  getResource(search)
    .then(response => {
      renderList(response);
    })
    .catch(error => {
      console.log(error);
      Notify.failure('Oops! Something went wrong! Try reloading the page!');
    });
  // renderList();

  // getResource(search).try(renderList).catch(onRenderError);
  // async function getResource(userText) {
  //   try {
  //       const response = await axios.get(`https://pixabay.com/api/?key=39228516-4e11e74abb6ab519ed74b0ef3&q=${userText}`)
  //     // .then(r => r.data[0])
  //     .catch(err => new Error(err.response.statusText));
  // }
  // let typeValue = '';

  // async function getResource(search) {
  //   const response = await axios.get('https://pixabay.com/api/', {
  //     params: {
  //       key: '39228516-4e11e74abb6ab519ed74b0ef3',
  //       q: `${search}`,
  //       page: `${page}`,
  //       per_page: `${perPage}`,
  //       image_type: 'photo',
  //       orientation: 'horizontal',
  //       safesearch: 'true',
  //     },
  //   });
  //   if (response.data.hits.length === 0) {
  //     Notiflix.Notify.failure(
  //       'Sorry, there are no images matching your search query.Please try again.'
  //     );
  //     return;
  //   }
  //   if (page === 1) {
  //     Notiflix.Notify.info(
  //       `Hooray! We found ${response.data.totalHits} images.`
  //     );
  //   }
  //   return response;
  // }

  async function getResource(search, page = 1) {
    try {
      const response = await axios.get(
        `https://pixabay.com/api/?key=39228516-4e11e74abb6ab519ed74b0ef3&q=${search}&limit=30&page=${page}`
      );
      console.log(response);
      return response;
    } catch (error) {
      new Error(error.response.statusText);
      // onRenderError();
    }
  }

  // .then(
  //   response => {
  //     if (!response.ok) {
  //       throw new Error(response.statusText);
  //     }
  //     return response.json();
  //   }

  // evt.currentTarget.reset();
  // localStorage.removeItem(LOCALSTORAGE_KEY);

  // getResource().then(renderList);
}

// const input = 'q=flowers';

// function fetchPhoto() {
//   return instance
//     .GET(input)
//     .then(r => r.data)
//     .catch(err => new Error(err.response.statusText));
// }
// console.log(instance);

// fetch(
//   'https://pixabay.com/api/?key=39228516-4e11e74abb6ab519ed74b0ef3&q=flowers+red'
// );

// function fetchCatByBreed(breedId) {
//   return instance
//     .get(`images/search?breed_ids=${breedId}`)
//     .then(r => r.data[0])
//     .catch(err => new Error(err.response.statusText));
// }

// fetchPhoto().then(renderList).catch(onRenderError);

// select.addEventListener('change', onOptionCLick);

// function onOptionCLick(e) {
//   const selectedOption = e.currentTarget.value;
//   catContainer.innerHTML = '';
//   Loading.hourglass();
//   fetchCatByBreed(selectedOption).then(renderCatCard).catch(onRenderError);
// }

// function renderList(res) {
//   const markup = res.map(({ name }) => `<div>${name}</div>`);
//   list.insertAdjacentHTML('beforeend', markup);
//   new SlimSelect({
//     select: select,
//     settings: {
//       placeholderText: 'Select a cat breed',
//       hideSelected: true,
//     },
//     events: {
//       afterChange: fetchBreeds,
//     },
//   });
// }

function renderList(response) {
  Loading.remove();
  const { total, hits } = response;
  const markup = response.data.hits
    .map(
      ({ comments, likes, downloads, tags, webformatURL, largeImageURL }) => {
        return `<div class="photo-card">
        <a class="gallery__link" href="${largeImageURL}" data-lightbox="gallery-item">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
     </a>
    <div class="info">
        <p class="info-item"> <b>Likes</b> ${likes} </p>
        <p class="info-item"> <b>Comments</b> ${comments} </p>
        <p class="info-item"> <b>Downloads</b> ${downloads} </p>
    </div>
    </div>`;
      }
    )
    .join('');
  gallery.innerHTML = markup;

  if (!gallerys) {
    gallerys = new SimpleLightbox('.gallery a', {
      captions: true,
      captionsData: 'alt',
      captionPosition: 'bottom',
    });
  }
  gallerys.refresh();
  observer.observe(guard);
}

function onRenderError() {
  Loading.remove(1000);
  return Notify.failure('Хуйня, переделывай!');
}

function createImg(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  renderList();
  if (observer) {
    observer.disconnect();
  }
}

function observerFunc() {
  const options = {
    root: null,
    rootMargin: '500px',
    threshold: 1,
  };
  const callback = function (entries) {
    entries.forEach(entry => {
      if (!gallery.firstElementChild) {
        return;
      } else if (entry.isIntersecting) {
        page += 1;
        getResource(search, page)
          .then(response => {
            if (perPage * page > response.data.totalHits) {
              observer.disconnect();
              Notiflix.Notify.warning(
                "We're sorry, but you've reached the end of search results."
              );
              return;
            }
            renderList(response);
          })
          .catch(error => {
            Notiflix.Notify.failure(
              'Oops! Something went wrong! Try reloading the page!'
            );
            console.log(error);
          });
      }
    });
  };
  observer = new IntersectionObserver(callback, options);
  observer.observe(target);
}
