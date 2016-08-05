class ProgressBarController
{
    private _installed_progress: number = 0;


    static $inject = [
        "$scope"
    ];

    constructor($scope: ng.IScope)
    {
        $scope.$on('InstalledProgressAdvances', (event: ng.IAngularEvent, data: number) =>
        {
            this._onInstalledProgressAdvances(event, data);
        });
    }

    private _onInstalledProgressAdvances(event: ng.IAngularEvent, data: number): void
    {
        this._installed_progress = Math.round(data * 100);
    }

    getInstalledProgressPercent(): string
    {
        return this._installed_progress.toString() + '%';
    }
}