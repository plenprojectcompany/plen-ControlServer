enum SERVER_STATE
{
    DISCONNECTED,
    CONNECTED,
    WAITING
};

class PLENControlServerService
{
    private _state: SERVER_STATE = SERVER_STATE.DISCONNECTED;
    private _socket: WebSocket;
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
        this._socket = new WebSocket('ws://' + this._ip_addr + '/cmdstream');

        this._socket.onopen = () =>
        {
            if (this._socket.readyState === WebSocket.OPEN)
            {
                this._state = SERVER_STATE.CONNECTED;
            }
        };

        this._socket.onmessage = (event) =>
        {
            this._state = SERVER_STATE.CONNECTED;
            console.log(event.data);
        };

        this._socket.onerror = () =>
        {
            this._state = SERVER_STATE.DISCONNECTED;
        };
    }

    connect(success_callback = null): void
    {
        if (this._state === SERVER_STATE.DISCONNECTED)
        {
            this._state = SERVER_STATE.WAITING;

            this.$http.get("//" + this._ip_addr + "/connect")
                .success((response: any) =>
                {
                    if (response.result === true)
                    {
                        this._state = SERVER_STATE.CONNECTED;

                        if (!_.isNull(success_callback))
                        {
                            success_callback();
                        }
                    }
                    else
                    {
                        this._state = SERVER_STATE.DISCONNECTED;
                    }
                })
                .error(() =>
                {
                    this._state = SERVER_STATE.DISCONNECTED;
                });
        }
    }

    disconnect(success_callback = null): void
    {
        if (this._state === SERVER_STATE.CONNECTED)
        {
            this._state === SERVER_STATE.WAITING;

            this.$http.get("//" + this._ip_addr + "/disconnect")
                .success((response: any) =>
                {
                    if (response.result === true)
                    {
                        if (!_.isNull(success_callback))
                        {
                            success_callback();
                        }
                    }

                    this._state = SERVER_STATE.DISCONNECTED;
                })
                .error(() =>
                {
                    this._state = SERVER_STATE.CONNECTED;
                });
        }
    }

    install(json, success_callback = null): void
    {
        if (this._state === SERVER_STATE.CONNECTED)
        {
            this._state = SERVER_STATE.WAITING;

            this.$http.post("//" + this._ip_addr + "/install", json)
                .success((response: any) =>
                {
                    this._state = SERVER_STATE.CONNECTED;

                    if (response.result === true)
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

    applyDiff(device: string, value: number): void
    {
        if (this._state === SERVER_STATE.CONNECTED)
        {
            this._socket.send('applyDiff/' + device + '/' + value.toString());
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
            this._socket.send('setHome/' + device + '/' + value.toString());
            this._state = SERVER_STATE.WAITING;
        }
    }

    play(slot: number, success_callback = null): void
    {
        if (this._state === SERVER_STATE.CONNECTED)
        {
            this._state = SERVER_STATE.WAITING;

            this.$http.get("//" + this._ip_addr + "/play/" + slot.toString())
                .success((response: any) =>
                {
                    this._state = SERVER_STATE.CONNECTED;

                    if (response.result === true)
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
                });
        }
    }

    stop(success_callback = null): void
    {
        if (this._state === SERVER_STATE.CONNECTED)
        {
            this._state === SERVER_STATE.WAITING;

            this.$http.get("//" + this._ip_addr + "/stop")
                .success((response: any) =>
                {
                    this._state = SERVER_STATE.CONNECTED;

                    if (response.result === true)
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
                });
        }
    }

    getStatus(): SERVER_STATE
    {
        return this._state;
    }
}

angular.module(APP_NAME).service("PLENControlServerService", PLENControlServerService);