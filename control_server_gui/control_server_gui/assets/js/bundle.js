var ApplyModeSelectorController = (function () {
    function ApplyModeSelectorController() {
        // noop.
    }
    ApplyModeSelectorController.$inject = [
    ];
    return ApplyModeSelectorController;
})();
"use strict";
var APP_NAME = "ControlServerGUI";
angular.module(APP_NAME, []);
/// <reference path="../../index.ts" />
/// <reference path="./controller.ts" />
var ApplyModeSelectorDirective = (function () {
    function ApplyModeSelectorDirective() {
    }
    ApplyModeSelectorDirective.getDDO = function ($scope) {
        return {
            restrict: "E",
            controller: ApplyModeSelectorController,
            controllerAs: "install_button",
            scope: {},
            templateUrl: "./angularjs/components/ApplyModeSelector/view.html",
            replace: true
        };
    };
    return ApplyModeSelectorDirective;
})();
angular.module(APP_NAME).directive("applyModeSelector", [
    ApplyModeSelectorDirective.getDDO
]);
var InstallButtonController = (function () {
    function InstallButtonController() {
        // noop.
    }
    InstallButtonController.$inject = [
    ];
    return InstallButtonController;
})();
/// <reference path="../../index.ts" />
/// <reference path="./controller.ts" />
var InstallButtonDirective = (function () {
    function InstallButtonDirective() {
    }
    InstallButtonDirective.getDDO = function ($scope) {
        return {
            restrict: "E",
            controller: InstallButtonController,
            controllerAs: "install_button",
            scope: {},
            templateUrl: "./angularjs/components/InstallButton/view.html",
            replace: true
        };
    };
    return InstallButtonDirective;
})();
angular.module(APP_NAME).directive("installButton", [
    InstallButtonDirective.getDDO
]);
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
    Object.defineProperty(JointSettingsModel.prototype, "current", {
        get: function () {
            return this.getValue().toString();
        },
        set: function (value) {
            if (_.isString(value)) {
                this.setValue(_.parseInt(value));
            }
            if (_.isNumber(value)) {
                this.setValue(value);
            }
        },
        enumerable: true,
        configurable: true
    });
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
var LoadButtonController = (function () {
    function LoadButtonController() {
        // noop.
    }
    LoadButtonController.$inject = [
    ];
    return LoadButtonController;
})();
/// <reference path="../../index.ts" />
/// <reference path="./controller.ts" />
var LoadButtonDirective = (function () {
    function LoadButtonDirective() {
    }
    LoadButtonDirective.getDDO = function ($scope) {
        return {
            restrict: "E",
            controller: LoadButtonController,
            controllerAs: "load_button",
            scope: {},
            templateUrl: "./angularjs/components/LoadButton/view.html",
            replace: true
        };
    };
    return LoadButtonDirective;
})();
angular.module(APP_NAME).directive("loadButton", [
    LoadButtonDirective.getDDO
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
var SetterButtonsController = (function () {
    function SetterButtonsController() {
        // noop.
    }
    SetterButtonsController.$inject = [
    ];
    return SetterButtonsController;
})();
/// <reference path="../../index.ts" />
/// <reference path="./controller.ts" />
var SetterButtonsDirective = (function () {
    function SetterButtonsDirective() {
    }
    SetterButtonsDirective.getDDO = function ($scope) {
        return {
            restrict: "E",
            controller: SetterButtonsController,
            controllerAs: "setter_buttons",
            scope: {},
            templateUrl: "./angularjs/components/SetterButtons/view.html",
            replace: true
        };
    };
    return SetterButtonsDirective;
})();
angular.module(APP_NAME).directive("setterButtons", [
    SetterButtonsDirective.getDDO
]);
/// <reference path="../../services/SharedJointSettings.Service.ts" />
var ValueChangerController = (function () {
    function ValueChangerController(joint_settings_model) {
        this.joint_settings_model = joint_settings_model;
        // noop.
    }
    ValueChangerController.$inject = [
        "SharedJointSettingsService"
    ];
    return ValueChangerController;
})();
/// <reference path="../../index.ts" />
/// <reference path="./controller.ts" />
var ValueChangerDirective = (function () {
    function ValueChangerDirective() {
    }
    ValueChangerDirective.getDDO = function () {
        return {
            restrict: "E",
            controller: ValueChangerController,
            controllerAs: "value_changer",
            scope: {},
            templateUrl: "./angularjs/components/ValueChanger/view.html",
            replace: true
        };
    };
    return ValueChangerDirective;
})();
angular.module(APP_NAME).directive("valueChanger", [
    ValueChangerDirective.getDDO
]);
