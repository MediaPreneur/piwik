/*!
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/**
 * Loads any custom widget or URL based on the given parameters.
 *
 * The currently active idSite, period, date and segment (if needed) is automatically appended to the parameters. If
 * this widget is removed from the DOM and requests are in progress, these requests will be aborted. A loading message
 * or an error message on failure is shown as well. It's kinda similar to ng-include but there it is not possible to
 * listen to HTTP errors etc.
 *
 * Example:
 * <div piwik-widget-loader="{module: '', action: '', ...}"></div>
 */
(function () {
    angular.module('piwikApp').directive('piwikWidgetLoader', piwikWidgetLoader);

    piwikWidgetLoader.$inject = ['piwik', 'piwikUrl', '$http', '$compile', '$q', '$location'];

    function piwikWidgetLoader(piwik, piwikUrl, $http, $compile, $q, $location){
        return {
            restrict: 'A',
            transclude: true,
            scope: {
                piwikWidgetLoader: '=',
                widgetName: '@'
            },
            templateUrl: 'plugins/CoreHome/angularjs/widget-loader/widgetloader.directive.html?cb=' + piwik.cacheBuster,
            compile: function (element, attrs) {

                return function (scope, element, attrs, ngModel) {
                    scope.widgetName = attrs.widgetName;
                    var changeCounter = 0,
                        currentScope,
                        currentElement,
                        httpCanceler,
                        contentNode = element.find('.theWidgetContent');

                    var cleanupLastWidgetContent = function() {
                        if (currentElement) {
                            currentElement.remove();
                            currentElement = null;
                        }
                        if (currentScope) {
                            currentScope.$destroy();
                            currentScope = null;
                        }
                    };

                    var abortHttpRequestIfNeeded = function () {
                        if (httpCanceler) {
                            httpCanceler.resolve();
                            httpCanceler = null;
                        }
                    }

                    function getFullWidgetUrl(parameters) {

                        var url = $.param(parameters);

                        var $urlParams = $location.search();
                        $urlParams = angular.copy($urlParams);
                        delete $urlParams['category'];
                        delete $urlParams['subcategory'];

                        angular.forEach($urlParams, function (value, key) {
                            if (!(key in parameters)) {
                                url += '&' + key + '=' + piwikUrl.getSearchParam(key);
                            }
                        });

                        // TODO set showtitle=1 only if not widget mode. This will also make _dataTable.twig simpler
                        url += '&showtitle=1';
                        url += '&random=' + parseInt(Math.random() * 10000);

                        return '?' + url;
                    }

                    function loadWidgetUrl(parameters, thisChangeId)
                    {
                        scope.loading = true;

                        var url = getFullWidgetUrl(parameters);

                        abortHttpRequestIfNeeded();
                        cleanupLastWidgetContent();

                        httpCanceler = $q.defer();

                        $http.get(url, {timeout: httpCanceler.promise}).success(function(response) {
                            if (thisChangeId !== changeCounter || !response) {
                                // another widget was requested meanwhile, ignore this response
                                return;
                            }

                            httpCanceler = null;

                            var newScope = scope.$new();
                            currentScope = newScope;

                            scope.loading = false;
                            scope.loadingFailed = false;

                            currentElement = contentNode.html(response).children();
                            $compile(currentElement)(newScope);

                        }).error(function () {
                            if (thisChangeId !== changeCounter) {
                                // another widget was requested meanwhile, ignore this response
                                return;
                            }

                            httpCanceler = null;

                            cleanupLastWidgetContent();

                            scope.loading = false;
                            scope.loadingFailed = true;
                        });
                    }

                    scope.$watch('piwikWidgetLoader', function (parameters, oldUrl) {
                        if (parameters) {
                            loadWidgetUrl(parameters, ++changeCounter);
                        }
                    });

                    element.on('$destroy', function() {
                        abortHttpRequestIfNeeded();
                    });
                };
            }
        };
    }
})();