var xhr = new XMLHttpRequest();
var imageInfo = {};
var extentsMode;
var galleryManifest;
var prevObject;
var nextObject;
var initialImage = '';
var isMobile;
var frameDims;
var details;
var isZoomed = false;
var labels = false;
var isLabelled = false;

// Image details json loaded.
xhr.onload = function(){
  if (xhr.status === 200) {
    details = JSON.parse(xhr.responseText);
    loadOptionalImages(details);
    loadImageDetails(details);
    imageInfo.aspect = details.aspect;
    $('.main-image-frame').show();
    extentsMode = "window";
    sizeFrame();

    // Hide labelss at start
    $('.labels').hide();
    var $moon = $('.moon');
    $moon.hide();

    resizeMoonImage();

    // Load the proper image
    var $img = $('#image');
    $img.attr('src', imageInfo[initialImage]);
  }
}

// Resize moon overlay, based on pixel size ratios
function resizeMoonImage(){
    var $moon = $('.moon');
    var displayPixelScale = (details.pixelscale * 2.0) * 2000 / frameDims[0];
    var pixelratio = 3.03 / displayPixelScale;
    var width = Math.round(720 * pixelratio);
    var height = Math.round(720 * pixelratio);
    var left = frameDims[0] / 2 - width / 2;
    var top = frameDims[1] / 2 - height / 2;
    $moon.css({top: top.toString()+"px"});
    $moon.css({left: left.toString()+"px"});
    $moon.height(height);
    $moon.width(width);
}

// Prepare table of image details.
function loadImageDetails(details) {
  var alias = details.alias;
  if (alias.length > 0) {
    alias = ': ' + alias;
  }

  var $caption = $('#image-caption');
  if (isMobile) {
    $caption.append(details.name);
  } else {
    $caption.append(details.name + alias);
  }

  var $description = $('#image-description');
  var extDescription = details.description + '</br></br><a href=' + details.info + '>More information...</a></br></br>';
  $description.append(extDescription);

  var $grid = $('#table-details');
  addImageDetailsRow($grid, 'Season', details.season);
  addImageDetailsRow($grid, 'Constellation', details.constellation);
  addImageDetailsRow($grid, 'Right Ascension', details.ra);
  addImageDetailsRow($grid, 'Declination', details.dec);
  addImageDetailsRow($grid, 'Distance', details.distance);
  addImageDetailsRow($grid, 'Date', details.date);
  //addImageDetailsRow($grid, 'Seeing', details.seeing);
  addImageDetailsRow($grid, 'Telescope', details.instrument);
  addImageDetailsRow($grid, 'Camera', details.camera);
  addImageDetailsRow($grid, 'Mount', details.mount);
  addImageDetailsRow($grid, 'Exposure', details.exposure);
  addImageDetailsRow($grid, 'Location', details.location);
}

// For optional images, insure that the path is fully formed.
function loadOptionalImages(descriptor) {
  // For the optionals, prepend with directory structure.
  if (descriptor.negative !== undefined) {
    var negative = descriptor.negative;
    imageInfo.negative = "gallery/objects/" + imageInfo.name + "/" + negative;
  } else {
    $('#negative').hide();
  }

  if (descriptor.overlay !== undefined) {
    imageInfo.overlay = "gallery/objects/" + imageInfo.name + "/" + descriptor.overlay;
    labels = true;
    $('#labels').attr('src', imageInfo.overlay);
  } else {
    labels = false;
    $('#show-labels').hide();
    $('.labels').hide();
  }

  if (descriptor.closeup !== undefined) {
    var zoom = descriptor.closeup;
    imageInfo.zoom = "gallery/objects/" + imageInfo.name + "/" + zoom;
  } else {
    $('#zoom').hide();
  }

  if (descriptor.special !== undefined) {
    // Special is always an array.
    var specials = descriptor.special;
    var specialCount = specials.length;
    for (var s = specialCount-1; s >= 0; s--) {
      var special = specials[s];
      special.image = "gallery/objects/" + imageInfo.name + "/" + special.image;
      $('#special').attr('title', special.description);
      var strElem = '<button id="' + special.name +
        '" class="tool" title="' + special.description + '"><span class="fa fa-star-o fa-lg"></span></button>';
      $(strElem).insertAfter('#zoom');
      var specialName = '#' + special.name;
      $(specialName).on('click', {specialImage: special.image}, function(event) {
        setZoomState(false);
        $('#image').attr('src', event.data.specialImage);
      });
    }
    imageInfo.special = specials;
  }
}

