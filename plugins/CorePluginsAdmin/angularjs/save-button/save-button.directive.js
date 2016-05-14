/*!
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/**
 * Usage:
 * <div piwik-save-button>
 */
(function () {
    angular.module('piwikApp').directive('piwikSaveButton', piwikSaveButton);

    piwikSaveButton.$inject = ['piwik'];

    function piwikSaveButton(piwik){

        return {
            restrict: 'A',
            replace: true,
            scope: {
                saving: '=?',
            },
            templateUrl: 'plugins/CorePluginsAdmin/angularjs/save-button/save-button.directive.html?cb=' + piwik.cacheBuster
        };
    }
})();