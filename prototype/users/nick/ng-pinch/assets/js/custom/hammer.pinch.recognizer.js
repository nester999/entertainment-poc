var stackElem = document.getElementById('single_wrapper');
var logContainer = document.getElementById('move_velocity');

if(stackElem && logContainer){
  var mc = new Hammer.Manager(stackElem);

// create a pinch and rotate recognizer
// these require 2 pointers
  var pinch = new Hammer.Pinch();
  var rotate = new Hammer.Rotate();

// we want to detect both the same time
  pinch.recognizeWith(pinch);

// add to the Manager
  mc.add([pinch, rotate]);

  mc.on("pinch", function(ev) {
    logContainer.textContent =  'pinchin-'+ $.now();
  });

  mc.on("pinchin", function(ev) {
    logContainer.textContent =  'pinchin-'+ $.now();
  });

  mc.on("pinchout", function(ev) {
    logContainer.textContent =  'pinchout-'+ $.now();
  });
}


