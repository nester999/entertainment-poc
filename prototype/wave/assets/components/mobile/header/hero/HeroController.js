mobileApp.controller('mobile.HeroSliderController', function($scope, $stateParams){
  var pageCategory = $stateParams.pageCategory;
  var heroImages = {
    entertainment: 'movies/201508/hdr_lg__Home.jpg',
    movies : 'movies/201508/hdr_lg__Home.jpg',
    tv:      'movies/201508/hdr_lg__Mississippi_Grind.jpg'
  };
  $scope.heroUrl = 'http://www.directv.com/rwd/ent/' + heroImages[pageCategory ? pageCategory : 'entertainment'];
})