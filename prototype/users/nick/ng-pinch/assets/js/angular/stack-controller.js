ngtv.controller('stackController', function ($scope, $rootScope, $log, $http, $location, $route, $routeParams, $interval, $timeout) {


  function subNavHandler(el, action, limit, option, last) {

    var newItems = [];

    // ACTION VARIABLE
    if (typeof el !== 'undefined' && el !== 0) {
      var subAction = el.attr('action');
    } else {
      var subAction = action;
    }

    // ACTION INTERPRETER
    if (typeof action !== 'undefined' && action == 'open') {
      processJson(subAction);
    } else if (typeof action !== 'undefined' && action == 'close') {
      unloadSubModule();
    } else {
      processJson(subAction);
    }

    // PROCESS AND PARSE JSON - NOTE: write redundancy safeguard
    function processJson(subAction) {

      // SET DEFAULT CANVAS
      $('#episode_inner_wrapper').show().empty();

      // JSON PARSER
      $.getJSON('assets/json/content.json', function (data) {

        switch (subAction) {
          case 'episode':
            var search = data.episode;
            break;
          case 'clip':
            var search = data.clip;
            break;
          case 'similar':
            var search = data.similar;
            break;
          case 'singlestack':
            var search = data.singlestack;
            break;
          default:
            console.log('ERROR PARSING JSON');
        }

        $scope.collection = data.singlestack;
        //console.log(data.singlestack)
        $scope.$apply()

        // PARSE FEED
        $.each(search, function (i, item) {

          if (typeof last !== 'undefined' && i <= last) {
            return true;
          }

          var eImage = item.image;
          var eDuration = item.duration;
          var eId = item.eid;
          var eTitle = item.etitle;
          var eDescription = item.edescription;


          if (subAction == 'singlestack') {
            var cardTemplate = '\
				    		<a  class="single_card active" index="' + i + '">\
								<div class="series_title medium_text">\
									' + eTitle + '\
								</div>\
								<img src="' + eImage + '" class="stack_image" alt="' + eTitle + '">\
								<div class="stack_content">\
									<div class="stack_description_wrapper">\
										<div class="stack_info_wrapper">\
											<div class="stack_time semi_large_text">\
												' + eDuration + '\
											</div>\
											<div class="stack_title din_alternate_bold semi_large_text">\
												' + eTitle + '\
											</div>\
										</div>\
										<div class="stack_description semi_large_text_reg">\
											' + ((eId !== "") ? eId + ' <span class="stack_separate">|</span> ' : '') + eDescription + '\
										</div>\
									</div>\
								</div>\
							</a>'
            //$('#single_stack').append(cardTemplate);

            newItems.push($('#single_stack a:last-child'));

          } else {
            $('#episode_inner_wrapper').append('\
					    	<a href="#" class="' + subAction + '_wrapper">\
					    		<div class="' + subAction + '_content">\
					    			<div class="' + subAction + '_image">\
					       				<img src="' + eImage + '" alt="' + eId + ' ' + eTitle + '">\
					       			</div>\
					       			<div class="' + subAction + '_description_wrapper">\
					       				<div class="' + subAction + '_info_wrapper">\
					       					' + ((subAction !== "similar") ? '<div class="' + subAction + '_minutes">' + eDuration + '</div>' : '') + '\
					       					<div class="' + subAction + '_id">' + ((subAction == "episode") ? '<span class="' + subAction + '_se din_bold">' + eId + '</span> | ' : '') + eTitle + '</div>\
					       				</div>\
				        				<div class="' + subAction + '_description">' + eDescription + '</div>\
				        				' + ((subAction == "episode") ? '<div class="' + subAction + '_elipsis">...</div>' : '') + '\
				        			</div>\
				        		</div>\
					    	</a>');
          }

          // limit to 10 - may need to change when doing an update
          if (typeof limit !== 'undefined') {
            return i < (limit - 1);
          }

        });

      }).done(function () {

        if (action == 'singlestack') {
          setZindex();

          if (option == undefined) {
            setScale();
          } else {
            var lastCard = visualEffects.length - 1;

            var card = visualEffects[lastCard];
            var cardScale = card[0];
            var cardOffset = card[1];

            $(newItems).each(function () {

              var $this = $(this);

              TweenMax.set($this, {
                scaleX: cardScale,
                scaleY: cardScale,
                y: cardOffset,
                z: 0.01
              });

            });
            $('.active').each(function (i) {

              var $this = $(this);
              var $i = i;

              var card = visualEffects[i];

              if (typeof card === 'undefined') {
                return false;
              } else {
                var cardScale = card[0];
                var cardOffset = card[1];
              }

              TweenMax.to($this, 2.5, {
                scaleX: cardScale,
                scaleY: cardScale,
                y: cardOffset,
                z: 0.01,
                force3D: true
              });

            });
            roloForward(option);

          }

          setHandler();

          /* TEST FUNCTION FOR OPENING SINGLE VIEW */
          //stackPinch();

        } else {
          loadSubModule();
        }
      });
    }


    /* NOTES - if screen is larger then just go maximum height of content or of items x amount */


    // SUB MODULE OPEN AND LOAD
    function loadSubModule() {

      // CAPTURE MODULE SIZING ON TRANSITION
      var contentModule = $('#content_module');
      contentModule
        .height(contentModule.height())
        .width(contentModule.width());

      // HANDLE SELECTED STATES
      $('.navigation_item').removeClass('selected');
      el.addClass('selected');

      // DYNAMIC HEIGHT CALCULATIONS
      var windowHeight = $(window).innerHeight();

      var singleOffset = $('#flat_view').offset();

      var infoTitle = $('.info_title');
      var infoTitleHeight = infoTitle.outerHeight();

      var subNavigation = $('#sub_navigation');
      var subnavHeight = subNavigation.outerHeight();
      var subnavPosition = subNavigation.position();
      var innerSubNavHeight = infoTitleHeight + subnavHeight;

      var contentHeight = windowHeight - singleOffset.top;


      // SET CONTENT LOCATIONS PRE ANIMATION
      $('#sub_module').show().css({visibility: 'hidden'});

      var moduleNavigation = $('#module_navigation');
      var moduleNavHeight = moduleNavigation.outerHeight();

      if (subAction == "clip" || subAction == "similar") {
        var subContentHeight = windowHeight
          - (singleOffset.top
            + innerSubNavHeight
          );
        $('#module_navigation').hide();
        $('#episode_inner_wrapper')
          .removeClass('list_view')
          .addClass('thumb_view');
      } else {
        var subContentHeight = windowHeight
          - (singleOffset.top
            + innerSubNavHeight
            + moduleNavHeight
          );
        $('#module_navigation').show();
        $('#episode_inner_wrapper')
          .removeClass('thumb_view')
          .addClass('list_view');
      }

      $('#episode_outer').height(subContentHeight);

      // TRANSITION ANIMATIONS
      $('#action_subnav').fadeIn(500);

      // SUB NAV TRANSITION ANIMATIONS
      contentModule.animate({height: contentHeight}, 250);

      $('#content_wrapper').animate({opacity: 0}, 250, function (e) {
        $(this).hide();
        $('#sub_navigation')
          .addClass('subnav_open')
          .css({top: subnavPosition.top})
          .animate({top: infoTitleHeight}, 350);

        // SUB MODULE LOADER

        $('#sub_module').css({
          top: windowHeight,
          opacity: 1,
          visibility: 'visible'
        }).delay(250).animate({top: innerSubNavHeight}, 350);

        /*
         NOTES: redo the module to have 3 internal sections
         - detect which view you are on
         - have it move left or right based on what is currently selected
         */

      });

    }

    // UNLOAD AND CLOSE
    function unloadSubModule() {

      // DYNAMIC HEIGHT - (NOTE: instead of polling at the time of function, on window resizes store in parent object)
      var contentModule = $('#content_module');
      var endContentHeight = contentModule.height();

      var contentWrapper = $('#content_wrapper');

      var subNav = $('#sub_navigation');

      // TEMPORARILY GET HEIGHT VARIABLES FOR ANIMATION BACK
      $('#action_subnav, #module_navigation').fadeOut(250);
      $('#episode_inner_wrapper').fadeOut(250, function () {
        $(this).hide().empty();
        $('#episode_outer, #content_module').removeAttr('style');
        $('.navigation_item').removeClass('selected');
        contentWrapper
          .show()
          .css({visibility: 'hidden'});
        subNav
          .removeClass('subnav_open')
          .css({top: ''});

        var contentHeight = contentModule.height();
        var contentWrapperHeight = contentWrapper.height();

        // SET FINAL HEIGHTS AND RESET MODULE
        contentWrapper.removeAttr('style').css({visibility: 'hidden'}).height(0).animate({height: contentWrapperHeight}, 250);

        contentModule.height(endContentHeight).animate({height: contentHeight}, 350, function () {
          $('#content_module, #content_wrapper, #sub_module').removeAttr('style');
          contentWrapper.hide().fadeIn(250);
        });
      });

    }

  }

  jQuery.fn.reverse = [].reverse;

// SET THE INDEX FOR ITEMS
  function setZindex() {
    var zindex = 0
    $('.single_card').reverse().each(function () {
      $(this).css({
        zIndex: zindex
      });
      zindex += 1;
    });
    zindex = 0;
  }

// SET SCALE OF EACH ITEM
  function setScale() {

    visualEffects = [];
    cachedSiblings = [];

    var initScale = 1;
    var initOffset = 380;
    var setPerspective = 0;

    $('.single_card').each(function (i) {

      $this = $(this);

      // kickstart the gpu
      TweenMax.to($this, 0.0, {
        opacity: 1.0,
        scaleX: initScale,
        scaleY: initScale,
        y: initOffset,
        z: 0.01,
        x: 0,
        force3D: true
      });

      visualEffects.push([initScale, initOffset]);
      if (i <= 1) {
        initOffset -= (70 - setPerspective);
      } else if (i >= 2 && i <= 3) {
        initOffset -= (60 - setPerspective);
      } else if (i >= 4 && i <= 6) {
        initOffset -= (56 - setPerspective);
      } else if (i >= 7) {
        initOffset -= (52 - setPerspective);
      }
      setPerspective += 4;

      initScale = parseFloat((initScale - 0.07).toFixed(2));

    });

    var initScale = 1;
    var initOffset = 380;
    var setPerspective = 0;

  }

// SET SINGLE STACK CARD HANDLERS
  function setHandler() {
    $('.single_card').off('click').on('click', function () {
      var siblingsInfront = $(this).prevAll();
      roloToCard(siblingsInfront);
    });
  }


  $timeout(function () {
//$(window).load(function () {
    subNavHandler(0, 'singlestack', 10);
//});
  }, 0);

  //Daniel's code ends

  //Nick's code begin

  function gridToStack(){
    subNavHandler(0, 'singlestack', 10);
  }

  function stackToGrid() {
    var row = 1;
    var left;

    $('.single_card.active').each(function (i) {
      var $this = $(this)
      var index = parseInt($(this).attr('index')) + 1;
      var CARD_WIDTH = 300;
      var CARD_HEIGHT = 180;
      var lastElement = (index % 3 == 0)
      var firstElement = (index % 3 == 1)
      var top = row * 180 - 180

      if (firstElement)
        left = -CARD_WIDTH;
      else
        left += CARD_WIDTH;


      TweenMax.to($this, 0.1, {
        delay: 0.05,
        scaleX: 0.5,
        scaleY: 0.5,
        y: top + 'px',
        x: left + 'px',
        z: 0.01,
        force3D: true,
        ease: SlowMo.easeIn
      });


      if (lastElement) row++;

    });

  }


  //Pinch Hammer Code

  $scope.onHammer = function onHammer(event) {
    $scope.eventType = event.type;
    if (event.type == 'pinchout') {
      stackToGrid()

    }
    if (event.type == 'pinchin') {
      gridToStack()
    }

  };


});



