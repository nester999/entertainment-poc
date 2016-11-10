'use strict';
(function() {
  var app = angular.module("NgtvPhase2", ['ngSanitize']);

  app.filter("hello", function() {
    return function(foundItem, srchTxt) {
      if(foundItem === '') {
        $rootScope.emptyInput = true;
      }
      var foundIndex = foundItem.indexOf(srchTxt);


      // if the search text was actually found, add <b> tags around the matching text
      if (foundIndex !== -1) {
        var modifiedText = foundItem.substring(0, foundIndex) + srchTxt.bold() + foundItem.substring(foundIndex + srchTxt.length, foundItem.length);
        return modifiedText;
      }


      // var srchtxt = $rootScope.searchText;
      // searchString.indexOf(srchtxt)
      return "";
    };
  });

  app.controller("TypeaheadSearchController", ['$scope', '$rootScope', '$filter', function($scope, $rootScope, $filter) {

    $rootScope.searchItems = [
      "The Walking Dead",
      "Walk The Line",
      "The Walk",
      "Fear the Walking Dead",
      "Paul Walker",
      "A Walk in the Woods",
      "A Walk Among the Tombstones"
    ];





    // Sort Array
    $rootScope.searchItems.sort();

    // Define Suggestions List
    $rootScope.suggestions = [];
    $rootScope.emptyInput = true;

    // Define Selected Suggestion Item
    $rootScope.selectedIndex = -1;

    // use filter hello on input field text
    // $rootScope.searchText = 'hey';
    // $rootScope.searchText = $filter('hello')($rootScope.searchText);

    $scope.$watch('searchText', function(val) {
      if($rootScope.searchText === '') {
        $rootScope.emptyInput = true;
      }
      $rootScope.searchText = $filter('uppercase')(val);

    }, true);

    //Function To Call On ng-change
    $rootScope.search = function() {
      $rootScope.suggestions = [];
      var myMaxSuggestionListLength = 0;
      for (var i = 0; i < $rootScope.searchItems.length; i++) {
        var searchItemsSmallLetters = angular.lowercase($rootScope.searchItems[i]);
        var searchTextSmallLetters = angular.lowercase($scope.searchText);
        if (searchItemsSmallLetters.indexOf(searchTextSmallLetters) !== -1) {
          $rootScope.suggestions.push(searchItemsSmallLetters);
          myMaxSuggestionListLength += 1;
          $rootScope.typeaheadText = searchItemsSmallLetters;
          $rootScope.searchText = searchItemsSmallLetters;

          if (myMaxSuggestionListLength == 3) {
            break;
          }
        }
      }
    };

    //Keep Track Of Search Text Value During The Selection From The Suggestions List  
    $rootScope.$watch('selectedIndex', function(val) {
      if (val !== -1) {
        $scope.searchText = $rootScope.suggestions[$rootScope.selectedIndex];
      }
    });


    //Text Field Events
    //Function To Call on ng-keydown
    $rootScope.checkKeyDown = function(event) {
      $rootScope.emptyInput = false;
      if (event.keyCode === 39) { //down key, increment selectedIndex
        event.preventDefault();
        if ($rootScope.selectedIndex + 1 !== $rootScope.suggestions.length) {
          $rootScope.selectedIndex++;
        } else {
          $rootScope.selectedIndex = 0;
        }
      } else if (event.keyCode === 37) { //up key, decrement selectedIndex
        event.preventDefault();
        if ($rootScope.selectedIndex - 1 !== -1) {
          $rootScope.selectedIndex--;
        } else {
          $rootScope.selectedIndex = $rootScope.suggestions.length - 1;
        }
      } else if (event.keyCode === 13) { //enter key, empty suggestions array
        event.preventDefault();
        $rootScope.suggestions = [];
        $rootScope.emptyInput = true;
      }
    };

    //Function To Call on ng-keyup
    $rootScope.checkKeyUp = function(event) {
      if (event.keyCode !== 8 || event.keyCode !== 46) { //delete or backspace
        if ($scope.searchText == "") {
          $rootScope.suggestions = [];
          $rootScope.emptyInput = true;
        }
      }
    };
    //======================================

    //List Item Events
    //Function To Call on ng-click
    $rootScope.AssignValueAndHide = function(index) {
      $scope.searchText = $rootScope.suggestions[index];
      $rootScope.suggestions = [];
    };
    //======================================

    $scope.tvLinks = [{
        "imgPath": "assets/img/cards/tv/walking-dead.jpg",
        "title": "Big Hero 6",
        "style": {
          "z-index": "10"
        }
      }, {
        "imgPath": "assets/img/cards/movies/avengers-age-of-ultron.jpg",
        "title": "Avengers",
        "style": {
          "z-index": "11"
        }
      }, {
        "imgPath": "assets/img/cards/movies/chappie.jpg",
        "title": "Chappie",
        "style": {
          "z-index": "12"
        }
      }, {
        "imgPath": "assets/img/cards/movies/mad-max-fury-road.jpg",
        "title": "Mad Max",
        "style": {
          "z-index": "13"
        }
      }, {
        "imgPath": "assets/img/cards/movies/san-andreas.jpg",
        "title": "San Andreas",
        "style": {
          "z-index": "14"
        }
      }, {
        "imgPath": "assets/img/cards/movies/the-thing.jpg",
        "title": "The Thing",
        "style": {
          "z-index": "16"
        }
      }, {
        "imgPath": "assets/img/cards/movies/tomorrowland.jpg",
        "title": "Tomorrowland",
        "style": {
          "z-index": "17"
        }
      },
      // "assets/img/cards/movies/avengers-age-of-ultron.jpg": "Avengers",
      // "assets/img/cards/movies/chappie.jpg": "Chappie",
      // "assets/img/cards/movies/mad-max-fury-road.jpg": "Mad Max",
      // "assets/img/cards/movies/san-andreas.jpg": "San Andreas",
      // "assets/img/cards/movies/tomorrowland.jpg": "Tomorrowland",
      // "assets/img/cards/movies/the-thing.jpg": "The Thing"
    ];
  }]);

})();
