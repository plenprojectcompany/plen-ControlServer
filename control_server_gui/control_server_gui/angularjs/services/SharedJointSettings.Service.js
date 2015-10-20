/// <reference path="../models/JointSettings.Model.ts" />
var app = require("../index");
angular.module(app.APP_NAME).service("SharedJointSettingsService", JointSettingsModel);
