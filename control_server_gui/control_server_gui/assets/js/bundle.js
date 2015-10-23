var InstallButtonController = (function () {
    function InstallButtonController() {
        // noop.
    }
    InstallButtonController.$inject = [
    ];
    return InstallButtonController;
})();
"use strict";
var APP_NAME = "ControlServerGUI";
angular.module(APP_NAME, []);
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
        return this.joint_settings[this.controlling]._name;
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
var SERVER_STATE;
(function (SERVER_STATE) {
    SERVER_STATE[SERVER_STATE["DISCONNECTED"] = 0] = "DISCONNECTED";
    SERVER_STATE[SERVER_STATE["CONNECTED"] = 1] = "CONNECTED";
    SERVER_STATE[SERVER_STATE["WAITING"] = 2] = "WAITING";
})(SERVER_STATE || (SERVER_STATE = {}));
;
var PLENControlServerService = (function () {
    function PLENControlServerService($http, $rootScope) {
        var _this = this;
        this.$http = $http;
        this.$rootScope = $rootScope;
        this._state = 0 /* DISCONNECTED */;
        this._ip_addr = "localhost:17264";
        this._socket = new WebSocket('ws://' + this._ip_addr + '/cmdstream');
        this._socket.onopen = function () {
            if (_this._socket.readyState === WebSocket.OPEN) {
                _this._state = 1 /* CONNECTED */;
            }
        };
        this._socket.onmessage = function (event) {
            _this._state = 1 /* CONNECTED */;
            console.log(event.data);
        };
        this._socket.onerror = function () {
            _this._state = 0 /* DISCONNECTED */;
        };
    }
    PLENControlServerService.prototype.connect = function (success_callback) {
        var _this = this;
        if (success_callback === void 0) { success_callback = null; }
        if (this._state === 0 /* DISCONNECTED */) {
            this._state = 2 /* WAITING */;
            this.$http.get("//" + this._ip_addr + "/connect").success(function (response) {
                if (response.result === true) {
                    _this._state = 1 /* CONNECTED */;
                    if (!_.isNull(success_callback)) {
                        success_callback();
                    }
                }
                else {
                    _this._state = 0 /* DISCONNECTED */;
                }
            }).error(function () {
                _this._state = 0 /* DISCONNECTED */;
            });
        }
    };
    PLENControlServerService.prototype.disconnect = function (success_callback) {
        var _this = this;
        if (success_callback === void 0) { success_callback = null; }
        if (this._state === 1 /* CONNECTED */) {
            this._state === 2 /* WAITING */;
            this.$http.get("//" + this._ip_addr + "/disconnect").success(function (response) {
                if (response.result === true) {
                    if (!_.isNull(success_callback)) {
                        success_callback();
                    }
                }
                _this._state = 0 /* DISCONNECTED */;
            }).error(function () {
                _this._state = 1 /* CONNECTED */;
            });
        }
    };
    PLENControlServerService.prototype.install = function (json, success_callback) {
        var _this = this;
        if (success_callback === void 0) { success_callback = null; }
        if (this._state === 1 /* CONNECTED */) {
            this._state = 2 /* WAITING */;
            this.$http.post("//" + this._ip_addr + "/install", json).success(function (response) {
                _this._state = 1 /* CONNECTED */;
                if (response.result === true) {
                    if (!_.isNull(success_callback)) {
                        success_callback();
                    }
                }
            }).error(function () {
                _this._state = 0 /* DISCONNECTED */;
            }).finally(function () {
                _this.$rootScope.$broadcast("InstallFinished");
            });
        }
    };
    PLENControlServerService.prototype.applyNative = function (device, value) {
        if (this._state === 1 /* CONNECTED */) {
            this._socket.send('apply/' + device + '/' + value.toString());
            this._state = 2 /* WAITING */;
        }
    };
    PLENControlServerService.prototype.applyDiff = function (device, value) {
        if (this._state === 1 /* CONNECTED */) {
            this._socket.send('applyDiff/' + device + '/' + value.toString());
            this._state = 2 /* WAITING */;
        }
    };
    PLENControlServerService.prototype.setMin = function (device, value) {
        if (this._state === 1 /* CONNECTED */) {
            this._socket.send('setMin/' + device + '/' + value.toString());
            this._state = 2 /* WAITING */;
        }
    };
    PLENControlServerService.prototype.setMax = function (device, value) {
        if (this._state === 1 /* CONNECTED */) {
            this._socket.send('setMax/' + device + '/' + value.toString());
            this._state = 2 /* WAITING */;
        }
    };
    PLENControlServerService.prototype.setHome = function (device, value) {
        if (this._state === 1 /* CONNECTED */) {
            this._socket.send('setHome/' + device + '/' + value.toString());
            this._state = 2 /* WAITING */;
        }
    };
    PLENControlServerService.prototype.play = function (slot, success_callback) {
        var _this = this;
        if (success_callback === void 0) { success_callback = null; }
        if (this._state === 1 /* CONNECTED */) {
            this._state = 2 /* WAITING */;
            this.$http.get("//" + this._ip_addr + "/play/" + slot.toString()).success(function (response) {
                _this._state = 1 /* CONNECTED */;
                if (response.result === true) {
                    if (!_.isNull(success_callback)) {
                        success_callback();
                    }
                }
            }).error(function () {
                _this._state = 0 /* DISCONNECTED */;
            });
        }
    };
    PLENControlServerService.prototype.stop = function (success_callback) {
        var _this = this;
        if (success_callback === void 0) { success_callback = null; }
        if (this._state === 1 /* CONNECTED */) {
            this._state === 2 /* WAITING */;
            this.$http.get("//" + this._ip_addr + "/stop").success(function (response) {
                _this._state = 1 /* CONNECTED */;
                if (response.result === true) {
                    if (!_.isNull(success_callback)) {
                        success_callback();
                    }
                }
            }).error(function () {
                _this._state = 0 /* DISCONNECTED */;
            });
        }
    };
    PLENControlServerService.prototype.getStatus = function () {
        return this._state;
    };
    PLENControlServerService.$inject = [
        "$http",
        "$rootScope"
    ];
    return PLENControlServerService;
})();
angular.module(APP_NAME).service("PLENControlServerService", PLENControlServerService);
/// <reference path="../../services/PLENControlServer.Service.ts" />
/// <reference path="../../services/SharedJointSettings.Service.ts" />
var SetterButtonsController = (function () {
    function SetterButtonsController(ctrl_server_service, joint_settings) {
        this.ctrl_server_service = ctrl_server_service;
        this.joint_settings = joint_settings;
        // noop.
    }
    SetterButtonsController.prototype.onClickMax = function () {
        this.ctrl_server_service.setMax(this.joint_settings.getName(), this.joint_settings.getValue());
    };
    SetterButtonsController.prototype.onClickHome = function () {
        this.ctrl_server_service.setHome(this.joint_settings.getName(), this.joint_settings.getValue());
    };
    SetterButtonsController.prototype.onClickMin = function () {
        this.ctrl_server_service.setMin(this.joint_settings.getName(), this.joint_settings.getValue());
    };
    SetterButtonsController.prototype.onClickReset = function () {
        this.joint_settings.setValue(0);
        this.ctrl_server_service.applyNative(this.joint_settings.getName(), 0);
    };
    SetterButtonsController.$inject = [
        "PLENControlServerService",
        "SharedJointSettingsService"
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
/// <reference path="../../services/PLENControlServer.Service.ts" />
/// <reference path="../../services/SharedJointSettings.Service.ts" />
var ValueChangerController = (function () {
    function ValueChangerController(ctrl_server_service, joint_settings_model) {
        this.ctrl_server_service = ctrl_server_service;
        this.joint_settings_model = joint_settings_model;
        // noop.
    }
    ValueChangerController.prototype.onChange = function () {
        this.ctrl_server_service.applyNative(this.joint_settings_model.getName(), this.joint_settings_model.getValue());
    };
    ValueChangerController.$inject = [
        "PLENControlServerService",
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
