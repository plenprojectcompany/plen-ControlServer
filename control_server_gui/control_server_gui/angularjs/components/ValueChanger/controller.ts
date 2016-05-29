/// <reference path="../../services/PLENControlServer.Service.ts" />
/// <reference path="../../services/SharedJointSettings.Service.ts" />

class ValueChangerController
{
    static $inject = [
        "PLENControlServerService",
        "SharedJointSettingsService"
    ];

    constructor(
        public ctrl_server_service: PLENControlServerService,
        public joint_settings_model: JointSettingsModel
    )
    {
        // noop.
    }

    onChange(): void
    {
        this.ctrl_server_service.applyNative(
            this.joint_settings_model.joint_handle,
            this.joint_settings_model.getValue()
        );
    }

    getJointName(): string
    {
        return this.joint_settings_model.joint_settings[this.joint_settings_model.joint_handle]["name"];
    }
}