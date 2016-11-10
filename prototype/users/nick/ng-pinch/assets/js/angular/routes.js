ngtv.config(function ($routeProvider) {
  $routeProvider

    .when('/', {
      templateUrl: '/users/nick/ng-pinch/assets/js/angular/templates/single-stack.html',  //page is /dashboard#/superadmin
      controller: 'stackController'
    })


});



