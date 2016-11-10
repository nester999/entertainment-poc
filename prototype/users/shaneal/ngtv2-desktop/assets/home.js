var app = angular.module("dtvModule", 
  [
    'ui.router',
    'dtv.background',
    'dtv.assetCard'
  ]
);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {

    if(window.history && window.history.pushState) {
      $locationProvider.html5Mode({
        enabled: true
      });
    }

    console.log('hellifhuierhfiuheo');


  }
]);

app.controller('AppCtrl', ['$scope', '$state',
  function($scope, $state) {

  }
]);


// app.controller("homeController", 
//   function($scope, $http, $filter, $timeout, $document, $interval, $window) {
  
//   getCarouselData();

//   function getCarouselData(){
//     $http.get("/_shared/ngtv2/data.json").success(function(data){
//       $scope.categoriesList = data;
//       cardStackLength = $scope.categoriesList.length;

//       angular.forEach($scope.categoriesList, function (category) {
//         categoryCards = category.items;
//         // addCardInStackCard = categoryCards[categoryCards.length-1];
//         // categoryCards.splice(categoryCards.length-1, 1);
//         // categoryCards.splice(0, 0, addCardInStackCard);
//       })
//     });
//   };
// });