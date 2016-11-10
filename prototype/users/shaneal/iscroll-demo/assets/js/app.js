$(document).ready(function() {
  init();
});

function init() {

  console.log('HELLO');

  var myScroll;

  myScroll = new IScroll('#wrapper', {
    scrollX: true,
    scrollY: false,
    momentum: false,
    snap: true,
    snapSpeed: 400,
    keyBindings: true,
    scrollbars: true,
    fadeScrollbars: false,
    probeType: 3
    // indicators: {
    //   el: document.getElementById('indicator'),
    //   resize: false
    // }
  });

  myScroll.on('scroll', updatepos);
  myScroll.on('scrollEnd', updatepos);

  document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
}

function updatepos() {
  var w = 200;

  var x = -this.x / w;
  var currentItem = Math.floor(x);

  console.log('---');
  console.log(x);
  // console.log(this.absStartX, this.distX, this.startX, this.x);
}