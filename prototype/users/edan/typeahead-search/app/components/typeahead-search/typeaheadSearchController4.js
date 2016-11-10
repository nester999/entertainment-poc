'use strict';

(function() {
  var app = angular.module("NgtvPhase2", ['ngSanitize', 'dtv.assetCard', 'dtv.background']);

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

  app.controller("TypeaheadSearchController", ['$scope', '$rootScope', '$filter', '$interval', '$http', '$timeout', function($scope, $rootScope, $filter, $interval, $http, $timeout) {
    var cursorAnim;

    var card = {
      "id": 177572,
      "poster_path": "https://image.tmdb.org/t/p/w300/9gm3lL8JMTTmc3W4BmNMCuRLdL8.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w500/2BXd0t9JdVqCp9sKf6kzMkr7QjB.jpg",
      "card_type": "recomendation", // 'recomendation, following, in-progress'
      "media_type": "movie", // 'movie', 'show', 'episode', 'clip', 'music-video', 'sporting-event', 'actor-personality', 'network', 'live-content'
      "title": "Guardiaffffns of the Galaxy",
      "hash_tag": "paulrudd",
      "tomato_score": 96,
      "recomended_by": "The Avengers",
      "description": "Larger-than-life and dangerously explosive, they're so funny that boys and girls will love the film in equal measure.",
      "media_duration": "3720000",
      "media_position": "1860000",
      'ppv': true,
      "subscribed": true
    };

    $scope.cards = [{}];

    $rootScope.searchItems = [];

    // Sort Search Array
    $rootScope.searchItems.sort();

    // Define Suggestions List
    $rootScope.suggestions = [];
    // When input field is empty
    $rootScope.emptyInput = true;
    $rootScope.selectedInput = false;
    $rootScope.posters = [];

    // Define Selected Suggestion Item
    $rootScope.selectedIndex = -1;

    // This builds the url to call the backend to populate the suggestions array based on the input field's text
    $scope.$watch('searchText', function(val) {
      // if searchText isn't empty or null, build json call
      if ((val) && val.length > 0) {
        var url = 'https://edm.dtvce.com/SmartSearchWS/rest/search15?searchText=' + val + '&zipCode=26105&maxResults=100&pgmWithTMSid=true&output=json&includeottcontent=true&includeottpreview=false&callback=JSON_CALLBACK';
        $http.jsonp(url).
        success(function(data, status, headers, config) {
          // filters out titles with a placeholder image poster. Only works for search results with primaryImageUrl
          var titlesWithPosters = _.filter(data.titles, function(title) {
            var titleImgLink = title.primaryImageUrl;
            return (titleImgLink.indexOf('default') === -1);
          });


          // builds an array of titles that match the current input field's text input
          var typeaheadTitles = _.filter(data.searchResult, function(title) {
            var titleContaining = angular.lowercase(title.content);
            val = angular.lowercase(val);
            return (titleContaining.indexOf(val) !== -1);
          });

          var titles = _.pluck(typeaheadTitles, 'content') || [];
          $scope.cards = [];

          // Creates a corresponding array of titles' image urls
          // var posters = _.pluck(data.titles, 'primaryImageUrl');

          // Adds poster urls to rootscope
          // $rootScope.posters = posters;

          // Adds matching search titles to scope
          $rootScope.searchItems = titles;
          $rootScope.suggestions = titles;

          console.log(titles);

          
          angular.forEach(titles, function(title) {
            var c = angular.copy(card);
            c.title = title;
            $scope.cards.push(c);
          });

          // This tween will make posters scale up just once when called, not after each new search
          // rotationY creates card flip if desired
          // TweenMax.staggerTo($(".card"), 0.7, {rotationY:0, scale:1, opacity: 1}, 0.2);



          // This tween will make posters scale up after every new search
          // timeout is necessary otherwise the posters will just appear on the page, instead of having intro animation
          $timeout(function() {
            TweenMax.staggerFromTo($('.card'), 0.7, { rotationY:-360, scale: 0, opacity: 0, y:200 }, { rotationY:0, scale: 1, opacity: 1, y:0, ease: Power3.easeOut }, 0.1);
          }, 200);

          // if at least one suggestion is returned, show the typeahead list, otherwise show actual input text
          if ($rootScope.suggestions.length > 0) {
            $('#typeahead').show();
            $('.input').css('color', 'transparent');
          } else {
            $('#typeahead').hide();
            $('.input').css('color', '#4C4C4C');
          }

        }).
        error(function(data, status, headers, config) {
          // log error
          console.log(data, status);
        });
      }
      // if input field is empty, clear suggestions, mark as empty, and hide typeahead list
      else {
        // animation when the searchbar is empty
        TweenMax.staggerTo($(".card"), 0.5, { rotationY:-180, opacity: 0, scale:0.5, ease: Power3.easeOut }, 0.2);

        $rootScope.suggestions = [];
        $rootScope.emptyInput = true;
        $('#typeahead').hide();
        $('.input').css('color', '#4C4C4C');
      }

      // makes sure the fake cursor doesn't start freaking out while typing
      clearInterval(cursorAnim);

      // if the input search is empty, show the real input cursor
      if ($rootScope.searchText === '') {
        $rootScope.emptyInput = true;
        $('.input').css('color', '#4C4C4C');
        $('#typeahead').hide();
      }
      // otherwise, if there are suggestions in the listshow the typeahead list
      else if ($rootScope.suggestions.length > 0) {
        $('#typeahead').show();
        $('.input').css('color', 'transparent');
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
      // for all titles in searchItems, if input matches the current searchItem, push it onto suggestions list
      // increment max suggestion list
      for (var i = 0; i < $rootScope.searchItems.length; i++) {
        var searchItemsSmallLetters = angular.lowercase($rootScope.searchItems[i]);
        var searchTextSmallLetters = angular.lowercase($scope.searchText);
        if (searchItemsSmallLetters.indexOf(searchTextSmallLetters) !== -1) {
          $rootScope.suggestions.push(searchItemsSmallLetters);
          myMaxSuggestionListLength += 1;
          $rootScope.typeaheadText = searchItemsSmallLetters;
          $rootScope.searchText = searchItemsSmallLetters;

          // next if statement determines maximum number of returned titles
          if (myMaxSuggestionListLength === 25) {
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


    // ================================== Keypress Functions ======================================
    
    //Function To Call on ng-keydown
    $rootScope.checkKeyDown = function(event) {
      // set empty input to false
      $rootScope.emptyInput = false;

      // if there are suggestions present, show the typeahead
      if ($rootScope.suggestions.length > 0) {
        if ($rootScope.suggestions.length !== 1) {
          if ($rootScope.searchText !== '') {
            $('.input').css('color', 'transparent');
            $('#typeahead').show();
          } 
          // otherwise, show the real input field
          else {
            $('#typeahead').hide();
            $('.input').css('color', '#4C4C4C');
          }
        }
        else if (angular.lowercase($scope.searchText) === angular.lowercase($scope.suggestions[0])){
          $('#typeahead').hide();
          $('.input').css('color', '#4C4C4C');
          $rootScope.suggestions = [];
        }
      }
      else {
        $('#typeahead').hide();
        $('.input').css('color', '#4C4C4C');
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
      else if (event.keyCode === 13 && $scope.suggestions.length > 0) {
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

    // Function To Call on ng-keyup
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

    // Function To Call on ng-click
    $rootScope.AssignValueAndHide = function(index) {
      $scope.searchText = $scope.suggestions[index];
      $rootScope.suggestions = [];
      $rootScope.selectedIndex = -1;
      // $scope.suggestions = [];
      
      $('#typeahead').hide();
      $('.input').css('color', '#4C4C4C');
      
    };
  }]);

})();
