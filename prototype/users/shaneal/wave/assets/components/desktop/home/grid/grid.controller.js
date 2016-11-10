dtvModule.controller('GridCtrl', ['$scope', '$state', 'carousel',
  function($scope, $state, carousel) {
    $scope.carousel = carousel;

    $scope.breakPoints = [
      {maxWidth: 400,  columns:1, spacingX: 0  },
      {maxWidth: 1000, columns:3, spacingX: 20 },
      {maxWidth: 1500, columns:4, spacingX: 20 },
      {maxWidth: 3000, columns:5, spacingX: 20 }
    ];

    $scope.layout = 'grid';
  }
]);