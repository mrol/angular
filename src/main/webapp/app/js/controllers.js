/**
 * Created by ilapin on 15.12.2014.
 */
var funnyNamesControllers = angular.module('funnyNamesControllers', ['ui.bootstrap']);

funnyNamesControllers.controller('FunnyNamesDetailCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {
    $scope.funnyName = FunnyName.get({funnyNameId: $routeParams.funnyNameId});
}]);

funnyNamesControllers.controller('FunnyNamesListCtrl', ['$scope', 'FunnyName', '$modal', function ($scope, FunnyName, $modal) {
    $scope.funnyNames = FunnyName.query();
    $scope.orderProp = 'code';

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.open = function (funnyName) {

        var modalInstance = $modal.open({
            templateUrl: 'partials/funny-names-detail.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                //items: function () {
                //    return $scope.items;
                //}
                funnyName: function () {
                    return funnyName;
                }
                //FunnyName: function () {
                //    return FunnyName;
                //}
            }
        });

        modalInstance.result.then(function (selectedItem) {
            //$scope.selected = selectedItem;
            $scope.funnyNames = FunnyName.query();
        });
    };

    $scope.funnyNames = FunnyName.query();
    $scope.deleteFunnyName = function(funnyName) {
        var funnyNameId = funnyName.id;
        FunnyName.delete({ id: funnyNameId }, function (success) {
            $scope.funnyNames = FunnyName.query();
        });
    }

}]);

funnyNamesControllers.controller('ModalInstanceCtrl', function ($scope, $modalInstance, funnyName, FunnyName) {

    //$scope.items = items;
    //$scope.selected = {
    //    item: $scope.items[0]
    //};
    //var mode;
    //if (funnyName == undefined) {
    //    mode = 'add';
    //} else {
    //    mode = 'upd';
    //}

    $scope.funnyName = funnyName;

    $scope.ok = function () {
        FunnyName.save($scope.funnyName);
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    //$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    //$scope.format = $scope.formats[0];
});