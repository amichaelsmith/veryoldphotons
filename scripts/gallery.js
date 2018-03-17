var xhr = new XMLHttpRequest();
var category = '';
var galleryManifest = {};

// Array shuffler, useful to randomize the "All" gallery.
// Fisher-Yates shuffle, no side effects.
function shuffleArray(a) {
  var i = a.length, t, j;
  a = a.slice();
  while (--i) t = a[i], a[i] = a[j = ~~(Math.random() * (i+1))], a[j] = t;
  return a;
}

// Gallery manifest load callback.
xhr.onload = function() {
  if (xhr.status === 200) {
    manifest = JSON.parse(xhr.responseText);

    // TODO: this special case doesn't really belong here.
    if (category === "All") {
      manifest.image = shuffleArray(manifest.image);
    }

    // Verify that manifest is fully populated.
    validateManifest(manifest);

    var $grid = $('#grid');

    // Setup gallery title
    // Convert dashes to spaces, if present
    var gallery = category.replace('-', ' ');
    $grid.before('<h1>' + gallery + '</h1>');

    $grid.prepend('<tr>');
    var $row = $('tr:last');
    var imageCount = manifest.image.length;
    for (var index=0; index<imageCount; index++) {
      var object = manifest.image[index];
      var name = object.name;
      $row.append('<td width="200" class="gallery-thumbnail"></td>');
      var $cell = $row.children(':last');
      $cell.append('<a href="object.html?' + name + '"></a>');
      var $anchor = $cell.children('a');
      $anchor.append('<img class="thumbnail-image" src="' + manifest.image[index].thumbnail +
        '" width="200" height="200" alt="' + name + '" index="' + index +'">');
      $cell.append('<p class="thumbnail-caption">' + manifest.image[index].displayName + '</p>');
    }
    defineEventHandlers(manifest);
  }
}

// Method to auto-populate required fields from the minimal category manifest.
function validateManifest(manifest) {
  var imageCount = manifest.image.length;
  var image = manifest.image;

  // Insure that the three mandatory files are defined (extents, thumbnail, details)
  for (var index=0; index<imageCount; index++) {
    var baseName = "gallery/objects/" + image[index].name + "/" + image[index].name;
    if (image[index].thumbnail === undefined) {
      image[index].thumbnail = baseName + "-200.jpg"
    }
    var prev = (index === 0) ? imageCount-1 : index-1;
    var next = (index === imageCount-1) ? 0 : index+1;
    galleryManifest[manifest.image[index].name] = [
      manifest.image[prev].name,
      manifest.image[next].name ];
  }
}

// Setup up event handlers after page is fully loaded.
function defineEventHandlers(manifest) {
  $('img').on('click', function(e) {
    if (window.sessionStorage) {
      sessionStorage.setItem('galleryManifest', JSON.stringify(galleryManifest));
    } else {
      console.log('sessionStorage not available');
    }
  });
}

// This method gets fired when page is loaded.
function loadGallery(gallery) {
  category = gallery.toLowerCase();
  var manifestFile = 'gallery/collections/' + category + '.json';
  xhr.open('GET', manifestFile, true);
  xhr.send(null);
}

