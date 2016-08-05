/// <reference path="../../services/SharedMotionStore.Service.ts" />

class LoadButtonController
{
    static $inject = [
        "$scope",
        "SharedMotionStoreService",
    ];

    constructor(
        public $scope: ng.IScope,
        public motion_store: MotionStore
    )
    {
        // noop.
    }

    onChange(event: any): void
    {
        var files: FileList = event.target.files;
        var files_load_count: number = 0;

        var onLoadCallback = (event: any) =>
        {
            files_load_count++;

            var motion = JSON.parse(event.target.result);

            if (this.motion_store.validate(motion))
            {
                this.motion_store.motions.push(motion);
            }

            if (files_load_count === files.length)
            {
                this.$scope.$apply();
            }
        };

        _.each(files, (file: File) =>
        {
            /*!
                @attention
                You need to create some FileReader instances to avoid busy wait error.
            */
            var reader: FileReader = new FileReader();
            reader.onload = onLoadCallback;

            reader.readAsText(file);
        });
    }
} 