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
    comment.message = getRandomElement(commentsList);
    var isAdditionalComment = getRandomInteger(0, 1); // определяем, будет ли вторая часть комментария
    // comment.isAdd = isAdditionalComment;

    if (isAdditionalComment) {
      var additionalComment = getRandomElement(commentsList);

      // исключаем повторные комментарии
      while (additionalComment === comment.message) {
        additionalComment = getRandomElement(commentsList);
      }
      comment.message += ' ' + additionalComment;
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
    var likesAmount = getRandomInteger(15, 200);
    photo.likes = likesAmount;
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
