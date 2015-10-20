/// <reference path="../../index.ts" />
/// <reference path="./controller.ts" />

class ProgressBarDirective
{
    static getDDO()
    {
        return {
            restrict: "E",
            controller: ProgressBarController,
            controllerAs: "progress_bar",
            scope: {},
            templateUrl: "./angularjs/components/ProgressBar/view.html",
            replace: true
        };
    }
}

angular.module(APP_NAME).directive("progressBar",
    [
        ProgressBarDirective.getDDO
    ]
);