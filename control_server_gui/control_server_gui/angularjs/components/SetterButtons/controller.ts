/// <reference path="../../services/PLENControlServer.Service.ts" />
/// <reference path="../../services/SharedJointSettings.Service.ts" />

class SetterButtonsController
{
    static $inject = [
        "$window",
        "PLENControlServerService",
        "SharedJointSettingsService"
    ];

    constructor(
        private _$window: ng.IWindowService,
        private _ctrl_server_service: PLENControlServerService,
        private _joint_settings: JointSettingsModel
    )
    {
        // noop.
    }

    onClickMax(): void
    {
        this._ctrl_server_service.setMax(
            this._joint_settings.joint_handle,
            this._joint_settings.getValue()
        );
    }

    onClickHome(): void
    {
        this._ctrl_server_service.setHome(
            this._joint_settings.joint_handle,
            this._joint_settings.getValue()
        );
    }

    onClickMin(): void
    {
        this._ctrl_server_service.setMin(
            this._joint_settings.joint_handle,
            this._joint_settings.getValue()
        );
    }

    onClickReset(): void
    {
        if (this._$window.confirm('Are you sure you want to reset the all joint settings?'))
        {
            this._ctrl_server_service.resetJointSettings();
        }
    }
} 