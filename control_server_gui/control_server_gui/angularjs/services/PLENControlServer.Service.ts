/// <reference path="../index.ts" />

enum SERVER_STATE
{
    DISCONNECTED,
    CONNECTED,
    WAITING
};

class PLENControlServerService
{
    private _state: SERVER_STATE = SERVER_STATE.DISCONNECTED;
    private _socket: WebSocket = null;
    private _ip_addr: string = "localhost:17264";

    static $inject = [
        "$http",
        "$rootScope"
    ];

    constructor(
        public $http: ng.IHttpService,
        public $rootScope: ng.IRootScopeService
    )
    {
        this.connect();
    }

    connect(success_callback = null): void
    {
        if (this._state === SERVER_STATE.DISCONNECTED)
        {
            this._state = SERVER_STATE.WAITING;

            this.$http.get("//" + this._ip_addr + "/v2/connect")
                .success((response: any) =>
                {
                    if (response.data.result === true)
                    {
                        this._state = SERVER_STATE.CONNECTED;
                        this._createWebSocket();

                        if (!_.isNull(success_callback))
                        {
                            success_callback();
                        }
                    }
                    else
                    {
                        this._state = SERVER_STATE.DISCONNECTED;

                        alert("USB connection has been disconnected!");
                    }
                })
                .error(() =>
                {
                    this._state = SERVER_STATE.DISCONNECTED;

                    alert("The control-server hasn't run.");
                });
        }
    }

    install(json, success_callback = null): void
    {
        if (this._state === SERVER_STATE.CONNECTED)
        {
            this._state = SERVER_STATE.WAITING;

            this.$http.put("//" + this._ip_addr + "/v2/install", json)
                .success((response: any) =>
                {
                    this._state = SERVER_STATE.CONNECTED;

                    if (response.data.result === true)
                    {
                        if (!_.isNull(success_callback))
                        {
                            success_callback();
                        }
                    }
                })
                .error(() =>
                {
                    this._state = SERVER_STATE.DISCONNECTED;
                })
                .finally(() =>
                {
                    this.$rootScope.$broadcast("InstallFinished");
                });
        }
    }

    applyNative(device: string, value: number): void
    {
        if (this._state === SERVER_STATE.CONNECTED)
        {
            this._socket.send('apply/' + device + '/' + value.toString());
            this._state = SERVER_STATE.WAITING;
        }
    }

    setMin(device: string, value: number): void
    {
        if (this._state === SERVER_STATE.CONNECTED)
        {
            this._socket.send('setMin/' + device + '/' + value.toString());
            this._state = SERVER_STATE.WAITING;
        }
    }

    setMax(device: string, value: number): void
    {
        if (this._state === SERVER_STATE.CONNECTED)
        {
            this._socket.send('setMax/' + device + '/' + value.toString());
            this._state = SERVER_STATE.WAITING;
        }
    }

    setHome(device: string, value: number): void
    {
        if (this._state === SERVER_STATE.CONNECTED)
        {
            console.log("setHome");

            this._socket.send('setHome/' + device + '/' + value.toString());
            this._state = SERVER_STATE.WAITING;
        }
    }

    getStatus(): SERVER_STATE
    {
        return this._state;
    }

    private _createWebSocket(): void
    {
        if (!_.isNull(this._socket))
        {
            this._socket.close();
            this._socket = null;
        }

        this._socket = new WebSocket('ws://' + this._ip_addr + '/v2/cmdstream');

        this._socket.onopen = () =>
        {
            if (this._socket.readyState === WebSocket.OPEN)
            {
                this._state = SERVER_STATE.CONNECTED;
                this.$rootScope.$apply();
            }
        };

        this._socket.onmessage = (event) =>
        {
            if (event.data == "False")
            {
                if (this._state === SERVER_STATE.WAITING)
                {
                    this._state = SERVER_STATE.DISCONNECTED;
                    this.$rootScope.$apply();

                    alert("USB connection has been disconnected!");
                }
            }
            else
            {
                this._state = SERVER_STATE.CONNECTED;
            }
        };

        this._socket.onerror = () =>
        {
            this._state = SERVER_STATE.DISCONNECTED;
            this.$rootScope.$apply();

            alert("The control-server hasn't run.");
        };
    }
}

angular.module(APP_NAME).service("PLENControlServerService", PLENControlServerService);