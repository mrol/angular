'use strict';

var funnyNamesApp = angular.module('funnyNamesApp', [
    'ngRoute',
    'funnyNamesControllers',
    'ui.bootstrap',
    //'phonecatFilters',
    'funnyNamesServices',
    'ngMockE2E'
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

funnyNamesApp
    .constant('Config', {
        viewDir:               'partials/',
        API: {
            useMocks:           true,
            fakeDelay:          2000,
            path:               '/rest/json/funny_names'
        }
    })
    //.config(function(Config, $provide) {
    //    //Decorate backend with awesomesauce
    //    if(Config.API.useMocks) $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
    //})
    .config(function ($httpProvider, Config) {
        if(!Config.API.useMocks) return;

        $httpProvider.interceptors.push(function ($q, $timeout, Config, $log) {
            return {
                'request': function (config) {
                    $log.log('Requesting ' + config.url, config);
                    return config;
                },
                'response': function (response) {
                    var deferred = $q.defer();

                    if(response.config.url.indexOf(Config.viewDir) == 0) {
                        //Let through views immideately
                        $log.log('Let through views immideately.', response);
                        return response;
                    }
                    //Fake delay on response from APIs and other urls
                    $log.log('Delaying response with ' + Config.API.fakeDelay + 'ms');
                    $timeout(function () {
                        deferred.resolve(response);
                    }, Config.API.fakeDelay);

                    return deferred.promise;
                }

            }
        })

    })
    .factory('APIBase', function (Config) {
        return (Config.API.path + '/');
    })
    .constant('regexEscape', function regEsc(str) {
        //Escape string to be able to use it in a regular expression
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    })
    .run(function (Config, $httpBackend, $log, APIBase, $timeout, regexEscape) {

        //Only load mocks if config says so
        if(!Config.API.useMocks) return;

        var collectionUrl = APIBase;

        $log.log('Collection url', collectionUrl);

        var IdRegExp = /[\d\w-_]+$/.toString().slice(1, -1);
        //var QueryRegExp = /[\d\w-_\.%\s]*$/.toString().slice(1, -1);

        var id = 0;

        var Repo = {};
        Repo.data = [
            {
                "name": "DDRD",
                "id": id++,
                "code": "DDRD",
                "enabled": false,
                "modifiedDate": 1382700725382,
                "modifiedBy": "sv123"
            },
            {
                "name": "DDDК",
                "id": id++,
                "code": "DDD",
                "enabled": true,
                "modifiedDate": 1383295172493,
                "modifiedBy": "sv123"
            },
            {
                "name": "DDR",
                "id": id++,
                "code": "DDR",
                "enabled": false,
                "modifiedDate": 1382700715130,
                "modifiedBy": "sv123"
            },
            {
                "name": "Re2",
                "id": id++,
                "code": "Reee",
                "enabled": true,
                "modifiedDate": 1383295182565,
                "modifiedBy": "sv123"
            },
            {
                "name": "FF",
                "id": id++,
                "code": "FF",
                "enabled": true,
                "modifiedDate": 1602406800000,
                "modifiedBy": "sv"
            }
        ];
        Repo.index = {};

        angular.forEach(Repo.data, function(item, key) {
            Repo.index[item.id] = item; //Index messages to be able to do efficient lookups on id
        });

        //GET tag/
        $httpBackend.whenGET(Config.API.path).respond(function(method, url, data, headers) {
            $log.log('Intercepted GET to tag', data);
            return [200, Repo.data, {/*headers*/}];
        });

        //GET tag/<id>
        $httpBackend.whenGET( new RegExp(regexEscape(collectionUrl + '/') + IdRegExp ) ).respond(function(method, url, data, headers) {
            $log.log('Intercepted GET to tag/id');
            var id = url.match( new RegExp(IdRegExp) )[0];

            var Tag = Repo.index[id];

            if (!Tag) {
                return [404, {} , {/*headers*/}];
            }


            return [200, Tag, {/*headers*/}];
        });

        //POST tag/
        $httpBackend.whenPOST(Config.API.path).respond(function(method, url, data, headers) {
            $log.log('Intercepted POST to tag', data);
            var Tag = angular.fromJson(data);

            if (!Tag.id) {
                Tag.id = id++;
                Repo.data.push(Tag);
            } else {
                var index;
                for (var dataObject in Repo.data) {
                    if (dataObject == Tag.id) {
                        index = dataObject;
                        break;
                    }
                }
                Repo.data[index] = Tag;
            }
            Repo.index[Tag.id] = Tag;
            return [200, Tag, {/*headers*/}];
        });

        ////GET tag/search?q=<query>
        $httpBackend.whenGET( new RegExp(regexEscape(collectionUrl + '/search?q=') + QueryRegExp ) ).respond(function(method, url, data, headers) {
            $log.log('Intercepted GET to tag/search');
            var term = url.match( new RegExp(QueryRegExp) )[0] || '';

            var hits = TagRepo.data.filter(function (tag) {
                return tag && typeof tag.text == 'string' && tag.text.toLowerCase().indexOf(term.toLowerCase()) >= 0;
            });

            return [200, hits, {/*headers*/}];
        });

        //PUT tag/<id>
        $httpBackend.whenPUT( new RegExp(regexEscape(collectionUrl + '/') + IdRegExp ) ).respond(function(method, url, data, headers) {
            $log.log('Intercepted PUT to tag');
            var id = url.match( new RegExp(IdRegExp) )[0];

            if (!Repo.index[id]) {
                return [404, {} , {/*headers*/}];
            }

            var Tag = Repo.index[id] = angular.fromJson(data);

            return [200, Tag, {/*headers*/}];
        });

        //DELETE tag/<id>
        $httpBackend.whenDELETE( new RegExp(regexEscape(Config.API.path + '/') + IdRegExp ) ).respond(function(method, url, data, headers) {
            $log.log('Intercepted DELETE to tag');
            var id = url.match( new RegExp(IdRegExp) )[0];

            var Tag = Repo.index[id];

            if (!Tag) {
                return [404, {} , {/*headers*/}];
            }

            delete Repo.index[Tag.id];

            var index = Repo.data.indexOf(Tag);
            Repo.data.splice(index, 1);

            return [200, Tag , {/*headers*/}];
        });

        // pass through everything else.
        $httpBackend.whenGET(/\/*/).passThrough(function(){
            $log.log('passThrough');
        });
    });