/// <reference path="../../services/PLENControlServer.Service.ts" />

class ConnectButtonController
{
    static $inject = [
        "PLENControlServerService"
    ];

    constructor(private _server: PLENControlServerService)
    {
        // noop.
    }

    getServerStatus(): string
    {
        if (this._server.getStatus() === SERVER_STATE.CONNECTED)
        {
            return "Connected!";
        }

        if (this._server.getStatus() === SERVER_STATE.DISCONNECTED)
        {
            return "Disconnected!";
        }

        return "Connected!";
    }

    onClick(): void
    {
        this._server.connect(() => { this._server.checkVersionOfPLEN() });
    }
} 