// Utility to add a row to the table
function addImageDetailsRow($grid, name, value){
  $grid.append('<tr>');
  var $row = $grid.children(':last');
  $row.append('<td class="detail-name">' + name + '</td>');
  $row.append('<td class="detail-value">' + value + '</td>');
}

$('#info').click(function() {
  var $details = $('.image-details');
  var bVisible = $details.is(':visible');
  if (bVisible) {
    $details.hide();
  } else {
    $details.show();
  }
});

$('#fit').click(function() {
  extentsMode = "image"
  frameDims = sizeFrameToImageExtents(imageInfo.aspect);
  resizeMoonImage();  
});

$('#max').click(function() {
  extentsMode = "window"
  frameDims = sizeFrameToWindowExtents(imageInfo.aspect);
  resizeMoonImage();  
});

$('#main').click(function() {
  setZoomState(false);
  $('#image').attr('src', imageInfo["extents"]);
});

$('#negative').click(function() {
  setZoomState(false);
  $('#image').attr('src', imageInfo["negative"]);
});

$('#show-labels').click(function() {
  var $labels = $('.labels');
  if ($labels.is(':visible')) {
    $labels.hide();
  } else {
    $labels.show();
  }
});

$('#moon-comparison').click(function() {
  setZoomState(false);
  var $moon = $('.moon');
  var bVisible = $moon.is(':visible');
  if (bVisible) {
    $moon.hide();
  } else {
    $moon.show();
  }
});

$('#zoom').click(function() {
  setZoomState(true);
  $('#image').attr('src', imageInfo["zoom"]);
});

$('#previous').click(function() {
  window.location.href = 'object.html?' + prevObject
});

$('#next').click(function() {
  window.location.href = 'object.html?' + nextObject
});

$(window).on('resize', function(){
  sizeFrame();
  resizeMoonImage();
});

function setZoomState(state) {
  isZoomed = state;
  if (isZoomed) {
    $('.labels').hide();
    $('.moon').hide();
    $('#show-labels').hide();
    $('#moon-comparison').hide();
  } else {
    $('#moon-comparison').show();
    if (labels) {
      $('#show-labels').show();
    }
  }
}

function sizeFrame() {
  if (extentsMode === "image") {
    frameDims = sizeFrameToImageExtents(imageInfo.aspect);
  } else {
    frameDims = sizeFrameToWindowExtents(imageInfo.aspect);
  }
}

// Entry point to set up page on load.
function loadObject(objectName) {
  // Finally, detect if mobile
  isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

  galleryManifest = JSON.parse(sessionStorage.getItem('galleryManifest'));
  // Previous - Next navigation is only supported within a gallery.
  // There are other ways to navigate to this page, in which case the galleryManifest
  // either does not exist, or does not contain an entry for this object.
  if ((galleryManifest === null) || (galleryManifest[objectName] === undefined) ) {
    $('#previous').hide();
    $('#next').hide();
  } else {
    prevObject = galleryManifest[objectName][0];
    nextObject = galleryManifest[objectName][1];
  }

  // objectName may contain &-delimited parameters
  initialImage = 'extents';
  var strParams = objectName;
  objectParams = strParams.split('&');
  if (objectParams.length > 1) {
    var objectName = objectParams[0];
    if (strParams.length > 1) {
      initialImage = objectParams[1];
    }
  }

  imageInfo.name = objectName;
  var baseObjPath = 'gallery/objects/' + objectName + '/' + objectName;
  imageInfo.extents = baseObjPath + '-2000.jpg'

  xhr.open('GET', baseObjPath + '.json', true);
  xhr.send(null);
}