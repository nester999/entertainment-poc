(function(angular) {
"use strict";

var router = angular.module("dtv.ui.router.extras", ['ct.ui.router.extras.core', 'ui.router']);
var internalStates = {};

router.config(['$provide', '$stateProvider', 
  function ($provide, $stateProvider) {
    // Decorate any state attribute in order to get access to the internal state representation.
    $stateProvider.decorator('parent', function (state, parentFn) {

      // Capture each internal UI-Router state representations as opposed to the user-defined state object.
      // The internal state is, e.g., the state returned by $state.$current as opposed to $state.current
      internalStates[state.self.name] = state;

      // Add an accessor for the internal state from the user defined state
      state.self.$$state = function () {
        return internalStates[state.self.name];
      };

      return parentFn(state);
    });
  }
]);

router.run(['$rootScope', '$injector',
  function($rootScope, $injector) {
    $rootScope.$on("$stateChangeStart", function(evt, toState, toParams, fromState, fromParams) {
      if(internalStates[toState.name].self && internalStates[toState.name].self.beforeOnEnter) {
        var res = $injector.invoke(internalStates[toState.name].self.beforeOnEnter, internalStates[toState.name].self);
        internalStates[toState.name].self = res || internalStates[toState.name].self;
      }
    });
  }
]);

})(window.angular);