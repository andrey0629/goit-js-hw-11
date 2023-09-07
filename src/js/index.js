import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
// import OnlyScroll from 'only-scrollbar';
import { fetchImg } from './api.js';
import { renderImgCard } from './renderCard.js';
export const cardBlock = document.querySelector('.gallery');
const searchFormEl = document.querySelector('#search-form');
const typeInputEl = document.querySelector('input[name="searchQuery"]');
// const scroll = new OnlyScroll(window);
export let page = 0;
export const perPage = 40;
const target = document.querySelector('.observer');
let typeValue = '';
export let observer = null;

function createImg(event) {
  event.preventDefault();
  typeValue = typeInputEl.value.trim();
  if (!typeValue) {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }
  cardBlock.innerHTML = '';
  page = 1;
  fetchData();
  if (observer) {
    observer.disconnect();
  }
}

async function fetchData() {
  try {
    const typeValue = typeInputEl.value;
    const response = await fetchImg(typeValue);
    observerFunc(response);
    renderImgCard(response);
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
  }
}

searchFormEl.addEventListener('submit', createImg);

// function observerFunc() {
//   const options = {
//     root: null,
//     rootMargin: '500px',
//     threshold: 1,
//   };
//   const callback = function (entries) {
//     entries.forEach(entry => {
//       if (!cardBlock.firstElementChild) {
//         return;
//       } else if (entry.isIntersecting) {
//         page += 1;
//         fetchImg(typeValue)
//           .then(response => {
//             if (perPage * page > response.data.totalHits) {
//               observer.disconnect();
//               Notiflix.Notify.warning(
//                 "We're sorry, but you've reached the end of search results."
//               );
//               return;
//             }
//             renderImgCard(response);
//           })
//           .catch(error => {
//             Notiflix.Notify.failure(
//               'Oops! Something went wrong! Try reloading the page!'
//             );
//             console.log(error);
//           });
//       }
//     });
//   };
//   observer = new IntersectionObserver(callback, options);
//   observer.observe(target);
// }

async function observerFunc() {
  const options = {
    root: null,
    rootMargin: '500px',
    threshold: 1,
  };
  const callback = async function (entries) {
    for (const entry of entries) {
      if (!cardBlock.firstElementChild) {
        return;
      } else if (entry.isIntersecting) {
        page += 1;
        try {
          const response = await fetchImg(typeValue);
          if (perPage * page > response.data.totalHits) {
            observer.disconnect();
            Notiflix.Notify.warning(
              "We're sorry, but you've reached the end of search results."
            );
            return;
          }
          renderImgCard(response);
        } catch (error) {
          Notiflix.Notify.failure(
            'Oops! Something went wrong! Try reloading the page!'
          );
          console.log(error);
        }
      }
    }
  };
  observer = new IntersectionObserver(callback, options);
  observer.observe(target);
}
