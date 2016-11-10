(function () {

app.directive('dtvModal', function ($timeout) {
  return {
    element: 'E',
    templateUrl: 'assets/js/directives/modal/seriesDetailsModalTemplate.html',
    scope: {
      seriesInfo: '=ngModel',
      active: '='
    },
    link: function (scope, elem, attr) {
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
          scope.seriesInfo = {};
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

      scope.$watch('seriesInfo', function () {
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
              backgroundImage: 'url(' + scope.seriesInfo.backdrop_path + ')'
            }
          };
          animateModalSlideIn();
        }
      });

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
        // modalTabHeaderHeight = angular.element($('.modal-tabs .tabs-header').height())[0];
        // modalHeaderHeight = angular.element($('.modal-header').outerHeight(true))[0];
        // modalHeight = angular.element($('.modal-content').height())[0];

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

    }
  }
});

})();