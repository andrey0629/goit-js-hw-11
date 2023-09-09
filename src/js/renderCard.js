import { cardBlock } from './index.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let gallery;

export function renderImgCard(response) {
  if (
    !response ||
    !response.data ||
    !response.data.hits ||
    !Array.isArray(response.data.hits)
  ) {
    return;
  }

  const hits = response.data.hits;

  if (hits.length === 0) {
    return;
  }

  const markupImg = hits
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
