'use strict';

angular.module('mockBackend', ['ngMockE2E'])
    .constant('Config', {
        viewDir: 'partials/',
        API: {
            useMocks: false,
            fakeDelay: 2000,
            protocol: window.location.protocol.split(':')[0],
            host: window.location.hostname,
            port: String(window.location.port || 80),
            path: '/rest/json/funny_names/'
        }
    })
    .config(function (Config, $provide) {
        //Decorate backend with awesomesauce
        if (Config.API.useMocks) {
            $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
        }
    })
    .config(function ($httpProvider, Config) {
        if (Config.API.useMocks) {
            $httpProvider.interceptors.push(function ($q, $timeout, Config, $log) {
                return {
                    'request': function (config) {
                        $log.log('Requesting ' + config.url, config);
                        return config;
                    },
                    'response': function (response) {
                        var deferred = $q.defer();

                        if (response.config.url.indexOf(Config.viewDir) == 0) return response; //Let through views immideately

                        //Fake delay on response from APIs and other urls
                        $log.log('Delaying response with ' + Config.API.fakeDelay + 'ms');
                        $timeout(function () {
                            deferred.resolve(response);
                        }, Config.API.fakeDelay);

                        return deferred.promise;
                    }

                }
            })
        }
    })
    .factory('APIBase', function (Config) {
        return (Config.API.protocol + '://' + Config.API.host + ':' + Config.API.port + Config.API.path + '/');
    })
    .constant('regexEscape', function regEsc(str) {
        //Escape string to be able to use it in a regular expression
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    })
    .run(function (Config, $httpBackend, $log, APIBase, $timeout, regexEscape) {

        //Only load mocks if config says so
        if (Config.API.useMocks) {
            var collectionUrl = APIBase + 'tags';

            var IdRegExp = /[\d\w-_]+$/.toString().slice(1, -1);
            var QueryRegExp = /[\d\w-_\.%\s]*$/.toString().slice(1, -1);

            var id = 0;

            var TagRepo = {};
            TagRepo.data = [
                {id: id++, text: 'Javascript'},
                {id: id++, text: 'Angular'},
                {id: id++, text: '.NET'},
                {id: id++, text: 'Java'},
                {id: id++, text: 'Firebase'},
                {id: id++, text: 'Ember'},
                {id: id++, text: 'generator-angular-xl'},
            ];
            TagRepo.index = {};

            angular.forEach(TagRepo.data, function (item, key) {
                TagRepo.index[item.id] = item; //Index messages to be able to do efficient lookups on id
            });

            //GET tag/
            $httpBackend.whenGET(collectionUrl).respond(function (method, url, data, headers) {
                $log.log('Intercepted GET to tag', data);
                return [200, TagRepo.data, {/*headers*/}];
            });

            //GET tag/<id>
            $httpBackend.whenGET(new RegExp(regexEscape(collectionUrl + '/') + IdRegExp)).respond(function (method, url, data, headers) {
                $log.log('Intercepted GET to tag/id');
                var id = url.match(new RegExp(IdRegExp))[0];

                var Tag = TagRepo.index[id];

                if (!Tag) {
                    return [404, {}, {/*headers*/}];
                }


                return [200, Tag, {/*headers*/}];
            });

            //POST tag/
            $httpBackend.whenPOST(collectionUrl).respond(function (method, url, data, headers) {
                $log.log('Intercepted POST to tag', data);
                var Tag = angular.fromJson(data);

                Tag.id = id++;
                TagRepo.data.push(Tag);
                TagRepo.index[Tag.id] = Tag;

                return [200, Tag, {/*headers*/}];
            });

            //GET tag/search?q=<query>
            $httpBackend.whenGET(new RegExp(regexEscape(collectionUrl + '/search?q=') + QueryRegExp)).respond(function (method, url, data, headers) {
                $log.log('Intercepted GET to tag/search');
                var term = url.match(new RegExp(QueryRegExp))[0] || '';

                var hits = TagRepo.data.filter(function (tag) {
                    return tag && typeof tag.text == 'string' && tag.text.toLowerCase().indexOf(term.toLowerCase()) >= 0;
                });

                return [200, hits, {/*headers*/}];
            });

            //POST tag with id/<id>
            $httpBackend.whenPOST(new RegExp(regexEscape(collectionUrl + '/') + IdRegExp)).respond(function (method, url, data, headers) {
                $log.log('Intercepted PUT to tag');
                var id = url.match(new RegExp(IdRegExp))[0];

                if (!TagRepo.index[id]) {
                    return [404, {}, {/*headers*/}];
                }

                var Tag = TagRepo.index[id] = angular.fromJson(data);

                return [200, Tag, {/*headers*/}];
            });

            //DELETE tag/<id>
            $httpBackend.whenDELETE(new RegExp(regexEscape(collectionUrl + '/') + IdRegExp)).respond(function (method, url, data, headers) {
                $log.log('Intercepted DELETE to tag');
                var id = url.match(new RegExp(IdRegExp))[0];

                var Tag = TagRepo.index[id];

                if (!Tag) {
                    return [404, {}, {/*headers*/}];
                }

                delete TagRepo.index[Tag.id];

                var index = TagRepo.data.indexOf(Tag);
                TagRepo.data.splice(index, 1);

                return [200, Tag, {/*headers*/}];
            });

            // pass through everything else.
            $httpBackend.whenGET(/\/*/).passThrough();
        }
    });