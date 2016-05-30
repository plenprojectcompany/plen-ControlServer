/// <reference path="../../services/PLENControlServer.Service.ts" />

class ConnectButtonController
{
    static $inject = [
        "PLENControlServerService"
    ];

    constructor(public server: PLENControlServerService)
    {
        // noop.
    }

    getServerStatus(): string
    {
        if (this.server.getStatus() === SERVER_STATE.CONNECTED)
        {
            return "Connected!";
        }

        if (this.server.getStatus() === SERVER_STATE.DISCONNECTED)
        {
            return "Disconnected!";
        }

        return "Connected!";
    }

    onClick(): void
    {
        this.server.connect();
    }
} 