var xhr = new XMLHttpRequest();
var manifest;
var aspect;

// Gallery manifest load callback.
xhr.onload = function() {
  if (xhr.status === 200) {
    manifest = JSON.parse(xhr.responseText);
  }
  loadRandomImage();
}

function loadRandomImage() {
  var randindex = Math.round(Math.random() * manifest.image.length-1);
  randindex = Math.max(randindex, 0);
  var randObject = manifest.image[randindex].name;
  aspect = manifest.image[randindex].aspect;
  var imgURL = "gallery/objects/" + randObject + "/" + randObject + "-2000.jpg";
  loadBackgroundImage(imgURL, aspect);
}

// The method picks a random object from the collections
// and uses it to load a background image.
function loadBackgroundImage(imgURL) {
  var $img = $('#image');
  $img.attr('src', imgURL);
  $('.main-image-frame').show();
  sizeFrameToWindowExtents(aspect);
  $('body').click(function () {
    window.location.href = 'galleries.html';
  })
}

$(window).on('resize', function(){
  var win = $(this); //this = window
  sizeFrameToWindowExtents(aspect);
});

// Page load for the landing page.
function loadLandingPage() {
  loadGallery('new');
  var imgURL = 'gallery/objects/Venus-Jupiter-Conjunction/Venus-Jupiter-Conjunction-2000.jpg';
  aspect = 1.5;
  loadBackgroundImage(imgURL);
  // var manifestFile = 'gallery/collections/marquee.json';
  // xhr.open('GET', manifestFile, true);
  // xhr.send(null);
}