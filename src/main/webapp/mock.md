# angular-mock
Модуль используется для создания заглушек для разработки/тестирования.
Наиболее правильным путем его использования явлется подмена http запросов. Данный подход позволяет проводить разработку back-end'а и front-end'а по отдельности.

## Подготовка
Для корректной работы GUI необходим HTTP сервер (иначе браузер будет блокировать запросы к другим файлам в целях безопасноти).
Самый простой способ - установить python и запустить сервер из консоли из директории с файлом index.html

Для версии 2.*
```bash
#вместо 8000 можно использовать любой другой порт
python -m SimpleHTTPServer 8000
```
Для версии 3.*
```bash
#вместо 8000 можно использовать любой другой порт
python -m http.server 8000
```

Порт по-умолчанию: 8000

## Простой пример использования
Вся магия происходит в методе `run`

```
  myAppDev = angular.module('myAppDev', ['myApp', 'ngMockE2E']);
  myAppDev.run(function($httpBackend) {
    phones = [{name: 'phone1'}, {name: 'phone2'}];

    // returns the current list of phones
    $httpBackend.whenGET('/phones').respond(phones);

    // adds a new phone to the phones array
    $httpBackend.whenPOST('/phones').respond(function(method, url, data) {
      var phone = angular.fromJson(data);
      phones.push(phone);
      return [200, phone, {}];
    });
    $httpBackend.whenGET(/^\/templates\//).passThrough();
    //...
  });
```

Методы `whenGET`, `whenPOST`, `when` и т.д. отлавливают запрос приложения по http по конкертному методу HTTP и адресу.
Адрес может быть задан регуляркой, строкой или функцией.
[Более подробное описание методов.](https://docs.angularjs.org/api/ngMockE2E/service/$httpBackend)

## Довольно универсальный метод использования
Ниже пример использования с внесением задержек во время получения/передачи данных с помощью http, быстрым переключением на реальные сервисы и удобным допиливанием под себя.
Для использования в своем приложении необходимо:
<ol>
  <li>Прописать viewDir</li>
  <li>Прописать путь до REST API в Config.API.path</li>
  <li>Заполнить Repo.data корректными значениями. Для корректной работы рекомендуется в качестве значения поля id прописывать id++</li>
</ol>

```
myApp
    //Config
    .constant('Config', {
        //dir with view files
        viewDir: 'partials/',
        API: {
            //boolean flag for using mocks
            useMocks: true,
            //fake delay for access to REST API
            fakeDelay: 2000,
            //path to REST API
            path: '/rest/json/funny_names'
        }
    })
    .config(function ($httpProvider, Config) {
        if (!Config.API.useMocks) return;

        //logging requests/responses, adding delay
        $httpProvider.interceptors.push(function ($q, $timeout, Config, $log) {
            return {
                'request': function (config) {
                    $log.log('Requesting ' + config.url, config);
                    return config;
                },
                'response': function (response) {
                    var deferred = $q.defer();

                    if (response.config.url.indexOf(Config.viewDir) == 0) {
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
    //mocking http service
    .run(function (Config, $httpBackend, $log, APIBase, $timeout, regexEscape) {

        //Only load mocks if config says so
        if (!Config.API.useMocks) return;

        var collectionUrl = APIBase;

        //regExp for id
        var IdRegExp = /[\d\w-_]+$/.toString().slice(1, -1);

        //id used as sequence
        var id = 0;

        var Repo = {};
        //mocking data
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
                    }
                ];
        Repo.index = {};

        angular.forEach(Repo.data, function (item, key) {
            Repo.index[item.id] = item; //Index messages to be able to do efficient lookups on id
        });

        //GET all
        $httpBackend.whenGET(Config.API.path).respond(function (method, url, data, headers) {
            $log.log('Intercepted GET to tag', data);
            return [200, Repo.data, {/*headers*/}];
        });

        //GET element by id
        $httpBackend.whenGET(new RegExp(regexEscape(collectionUrl + '/') + IdRegExp)).respond(function (method, url, data, headers) {
            $log.log('Intercepted GET to tag/id');
            var id = url.match(new RegExp(IdRegExp))[0];

            var Tag = Repo.index[id];

            if (!Tag) {
                return [404, {}, {/*headers*/}];
            }


            return [200, Tag, {/*headers*/}];
        });

        //POST add/update
        $httpBackend.whenPOST(Config.API.path).respond(function (method, url, data, headers) {
            $log.log('Intercepted POST to tag', data);
            var Tag = angular.fromJson(data);

            if (!Tag.id) {
                //adding new element
                Tag.id = id++;
                Repo.data.push(Tag);
            } else {
                //update element
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

        //DELETE by id
        $httpBackend.whenDELETE(new RegExp(regexEscape(Config.API.path + '/') + IdRegExp)).respond(function (method, url, data, headers) {
            $log.log('Intercepted DELETE to tag');
            var id = url.match(new RegExp(IdRegExp))[0];

            var Tag = Repo.index[id];

            if (!Tag) {
                return [404, {}, {/*headers*/}];
            }

            delete Repo.index[Tag.id];

            var index = Repo.data.indexOf(Tag);
            Repo.data.splice(index, 1);

            return [200, Tag, {/*headers*/}];
        });

        // pass through everything else.
        $httpBackend.whenGET(/\/*/).passThrough(function () {
            $log.log('passThrough');
        });
    });
```

Данный пример подразумевает, что REST API находится на том же сервере

Если REST API находится на другом сервере, можно попробовать видоизменить [пример](https://gist.github.com/mrol/0ce10640714f1e6648fd) под себя.