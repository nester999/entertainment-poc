$(document).ready(function(){

  var myScroll = new IScroll('.modal-tup', {mouseWheel: true, bounceEasing: 'quadratic'});
  console.log('whattt');

  document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
});

