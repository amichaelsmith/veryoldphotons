// Method to resize main-image-frame to fit full image
// extents into window at full bleed.

function sizeFrameToImageExtents(imgAspect) {
  var winHeight = window.innerHeight;
  var winWidth = window.innerWidth;
  var winAspect = winWidth / winHeight;
  if (!imgAspect) {
    imgAspect = 1; // imageInfo.aspect
  }
  var $imgFrame = $('.main-image-frame');
  var frameHeight, frameWidth;
  if (winAspect > imgAspect) {
    frameHeight = winHeight;
    frameWidth = winHeight * imgAspect;
  } else {
    frameWidth = winWidth;
    frameHeight = winWidth / imgAspect;
  }
  $imgFrame.css({top: "0px"});
  $imgFrame.css({left: "0px"});
  $imgFrame.height(frameHeight);
  $imgFrame.width(frameWidth);
  var $imgFooter = $('.image-footer');
  $imgFooter.width(frameWidth);
  var top = frameHeight-$imgFooter.height();
  $imgFooter.css({top: top.toString()+"px"});
  $imgFooter.css({left: "0px"});
  return [frameWidth, frameHeight, 0, 0];
}

// Method to resize main-image-frame to make full use of
// the entire window at full bleed. This will usually result
// the image getting cropped.

function sizeFrameToWindowExtents(imgAspect) {
  var winHeight = window.innerHeight;
  var winWidth = window.innerWidth;
  var winAspect = winWidth / winHeight;
  if (!imgAspect) {
    imgAspect = 1; // imageInfo.aspect
  }
  var $imgFrame = $('.main-image-frame');
  var frameHeight, frameWidth, frameTop, frameLeft, footerWidth;
  if (winAspect > imgAspect) {
    frameWidth = winWidth;
    frameHeight = frameWidth / imgAspect;
    frameTop = Math.round(.5 * (winHeight - frameHeight));
    frameLeft = 0;
    footerWidth = frameWidth;
  } else {
    frameHeight = winHeight;
    frameWidth = winHeight * imgAspect;
    frameTop = 0;
    frameLeft = Math.round(.5 * (winWidth - frameWidth));
    footerWidth = winWidth;
  }
  $imgFrame.css({top: frameTop.toString()+"px"});
  $imgFrame.css({left: frameLeft.toString()+"px"});
  $imgFrame.height(frameHeight);
  $imgFrame.width(frameWidth);
  var $imgFooter = $('.image-footer');
  $imgFooter.width(footerWidth);
  var top = winHeight-$imgFooter.height()-frameTop;
  $imgFooter.css({top: top.toString()+"px"});
  var left = winWidth-$imgFooter.width()-frameLeft;
  $imgFooter.css({left: left.toString()+"px"});
  return [frameWidth, frameHeight, frameLeft, frameTop];
}
