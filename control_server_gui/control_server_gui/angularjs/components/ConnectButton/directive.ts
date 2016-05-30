/// <reference path="../../index.ts" />
/// <reference path="./controller.ts" />

class ConnectButtonDirective
{
    static getDDO($scope)
    {
        return {
            restrict: "E",
            controller: ConnectButtonController,
            controllerAs: "$ctrl",
            scope: {},
            templateUrl: "./angularjs/components/ConnectButton/view.html",
            replace: true
        };
    }
}

angular.module(APP_NAME).directive("connectButton",
    [
        ConnectButtonDirective.getDDO
    ]
); 