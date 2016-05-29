/// <reference path="../../services/SharedJointSettings.Service.ts" />

class JointSelectorController
{
    static $inject = [
        "SharedJointSettingsService"
    ];

    constructor(public joint_settings_model: JointSettingsModel)
    {
        // noop.
    }

    onClick(button_id: string): void
    {
        this.joint_settings_model.joint_handle = button_id;
    }
}