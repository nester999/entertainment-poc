var app = angular.module("dtvModule", ['dtv.background', 'dtv.assetCard']);

app.controller("homeController", function($scope, $http, $filter, $timeout, $document, $interval, $window){
  getCarouselData();

  function getCarouselData(){
    $http.get("/_shared/ngtv2/data.json").success(function(data){
      $scope.categoriesList = data;
      cardStackLength = $scope.categoriesList.length;

      angular.forEach($scope.categoriesList, function (category) {
        categoryCards = category.items;
        // addCardInStackCard = categoryCards[categoryCards.length-1];
        // categoryCards.splice(categoryCards.length-1, 1);
        // categoryCards.splice(0, 0, addCardInStackCard);
      })
    });
  };
});