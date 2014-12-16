/**
 * Created by ilapin on 15.12.2014.
 */
var funnyNamesControllers = angular.module('funnyNamesControllers', ['ui.bootstrap']);

funnyNamesControllers.controller('FunnyNamesListCtrl', ['$scope', 'FunnyName', '$modal', function ($scope, FunnyName, $modal) {
    $scope.funnyNames = FunnyName.query();
    $scope.orderProp = 'code';

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.open = function (size) {

        var modalInstance = $modal.open({
            templateUrl: 'partials/funny-names-detail.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            //$scope.selected = selectedItem;
        });
    };

    $scope.deleteFunnyName = function(funnyName) {
        FunnyName.delete(funnyName);
    }

}]);

funnyNamesControllers.controller('FunnyNamesDetailCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {
    $scope.funnyName = FunnyName.get({funnyNameId: $routeParams.funnyNameId});
}]);

funnyNamesControllers.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});