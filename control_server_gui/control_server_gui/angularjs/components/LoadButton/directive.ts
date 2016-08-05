/// <reference path="../../index.ts" />
/// <reference path="./controller.ts" />

class LoadButtonDirective
{
    static getDDO()
    {
        return {
            restrict: "E",
            controller: LoadButtonController,
            controllerAs: "$ctrl",
            scope: {},
            templateUrl: "./angularjs/components/LoadButton/view.html",
            replace: true,
            link: (_1, $element: JQuery, _3, $ctrl: LoadButtonController) =>
            {
                /*!
                    @attention
                    You need to set the change event handler yourself,
                    because ng-change directive is not resolved automatically if without ng-model directive.
                */
                $element.find('input').on('change', $ctrl.onChange.bind($ctrl));
            }
        };
    }
}

angular.module(APP_NAME).directive("loadButton",
    [
        LoadButtonDirective.getDDO
    ]
); 