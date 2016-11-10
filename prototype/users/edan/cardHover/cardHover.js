$('.poster').hover(function() {
  TweenMax.fromTo(".button-container", 0.8, {
    scale: 0,
    opacity: 0,
    rotation: -360
  }, {
    display: "block",
    scale: 1,
    rotation: 0,
    opacity: 1,
    ease: Linear.easeNone
  });

  TweenMax.to(".poster", 1, {
    backgroundColor: "#333",
    ease: Power2.easeOut
  });

  TweenMax.staggerFromTo(".pop", 1.2, {
    scale: 0,
    left: 100,
    rotation: -90
  }, {
    scale: 1,
    left: 0,
    rotation: 0,
    ease: Elastic.easeOut.config(1.0, 0.3),
    delay: 0.2
  }, 0.2);

});

$('.poster').mouseleave(function() {
  TweenMax.fromTo(".button-container", 0.8, {
    scale: 1,
    rotation: 0,
    opacity: 1,
    ease: Linear.easeNone
  }, {
    
    scale: 0,
    opacity: 0,
    rotation: -360
  });

  TweenMax.staggerFromTo(".pop", 1.2, {
    left: 0,
    scale: 1,
    rotation: 0,
    ease: Elastic.easeOut.config(1.0, 0.3)
  }, {
    left: 100,
    scale: 0,
    rotation: 360
  }, 0.1);
});