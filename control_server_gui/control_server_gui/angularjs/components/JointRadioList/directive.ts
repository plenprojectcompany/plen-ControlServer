/// <reference path="../../index.ts" />
/// <reference path="./controller.ts" />

class JointRadioListDirective
{
    static getDDO($scope)
    {
        return {
            restrict: "E",
            controller: JointRadioListController,
            controllerAs: "joint_radio_list",
            scope: {},
            templateUrl: "./angularjs/components/JointRadioList/view.html",
            replace: true
        };
    }
}

angular.module(APP_NAME).directive("jointRadioList",
    [
        JointRadioListDirective.getDDO
    ]
);