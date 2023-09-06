import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
// import OnlyScroll from 'only-scrollbar';

const axios = require('axios').default;
const cardBlock = document.querySelector('.gallery');
const searchFormEl = document.querySelector('#search-form');
const typeInputEl = document.querySelector('input[name="searchQuery"]');
// const scroll = new OnlyScroll(window);
const perPage = 40;
const target = document.querySelector('.obseerver');

let page = 0;
let typeValue = '';
let observer = null;
let gallery;

function createImg(event) {
  event.preventDefault();
  cardBlock.innerHTML = '';
  page = 1;
  fetchData();
  if (observer) {
    observer.disconnect();
  }
}

function fetchData() {
  typeValue = typeInputEl.value;
  fetchImg(typeValue)
    .then(response => {
      observerFunc(response);
      renderImgCard(response);
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
    });
}

searchFormEl.addEventListener('submit', createImg);

function observerFunc() {
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
        page += 1;
        fetchImg(typeValue)
          .then(response => {
            if (perPage * page > response.data.totalHits) {
              observer.disconnect();
              Notiflix.Notify.warning(
                "We're sorry, but you've reached the end of search results."
              );
              return;
            }
            renderImgCard(response);
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

async function fetchImg(typeValue) {
  const response = await axios.get('https://pixabay.com/api/', {
    params: {
      key: '36865629-a181ba7c52348470e5fc378ab',
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

function renderImgCard(response) {
  if (!response) {
    return;
  }
  const markupImg = response.data.hits
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <a class="gallery__link" href="${largeImageURL}" data-lightbox="gallery-item">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
     </a>
    <div class="info">
        <p class="info-item">
            <b>Likes</b>
            ${likes}
        </p>
        <p class="info-item">
            <b>Views</b>
            ${views}
        </p>
        <p class="info-item">
            <b>Comments</b>
            ${comments}
        </p>
        <p class="info-item">
            <b>Downloads</b>
            ${downloads}
        </p>
    </div>
</div> `;
      }
    )
    .join('');
  cardBlock.insertAdjacentHTML('beforeend', markupImg);
  if (!gallery) {
    gallery = new SimpleLightbox('.gallery a', {
      captions: true,
      captionsData: 'alt',
    });
  }
  gallery.refresh();
}
