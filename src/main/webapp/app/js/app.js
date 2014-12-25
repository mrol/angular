'use strict';

var funnyNamesApp = angular.module('funnyNamesApp', [
    'ngRoute',
    'funnyNamesControllers',
    'ui.bootstrap',
    //'phonecatFilters',
    'funnyNamesServices',
    //'ngMockE2E'
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

//funnyNamesApp.run(function ($httpBackend) {
//    $httpBackend.
//        whenGET(/.*/).
//        respond(200, {some: 'any'}, {header: 'one'});
//
//    //$httpBackend.
//    //    whenGET(/.*/).
//    //    passThrough();
//});