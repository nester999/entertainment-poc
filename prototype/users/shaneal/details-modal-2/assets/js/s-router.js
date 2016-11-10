var router = angular.module("ss.router", [ "ui.router" ]);

var internalStates = {}, stateRegisteredCallbacks = [];

router.config([ '$provide', '$stateProvider', '$injector', function ($provide, $stateProvider, $injector) {

  // Decorate any state attribute in order to get access to the internal state representation.
  // $stateProvider.decorator('parent', function (state, parentFn) {

  //   // Capture each internal UI-Router state representations as opposed to the user-defined state object.
  //   // The internal state is, e.g., the state returned by $state.$current as opposed to $state.current
  //   internalStates[state.self.name] = state;
  //   // Add an accessor for the internal state from the user defined state
  //   state.self.$$state = function () {
  //     return internalStates[state.self.name];
  //   };

  //   console.log(state);

  //   angular.forEach(stateRegisteredCallbacks, function(callback) { callback(state); });
  //   return parentFn(state);
  // });


  // var $state_transitionTo;
  // $provide.decorator("$state", ['$delegate', '$q', function ($state, $q) {
  //   $state_transitionTo = $state.transitionTo;
  //   $state.transitionTo = function (to, toParams, options) {
  //     // if (options.ignoreDsr) {
  //     //   ignoreDsr = options.ignoreDsr;
  //     // }

  //     console.log(to, toParams, options);

  //     return $state_transitionTo.apply($state, arguments).then(
  //       function (result) {
  //         // resetIgnoreDsr();
  //         return result;
  //       },
  //       function (err) {
  //         // resetIgnoreDsr();
  //         return $q.reject(err);
  //       }
  //     );
  //   };
  //   return $state;
  // }]);


}]);



