'use strict';

(function() {
  var app = angular.module("NgtvPhase2", ['ngSanitize']);

  // create suggestion string with bold text in the matching phrase
  app.filter("boldMatch", function() {
    return function(foundItem, srchTxt) {
      // if input field is empty
      if (foundItem === '') {
        $rootScope.emptyInput = true;
        $rootScope.suggestions = [];
      }

      var foundIndex = foundItem.indexOf(srchTxt);


      // if the search text was actually found, add <b> tags around the matching text
      if (foundIndex !== -1) {
        var modifiedText = foundItem.substring(0, foundIndex) + srchTxt.bold() + foundItem.substring(foundIndex + srchTxt.length, foundItem.length);

        return modifiedText;
      }

      return "";
    };
  });

  app.controller("TypeaheadSearchController", ['$scope', '$rootScope', '$filter', '$interval', '$http', function($scope, $rootScope, $filter, $interval, $http) {
    var cursorAnim;

    $rootScope.searchItems = [];

    // Sort Array
    $rootScope.searchItems.sort();

    // Define Suggestions List
    $rootScope.suggestions = [];
    $rootScope.emptyInput = true;
    $rootScope.selectedInput = false;
    $rootScope.posters = [];

    // Define Selected Suggestion Item
    $rootScope.selectedIndex = -1;

    
    $scope.$watch('searchText', function(val) {
      console.log(val);

      if ((val) && val.length > 0) {
        // $rootScope.suggestions = [];
        var url = '/json/search?keyword=' + val;
        $http.get(url).
          // $http.get('/json/program/search', {keyword: 'shit'}).
        success(function(data, status, headers, config) {

          var titlesWithPosters = _.filter(data.titles, function(title) {
            var titleImgLink = title.primaryImageUrl;
            return titleImgLink.indexOf('default') === -1;
          });

          var titles = _.pluck(titlesWithPosters, 'title');
          var posters = _.pluck(data.titles, 'primaryImageUrl');

          posters = _.filter(posters, function(poster) {
            return (poster.indexOf('default') === -1);
          });

          // alert(JSON.stringify(posters, null, 2));
          // alert(JSON.stringify(posters, null, 2));
          $rootScope.posters = posters;
          $rootScope.searchItems = titles;
          $rootScope.suggestions = titles;

          $rootScope.$apply();

          // This tween will make posters scale up just once when called, not after each new search
          // TweenMax.staggerTo($(".poster"), 0.7, {/*rotationY:0, */scale:1, opacity: 1}, 0.2);

          // This tween will make posters scale up after every new search
          TweenMax.staggerFromTo($('.poster'), 0.7, {
            scale: 0,
            opacity: 0
          }, {
            scale: 1,
            opacity: 1,
            ease: Power3.easeOut
          }, 0.05);
          if ($rootScope.suggestions.length > 0) {
            $('#typeahead').show();
            // $('.input').css('color', 'transparent');
          } else {
            $('#typeahead').hide();
            $('.input').css('color', '#4C4C4C');
          }

        }).
        error(function(data, status, headers, config) {
          // log error
          console.log(data, status);
        });
      } else {
        $rootScope.suggestions = [];

        // animation when the searchbar is empty
        TweenMax.staggerTo($(".poster"), 0.5, { scale: 0, opacity: 0 }, 0.2);
        // $('#typeahead').hide();
        // $('.input').css('color', '#4C4C4C');
      }

      // makes sure the fake cursor doesn't start freaking out while typing
      clearInterval(cursorAnim);

      // if the input search is empty, show the real input cursor
      if ($rootScope.searchText === '') {
        $rootScope.emptyInput = true;
        $('.input').css('color', '#4C4C4C');
        $('#typeahead').hide();
      }
      // otherwise, show the fake typeahead list
      else if ($rootScope.suggestions.length > 0) {
        console.log('suggestions not empty');
        $('#typeahead').show();

        $('.input').css('color', 'transparent');
        // alert('change border');

      }

      // change the search text to be all uppercase
      $rootScope.searchText = $filter('uppercase')(val);

      // make the fake cursor blink on the first result of the typeahead search results
      cursorAnim = setInterval(function() {
        $('.p2-searchbar b:first').toggleClass('fake-cursor');
      }, 700);

    }, true); // end of watch $searchText function

    // function that runs every time there is a change to the input search field
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

          if (myMaxSuggestionListLength == 4) {
            break;
          }
        }
      }



    };

    //Keep Track Of Search Text Value During The Selection From The Suggestions List  
    $rootScope.$watch('selectedIndex', function(val) {
      if (val !== -1) {
        $rootScope.searchText = $rootScope.suggestions[$rootScope.selectedIndex];
      }
    });


    //Text Field Events
    //Function To Call on ng-keydown
    $rootScope.checkKeyDown = function(event) {
      // set empty input to false
      $rootScope.emptyInput = false;

      // if there are suggestions present, show the typeahead
      if ($scope.suggestions.length > 0) {

        if ($rootScope.searchText !== '') {
          $('.input').css('color', 'transparent');
          $('#typeahead').show();
          // otherwise, show the real input field
        } else {
          $('#typeahead').hide();
          $('.input').css('color', '#4C4C4C');
        }
      }



      // if right key is pressed and input field isn't empty, increment selected index
      if (event.keyCode === 39 && $rootScope.searchText !== '') {
        event.preventDefault();
        if ($rootScope.selectedIndex + 1 !== $rootScope.suggestions.length) {
          $rootScope.selectedIndex++;
        } else {
          $rootScope.selectedIndex = 0;
        }

        // show only the selected list item as you scroll through the suggestions
        var typeaheadList = $('#typeahead li');
        typeaheadList.hide();
        angular.element($('#typeahead li').eq($rootScope.selectedIndex).show());


        // if left key, decrement selectedIndex
      } else if (event.keyCode === 37) {
        event.preventDefault();
        if ($rootScope.selectedIndex - 1 !== -1) {
          if ($rootScope.selectedIndex === -1) {
            $rootScope.selectedIndex = $rootScope.suggestions.length - 1;
          } else {
            $rootScope.selectedIndex--;
          }
        } else {
          $('#typeahead').hide();
          $('.input').css('color', '#4C4C4C');
          $rootScope.selectedIndex = $rootScope.suggestions.length - 1;
        }


        var typeaheadList = $('#typeahead li');
        typeaheadList.hide();
        angular.element($('#typeahead li').eq($rootScope.selectedIndex).show());
      }

      //enter key, change to selected index
      else if (event.keyCode === 13) {
        if ($rootScope.selectedIndex === -1) {
          $rootScope.selectedIndex = 0;
        }

        $scope.searchText = $rootScope.suggestions[$rootScope.selectedIndex];
        $rootScope.suggestions = [];
        $rootScope.selectedIndex = -1;
        $('#typeahead').hide();
        $('.input').css('color', '#4C4C4C');
      }
      // if character is a standard text character, push the typeahead forward
      else if (event.keyCode !== 40 || event.keyCode !== 38) {
        $('#typeahead').hide();
        $('.input').css('color', '#4C4C4C');
      }
    };

    //Function To Call on ng-keyup
    $rootScope.checkKeyUp = function(event) {
      // if the key pressed was NOT delete OR backspace
      if (event.keyCode !== 8 || event.keyCode !== 46) {
        // if the input field is empty
        if ($scope.searchText === "") {
          $rootScope.suggestions = [];
          $rootScope.emptyInput = true;

          $('#typeahead').hide();
          $('.input').css('color', '#4C4C4C');
        }
      }
    };
    //======================================

    //List Item Events
    //Function To Call on ng-click
    $rootScope.AssignValueAndHide = function(index) {
      $rootScope.searchText = $rootScope.suggestions[index];
      $rootScope.suggestions = [];
    };
  }]);

})();
