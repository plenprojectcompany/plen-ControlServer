/// <reference path="../../index.ts" />
/// <reference path="./controller.ts" />

class SetterButtonsDirective
{
    static getDDO($scope)
    {
        return {
            restrict: "E",
            controller: SetterButtonsController,
            controllerAs: "setter_buttons",
            scope: {},
            templateUrl: "./angularjs/components/SetterButtons/view.html",
            replace: true
        };
    }
}

angular.module(APP_NAME).directive("setterButtons",
    [
        SetterButtonsDirective.getDDO
    ]
); 