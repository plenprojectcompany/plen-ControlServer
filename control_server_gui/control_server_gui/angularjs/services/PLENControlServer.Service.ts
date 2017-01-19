/// <reference path='../index.ts' />

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
    private _ip_addr: string = 'localhost:17264';

    static $inject = [
        '$q',
        '$http',
        '$rootScope'
    ];

    constructor(
        private _$q: ng.IQService,
        private _$http: ng.IHttpService,
        private _$rootScope: ng.IRootScopeService
    )
    {
        this.connect(() => { this.checkVersionOfPLEN(); });

        $(window).on('beforeunload', () => { this.disconnect(); });
    }

    connect(success_callback = null): void
    {
        if (this._state === SERVER_STATE.DISCONNECTED)
        {
            this._state = SERVER_STATE.WAITING;

            this._$http.get('//' + this._ip_addr + '/v2/connect')
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

                        alert('USB connection has been disconnected!');
                    }
                })
                .error(() =>
                {
                    this._state = SERVER_STATE.DISCONNECTED;

                    alert("The control-server hasn't run.");
                });
        }
    }

    disconnect(success_callback = null): void
    {
        if (this._state === SERVER_STATE.CONNECTED)
        {
            this._state = SERVER_STATE.WAITING;

            this._$http.get('//' + this._ip_addr + '/v2/disconnect')
                .success((response: any) =>
                {
                    if (response.data.result === true)
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

            this._$http.put('//' + this._ip_addr + '/v2/motions/' + json.slot.toString(), json)
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
                    this._$rootScope.$broadcast('InstallFinished');
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
            this._socket.send('setHome/' + device + '/' + value.toString());
            this._state = SERVER_STATE.WAITING;
        }
    }

    resetJointSettings(): void
    {
        if (this._state === SERVER_STATE.CONNECTED)
        {
            this._socket.send('resetJointSettings');
            this._state = SERVER_STATE.WAITING;
        }
    }

    getStatus(): SERVER_STATE
    {
        return this._state;
    }

    checkVersionOfPLEN(): void
    {
        if (this._state === SERVER_STATE.CONNECTED)
        {
            var deferred: ng.IDeferred<any> = this._$q.defer();
            var promise: ng.IPromise<any>   = deferred.promise;

            var urls: Array<string> = [
                '//' + this._ip_addr + '/v2/version',
                '//' + this._ip_addr + '/v2/metadata'
            ];

            var responses: Array<any> = [];

            _.each(urls, (url: string) =>
            {
                promise = promise.finally(() =>
                {
                    return this._$http.get(url)
                        .success((response: any) =>
                        {
                            responses.push(response);
                        });
                });
            });

            promise = promise
                .then(() =>
                {
                    try {
                        var firmware_version: number = parseInt(responses[0].data['version'].replace(/\./g, ''));
                        var required_verison: number = parseInt(responses[1].data['required-firmware'].replace(/[\.\~]/g, ''));

                        if (firmware_version < required_verison) throw 'version error';
                    }
                    catch (e)
                    {
                        this._state = SERVER_STATE.DISCONNECTED;

                        alert('Firmware version of your PLEN is old. Please update version ' + responses[1].data['required-firmware'] + '.');
                    }
                })
                .catch(() =>
                {
                    this._state = SERVER_STATE.DISCONNECTED;
                });

            deferred.resolve();
        }
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
                this._$rootScope.$apply();
            }
        };

        this._socket.onmessage = (event: any) =>
        {
            if (event.data == 'False')
            {
                if (this._state === SERVER_STATE.WAITING)
                {
                    this._state = SERVER_STATE.DISCONNECTED;
                    this._$rootScope.$apply();

                    alert('USB connection has been disconnected!');
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
            this._$rootScope.$apply();

            alert("The control-server hasn't run.");
        };
    }
}

angular.module(APP_NAME).service('PLENControlServerService', PLENControlServerService);