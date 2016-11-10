'use strict';

(function() {
  var app = angular.module("D3-app", ['ngSanitize', 'dtv.assetCard', 'dtv.background']);


  app.controller("D3Controller", ['$scope', function($scope) {
    $scope.equipment = ['bat', 'ball', 'helmet', 'hockey stick', 'football'];

    $scope.myColors = [{
      width: 220,
      color: '#A37706'
    }, {
      width: 390,
      color: '#BD3613'
    }, {
      width: 736,
      color: '#D11C24'
    }, {
      width: 750,
      color: '#C61C6F'
    }, {
      width: 127,
      color: '#595AB7'
    }];

    d3.selectAll('.item').data($scope.myColors).style({
      'color': 'white',
      'background': function(d) {
        return d.color;
      },
      'width': function(d) {
        return d.width + 'px';
      }
    });

    d3.select('#chart2')
      .append('svg')
      .attr('width', 600)
      .attr('height', 400)
      .style('background', '#93A1A1')
      .append('rect')
      .attr('x', 200)
      .attr('y', 100)
      .attr('height', 200)
      .attr('width', 200)
      .style('fill', '#CB4B19');
    d3.select('svg')
      .append('circle')
      .attr('cx', 300)
      .attr('cy', 200)
      .attr('r', 50)
      .style('fill', '#840043');

    // bargraph data
    var bardata = [20, 30, 45, 15, 85];
    var height = 400,
      width = 600,
      barWidth = 50,
      barOffset = 5;

    d3.select('#bargraph').append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background', '#C9D7D6')
      .selectAll('rect').data(bardata)
      .enter().append('rect')
        .style('fill', '#C61C6F')
        .attr('width', barWidth)
        .attr('height', function(d) {
          return d;
        })
        .attr('x', function(d, i) {
          return i * (barWidth + barOffset);
        })
        .attr('y', function(d) {
          return height - d;
        })

  }]);

})();
