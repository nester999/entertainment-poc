(function () {

app.directive('dtvModal', function ($timeout) {

  function detailsLink(scope, elem, attr) {
    console.log('loading details modal link');
    var modalTabHeaderHeight = 72,
      modalHeaderHeight = 150,
      modalHeight = angular.element($('.modal-content').height())[0],
      modalBodyContentHeight,
      modalContainerWidth,
      modalTranslateX,
      modalTranslateY;

    function closeModalTabs() {
      delete scope.modalTabs.headerStyle;
      delete scope.modalTabs.style;
      scope.tabsActive = false;
      scope.modalTabs.activeTab = '';
      scope.modalTabs.header.style = {};
      scope.modalTabs.style = {
        top: modalBodyContentHeight + 'px',
        transition: '.25s'
      }
      scope.modalBodyContent = {
        style: {
          height: modalBodyContentHeight + 'px'
        }
      };
    }

    function animateModalSlideOut(){
      modalTranslateX = (modalContainerWidth - (modalContainerWidth * .80)) / 2 + 'px';
      modalTranslateY = modalHeight + 'px';

      scope.modal.style.transform = 'translate3d(' + modalTranslateX + ', ' + modalTranslateY + ' ,0)';
      scope.modalOverlay.style = {
        opacity: 0
      };

      $timeout(function () {
        scope.ngModel = {};
        scope.active = false;
        scope.modal.style.transform = 'translate3d(' + modalTranslateX + ', 0, 0)';
        scope.modal.style.transition = '.25s';
      },100);

    }

    scope.closeModal = function () {
      if(!scope.tabsActive) {
        animateModalSlideOut();
      } else {
        closeModalTabs();
      }
    };

    scope.modalTabs = {
      tabs: [
        {
          name: 'All Episodes',
          value: 'allEpisodes'
        },{
          name: 'Clips',
          value: 'clips'
        },{
          name: 'Cast & Crew',
            value: 'castCrew'
        },{
          name: 'Similar Shows',
          value: 'similarShows'
        }
      ],
      activeTab: '',
      style: ''

    }

    if(scope.active) {
      modalContainerWidth = angular.element($('.modal').outerWidth(true))[0];
      modalHeight = angular.element($('.modal-content').outerHeight(true))[0];
      modalBodyContentHeight = modalHeight - modalHeaderHeight - modalTabHeaderHeight;
      scope.modalBodyContent = {
        style: {
          height: modalBodyContentHeight + 'px'
        }
      };
      scope.modalTabs.style = {
        top: modalBodyContentHeight + 'px',
      }
      scope.modalOverlay = {
        style: {
          opacity: 1
        }
      };

      scope.modal = {
        style: {
          backgroundImage: 'url(' + scope.ngModel.backdrop_path + ')'
        }
      };
      animateModalSlideIn();
    }

    function animateModalSlideIn(){
      modalTranslateX = (modalContainerWidth - (modalContainerWidth * .80)) / 2 + 'px';
      modalTranslateY = modalHeight + 'px';

      scope.modal.style.transform = 'translate3d(' + modalTranslateX + ', ' + modalTranslateY + ' ,0)';
      $timeout(function () {
        scope.modal.style.transform = 'translate3d(' + modalTranslateX + ', 0, 0)';
        scope.modal.style.transition = '.25s';
      },100);
    }

    scope.selectTab = function (activeTab) {
      scope.tabsActive = true;
      scope.modalTabs.activeTab = activeTab;
      scope.modalTabs.header = {
        style: {
          background: 'rgba(255,255,255,.8)'
        }
      };
      scope.modalTabs.style = {
        top: 0,
        transition: '.25s'
      }

      scope.modalBodyContent = {
        style: {
          height: 0
        }
      };
    };
    scope.watchVideo = function () {
      scope.showSeriesDetail = false;
      scope.showVideoPlayer = true;
    }

  };

  function videoPlayerLink(scope, elem, attr) {
        scope.videoSideBarNav = scope.ngModel.nav;
        console.log('loading video player link');

        $('body, html').css('overflow', 'hidden');

        var videoTabNavWidth,
          baseFontSize = 16,
          baseThumbnailWidthEm = 22,
          baseTabNavTabWidthEm = 18.5,
          videoTabContentWidth = baseFontSize * baseThumbnailWidthEm,
          videoTabNavTabWidth = baseFontSize * baseTabNavTabWidthEm,
          videoNavWidth = videoTabContentWidth + videoTabNavTabWidth,
          hideVideoTabNavTimer,
          videoListHeight;

        scope.modal = {
          style: {
            zIndex: '10000'
          },
          overlay: {
            style: {
              opacity: 1,
              backgroundColor: 'rgba(000, 000, 000, 1)'
            }
          }
        }
        scope.videoTabNav = {
          style: {
            transition: '.25s',
            transform: 'translate3d(' + videoNavWidth + 'px, 0, 0)',
            width: videoNavWidth + 'px'
          },
          tab: {
            style: {
              width: videoTabNavTabWidth + 'px'
            }
          },
          content: {
            style: {
              width: videoTabContentWidth + 'px'
            }
          },
          controls: {
            style: {
              right: 0 
            }
          }
        };

        scope.revealVideoTabNavContent = function (tab) {
          angular.forEach(scope.videoSideBarNav, function (tab) {
            tab.active = false;
          });
          tab.active = true;

          scope.videoTabNav.style.transition = '.25s';
          scope.videoTabNav.style.transform = 'translate3d(0, 0, 0)';

          scope.videoTabNav.videoList = {
            style: {
              transform: 'translate3d(0, 150px, 0)'
            }
          }

          $timeout(function () {
            displayVideoTabNavcontentList();
          }, 500)

        };

        function displayVideoTabNavcontentList() {
          videoListHeight = $(window).height() - $('.tab-content-header').outerHeight(true)
          scope.videoTabNav.videoList = {
            style: {
              transition: '.25s',
              transform: 'translate3d(0, 0, 0)',
              opacity: 1,
              overflowY: 'hidden'
            }
          }
          $timeout(function () {
            scope.videoTabNav.videoList.style.height = videoListHeight + 'px';
            scope.videoTabNav.videoList.style.overflowY = 'scroll';
          }, 500);
        }

        scope.closeVideoTabNavContent = function (tab) {
          tab.style = {
            transition: '.25s'
          };
          tab.icon = {
            style: {
              transition: '.25s',
              transform: 'rotate(0)'
            }
          };
          scope.videoTabNav.videoList = {
            style: {
              transition: '.25s',
              opacity: 0
            }
          }
         
          scope.videoTabNav.style.transition = '.25s';
          scope.videoTabNav.style.transform = 'translate3d(' + videoTabContentWidth + 'px, 0, 0)';

          $timeout(function () {
            angular.forEach(scope.videoSideBarNav, function (tab) {
              tab.active = false;
            });
          }, 250)
        }

        scope.revealVideoTabNav = function() {
          // $timeout.cancel(hideVideoTabNavTimer);
          if(!scope.videoTabNav.active) {
            scope.videoTabNav.active = true;
            scope.videoTabNav.style.transition = '.25s';
            scope.videoTabNav.style.transform = 'translate3d(' + videoTabContentWidth + 'px, 0, 0)';
            scope.videoTabNav.controls.style.opacity = 1;
            scope.videoTabNav.controls.style.transition = '.25s';

          }
        };

        scope.hideVideoTabNav = function() {
          scope.videoTabNav.active = false;
          scope.videoTabNav.style.transition = '.25s';
          scope.videoTabNav.style.transform = 'translate3d(' + videoNavWidth + 'px, 0, 0)';

          $timeout(function () {
            angular.forEach(scope.videoSideBarNav, function (tab) {
              tab.active = false;
              tab.icon = {};
            });
          }, 250);

        };

        scope.videoTabNavTabMouseEnter = function (tab) {
          tab.style = {
            transition: '.25s',
            background: '#187bf3'
          }
          tab.icon = {
            style: {
              transition: '.25s',
              transform: 'rotate(180deg)'
            }
          }
        }

        scope.videoTabNavTabMouseLeave = function (tab) {
          tab.style = {
            transition: '.25s'
          };
          if(!tab.active) {
            tab.icon = {
              style: {
                transition: '.25s',
                transform: 'rotate(0)'
              }
            };
          }
        };

        scope.closeModal = function () {
          scope.ngModel = null;
          scope.active = false;
          $('body, html').removeAttr('style');
        };

  };

  function link(scope, elem, attr) {
    scope.$watch('active', function(newValue, oldValue) {
      if(scope.ngModel) {
        switch(scope.type) {
          case 'videoPlayer':
            scope.getTemplateUrl = function () {
              return 'assets/js/directives/modal/videoPlayerTemplate.html';
            };
            videoPlayerLink(scope, elem, attr);
          break; 
          case 'details':
            scope.getTemplateUrl = function () {
              return 'assets/js/directives/modal/seriesDetailsModalTemplate.html';
            };
            detailsLink(scope, elem, attr);
        }
      }
    });



  }

  return {
    element: 'E',
    template: '<ng-include src="getTemplateUrl()"/>',
    scope: {
      ngModel: '=',
      active: '=',
      type: '='
    },
    link: link
  }
});

})();