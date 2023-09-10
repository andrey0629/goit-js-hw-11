import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { fetchImg } from './api.js';
import { renderImgCard } from './renderCard.js';

export const cardBlock = document.querySelector('.gallery');
const searchFormEl = document.querySelector('#search-form');
const typeInputEl = document.querySelector('input[name="searchQuery"]');
const target = document.querySelector('.observer');
let typeValue = '';
export let observer = null;
export let page = 0;
export const perPage = 40;
let totalHits = 0;
let isLoading = false;
let hasReachedEnd = false;

function createImg(event) {
  event.preventDefault();
  typeValue = typeInputEl.value.trim();
  if (!typeValue) {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }
  cardBlock.innerHTML = '';
  page = 0;
  totalHits = 0;
  isLoading = false;
  hasReachedEnd = false;
  fetchData();
  if (observer) {
    observer.disconnect();
  }
}

async function fetchData() {
  try {
    if (isLoading || hasReachedEnd) return;
    isLoading = true;
    page += 1;
    const typeValue = typeInputEl.value;
    const response = await fetchImg(typeValue, page);
    if (response.data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      isLoading = false;
      return;
    }

    if (page === 1) {
      totalHits = response.data.totalHits;
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    }
    renderImgCard(response);

    if (totalHits > perPage * page) {
      observerFunc();
    } else {
      hasReachedEnd = true;
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }

    isLoading = false;
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page.'
    );
    isLoading = false;
  }
}

searchFormEl.addEventListener('submit', createImg);

async function observerFunc() {
  const options = {
    root: null,
    rootMargin: '500px',
    threshold: 1,
  };

  const callback = function (entries) {
    entries.forEach(entry => {
      if (!cardBlock.firstElementChild) {
        return;
      } else if (entry.isIntersecting) {
        fetchData();
      }
    });
  };

  observer = new IntersectionObserver(callback, options);
  observer.observe(target);
}

observerFunc();
