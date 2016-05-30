/// <reference path="../../index.ts" />
/// <reference path="./controller.ts" />

class InstallButtonDirective
{
    static getDDO($scope)
    {
        return {
            restrict: "E",
            controller: InstallButtonController,
            controllerAs: "$ctrl",
            scope: {},
            templateUrl: "./angularjs/components/InstallButton/view.html",
            replace: true
        };
    }
}

angular.module(APP_NAME).directive("installButton",
    [
        InstallButtonDirective.getDDO
    ]
);