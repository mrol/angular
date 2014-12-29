/**
 * Created by ilapin on 15.12.2014.
 */
'use strict';

/* Services */

var funnyNamesServices = angular.module('funnyNamesServices', ['ngResource']);

funnyNamesServices.factory('FunnyName', ['$resource',
    function($resource){
        return $resource('/rest/json/funny_names/:id', {}, {
            query: {method:'GET', isArray:true}
        });
    }]);

//funnyNamesServices.factory("FunnyName", function($resource) {
//    return $resource("/rest/json/funny_names/:funnyNameId");
//});


//angular.module('funnyNamesServices', ['ngResource']).
//    factory('FunnyName', function($resource){
//        return $resource('funny_names/:funnyNameId', {}, {
//            query: {method:'GET', params:{phoneId:'funny_names'}, isArray:true}
//        });
//    });
