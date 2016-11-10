app.directive('ngSparkline', function() {
  return {
    restrict: 'A',
    require: '^ngModel',
    template: '<div class="sparkline"><h4>Weather for {{ngModel}}</h4></div>'
  }
});