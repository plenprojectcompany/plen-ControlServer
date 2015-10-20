"use strict";
var APP_NAME = "ControlServerGUI";
angular.module(APP_NAME, []);
var JointSettingsModel = (function () {
    function JointSettingsModel() {
        this.controlling = 0;
        this.joint_settings = [
            {
                "name": "Left Shoulder Pitch",
                "_name": "left_shoulder_pitch",
                "value": 0
            },
            {
                "name": "Left Thigh Yaw",
                "_name": "left_thigh_yaw",
                "value": 0
            },
            {
                "name": "Left Shoulder Roll",
                "_name": "left_shoulder_roll",
                "value": 0
            },
            {
                "name": "Left Elbow Roll",
                "_name": "left_elbow_roll",
                "value": 0
            },
            {
                "name": "Left Thigh Roll",
                "_name": "left_thigh_roll",
                "value": 0
            },
            {
                "name": "Left Thigh Pitch",
                "_name": "left_thigh_pitch",
                "value": 0
            },
            {
                "name": "Left Knee Pitch",
                "_name": "left_knee_pitch",
                "value": 0
            },
            {
                "name": "Left Foot Pitch",
                "_name": "left_foot_pitch",
                "value": 0
            },
            {
                "name": "Left Foot Roll",
                "_name": "left_foot_roll",
                "value": 0
            },
            {
                "name": "Right Shoulder Pitch",
                "_name": "right_shoulder_pitch",
                "value": 0
            },
            {
                "name": "Right Thigh Yaw",
                "_name": "right_thigh_yaw",
                "value": 0
            },
            {
                "name": "Right Shoulder Roll",
                "_name": "right_shoulder_roll",
                "value": 0
            },
            {
                "name": "Right Elbow Roll",
                "_name": "right_elbow_roll",
                "value": 0
            },
            {
                "name": "Right Thigh Roll",
                "_name": "right_thigh_roll",
                "value": 0
            },
            {
                "name": "Right Thigh Pitch",
                "_name": "right_thigh_pitch",
                "value": 0
            },
            {
                "name": "Right Knee Pitch",
                "_name": "right_knee_pitch",
                "value": 0
            },
            {
                "name": "Right Foot Pitch",
                "_name": "right_foot_pitch",
                "value": 0
            },
            {
                "name": "Right Foot Roll",
                "_name": "right_foot_roll",
                "value": 0
            }
        ];
        // noop.
    }
    JointSettingsModel.prototype.setValue = function (value) {
        this.joint_settings[this.controlling].value = value;
    };
    JointSettingsModel.prototype.getValue = function () {
        return this.joint_settings[this.controlling].value;
    };
    JointSettingsModel.prototype.getName = function () {
        return this.joint_settings[this.controlling].name;
    };
    JointSettingsModel.$inject = [
    ];
    return JointSettingsModel;
})();
/// <reference path="../index.ts" />
/// <reference path="../models/JointSettings.Model.ts" />
angular.module(APP_NAME).service("SharedJointSettingsService", JointSettingsModel);
/// <reference path="../../services/SharedJointSettings.Service.ts" />
var JointRadioListController = (function () {
    function JointRadioListController(joint_settings_model) {
        this.joint_settings_model = joint_settings_model;
        // noop.
    }
    JointRadioListController.$inject = [
        "SharedJointSettingsService"
    ];
    return JointRadioListController;
})();
/// <reference path="../../index.ts" />
/// <reference path="./controller.ts" />
var JointRadioListDirective = (function () {
    function JointRadioListDirective() {
    }
    JointRadioListDirective.getDDO = function ($scope) {
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
angular.module(APP_NAME).directive("jointRadioList", [
    JointRadioListDirective.getDDO
]);
var ProgressBarController = (function () {
    function ProgressBarController() {
        // noop.
    }
    ProgressBarController.$inject = [
    ];
    return ProgressBarController;
})();
/// <reference path="../../index.ts" />
/// <reference path="./controller.ts" />
var ProgressBarDirective = (function () {
    function ProgressBarDirective() {
    }
    ProgressBarDirective.getDDO = function () {
        return {
            restrict: "E",
            controller: ProgressBarController,
            controllerAs: "progress_bar",
            scope: {},
            templateUrl: "./angularjs/components/ProgressBar/view.html",
            replace: true
        };
    };
    return ProgressBarDirective;
})();
angular.module(APP_NAME).directive("progressBar", [
    ProgressBarDirective.getDDO
]);
