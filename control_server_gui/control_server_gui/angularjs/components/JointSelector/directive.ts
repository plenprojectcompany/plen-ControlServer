/// <reference path="../../index.ts" />
/// <reference path="./controller.ts" />

class JointSelectorDirective
{
    static getDDO()
    {
        return {
            restrict: "E",
            controller: JointSelectorController,
            controllerAs: "$ctrl",
            scope: {},
            templateUrl: "./angularjs/components/JointSelector/view.html",
            replace: true,
            link: ($scope: ng.IScope, $element: JQuery, _3, $ctrl: JointSelectorController) =>
            {
                var $joint_buttons: JQuery = $element.find('.joint_button');

                /*!
                    @attention
                    You shouldn't use the arrow-function sugar syntax therefore 'this' binding by jQuery will be broken. 
                */
                $joint_buttons.on('click', function()
                {
                    $joint_buttons.removeClass('is-selected');
                    $(this).addClass('is-selected');

                    $ctrl.onClick($(this).attr('id'));
                    $scope.$apply();
                });
            }
        };
    }
}

angular.module(APP_NAME).directive("jointSelector",
    [
        JointSelectorDirective.getDDO
    ]
);