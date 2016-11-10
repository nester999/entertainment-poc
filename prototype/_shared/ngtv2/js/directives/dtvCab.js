/* Taken from Daniel's prototype */

(function(angular) {

angular.module('dtv.cab', [])

.directive('dtvCab', [
  function() {
    return {
      restrict: 'A',
      templateUrl: '/_shared/ngtv2/templates/dtvCab.html',
      link: function($scope, $element, $attr) {
        var primaryWidth;
        var negPrimaryWidth;

        $scope.toggleCab = function() {
          if($('#cab_wrapper').hasClass('selected')) {
            closeCab();
          } else {
            openCab();
          }
        };

        function calculatePrimary() {
          var primary = $('#cab_primary');
          primaryWidth = $('#cab_primary').width();
          negPrimaryWidth = primaryWidth - (primaryWidth * 2);
        }

        function openCab() {
          // STOPS BUTTONS ACTION FROM QUEUING
          if($(':animated').length){
            return false;
          }

          $('#cab_wrapper').addClass('selected');

          $('#cab_primary,#secondary_wrapper').show(0,function(){
            calculatePrimary();
          });

          $.when(calculatePrimary()).done(function() {
            $('#cab_primary,#secondary_wrapper').children().animate({opacity:1},0).promise().done(function(){
              $('#cab_sort').css({
                width: primaryWidth,
                position: 'absolute',
                right: negPrimaryWidth,
                bottom: $('#cab_icon').height(),
                paddingBottom: parseFloat($('#cab_primary').css('padding-bottom'), 10)+1
              });
              $('#cab_primary,#secondary_wrapper').children().css({opacity:0});
              $('#cab_sort').stop().animate({opacity:1,right:0},200,function(){

              // REMOVE ALL STYLES DYNAMICALLY ASSIGNED
              $(this).removeAttr('style');

              // ANNIMATION QUEUE
              $('#cab_refine').stop().delay(100).animate({opacity:1},200);
              $('#cab_genres').stop().delay(200).animate({opacity:1},200);
              $('#cab_critically').stop().delay(300).animate({opacity:1},200);
              $('#cab_added').stop().delay(400).animate({opacity:1},200);
              $('#cab_popular').stop().delay(500).animate({opacity:1},200);
              });
            });
          });

          setTimeout(function(){
            $('body').bind('click', function() {
              closeCab();
            });
          });
        }

        function closeCab() {
          $('body').unbind('click');
          
          // STOPS BUTTONS ACTION FROM QUEUING
          if($(':animated').length){
            return false;
          }

          $('#cab_wrapper').removeClass('selected');
          calculatePrimary();

          // HIDE CAB ITEMS
          $('#cab_popular').stop().animate({opacity:0},200);
          $('#cab_added').stop().delay(100).animate({opacity:0},200);
          $('#cab_critically').stop().delay(200).animate({opacity:0},200);
          $('#cab_genres').stop().delay(300).animate({opacity:0},200);
          
          $('#cab_refine').stop().delay(400).animate({opacity:0},200,function(){
            $('#cab_sort').css({
              width: $(this).width(),
              position: 'absolute',
              bottom: $('#cab_icon').height(),
              paddingBottom: $('#cab_primary').css('padding-bottom')
            }).stop().animate({
              opacity:0, 
              right: negPrimaryWidth},200,function(){
                // REMOVE ALL STYLES DYNAMICALLY ASSIGNED
                $('#cab_primary,#secondary_wrapper').removeAttr('style').children().removeAttr('style');

              });
          });

        }
      }
    };
  }
]);

})(window.angular);