'use strict';

var funnyNamesApp = angular.module('funnyNamesApp', [
    'ngRoute',
    'funnyNamesControllers',
    'ui.bootstrap',
    //'phonecatFilters',
    'funnyNamesServices'
]);

funnyNamesApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/funny-names', {
                templateUrl: 'partials/funny-names.html',
                controller: 'FunnyNamesListCtrl'
            }).
            //when('/funny-names/:funnyNameId', {
            //  templateUrl: 'partials/funny-names.html',
            //  controller: 'FunnyNamesDetailCtrl'
            //}).
            otherwise({
                redirectTo: '/funny-names'
            });
    }]);

