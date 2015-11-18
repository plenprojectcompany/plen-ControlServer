/// <reference path="../../services/PLENControlServer.Service.ts" />
/// <reference path="../../services/SharedJointSettings.Service.ts" />

class SetterButtonsController
{
    static $inject = [
        "PLENControlServerService",
        "SharedJointSettingsService"
    ];

    constructor(
        public ctrl_server_service: PLENControlServerService,
        public joint_settings: JointSettingsModel
    )
    {
        // noop.
    }

    onClickMax(): void
    {
        this.ctrl_server_service.setMax(
            this.joint_settings.getName(),
            this.joint_settings.getValue()
        );
    }

    onClickHome(): void
    {
        this.ctrl_server_service.setHome(
            this.joint_settings.getName(),
            this.joint_settings.getValue()
        );
    }

    onClickMin(): void
    {
        this.ctrl_server_service.setMin(
            this.joint_settings.getName(),
            this.joint_settings.getValue()
        );
    }

    onClickReset(): void
    {
        this.joint_settings.setValue(0);
        this.ctrl_server_service.applyNative(this.joint_settings.getName(), 0);
    }
} 