'use strict';

// функция получения случайного числа в интервале
var getRandomInteger = function (min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
};


// функция, которая возвращает случайный элемент массива
var getRandomElement = function (array) {
  var randomIndex = getRandomInteger(0, array.length - 1);
  return array[randomIndex];
};


// функция перемешивания массива в случайном порядке (алгоритм Фишера-Йетса)
var shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
};


// функция создания комментариев для фотографии
var generateCommentsToPhoto = function () {
  var firstName = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];
  var secondName = ['да Марья', 'Верон', 'Мирабелла', 'Вальц', 'Онопко', 'Топольницкая', 'Нионго', 'Ирвинг'];
  var commentsList = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
  var comments = [];
  var commentariesAmount = getRandomInteger(1, 5); // количество комментариев к фотографии - случайное число от 1 до 5

  for (var i = 0; i < commentariesAmount; i++) {
    var comment = {};

    // имя комментатора
    comment.name = getRandomElement(firstName) + ' ' + getRandomElement(secondName);

    // аватар комментатора
    var avatarNumber = getRandomInteger(1, 6);
    comment.avatar = 'img/avatar-' + avatarNumber + '.svg';

    // комментарий
    var isAdditionalComment = getRandomInteger(0, 1); // определяем, будет ли вторая часть комментария
    // comment.isAdd = isAdditionalComment;

    shuffleArray(commentsList);
    // console.log(commentsList);

    comment.message = commentsList[0];
    if (isAdditionalComment) {
      comment.message += ' ' + commentsList[1];
    }
    comments[i] = comment;
  }
  // console.log(comments);
  return comments;
};


// функция создания объектов - фотографий пользователя
var generateDescriptionToPhotos = function (photosAmount) {
  var photos = [];

  for (var i = 0; i < photosAmount; i++) {
    var photo = {};

    photo.url = 'photos/' + (i + 1) + '.jpg';
    photo.likes = getRandomInteger(15, 200);
    photo.comments = generateCommentsToPhoto();

    photos[i] = photo;
  }
  // console.log(photos);
  return photos;
};


// функция создания DOM-элемента на основе JS-объекта
var createPhotos = function (photo) {
  // находим шаблон, который будем копировать, находим элемент, в который будем вставлять фотографии
  var photoTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture');

  var photoElement = photoTemplate.cloneNode(true);

  photoElement.querySelector('.picture__img').src = photo.url;
  photoElement.querySelector('.picture__likes').textContent = photo.likes;
  photoElement.querySelector('.picture__comments').textContent = photo.comments.length;

  return photoElement;
};


// функцию заполнения блока DOM-элементами на основе массива JS-объектов
var renderPhotos = function () {
  var PHOTOS_AMOUNT = 25; // количество фотографий с описаниями (объектов)

  var photoListElement = document.querySelector('.pictures');

  var photos = generateDescriptionToPhotos(PHOTOS_AMOUNT);

  // отрисовка шаблона в документ
  var fragment = document.createDocumentFragment();

  photos.forEach(function (photo) {
    fragment.appendChild(createPhotos(photo));
  });

  photoListElement.appendChild(fragment);
};

renderPhotos();


// открываем и закрываем окно редактирования изображений
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var input = document.querySelector('#upload-file');
var popup = document.querySelector('.img-upload__overlay');
var cancel = document.querySelector('#upload-cancel');

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var onInputChange = function () {
  popup.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
};

var closePopup = function () {
  popup.classList.add('hidden');
  input.value = null;
  document.removeEventListener('keydown', onPopupEscPress);
};

input.addEventListener('change', onInputChange);

cancel.addEventListener('click', function () {
  closePopup();
});

cancel.addEventListener('keydown', function (evt) {
  evt.preventDefault();
  if (evt.keyCode === ENTER_KEYCODE) {
    closePopup();
  }
});


// отображение эффектов
var preview = popup.querySelector('.img-upload__preview');
var img = preview.querySelector('img');
var thumbnails = popup.querySelectorAll('.effects__radio');
var slider = popup.querySelector('.effect-level');
var effects = ['none', 'chrome', 'sepia', 'marvin', 'phobos', 'heat'];


var onThumbnailChange = function (thumbnail, effect) {
  thumbnail.addEventListener('change', function () {
    if (img.classList.length > 0) {
      img.classList.remove(img.classList[img.classList.length - 1]);
    }

    slider.classList.remove('hidden');

    if (thumbnail === thumbnails[0]) {
      slider.classList.add('hidden');
      // console.log(slider);
    }

    img.classList.add(effect);
  });
};


for (var i = 0; i < effects.length; i++) {
  onThumbnailChange(thumbnails[i], 'effects__preview--' + effects[i]);
  // console.log('effects__preview--' + effects[i]);
}

thumbnails[0].checked = true;
slider.classList.add('hidden');


// определение уровня насыщенности фильтров
// var INITIAL_SATURATION = 100;
var effectLevelPin = popup.querySelector('.effect-level__pin');
// var effectLevelLine = popup.querySelector('.effect-level__line');
var effectLevelDepth = popup.querySelector('.effect-level__depth');
// var effectLevelValue = popup.querySelector('.effect-level__value');

effectLevelPin.style.left = '100%';
effectLevelDepth.style.width = '100%';

// обработчик, изменяющий уровень насыщенности фильтра для изображения
effectLevelPin.addEventListener('mouseup', function () {

  // хз, что делать Т__Т
});


// масштаб
var scalePreview = popup.querySelector('.img-upload__preview');
var scaleImg = scalePreview.querySelector('img');
var scaleSmaller = popup.querySelector('.scale__control--smaller');
var scaleBigger = popup.querySelector('.scale__control--bigger');
var scaleValue = popup.querySelector('.scale__control--value');
var scale = 1;
scaleValue.value = 100 * scale + '%';


var onBiggerButtonClick = function () {
  if (scale < 1) {
    scale += 0.25;
  }
  scaleImg.style.transform = 'scale(' + scale + ')';
  scaleValue.value = 100 * scale + '%';
};

var onSmallerButtonClick = function () {
  if (scale >= 0.5) {
    scale -= 0.25;
  }
  scaleImg.style.transform = 'scale(' + scale + ')';
  scaleValue.value = 100 * scale + '%';
};


scaleBigger.addEventListener('click', onBiggerButtonClick);
scaleSmaller.addEventListener('click', onSmallerButtonClick);
