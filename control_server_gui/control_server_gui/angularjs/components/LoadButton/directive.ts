/// <reference path="../../index.ts" />
/// <reference path="./controller.ts" />

class LoadButtonDirective
{
    static getDDO($scope)
    {
        return {
            restrict: "E",
            controller: LoadButtonController,
            controllerAs: "load_button",
            scope: {},
            templateUrl: "./angularjs/components/LoadButton/view.html",
            replace: true
        };
    }
}

angular.module(APP_NAME).directive("loadButton",
    [
        LoadButtonDirective.getDDO
    ]
); 