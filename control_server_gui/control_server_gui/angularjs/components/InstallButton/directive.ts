/// <reference path="../../index.ts" />
/// <reference path="./controller.ts" />

class InstallButtonDirective
{
    static getDDO($scope)
    {
        return {
            restrict: "E",
            controller: InstallButtonController,
            controllerAs: "install_button",
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