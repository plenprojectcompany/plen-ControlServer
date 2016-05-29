"use strict";
var APP_NAME = "ControlServerGUI";
angular.module(APP_NAME, []);
/// <reference path="../index.ts" />
var SERVER_STATE;
(function (SERVER_STATE) {
    SERVER_STATE[SERVER_STATE["DISCONNECTED"] = 0] = "DISCONNECTED";
    SERVER_STATE[SERVER_STATE["CONNECTED"] = 1] = "CONNECTED";
    SERVER_STATE[SERVER_STATE["WAITING"] = 2] = "WAITING";
})(SERVER_STATE || (SERVER_STATE = {}));
;
var PLENControlServerService = (function () {
    function PLENControlServerService($http, $rootScope) {
        this.$http = $http;
        this.$rootScope = $rootScope;
        this._state = 0 /* DISCONNECTED */;
        this._socket = null;
        this._ip_addr = "localhost:17264";
        this.connect();
    }
    PLENControlServerService.prototype.connect = function (success_callback) {
        var _this = this;
        if (success_callback === void 0) { success_callback = null; }
        if (this._state === 0 /* DISCONNECTED */) {
            this._state = 2 /* WAITING */;
            this.$http.get("//" + this._ip_addr + "/v2/connect").success(function (response) {
                if (response.data.result === true) {
                    _this._state = 1 /* CONNECTED */;
                    _this._createWebSocket();
                    if (!_.isNull(success_callback)) {
                        success_callback();
                    }
                }
                else {
                    _this._state = 0 /* DISCONNECTED */;
                    alert("USB connection has been disconnected!");
                }
            }).error(function () {
                _this._state = 0 /* DISCONNECTED */;
                alert("The control-server hasn't run.");
            });
        }
    };
    PLENControlServerService.prototype.install = function (json, success_callback) {
        var _this = this;
        if (success_callback === void 0) { success_callback = null; }
        if (this._state === 1 /* CONNECTED */) {
            this._state = 2 /* WAITING */;
            this.$http.put("//" + this._ip_addr + "/v2/install", json).success(function (response) {
                _this._state = 1 /* CONNECTED */;
                if (response.data.result === true) {
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
            console.log("setHome");
            this._socket.send('setHome/' + device + '/' + value.toString());
            this._state = 2 /* WAITING */;
        }
    };
    PLENControlServerService.prototype.getStatus = function () {
        return this._state;
    };
    PLENControlServerService.prototype._createWebSocket = function () {
        var _this = this;
        if (!_.isNull(this._socket)) {
            this._socket.close();
            this._socket = null;
        }
        this._socket = new WebSocket('ws://' + this._ip_addr + '/v2/cmdstream');
        this._socket.onopen = function () {
            if (_this._socket.readyState === WebSocket.OPEN) {
                _this._state = 1 /* CONNECTED */;
                _this.$rootScope.$apply();
            }
        };
        this._socket.onmessage = function (event) {
            if (event.data == "False") {
                if (_this._state === 2 /* WAITING */) {
                    _this._state = 0 /* DISCONNECTED */;
                    _this.$rootScope.$apply();
                    alert("USB connection has been disconnected!");
                }
            }
            else {
                _this._state = 1 /* CONNECTED */;
            }
        };
        this._socket.onerror = function () {
            _this._state = 0 /* DISCONNECTED */;
            _this.$rootScope.$apply();
            alert("The control-server hasn't run.");
        };
    };
    PLENControlServerService.$inject = [
        "$http",
        "$rootScope"
    ];
    return PLENControlServerService;
})();
angular.module(APP_NAME).service("PLENControlServerService", PLENControlServerService);
/// <reference path="../../services/PLENControlServer.Service.ts" />
var ConnectButtonController = (function () {
    function ConnectButtonController(server) {
        this.server = server;
        // noop.
    }
    ConnectButtonController.prototype.getServerStatus = function () {
        if (this.server.getStatus() === 1 /* CONNECTED */) {
            return "Connected!";
        }
        if (this.server.getStatus() === 0 /* DISCONNECTED */) {
            return "Disconnected!";
        }
        return "Connected!";
    };
    ConnectButtonController.prototype.onClick = function () {
        this.server.connect();
    };
    ConnectButtonController.$inject = [
        "PLENControlServerService"
    ];
    return ConnectButtonController;
})();
/// <reference path="../../index.ts" />
/// <reference path="./controller.ts" />
var ConnectButtonDirective = (function () {
    function ConnectButtonDirective() {
    }
    ConnectButtonDirective.getDDO = function ($scope) {
        return {
            restrict: "E",
            controller: ConnectButtonController,
            controllerAs: "$ctrl",
            scope: {},
            templateUrl: "./angularjs/components/ConnectButton/view.html",
            replace: true
        };
    };
    return ConnectButtonDirective;
})();
angular.module(APP_NAME).directive("connectButton", [
    ConnectButtonDirective.getDDO
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
            controllerAs: "$ctrl",
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
        this.joint_handle = "left_shoulder_pitch";
        this.joint_settings = {
            "left_shoulder_pitch": {
                "name": "Left Shoulder Pitch",
                "value": 0
            },
            "left_thigh_yaw": {
                "name": "Left Thigh Yaw",
                "value": 0
            },
            "left_shoulder_roll": {
                "name": "Left Shoulder Roll",
                "value": 0
            },
            "left_elbow_roll": {
                "name": "Left Elbow Roll",
                "value": 0
            },
            "left_thigh_roll": {
                "name": "Left Thigh Roll",
                "value": 0
            },
            "left_thigh_pitch": {
                "name": "Left Thigh Pitch",
                "value": 0
            },
            "left_knee_pitch": {
                "name": "Left Knee Pitch",
                "value": 0
            },
            "left_foot_pitch": {
                "name": "Left Foot Pitch",
                "value": 0
            },
            "left_foot_roll": {
                "name": "Left Foot Roll",
                "value": 0
            },
            "right_shoulder_pitch": {
                "name": "Right Shoulder Pitch",
                "value": 0
            },
            "right_thigh_yaw": {
                "name": "Right Thigh Yaw",
                "value": 0
            },
            "right_shoulder_roll": {
                "name": "Right Shoulder Roll",
                "value": 0
            },
            "right_elbow_roll": {
                "name": "Right Elbow Roll",
                "value": 0
            },
            "right_thigh_roll": {
                "name": "Right Thigh Roll",
                "value": 0
            },
            "right_thigh_pitch": {
                "name": "Right Thigh Pitch",
                "value": 0
            },
            "right_knee_pitch": {
                "name": "Right Knee Pitch",
                "value": 0
            },
            "right_foot_pitch": {
                "name": "Right Foot Pitch",
                "value": 0
            },
            "right_foot_roll": {
                "name": "Right Foot Roll",
                "value": 0
            }
        };
        // noop.
    }
    JointSettingsModel.prototype.setValue = function (value) {
        this.joint_settings[this.joint_handle].value = value;
    };
    JointSettingsModel.prototype.getValue = function () {
        return this.joint_settings[this.joint_handle].value;
    };
    Object.defineProperty(JointSettingsModel.prototype, "current", {
        get: function () {
            return this.getValue();
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
            controllerAs: "$ctrl",
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
/// <reference path="../../services/SharedJointSettings.Service.ts" />
var JointSelectorController = (function () {
    function JointSelectorController(joint_settings_model) {
        this.joint_settings_model = joint_settings_model;
        // noop.
    }
    JointSelectorController.prototype.onClick = function (button_id) {
        this.joint_settings_model.joint_handle = button_id;
    };
    JointSelectorController.$inject = [
        "SharedJointSettingsService"
    ];
    return JointSelectorController;
})();
/// <reference path="../../index.ts" />
/// <reference path="./controller.ts" />
var JointSelectorDirective = (function () {
    function JointSelectorDirective() {
    }
    JointSelectorDirective.getDDO = function () {
        return {
            restrict: "E",
            controller: JointSelectorController,
            controllerAs: "$ctrl",
            scope: {},
            templateUrl: "./angularjs/components/JointSelector/view.html",
            replace: true,
            link: function ($scope, $element, attrs, $ctrl) {
                var $joint_buttons = $element.find('.joint_button');
                /*!
                    @attention
                    You shouldn't use the arrow-function sugar syntax therefore 'this' binding by jQuery will be broken.
                */
                $joint_buttons.on('click', function () {
                    $joint_buttons.removeClass('is-selected');
                    $(this).addClass('is-selected');
                    $ctrl.onClick($(this).attr('id'));
                    $scope.$apply();
                });
            }
        };
    };
    return JointSelectorDirective;
})();
angular.module(APP_NAME).directive("jointSelector", [
    JointSelectorDirective.getDDO
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
            controllerAs: "$ctrl",
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
            controllerAs: "$ctrl",
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
/// <reference path="../../services/PLENControlServer.Service.ts" />
/// <reference path="../../services/SharedJointSettings.Service.ts" />
var SetterButtonsController = (function () {
    function SetterButtonsController(ctrl_server_service, joint_settings) {
        this.ctrl_server_service = ctrl_server_service;
        this.joint_settings = joint_settings;
        // noop.
    }
    SetterButtonsController.prototype.onClickMax = function () {
        this.ctrl_server_service.setMax(this.joint_settings.joint_handle, this.joint_settings.getValue());
    };
    SetterButtonsController.prototype.onClickHome = function () {
        this.ctrl_server_service.setHome(this.joint_settings.joint_handle, this.joint_settings.getValue());
    };
    SetterButtonsController.prototype.onClickMin = function () {
        this.ctrl_server_service.setMin(this.joint_settings.joint_handle, this.joint_settings.getValue());
    };
    SetterButtonsController.prototype.onClickReset = function () {
        this.joint_settings.setValue(0);
        this.ctrl_server_service.applyNative(this.joint_settings.joint_handle, 0);
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
            controllerAs: "$ctrl",
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
        this.ctrl_server_service.applyNative(this.joint_settings_model.joint_handle, this.joint_settings_model.getValue());
    };
    ValueChangerController.prototype.getJointName = function () {
        return this.joint_settings_model.joint_settings[this.joint_settings_model.joint_handle]["name"];
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
            controllerAs: "$ctrl",
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
