/// <reference path="../../services/SharedJointSettings.Service.ts" />

class JointRadioListController
{
    static $inject = [
        "SharedJointSettingsService"
    ];

    constructor(
        public joint_settings_model: JointSettingsModel
    )
    {
        // noop.
    }
}