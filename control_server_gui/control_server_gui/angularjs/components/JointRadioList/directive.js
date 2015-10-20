/// <reference path="./controller.ts" />
var app = require("../../index");
var JointRadioListDirective = (function () {
    function JointRadioListDirective() {
    }
    JointRadioListDirective.getDDO = function () {
        return {
            restrict: "E",
            controller: JointRadioListController,
            controllerAs: "joint_radio_list",
            scope: {},
            templateUrl: "./angularjs/components/JointRadioList/view.html",
            replace: true
        };
    };
    return JointRadioListDirective;
})();
angular.module(app.APP_NAME).directive("jointRadioList", [
    JointRadioListDirective.getDDO
]);
