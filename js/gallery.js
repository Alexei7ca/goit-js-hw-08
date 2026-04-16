const images = [
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/14/16/43/rchids-4202820__480.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/14/16/43/rchids-4202820_1280.jpg',
    description: 'Hokkaido Flower',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677_1280.jpg',
    description: 'Container Haulage Freight',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785_1280.jpg',
    description: 'Aerial Beach View',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619_1280.jpg',
    description: 'Flower Blooms',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334_1280.jpg',
    description: 'Alpine Mountains',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571_1280.jpg',
    description: 'Mountain Lake Sailing',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272_1280.jpg',
    description: 'Alpine Spring Meadows',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255_1280.jpg',
    description: 'Nature Landscape',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843_1280.jpg',
    description: 'Lighthouse Coast Sea',
  },
];

const gallery = document.querySelector('.gallery');

gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(images));
gallery.addEventListener('click', onGalleryClick);

function createGalleryMarkup(items) {
  return items
    .map(
      ({ preview, original, description }) => `
    <li class="gallery-item">
      <a class="gallery-link" href="${original}">
        <img
          class="gallery-image"
          src="${preview}"
          data-source="${original}"
          alt="${description}"
        />
      </a>
    </li>`
    )
    .join('');
}

function onGalleryClick(event) {
  event.preventDefault();

  const target = event.target;
  if (!target.classList.contains('gallery-image')) return;

  const currentImageIndex = images.findIndex(
    image => image.original === target.dataset.source
  );

  if (currentImageIndex === -1) return;

  openLightbox(currentImageIndex);
}

function openLightbox(startIndex) {
  let currentIndex = startIndex;
  let handleKeydown;
  let isAnimating = false;

  const instance = basicLightbox.create(
    `
      <div class="lightbox">
        <button class="lightbox-close-button" type="button" aria-label="Close modal">
          &times;
        </button>
        <button class="lightbox-button lightbox-button-prev" type="button" aria-label="Previous image">
          &#10094;
        </button>
        <div class="lightbox-image-wrapper"></div>
        <button class="lightbox-button lightbox-button-next" type="button" aria-label="Next image">
          &#10095;
        </button>
      </div>
    `,
    {
      onShow: lightboxInstance => {
        const lightboxElement = lightboxInstance.element();
        const lightboxImageWrapper = lightboxElement.querySelector(
          '.lightbox-image-wrapper'
        );
        const previousButton = lightboxElement.querySelector(
          '.lightbox-button-prev'
        );
        const nextButton = lightboxElement.querySelector('.lightbox-button-next');
        const closeButton = lightboxElement.querySelector(
          '.lightbox-close-button'
        );

        const createLightboxImage = imageIndex => {
          const { original, description } = images[imageIndex];
          const imageElement = document.createElement('img');

          imageElement.className = 'lightbox-image';
          imageElement.src = original;
          imageElement.alt = description;

          return imageElement;
        };

        const renderInitialImage = () => {
          lightboxImageWrapper.innerHTML = '';
          lightboxImageWrapper.append(createLightboxImage(currentIndex));
        };

        const slideToImage = direction => {
          if (isAnimating) return;

          isAnimating = true;

          const currentImage = lightboxImageWrapper.querySelector('.lightbox-image');
          const nextIndex =
            direction === 'next'
              ? (currentIndex + 1) % images.length
              : (currentIndex - 1 + images.length) % images.length;
          const nextImage = createLightboxImage(nextIndex);
          const enterClass =
            direction === 'next'
              ? 'lightbox-image-enter-from-right'
              : 'lightbox-image-enter-from-left';
          const exitClass =
            direction === 'next'
              ? 'lightbox-image-exit-to-left'
              : 'lightbox-image-exit-to-right';

          nextImage.classList.add(enterClass);
          lightboxImageWrapper.append(nextImage);

          requestAnimationFrame(() => {
            nextImage.classList.add('lightbox-image-active');
            currentImage.classList.add(exitClass);
          });

          nextImage.addEventListener(
            'transitionend',
            () => {
              currentImage.remove();
              nextImage.classList.remove(enterClass, 'lightbox-image-active');
              currentIndex = nextIndex;
              isAnimating = false;
            },
            { once: true }
          );
        };

        previousButton.addEventListener('click', event => {
          event.stopPropagation();
          slideToImage('previous');
        });

        nextButton.addEventListener('click', event => {
          event.stopPropagation();
          slideToImage('next');
        });

        closeButton.addEventListener('click', event => {
          event.stopPropagation();
          lightboxInstance.close();
        });

        handleKeydown = event => {
          if (event.key === 'Escape') {
            lightboxInstance.close();
          }

          if (event.key === 'ArrowLeft') {
            slideToImage('previous');
          }

          if (event.key === 'ArrowRight') {
            slideToImage('next');
          }
        };

        document.addEventListener('keydown', handleKeydown);
        renderInitialImage();
      },
      onClose: () => {
        document.removeEventListener('keydown', handleKeydown);
      },
    }
  );

  instance.show();
}
