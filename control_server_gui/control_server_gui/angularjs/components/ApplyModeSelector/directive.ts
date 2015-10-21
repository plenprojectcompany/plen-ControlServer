/// <reference path="../../index.ts" />
/// <reference path="./controller.ts" />

class ApplyModeSelectorDirective
{
    static getDDO($scope)
    {
        return {
            restrict: "E",
            controller: ApplyModeSelectorController,
            controllerAs: "install_button",
            scope: {},
            templateUrl: "./angularjs/components/ApplyModeSelector/view.html",
            replace: true
        };
    }
}

angular.module(APP_NAME).directive("applyModeSelector",
    [
        ApplyModeSelectorDirective.getDDO
    ]
);