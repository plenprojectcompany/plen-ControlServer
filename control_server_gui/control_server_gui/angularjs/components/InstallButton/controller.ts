/// <reference path="../../services/PLENControlServer.Service.ts" />
/// <reference path="../../services/SharedMotionStore.Service.ts" />

class InstallButtonController
{
    private _progress_count: number = 0.0;
    private _motions_count: number = 0;

    static $inject = [
        "$scope",
        "$rootScope",
        "PLENControlServerService",
        "SharedMotionStoreService"
    ];

    constructor(
        $scope: ng.IScope,
        public $rootScope: ng.IRootScopeService, 
        public ctrl_server_service: PLENControlServerService,
        public motion_store: MotionStore
    )
    {
        $scope.$on("InstallFinished", () => { this._onInstallFinished() });
    }

    private _onInstallFinished()
    {
        this._progress_count++;

        this.$rootScope.$broadcast(
            'InstalledProgressAdvances',
            this._progress_count / this._motions_count
        );

        if (this._progress_count === this._motions_count)
        {
            alert('Installation of all motion files was finished!');

            this.$rootScope.$broadcast('InstalledProgressAdvances', 0);
        }
    }

    onClick(): void 
    {
        this._progress_count = 0.0;
        this._motions_count = this.motion_store.motions.length;

        var installRoutine = () =>
        {
            if (this.motion_store.motions.length === 0)
            {
                return;
            }

            if (this.ctrl_server_service.getStatus() !== SERVER_STATE.CONNECTED)
            {
                return;
            }

            this.ctrl_server_service.install(this.motion_store.motions.pop(), installRoutine);
        };

        installRoutine();
    }

    getStoredMotionsCount(): string
    {
        return (this.motion_store.motions.length) ? ' (' + this.motion_store.motions.length.toString() + ')' : '';
    }
}