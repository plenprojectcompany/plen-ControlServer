/// <reference path="../../index.ts" />
/// <reference path="./controller.ts" />

class ValueChangerDirective
{
    static getDDO()
    {
        return {
            restrict: "E",
            controller: ValueChangerController,
            controllerAs: "$ctrl",
            scope: {},
            templateUrl: "./angularjs/components/ValueChanger/view.html",
            replace: true
        };
    }
}

angular.module(APP_NAME).directive("valueChanger",
    [
        ValueChangerDirective.getDDO
    ]
); 