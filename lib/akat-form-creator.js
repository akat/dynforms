'use strict';

angular.module("akat-form-creator", ['textAngular', 'ngTagsInput', 'ui.bootstrap', 'ui.select', 'ui.sortable']);

'use strict';

angular.module('akat-form-creator').directive('elembox', ['$compile', function ($compile) {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/box/box.html',
        replace: true,
        restrict: 'E',
        scope: {
            name: '@',
            model: '=',
            parent: '=',
            root: '=',
            options: '=',
            validation: '=',
            offset: '=',
            inline: '=',
            horizontal: '=',
            form: '='
        },
        link: function link($scope, element) {
            var options = _.get($scope, 'options', {});

            $scope.class = {};

            if ($scope.horizontal) {
                var numeric = !_.isArray($scope.offset) && $scope.offset - parseFloat($scope.offset) + 1 >= 0;
                var offset = numeric ? parseInt($scope.offset) : 2;

                $scope.class.wrapper = 'col-sm-' + (12 - offset);

                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + offset;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + offset;
                }
            }

            if (_.has($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            var root = angular.element('<div/>');

            if (options.fields) {
                var field = angular.element('<dynfields />');
                field.attr('data-options', 'options');
                field.attr('data-model', 'model');
                field.attr('data-parent', 'parent');
                field.attr('data-root', 'root');
                field.attr('data-name', '{{ name }}');
                field.attr('data-form', 'form');
                field.attr('data-validation', 'validation || form');

                if (_.has(options, 'horizontal') ? options.horizontal : $scope.horizontal) {
                    field.attr('data-horizontal', 'true');
                }

                if (_.has(options, 'inline') ? options.inline : $scope.inline) {
                    field.attr('data-inline', 'true');
                }

                if (_.has(options, 'offset')) {
                    field.attr('data-offset', options.offset);
                } else if (_.has($scope, 'offset')) {
                    field.attr('data-offset', $scope.offset);
                }

                root.append(field);
            }

            _(element.children()).forEach(function (children) {
                root.append(children);
            });

            if (_.get($scope, 'options.panel', false)) {
                var wrapper = angular.element('<div data-ng-class="class.wrapper"/>');
                var panel = angular.element('<div class="panel"/>');

                panel.addClass(_.get($scope, 'options.panel.type', 'panel-default'));

                if (_.get($scope, 'options.panel.heading', false)) {
                    panel.append('<div class="panel-heading">' + $scope.options.panel.heading + '</div>');
                }

                panel.append(root.addClass('panel-body'));
                element.append($compile(wrapper.append(panel))($scope)); //append compiled element
            } else {
                root.attr('data-ng-class', 'class.wrapper');
                element.append($compile(root)($scope)); //append compiled element
            }

            if (!$scope.model) {
                $scope.model = {};
            }

            if (!$scope.model && _.get($scope, 'options.default.field', false)) {
                var watch = $scope.root.$watch('model.' + $scope.options.default.field, function (val) {
                    if (!val) {} else if ($scope.validation.$dirty) {
                        watch();
                    } else {
                        $scope.model = val;
                    }
                }, true);
            }
        }
    };
}]);

'use strict';

angular.module('akat-form-creator').directive('elemboxarray', ['$compile', function ($compile) {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/boxarray/boxarray.html',
        replace: true,
        restrict: 'E',
        scope: {
            name: '@',
            model: '=',
            parent: '=',
            root: '=',
            options: '=',
            validation: '=',
            offset: '=',
            inline: '=',
            horizontal: '=',
            form: '='
        },
        link: function link($scope, element) {
            $scope.model = [{}, {}, {}, {}];
            $scope.class = {};
            $scope.controls = _.has($scope, 'options.controls') ? $scope.options.controls : true;

            var options = _.get($scope, 'options', {});

            if ($scope.horizontal) {
                var numeric = !_.isArray($scope.offset) && $scope.offset - parseFloat($scope.offset) + 1 >= 0;
                var offset = numeric ? parseInt($scope.offset) : 2;

                $scope.class.wrapper = 'col-sm-' + (12 - offset);

                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + offset;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + offset;
                }
            }

            if (_.has($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.has(options, 'horizontal') ? options.horizontal : $scope.horizontal) {
                $scope.fieldsHorizontal = true;
            }

            if (_.has(options, 'inline') ? options.inline : $scope.inline) {
                $scope.fieldsInline = true;
            }

            if (_.has(options, 'offset')) {
                $scope.fieldsOffset = options.offset;
            } else if (_.has($scope, 'offset')) {
                $scope.fieldsOffset = $scope.offset;
            }

            if (_.get($scope, 'options.panel', false)) {
                $scope.class.panel = 'panel ' + _.get($scope, 'options.panel.type', 'panel-default');
            }

            $scope.delete = function (index, item) {
                $scope.model.splice(index, 1);
            };

            $scope.add = function () {
                $scope.model.push({});
            };
        }
    };
}]);

'use strict';

angular.module('akat-form-creator').directive('elemcheckbox', function () {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/checkbox/checkbox.html',
        restrict: 'E',
        replace: true,
        scope: {
            name: '@',
            model: '=',
            root: '=',
            options: '=',
            validation: '=',
            offset: '=',
            inline: '=',
            horizontal: '='
        },
        link: function link($scope, element) {
            $scope.class = {};

            if ($scope.horizontal) {
                var numeric = !_.isArray($scope.offset) && $scope.offset - parseFloat($scope.offset) + 1 >= 0;
                var offset = numeric ? parseInt($scope.offset) : 2;

                $scope.class.wrapper = 'col-sm-' + (12 - offset);

                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + offset;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + offset;
                }
            }

            if (_.has($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.get($scope, 'options.panel', false)) {
                $scope.class.panel = 'panel ' + _.get($scope, 'options.panel.type', 'panel-default');
            }

            if (!$scope.model && _.get($scope, 'options.default.field', false)) {
                var watch = $scope.root.$watch('model.' + $scope.options.default.field, function (val) {
                    if (!val) {} else if ($scope.validation.$dirty) {
                        watch();
                    } else {
                        $scope.model = val;
                    }
                }, true);
            }
        }
    };
});

'use strict';

angular.module('akat-form-creator').directive('elemdatepicker', function () {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/datepicker/datepicker.html',
        restrict: 'E',
        replace: true,
        scope: {
            name: '@',
            model: '=',
            root: '=',
            options: '=',
            validation: '=',
            offset: '=',
            inline: '=',
            horizontal: '='
        },

        link: function link($scope, element) {
            $scope.class = {};

            if ($scope.horizontal) {
                var numeric = !_.isArray($scope.offset) && $scope.offset - parseFloat($scope.offset) + 1 >= 0;
                var offset = numeric ? parseInt($scope.offset) : 2;

                $scope.class.wrapper = 'col-sm-' + (12 - offset);

                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + offset;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + offset;
                }
            }

            if (_.has($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.get($scope, 'options.panel', false)) {
                $scope.class.panel = 'panel ' + _.get($scope, 'options.panel.type', 'panel-default');
            }

            function disabled(data) {
                var date = data.date,
                    mode = data.mode;
                return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
            }

            function getDayClass(data) {
                var date = data.date,
                    mode = data.mode;
                if (mode === 'day') {
                    var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                    for (var i = 0; i < $scope.events.length; i++) {
                        var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                        if (dayToCheck === currentDay) {
                            return $scope.events[i].status;
                        }
                    }
                }
                return '';
            }

            $scope.init = function () {

                $scope.today();
                $scope.toggleMin();

                $scope.inlineOptions = {
                    customClass: getDayClass,
                    minDate: new Date(),
                    showWeeks: true
                };

                $scope.dateOptions = {
                    dateDisabled: disabled,
                    formatYear: 'yy',
                    maxDate: new Date(2020, 5, 22),
                    minDate: new Date(),
                    startingDay: 1
                };

                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);

                var afterTomorrow = new Date();
                afterTomorrow.setDate(tomorrow.getDate() + 1);
                $scope.events = [{
                    date: tomorrow,
                    status: 'full'
                }, {
                    date: afterTomorrow,
                    status: 'partially'
                }];

                $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                $scope.format = $scope.formats[0];
                $scope.altInputFormats = ['M!/d!/yyyy'];
            };

            $scope.today = function () {
                $scope.dt = new Date();
            };

            $scope.clear = function () {
                $scope.dt = null;
            };

            $scope.toggleMin = function () {
                $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
                $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
            };

            $scope.open1 = function () {
                $scope.popup1.opened = true;
            };

            $scope.open2 = function () {
                $scope.popup2.opened = true;
            };

            $scope.setDate = function (year, month, day) {
                $scope.dt = new Date(year, month, day);
            };

            $scope.popup1 = {
                opened: false
            };

            $scope.popup2 = {
                opened: false
            };

            if (!$scope.model && _.get($scope, 'options.default.field', false)) {
                var watch = $scope.root.$watch('model.' + $scope.options.default.field, function (val) {
                    if (!val) {} else if ($scope.validation.$dirty) {
                        watch();
                    } else {
                        $scope.model = val;
                    }
                }, true);
            }
        }
    };
});

'use strict';

angular.module('akat-form-creator').directive('elemdatetimepicker', ['$timeout', function ($timeout) {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/datetimepicker/datetimepicker.html',
        restrict: 'E',
        replace: true,
        scope: {
            name: '@',
            offset: '=',
            inline: '=',
            horizontal: '=',
            model: '=',
            root: '=',
            options: '=',
            validation: '='
        },
        link: function link($scope, element) {
            $scope.class = {};

            if (!$scope.model && _.has($scope, 'options.default.value')) {
                $scope.model = $scope.options.default.value;
            }

            if ($scope.horizontal) {
                var numeric = !_.isArray($scope.offset) && $scope.offset - parseFloat($scope.offset) + 1 >= 0;
                var offset = numeric ? parseInt($scope.offset) : 2;
                $scope.class.wrapper = 'col-sm-' + (12 - offset);

                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + offset;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + offset;
                }
            }

            if (_.get($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.get($scope, 'options.panel', false)) {
                $scope.class.panel = 'panel ' + _.get($scope, 'options.panel.type', 'panel-default');
            }

            var input = element.find('input').datetimepicker(_.get($scope, 'options.options', {}));
            var picker = input.data('DateTimePicker');

            if ($scope.model) {
                picker.date($scope.model);
            } else if (_.get($scope, 'options.default.field', false)) {
                var watch = $scope.root.$watch('model.' + $scope.options.default.field, function (val) {
                    if (!val) {} else if ($scope.validation.$dirty) {
                        watch();
                    } else {
                        console.log('asfs');picker.date($scope.model = val);
                    }
                }, true);
            }

            input.on('dp.change dp.error', function () {
                $scope.$apply(function () {
                    var format = _.get($scope, 'options.options.format', null);
                    var date = picker.date();
                    $scope.model = date ? date.format(format || null) : null;
                });
            });
        }
    };
}]);

'use strict';

angular.module('akat-form-creator').directive('elemdirective', ['$compile', function ($compile) {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/directive/directive.html',
        restrict: 'E',
        replace: true,
        scope: {
            name: '@',
            model: '=',
            root: '=',
            options: '=',
            validation: '=',
            offset: '=',
            inline: '=',
            horizontal: '='
        },
        link: function link($scope, element) {
            $scope.class = {};

            if (!$scope.model && _.has($scope, 'options.default.value')) {
                $scope.model = $scope.options.default.value;
            }

            if ($scope.horizontal) {
                var numeric = !_.isArray($scope.offset) && $scope.offset - parseFloat($scope.offset) + 1 >= 0;
                var offset = numeric ? parseInt($scope.offset) : 2;
                $scope.class.wrapper = 'col-sm-' + (12 - offset);

                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + offset;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + offset;
                }
            }

            if (_.get($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.get($scope, 'options.panel', false)) {
                $scope.class.panel = 'panel ' + _.get($scope, 'options.panel.type', 'panel-default');
            }

            if (!_.get($scope, 'options.directive', false)) {
                console.error('Element elemdirective requires a directive field');
                element.find('spam').remove();
            } else {
                var directive = angular.element('<' + $scope.options.directive + '/>');

                if (_.get($scope, 'options.attrs')) {
                    _.each($scope.options.attrs, function (value, attr) {
                        directive.attr(attr, value);
                    });
                }

                if (_.has($scope, 'options.html')) {
                    directive.html($scope.options.html);
                }

                element.find('spam').replaceWith($compile(directive)($scope));
            }

            if (!$scope.model && _.get($scope, 'options.default.field', false)) {
                var watch = $scope.root.$watch('model.' + $scope.options.default.field, function (val) {
                    if (!val) {} else if ($scope.validation.$dirty) {
                        watch();
                    } else {
                        $scope.model = val;
                    }
                }, true);
            }
        }
    };
}]);

'use strict';

angular.module('akat-form-creator').directive('elememail', ['dynformfilters', function (dynformfilters) {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/email/email.html',
        restrict: 'E',
        replace: true,
        scope: {
            name: '@',
            model: '=',
            root: '=',
            options: '=',
            validation: '=',
            offset: '=',
            inline: '=',
            horizontal: '='
        },
        link: function link($scope, element) {
            $scope.class = {};

            if ($scope.horizontal) {
                var numeric = !_.isArray($scope.offset) && $scope.offset - parseFloat($scope.offset) + 1 >= 0;
                var offset = numeric ? parseInt($scope.offset) : 2;

                $scope.class.wrapper = 'col-sm-' + (12 - offset);

                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + offset;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + offset;
                }
            }

            if (_.has($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.get($scope, 'options.panel', false)) {
                $scope.class.panel = 'panel ' + _.get($scope, 'options.panel.type', 'panel-default');
            }

            if (!$scope.model && _.get($scope, 'options.default.field', false)) {
                var watch = $scope.root.$watch('model.' + $scope.options.default.field, function (val) {
                    if (!val) {} else if ($scope.validation.$dirty) {
                        watch();
                    } else {
                        $scope.model = val;
                    }
                }, true);
            }

            var filters = _.get($scope, 'options.filters', false);
            if (filters) {
                filters = dynformfilters(filters);
                $scope.$watch('model', function (value) {
                    $scope.model = _.reduce(filters, function (res, filter) {
                        return filter(res);
                    }, value);
                });
            }
        }
    };
}]);

'use strict';

angular.module('akat-form-creator').directive('dynfields', ['$compile', function ($compile) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            name: '@',
            offset: '=',
            inline: '=',
            horizontal: '=',
            model: '=',
            parent: '=',
            root: '=',
            options: '=',
            validation: '=',
            form: '='
        },
        link: function link($scope, element) {
            var options = _.get($scope, 'options', {});

            if (options.fields) {
                _(options.fields).forEach(function (field, key) {
                    var child = angular.element('<' + field.type + ' />');
                    var tree = [];
                    var model = 'model';

                    if (_.has($scope, 'name')) {
                        tree.push($scope.name);
                    }

                    if (_.has(field, 'name')) {
                        tree.push(field.name);
                        model += '["' + field.name + '"]';
                    }

                    var name = tree.join('-');

                    child.attr('data-options', 'options.fields[' + key + ']');
                    child.attr('data-offset', 'offset');
                    child.attr('data-horizontal', 'horizontal');
                    child.attr('data-inline', 'inline');
                    child.attr('data-model', model);
                    child.attr('data-root', 'root');
                    child.attr('data-parent', 'model');
                    child.attr('data-name', name);
                    child.attr('data-form', 'form');
                    child.attr('data-validation', 'validation["' + name + '"]');

                    element.append($compile(child)($scope));
                });
            }
        }
    };
}]);

'use strict';

angular.module('akat-form-creator').directive('dynform', ['$compile', function ($compile) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            structure: '=',
            model: '=',
            id: '='
        },
        link: function link($scope, element) {
            var options = _.get($scope, 'structure', {});
            var offset = false;
            var horizontal = false;
            var inline = false;

            $scope.root = $scope;

            if (!_.has($scope, 'model')) {
                $scope.model = {};
            }

            _.defaults(options, {
                root: 'form',
                novalidate: true
            });

            if (!($scope.name || options.name)) {
                var hash = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
                options.name = 'dynform_' + hash;
            }

            var form = angular.element('<' + options.root + ' />');

            form.attr('data-name', $scope.name || options.name);
            form.attr('data-options', 'options');
            form.attr('data-model', 'model');

            if (options.horizontal) {
                horizontal = true;
                form.addClass('form-horizontal');
                var numeric = !_.isArray(options.offset) && options.offset - parseFloat(options.offset) + 1 >= 0;
                offset = numeric ? parseInt(options.offset) : 2;
            } else if (options.inline) {
                inline = true;
                form.addClass('form-inline');
            }

            if (options.novalidate) {
                form.attr('novalidate');
            }

            if (options.panel) {
                form.addClass('panel panel-default');
            }

            if (options.class) {
                form.addClass(options.class);
            }

            if (options.fields) {
                var child = angular.element('<dynfields />');
                child.attr('data-options', 'structure');
                child.attr('data-model', 'model');
                child.attr('data-name', options.name);
                child.attr('data-form', options.name);
                child.attr('data-root', 'root');
                child.attr('data-parent', 'model');
                child.attr('data-form', options.name);
                child.attr('data-validation', options.name);
                if (false !== offset) {
                    child.attr('data-offset', offset);
                }
                if (horizontal) {
                    child.attr('data-horizontal', 'true');
                }
                if (inline) {
                    child.attr('data-inline', 'true');
                }
                form.append(child);
            }

            var root = $compile(form)($scope);

            _(element.children()).forEach(function (children) {
                root.append(children);
            });

            element.append(root); //append compiled element
        }
    };
}]);

'use strict';

angular.module('akat-form-creator').directive('elempassword', function () {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/password/password.html',
        restrict: 'E',
        replace: true,
        scope: {
            name: '@',
            model: '=',
            root: '=',
            options: '=',
            validation: '=',
            offset: '=',
            inline: '=',
            horizontal: '='
        },
        link: function link($scope, element) {
            $scope.class = {};

            if ($scope.horizontal) {
                var numeric = !_.isArray($scope.offset) && $scope.offset - parseFloat($scope.offset) + 1 >= 0;
                var offset = numeric ? parseInt($scope.offset) : 2;

                $scope.class.wrapper = 'col-sm-' + (12 - offset);

                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + offset;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + offset;
                }
            }

            if (_.has($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.get($scope, 'options.panel', false)) {
                $scope.class.panel = 'panel ' + _.get($scope, 'options.panel.type', 'panel-default');
            }

            if (!$scope.model && _.get($scope, 'options.default.field', false)) {
                var watch = $scope.root.$watch('model.' + $scope.options.default.field, function (val) {
                    if (!val) {} else if ($scope.validation.$dirty) {
                        watch();
                    } else {
                        $scope.model = val;
                    }
                }, true);
            }
        }
    };
});

'use strict';

angular.module('akat-form-creator').directive('elemradio', ['$http', '$log', function ($http, $log) {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/radio/radio.html',
        restrict: 'E',
        replace: true,
        scope: {
            name: '@',
            model: '=',
            parent: '=',
            root: '=',
            options: '=',
            validation: '=',
            offset: '=',
            horizontal: '='
        },
        link: function link($scope) {
            $scope.class = {};

            $scope.key = {
                value: _.get($scope, 'options.ajax.value', 'value'),
                text: _.get($scope, 'options.ajax.text', 'text')
            };

            if (!$scope.model && _.has($scope, 'options.default.value')) {
                $scope.model = $scope.options.default.value;
            }

            if (_.get($scope, 'options.ajax.url', false)) {
                $http.get($scope.options.ajax.url).then(function (res) {
                    return $scope.options.values = res.data;
                }).catch(function (err) {
                    $log.error(err);
                });
            }

            if ($scope.horizontal) {
                var numeric = !_.isArray($scope.offset) && $scope.offset - parseFloat($scope.offset) + 1 >= 0;
                var offset = numeric ? parseInt($scope.offset) : 2;

                $scope.class.wrapper = 'col-sm-' + (12 - offset);

                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + offset;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + offset;
                }
            }

            if (_.get($scope, 'options.panel', false)) {
                $scope.class.panel = 'panel ' + _.get($scope, 'options.panel.type', 'panel-default');
            }

            if (!$scope.model && _.get($scope, 'options.default.field', false)) {
                var watch = $scope.root.$watch('model.' + $scope.options.default.field, function (val) {
                    if (!val) {} else if ($scope.validation.$dirty) {
                        watch();
                    } else {
                        $scope.model = val;
                    }
                }, true);
            }
        }
    };
}]);

'use strict';

angular.module('akat-form-creator').directive('elemrichtext', ['dynformfilters', function (dynformfilters) {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/richtext/richtext.html',
        restrict: 'E',
        replace: true,

        scope: {
            name: '@',
            model: '=',
            root: '=',
            options: '=',
            validation: '=',
            offset: '=',
            horizontal: '='
        },

        link: function link($scope, element) {
            $scope.class = {};

            if ($scope.horizontal) {
                var numeric = !_.isArray($scope.offset) && $scope.offset - parseFloat($scope.offset) + 1 >= 0;
                var offset = numeric ? parseInt($scope.offset) : 2;

                $scope.class.wrapper = 'col-sm-' + (12 - offset);

                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + offset;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + offset;
                }
            }

            if (_.has($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.get($scope, 'options.panel', false)) {
                $scope.class.panel = 'panel ' + _.get($scope, 'options.panel.type', 'panel-default');
            }

            if (!$scope.model && _.get($scope, 'options.default.field', false)) {
                var watch = $scope.root.$watch('model.' + $scope.options.default.field, function (val) {
                    if (!val) {} else if ($scope.validation.$dirty) {
                        watch();
                    } else {
                        $scope.model = val;
                    }
                }, true);
            }

            var filters = _.get($scope, 'options.filters', false);
            if (filters) {
                filters = dynformfilters(filters);
                $scope.$watch('model', function (value) {
                    $scope.model = _.reduce(filters, function (res, filter) {
                        return filter(res);
                    }, value);
                });
            }
        }
    };
}]);

'use strict';

angular.module('akat-form-creator').directive('elemselectbox', ['$http', '$log', function ($http, $log) {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/selectbox/selectbox.html',
        restrict: 'E',
        replace: true,
        scope: {
            name: '@',
            model: '=',
            root: '=',
            options: '=',
            validation: '=',
            offset: '=',
            inline: '=',
            horizontal: '='
        },
        link: function link($scope, element) {
            $scope.class = {};

            $scope.key = {
                value: _.get($scope, 'options.ajax.value', 'value'),
                text: _.get($scope, 'options.ajax.text', 'text')
            };

            if (!$scope.model && _.has($scope, 'options.default.value')) {
                $scope.model = $scope.options.default.value;
            }

            if (_.get($scope, 'options.ajax.url', false)) {
                $http.get($scope.options.ajax.url).then(function (res) {
                    return $scope.options.options = res.data;
                }).catch(function (err) {
                    $log.error(err);
                });
            }

            if ($scope.horizontal) {
                var numeric = !_.isArray($scope.offset) && $scope.offset - parseFloat($scope.offset) + 1 >= 0;
                var offset = numeric ? parseInt($scope.offset) : 2;

                $scope.class.wrapper = 'col-sm-' + (12 - offset);

                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + offset;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + offset;
                }
            }

            if (_.has($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.get($scope, 'options.panel', false)) {
                $scope.class.panel = 'panel ' + _.get($scope, 'options.panel.type', 'panel-default');
            }

            if (!$scope.model && _.get($scope, 'options.default.field', false)) {
                var watch = $scope.root.$watch('model.' + $scope.options.default.field, function (val) {
                    if (!val) {} else if ($scope.validation.$dirty) {
                        watch();
                    } else {
                        $scope.model = val;
                    }
                }, true);
            }
        }
    };
}]);

'use strict';

angular.module('akat-form-creator').directive('elemtabs', function () {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/tabs/tabs.html',
        restrict: 'E',
        replace: true,
        scope: {
            name: '@',
            model: '=',
            parent: '=',
            root: '=',
            options: '=',
            validation: '=',
            offset: '=',
            inline: '=',
            horizontal: '=',
            form: '='
        },

        link: function link($scope) {
            var options = _.get($scope, 'options', {});
            $scope.class = {};

            $scope.tabsHorizontal = _.has(options, 'horizontal') ? options.horizontal : $scope.horizontal;
            $scope.tabsInline = _.has(options, 'inline') ? options.inline : $scope.inline;
            $scope.tabsOffset = _.has(options, 'offset') ? options.offset : $scope.offset;

            if ($scope.horizontal) {
                var numeric = !_.isArray($scope.offset) && $scope.offset - parseFloat($scope.offset) + 1 >= 0;
                var offset = numeric ? parseInt($scope.offset) : 2;

                $scope.class.wrapper = 'col-sm-' + (12 - offset);

                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + offset;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + offset;
                }
            }

            if (_.get($scope, 'options.panel', false)) {
                $scope.class.panel = 'panel ' + _.get($scope, 'options.panel.type', 'panel-default');
            }

            if (!$scope.model) {
                $scope.model = {};
            }

            if (!$scope.model && _.get($scope, 'options.default.field', false)) {
                var watch = $scope.root.$watch('model.' + $scope.options.default.field, function (val) {
                    if (!val) {} else if ($scope.validation.$dirty) {
                        watch();
                    } else {
                        $scope.model = val;
                    }
                }, true);
            }
        }
    };
});

'use strict';

angular.module('akat-form-creator').directive('elemtags', ['$http', function ($http) {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/tags/tags.html',
        restrict: 'E',
        replace: true,
        scope: {
            name: '@',
            model: '=',
            root: '=',
            options: '=',
            validation: '=',
            offset: '=',
            horizontal: '='
        },

        link: function link($scope, element) {
            $scope.class = {};

            if ($scope.horizontal) {
                var numeric = !_.isArray($scope.offset) && $scope.offset - parseFloat($scope.offset) + 1 >= 0;
                var offset = numeric ? parseInt($scope.offset) : 2;

                $scope.class.wrapper = 'col-sm-' + (12 - offset);

                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + offset;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + offset;
                }
            }

            if (_.has($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.get($scope, 'options.panel', false)) {
                $scope.class.panel = 'panel ' + _.get($scope, 'options.panel.type', 'panel-default');
            }

            var ajax = _.get($scope, 'options.ajax.url', false);
            var text = _.get($scope, 'options.ajax.text', false);

            $scope.setData = function (query) {
                if (!ajax) {
                    return [];
                }
                var req = $http.get(ajax.replace('%s', query));

                if (!text) {
                    return req;
                }
                return req.then(function (res) {
                    res.data = _.map(res.data, function (value) {
                        return value.text = value[text];
                    });
                    return res;
                });
            };

            if (!$scope.model && _.get($scope, 'options.default.field', false)) {
                var watch = $scope.root.$watch('model.' + $scope.options.default.field, function (val) {
                    if (!val) {} else if ($scope.validation.$dirty) {
                        watch();
                    } else {
                        $scope.model = val;
                    }
                }, true);
            }
        }
    };
}]);

'use strict';

angular.module('akat-form-creator').directive('elemtextarea', ['dynformfilters', function (dynformfilters) {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/textarea/textarea.html',
        restrict: 'E',
        replace: true,
        scope: {
            name: '@',
            model: '=',
            root: '=',
            options: '=',
            validation: '=',
            offset: '=',
            horizontal: '='
        },
        link: function link($scope, element) {
            $scope.class = {};

            if (!$scope.model && _.has($scope, 'options.default.value')) {
                $scope.model = $scope.options.default.value;
            }

            if ($scope.horizontal) {
                var numeric = !_.isArray($scope.offset) && $scope.offset - parseFloat($scope.offset) + 1 >= 0;
                var offset = numeric ? parseInt($scope.offset) : 2;

                $scope.class.wrapper = 'col-sm-' + (12 - offset);

                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + offset;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + offset;
                }
            }

            if (_.has($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.get($scope, 'options.panel', false)) {
                $scope.class.panel = 'panel ' + _.get($scope, 'options.panel.type', 'panel-default');
            }

            if (!$scope.model && _.get($scope, 'options.default.field', false)) {
                var watch = $scope.root.$watch('model.' + $scope.options.default.field, function (val) {
                    if (!val) {} else if ($scope.validation.$dirty) {
                        watch();
                    } else {
                        $scope.model = val;
                    }
                }, true);
            }

            var filters = _.get($scope, 'options.filters', false);
            if (filters) {
                filters = dynformfilters(filters);
                $scope.$watch('model', function (value) {
                    $scope.model = _.reduce(filters, function (res, filter) {
                        return filter(res);
                    }, value);
                });
            }
        }
    };
}]);

'use strict';

angular.module('akat-form-creator').directive('elemtextfield', ['dynformfilters', function (dynformfilters) {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/textfield/textfield.html',
        restrict: 'E',
        replace: true,
        scope: {
            name: '@',
            offset: '=',
            inline: '=',
            horizontal: '=',
            model: '=',
            root: '=',
            options: '=',
            validation: '='
        },
        link: function link($scope, element) {
            $scope.class = {};

            if (!$scope.model && _.has($scope, 'options.default.value')) {
                $scope.model = $scope.options.default.value;
            }

            if ($scope.horizontal) {
                var numeric = !_.isArray($scope.offset) && $scope.offset - parseFloat($scope.offset) + 1 >= 0;
                var offset = numeric ? parseInt($scope.offset) : 2;
                $scope.class.wrapper = 'col-sm-' + (12 - offset);

                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + offset;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + offset;
                }
            }

            if (_.get($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.get($scope, 'options.panel', false)) {
                $scope.class.panel = 'panel ' + _.get($scope, 'options.panel.type', 'panel-default');
            }

            if (!$scope.model && _.get($scope, 'options.default.field', false)) {
                var watch = $scope.root.$watch('model.' + $scope.options.default.field, function (val) {
                    if (!val) {} else if ($scope.validation.$dirty) {
                        watch();
                    } else {
                        $scope.model = val;
                    }
                }, true);
            }

            var filters = _.get($scope, 'options.filters', false);
            if (filters) {
                filters = dynformfilters(filters);
                $scope.$watch('model', function (value) {
                    $scope.model = _.reduce(filters, function (res, filter) {
                        return filter(res);
                    }, value);
                });
            }
        }
    };
}]);

'use strict';

angular.module('akat-form-creator').directive('elemuiselect', ['$http', '$injector', '$q', '$compile', function ($http, $injector, $q, $compile) {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/uiselect/uiselect.html',
        restrict: 'E',
        replace: true,
        scope: {
            name: '@',
            model: '=',
            parent: '=',
            root: '=',
            options: '=',
            validation: '=',
            offset: '=',
            inline: '=',
            horizontal: '='
        },
        link: function link($scope, element) {
            $scope.class = {};

            var select = angular.element('<ui-select/>');
            var match = angular.element('<ui-select-match/>');
            var choices = angular.element('<ui-select-choices/>');
            var grouby = _.get($scope, 'options.grouby', false);
            var bind = _.get($scope, 'options.bind', null);
            var selected = _.get($scope, 'options.selected', null);
            var multiple = _.get($scope, 'options.multiple', false);
            var repeat = [];
            var filter = [];
            var request = false;

            repeat.push('item' + (bind ? '.' + bind : ''));
            repeat.push('as item in options.options');
            repeat.push('| filter: $select.search');

            select.attr('data-ng-model', 'parent[options.name]');
            select.attr('theme', _.get($scope, 'options.theme', 'bootstrap'));
            choices.attr('repeat', repeat.join(' '));

            if (selected) {
                selected = '.' + selected;
            }

            if (multiple) {
                match.html('{{ $item' + selected + ' }}');
            } else {
                filter.push('| highlight:$select.search');
                match.html('{{ $select.selected' + selected + ' }}');
            }

            if (grouby) {
                choices.attr('group-by', grouby);
            }

            if (multiple) {
                select.attr('multiple', true);
            }

            if (_.get($scope, 'options.appendToBody', false)) {
                select.attr('append-to-body', 'true');
            }

            if (_.has($scope, 'options.placeholder')) {
                match.attr('placeholder', $scope.options.placeholder);
            }

            if (_.get($scope, 'options.http', false)) {
                request = function request(query) {
                    var req = {};
                    var url = _.get($scope, 'options.http.url', false);

                    if (url && url.replace) {
                        req.url = url.replace('%s', query);
                    }

                    return $q.resolve(_.assign({}, $scope.options.http, req)).then($http).then(function (res) {
                        return res.data;
                    });
                };
            } else if (_.get($scope, 'options.service', false)) {
                var service = $injector.get($scope.options.service);
                request = function request(query) {
                    return $q.resolve(service(query));
                };
            } else if (_.get($scope, 'options.resource.name', false)) {
                var resource = $injector.get($scope.options.resource.name);
                var method = _.get($scope, 'options.resource.method', 'query');
                var key = _.get($scope, 'options.resource.key', 'query');
                request = function request(query) {
                    return resource[method](_.set({}, key, query)).$promise;
                };
            }

            if (request) {
                choices.attr('refresh', 'refresh($select.search)');

                if (_.get($scope, 'options.refresh', false)) {
                    $scope.refresh = function (query) {
                        return request(query).then(function (res) {
                            return $scope.options.options = res;
                        });
                    };

                    if (_.has($scope, 'options.refreshDelay')) {
                        choices.attr('refresh-delay', $scope.options.refreshDelay);
                    }
                } else {
                    $scope.refresh = function (query) {
                        if (!_.has($scope, 'options.options')) {
                            return request(query).then(function (res) {
                                return $scope.options.options = res;
                            });
                        }
                    };
                }
            }

            if (!$scope.model && _.has($scope, 'options.default.value')) {
                $scope.model = $scope.options.default.value;
            }

            if ($scope.horizontal) {
                var numeric = !_.isArray($scope.offset) && $scope.offset - parseFloat($scope.offset) + 1 >= 0;
                var offset = numeric ? parseInt($scope.offset) : 2;

                $scope.class.wrapper = 'col-sm-' + (12 - offset);

                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + offset;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + offset;
                }
            }

            if (_.has($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.get($scope, 'options.panel', false)) {
                $scope.class.panel = 'panel ' + _.get($scope, 'options.panel.type', 'panel-default');
            }

            if (_.get($scope, 'options.template', false)) {
                choices.html($scope.options.template);
            } else if (_.get($scope, 'options.templateDirective', false)) {
                choices.html('<' + $scope.options.templateDirective + '/>');
            } else if (_.get($scope, 'options.templateUrl', false)) {
                choices.html('<ng-include src="' + $scope.options.templateUrl + '"></ng-include>');
            } else {
                choices.html('<span ng-bind-html="item' + selected + ' ' + filter.join(' ') + '"/>');
            }

            if (!$scope.model && _.get($scope, 'options.default.field', false)) {
                var watch = $scope.root.$watch('model.' + $scope.options.default.field, function (val) {
                    if (!val) {} else if ($scope.validation.$dirty) {
                        watch();
                    } else {
                        $scope.model = val;
                    }
                }, true);
            }

            select.append(match).append(choices);
            element.find('span').replaceWith($compile(select)($scope));
        }
    };
}]);

'use strict';

angular.module('akat-form-creator').factory('dynformfilters', ['$injector', '$log', function ($injector, $log) {
    function inject(filters, data) {
        var key = _.get(data, 'type', data);

        if ($injector.has(key)) {
            filters.push($injector.get(key)(data));
        } else if ($injector.has('dynform' + key)) {
            filters.push($injector.get('dynform' + key)(data));
        } else {
            $log.error('Unabled to find filter', key);
        }

        return filters;
    }

    return function (filters) {
        return _.reduce(filters, inject, []);
    };
}]).factory('dynformreplace', function () {
    return function (conf) {
        var from = _.get(conf, 'from', false);
        var to = _.get(conf, 'to', '');

        console.log('asfsfd', from, to);

        if (!from) {
            return function (value) {
                return value;
            };
        }
        return function (value) {
            return value && value.replace ? value.replace(from, to) : value;
        };
    };
}).factory('dynformlowercase', function () {
    return function () {
        return function (value) {
            return value && value.toLowerCase ? value.toLowerCase() : value;
        };
    };
}).factory('dynformuppercase', function () {
    return function () {
        return function (value) {
            return value && value.toUpperCase ? value.toUpperCase() : value;
        };
    };
}).factory('dynformtrim', function () {
    return function () {
        return function (value) {
            return value && value.trim ? value.trim() : value;
        };
    };
}).factory('dynformlatinise', function () {
    return function () {
        return function (value) {
            return value && _.isString(value) ? S(value).latinise().s : value;
        };
    };
}).factory('dynformslugify', function () {
    return function () {
        return function (value) {
            return value && _.isString(value) ? S(value).slugify().s : value;
        };
    };
}).constant('dynformgreeklishmap', {
    'ου': 'ou', 'ΟΥ': 'OU', 'Ού': 'Ou', 'ού': 'ou', 'αυ': 'au', 'ΑΥ': 'AU', 'Αύ': 'Au', 'αύ': 'au',
    'ευ': 'eu', 'ΕΥ': 'EU', 'Εύ': 'Eu', 'εύ': 'eu', 'α': 'a', 'Α': 'A', 'ά': 'a', 'Ά': 'A', 'β': 'b',
    'Β': 'B', 'γ': 'g', 'Γ': 'G', 'δ': 'd', 'Δ': 'D', 'ε': 'e', 'Ε': 'E', 'έ': 'e', 'Έ': 'E', 'ζ': 'z',
    'Ζ': 'Z', 'η': 'i', 'Η': 'I', 'ή': 'i', 'Ή': 'I', 'θ': 'th', 'Θ': 'th', 'ι': 'i', 'Ι': 'I', 'ί': 'i',
    'Ί': 'I', 'ϊ': 'i', 'ΐ': 'i', 'Ϊ': 'I', 'κ': 'k', 'Κ': 'K', 'λ': 'l', 'Λ': 'L', 'μ': 'm', 'Μ': 'M',
    'ν': 'n', 'Ν': 'N', 'ξ': 'ks', 'Ξ': 'KS', 'ο': 'o', 'Ο': 'O', 'ό': 'o', 'Ό': 'O', 'π': 'p', 'Π': 'P',
    'ρ': 'r', 'Ρ': 'R', 'σ': 's', 'Σ': 'S', 'ς': 's', 'τ': 't', 'Τ': 'T', 'υ': 'y', 'Υ': 'Y', 'ύ': 'y',
    'Ύ': 'y', 'ϋ': 'y', 'ΰ': 'y', 'Ϋ': 'Y', 'φ': 'f', 'Φ': 'f', 'χ': 'x', 'Χ': 'X', 'ψ': 'ps',
    'Ψ': 'PS', 'ω': 'o', 'Ω': 'O', 'ώ': 'o', 'Ώ': 'O'
}).factory('dynformgreeklish', ['dynformgreeklishmap', function (dynformgreeklishmap) {
    function convert(char) {
        return dynformgreeklishmap[char] || char;
    }

    return function () {
        return function (value) {
            return value && value.replace ? value.replace(/[^A-Za-z0-9\[\] ]/g, convert) : value;
        };
    };
}]).factory('dynformnormalize', function () {
    return function (conf) {
        return function (value) {
            if (!_.isString(value)) {
                return value;
            }

            var normalized = value.normalize(_.get(conf, 'type', 'NFD'));
            var res = '',
                i = 0,
                j = 0;

            while (i < value.length) {
                res += normalized[j];
                j += value[i] == normalized[j] ? 1 : 2;
                ++i;
            }

            return res;
        };
    };
});

angular.module('akat-form-creator').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('submodules/akat-form-creator/elements/box/box.html',
    "<div class=\"box form-group\">\n" +
    "    <label data-ng-if=\"options.label\" data-ng-class=\"class.label\">{{ options.label }}</label>\n" +
    "</div>"
  );


  $templateCache.put('submodules/akat-form-creator/elements/boxarray/boxarray.html',
    "<div class=\"form-group\">\n" +
    "\n" +
    "    <label data-ng-if=\"options.label\" data-ng-class=\"class.label\">{{ options.label }}</label>\n" +
    "\n" +
    "    <div data-ng-class=\"class.wrapper\">\n" +
    "        <div data-ng-class=\"class.panel\">\n" +
    "\n" +
    "            <div data-ng-if=\"options.panel.heading\" class=\"panel-heading\">\n" +
    "                {{ options.panel.heading }}\n" +
    "            </div>\n" +
    "\n" +
    "            <div data-ng-class=\"{ 'panel-body': options.panel }\">\n" +
    "\n" +
    "                <div data-ng-if=\"!options.sortable\" data-ng-repeat=\"item in model\">\n" +
    "\n" +
    "                    <dynfields\n" +
    "                        data-options=\"options\"\n" +
    "                        data-model=\"item\"\n" +
    "                        data-parent=\"item\"\n" +
    "                        data-root=\"root\"\n" +
    "                        data-name=\"{{ name + '-' + $index }}\"\n" +
    "                        data-form=\"form\"\n" +
    "                        data-validation=\"validation || form\"\n" +
    "                        data-horizontal=\"fieldsHorizontal\"\n" +
    "                        data-inline=\"fieldsInline\"\n" +
    "                        data-offset=\"fieldsOffset\"\n" +
    "                    ></dynfields>\n" +
    "\n" +
    "                    <div data-ng-if=\"controls\" class=\"form-group controls\">\n" +
    "                        <div class=\"col-sm-11 col-sm-offset-1 input-group-btn\">\n" +
    "                            <button type=\"button\" class=\"btn btn-danger\">\n" +
    "                                <span class=\"glyphicon glyphicon-minus\"></span>\n" +
    "                            </button>\n" +
    "                            <button data-ng-if=\"$last\" type=\"button\" class=\"btn btn-default\">\n" +
    "                                <span class=\"glyphicon glyphicon-plus\"></span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "\n" +
    "                <div data-ng-if=\"options.sortable\" ui-sortable=\"options.sortable\" ng-model=\"model\">\n" +
    "                    <div data-ng-repeat=\"item in model\">\n" +
    "\n" +
    "                        <dynfields\n" +
    "                            data-options=\"options\"\n" +
    "                            data-model=\"item\"\n" +
    "                            data-parent=\"item\"\n" +
    "                            data-root=\"root\"\n" +
    "                            data-name=\"{{ name + '-' + $index }}\"\n" +
    "                            data-form=\"form\"\n" +
    "                            data-validation=\"validation || form\"\n" +
    "                            data-horizontal=\"fieldsHorizontal\"\n" +
    "                            data-inline=\"fieldsInline\"\n" +
    "                            data-offset=\"fieldsOffset\"\n" +
    "                        ></dynfields>\n" +
    "\n" +
    "                        <div data-ng-if=\"controls\" class=\"form-group\">\n" +
    "                            <div class=\"col-sm-11 col-sm-offset-1 input-group-btn\">\n" +
    "                                <button data-ng-click=\"delete( $index, item )\" type=\"button\" class=\"btn btn-danger\">\n" +
    "                                    <span class=\"glyphicon glyphicon-minus\"></span>\n" +
    "                                </button>\n" +
    "                                <button data-ng-click=\"add()\" data-ng-if=\"$last\" type=\"button\" class=\"btn btn-default\">\n" +
    "                                    <span class=\"glyphicon glyphicon-plus\"></span>\n" +
    "                                </button>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div data-ng-if=\"controls && !model.length\" class=\"form-group\">\n" +
    "                    <div class=\"col-sm-11 col-sm-offset-1 input-group-btn\">\n" +
    "                        <button data-ng-click=\"add()\" type=\"button\" class=\"btn btn-default\">\n" +
    "                            <span class=\"glyphicon glyphicon-plus\"></span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('submodules/akat-form-creator/elements/checkbox/checkbox.html',
    "<div class=\"form-group\" data-ng-class=\"{ 'has-error' : validation.$touched && validation.$invalid }\">\n" +
    "\n" +
    "    <label data-ng-if=\"options.label\" data-ng-class=\"class.label\">{{ options.label }}</label>\n" +
    "\n" +
    "    <div ng-style=\"inline && {'display': 'inline-block'}\" data-ng-class=\"class.wrapper\">\n" +
    "        <div data-ng-class=\"class.panel\">\n" +
    "            <div data-ng-if=\"options.panel.heading\" class=\"panel-heading\">\n" +
    "                {{ options.panel.heading }}\n" +
    "            </div>\n" +
    "            <div data-ng-class=\"{ 'panel-body': options.panel }\">\n" +
    "                <div class=\"checkbox\">\n" +
    "                    <label>\n" +
    "                        <input type=\"checkbox\" name=\"{{ name }}\" ng-model=\"model\">\n" +
    "                        {{options.text}}\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('submodules/akat-form-creator/elements/datepicker/datepicker.html',
    "<div class=\"form-group\" ng-init=\"init()\" data-ng-class=\"{ 'has-error' : validation.$touched && validation.$invalid }\">\n" +
    "\n" +
    "    <label data-ng-if=\"options.label\" data-ng-class=\"class.label\">{{ options.label }}</label>\n" +
    "\n" +
    "    <div ng-style=\"inline && {'display': 'inline-block'}\" data-ng-class=\"class.wrapper\">\n" +
    "        <div data-ng-class=\"class.panel\">\n" +
    "\n" +
    "            <div data-ng-if=\"options.panel.heading\" class=\"panel-heading\">\n" +
    "                {{ options.panel.heading }}\n" +
    "            </div>\n" +
    "            <div data-ng-class=\"{ 'panel-body': options.panel }\">\n" +
    "                <div class=\"input-group\">\n" +
    "                    <input\n" +
    "                        type=\"text\"\n" +
    "                        name=\"{{ name }}\"\n" +
    "                        class=\"form-control\"\n" +
    "                        uib-datepicker-popup=\"{{format}}\"\n" +
    "                        ng-model=\"model\"\n" +
    "                        is-open=\"popup1.opened\"\n" +
    "                        datepicker-options=\"dateOptions\"\n" +
    "                        ng-required=\"true\"\n" +
    "                        close-text=\"Close\"\n" +
    "                        alt-input-formats=\"altInputFormats\"\n" +
    "                    />\n" +
    "\n" +
    "                    <span class=\"input-group-btn\">\n" +
    "                        <button type=\"button\" class=\"btn btn-default\" ng-click=\"open1()\"><i class=\"glyphicon glyphicon-calendar\"></i></button>\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('submodules/akat-form-creator/elements/datetimepicker/datetimepicker.html',
    "<div class=\"form-group\" data-ng-class=\"{ 'has-error' : validation.$touched && validation.$invalid }\">\n" +
    "\n" +
    "    <label data-ng-if=\"options.label\" data-ng-class=\"class.label\">{{ options.label }}</label>\n" +
    "\n" +
    "    <div ng-style=\"inline && {'display': 'inline-block'}\" data-ng-class=\"class.wrapper\">\n" +
    "        <div data-ng-class=\"class.panel\">\n" +
    "\n" +
    "            <div data-ng-if=\"options.panel.heading\" class=\"panel-heading\">\n" +
    "                {{ options.panel.heading }}\n" +
    "            </div>\n" +
    "\n" +
    "            <div data-ng-class=\"{ 'panel-body': options.panel }\">\n" +
    "                <div class=\"input-group\">\n" +
    "                    <input\n" +
    "                        type=\"text\"\n" +
    "                        name=\"{{ name }}\"\n" +
    "                        class=\"form-control\"\n" +
    "                        placeholder=\"{{ options.placeholder }}\"\n" +
    "                        data-ng-model=\"model\"\n" +
    "\n" +
    "                        data-ng-required=\"options.required\"\n" +
    "                    />\n" +
    "                    <span class=\"input-group-addon\">\n" +
    "                        <span class=\"glyphicon glyphicon-calendar\"></span>\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "\n" +
    "                <div data-ng-if=\"!inline\">\n" +
    "                    <p data-ng-show=\"validation.$touched && validation.$error.required\" class=\"help-block\">{{ options.name }} is required.</p>\n" +
    "                    <p data-ng-show=\"validation.$error.minlength\" class=\"help-block\">{{ options.name }} is too short.</p>\n" +
    "                    <p data-ng-show=\"validation.$error.maxlength\" class=\"help-block\">{{ options.name }} is too long.</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('submodules/akat-form-creator/elements/directive/directive.html',
    "<div class=\"form-group\" data-ng-class=\"{ 'has-error' : validation.$touched && validation.$invalid }\">\n" +
    "\n" +
    "    <label data-ng-if=\"options.label\" data-ng-class=\"class.label\">{{ options.label }}</label>\n" +
    "\n" +
    "    <div ng-style=\"inline && {'display': 'inline-block'}\" data-ng-class=\"class.wrapper\">\n" +
    "        <div data-ng-class=\"class.panel\">\n" +
    "\n" +
    "            <div data-ng-if=\"options.panel.heading\" class=\"panel-heading\">\n" +
    "                {{ options.panel.heading }}\n" +
    "            </div>\n" +
    "\n" +
    "            <div data-ng-class=\"{ 'panel-body': options.panel }\">\n" +
    "                <spam hidden></spam>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('submodules/akat-form-creator/elements/email/email.html',
    "<div class=\"form-group\" data-ng-class=\"{ 'has-error' : validation.$touched && validation.$invalid }\">\n" +
    "\n" +
    "    <label data-ng-if=\"options.label\" data-ng-class=\"class.label\">{{ options.label }}</label>\n" +
    "\n" +
    "    <div ng-style=\"inline && {'display': 'inline-block'}\" data-ng-class=\"class.wrapper\">\n" +
    "        <div data-ng-class=\"class.panel\">\n" +
    "\n" +
    "            <div data-ng-if=\"options.panel.heading\" class=\"panel-heading\">\n" +
    "                {{ options.panel.heading }}\n" +
    "            </div>\n" +
    "\n" +
    "            <div data-ng-class=\"{ 'panel-body': options.panel }\">\n" +
    "                <div class=\"input-group\">\n" +
    "                    <span class=\"input-group-addon\">@</span>\n" +
    "                    <input\n" +
    "                        type=\"email\"\n" +
    "                        name=\"{{ name }}\"\n" +
    "                        class=\"form-control\"\n" +
    "                        placeholder=\"{{options.placeholder}}\"\n" +
    "                        ng-model=\"model\"\n" +
    "\n" +
    "                        ng-attr-ng-minlength=\"{{ options.validators.minlength }}\"\n" +
    "                        ng-attr-ng-maxlength=\"{{ options.validators.maxlength }}\"\n" +
    "                        ng-required=\"options.required\"\n" +
    "                    />\n" +
    "                </div>\n" +
    "\n" +
    "                <div data-ng-if=\"!inline\">\n" +
    "                    <p data-ng-show=\"validation.$touched && validation.$error.required\" class=\"help-block\">{{ options.name }} is required.</p>\n" +
    "                    <p data-ng-show=\"validation.$error.minlength\" class=\"help-block\">{{ options.name }} is too short.</p>\n" +
    "                    <p data-ng-show=\"validation.$error.maxlength\" class=\"help-block\">{{ options.name }} is too long.</p>\n" +
    "                    <p data-ng-show=\"validation.$error.email\" class=\"help-block\">{{ options.name }} is not a valid email.</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('submodules/akat-form-creator/elements/password/password.html',
    "<div class=\"form-group\" data-ng-class=\"{ 'has-error' : validation.$touched && validation.$invalid }\">\n" +
    "\n" +
    "    <label data-ng-if=\"options.label\" data-ng-class=\"class.label\">{{ options.label }}</label>\n" +
    "\n" +
    "    <div ng-style=\"inline && {'display': 'inline-block'}\" data-ng-class=\"class.wrapper\">\n" +
    "        <div data-ng-class=\"class.panel\">\n" +
    "\n" +
    "            <div data-ng-if=\"options.panel.heading\" class=\"panel-heading\">\n" +
    "                {{ options.panel.heading }}\n" +
    "            </div>\n" +
    "\n" +
    "            <div data-ng-class=\"{ 'panel-body': options.panel }\">\n" +
    "                <input\n" +
    "                    type=\"password\"\n" +
    "                    name=\"{{ name }}\"\n" +
    "                    class=\"form-control\"\n" +
    "                    placeholder=\"{{options.placeholder}}\"\n" +
    "                    data-ng-model=\"model\"\n" +
    "\n" +
    "                    data-ng-attr-ng-minlength=\"{{ options.validators.minlength }}\"\n" +
    "                    data-ng-attr-ng-maxlength=\"{{ options.validators.maxlength }}\"\n" +
    "                    data-ng-required=\"options.required\"\n" +
    "                />\n" +
    "\n" +
    "                <div data-ng-if=\"!inline\">\n" +
    "                    <p data-ng-show=\"validation.$touched && validation.$error.required\" class=\"help-block\">{{ options.name }} is required.</p>\n" +
    "                    <p data-ng-show=\"validation.$error.minlength\" class=\"help-block\">{{ options.name }} is too short.</p>\n" +
    "                    <p data-ng-show=\"validation.$error.maxlength\" class=\"help-block\">{{ options.name }} is too long.</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('submodules/akat-form-creator/elements/radio/radio.html',
    "<div class=\"form-group\" data-ng-class=\"{ 'has-error' : validation.$touched && validation.$invalid }\">\n" +
    "\n" +
    "    <label data-ng-if=\"options.label\" data-ng-class=\"class.label\">{{ options.label }}</label>\n" +
    "\n" +
    "    <div data-ng-class=\"class.wrapper\">\n" +
    "        <div data-ng-class=\"class.panel\">\n" +
    "\n" +
    "            <div data-ng-if=\"options.panel.heading\" class=\"panel-heading\">\n" +
    "                {{ options.panel.heading }}\n" +
    "            </div>\n" +
    "\n" +
    "            <div data-ng-class=\"{ 'panel-body': options.panel }\">\n" +
    "                <div class=\"radio\" ng-repeat=\"radio in options.values\">\n" +
    "                    <label>\n" +
    "                        <input type=\"radio\" data-ng-model=\"parent[options.name]\" data-ng-change=\"update(radio[key.value])\" name=\"{{ name }}\" value=\"{{ radio[key.value] }}\" >\n" +
    "                        {{ radio[key.text] }}\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('submodules/akat-form-creator/elements/richtext/richtext.html',
    "<div class=\"form-group\" data-ng-class=\"{ 'has-error' : validation.$touched && validation.$invalid }\">\n" +
    "\n" +
    "    <label data-ng-if=\"options.label\" data-ng-class=\"class.label\">{{ options.label }}</label>\n" +
    "\n" +
    "    <div data-ng-class=\"class.wrapper\">\n" +
    "        <div data-ng-class=\"class.panel\">\n" +
    "\n" +
    "            <div data-ng-if=\"options.panel.heading\" class=\"panel-heading\">\n" +
    "                {{ options.panel.heading }}\n" +
    "            </div>\n" +
    "\n" +
    "            <div data-ng-class=\"{ 'panel-body': options.panel }\">\n" +
    "                <text-angular\n" +
    "                    ng-model=\"model\"\n" +
    "                    ta-unsafe-sanitizer=\"true\"\n" +
    "                ></text-angular>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('submodules/akat-form-creator/elements/selectbox/selectbox.html',
    "<div class=\"form-group\" data-ng-class=\"{ 'has-error' : validation.$touched && validation.$invalid }\">\n" +
    "\n" +
    "    <label data-ng-if=\"options.label\" data-ng-class=\"class.label\">{{ options.label }}</label>\n" +
    "\n" +
    "    <div ng-style=\"inline && {'display': 'inline-block'}\" data-ng-class=\"class.wrapper\">\n" +
    "        <div data-ng-class=\"class.panel\">\n" +
    "\n" +
    "            <div data-ng-if=\"options.panel.heading\" class=\"panel-heading\">\n" +
    "                {{ options.panel.heading }}\n" +
    "            </div>\n" +
    "\n" +
    "            <div data-ng-class=\"{ 'panel-body': options.panel }\">\n" +
    "                <select name=\"{{ name }}\" class=\"form-control\" data-ng-model=\"model\">\n" +
    "                    <option ng-repeat=\"option in options.options\" value=\"{{option[key.value]}}\">{{option[key.text]}}</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('submodules/akat-form-creator/elements/tabs/tabs.html',
    "<div class=\"form-group\">\n" +
    "    <label data-ng-if=\"options.label\" data-ng-class=\"class.label\">{{ options.label }}</label>\n" +
    "\n" +
    "    <div data-ng-class=\"class.wrapper\">\n" +
    "        <div data-ng-class=\"class.panel\">\n" +
    "\n" +
    "            <div data-ng-if=\"options.panel.heading\" class=\"panel-heading\">\n" +
    "                {{ options.panel.heading }}\n" +
    "            </div>\n" +
    "\n" +
    "            <div data-ng-class=\"{ 'panel-body': options.panel }\">\n" +
    "                <uib-tabset active=\"active\">\n" +
    "                    <uib-tab index=\"$index + 1\" ng-repeat=\"tab in options.tabs\" heading=\"{{ tab.tabname }}\">\n" +
    "                        <uib-tab-heading>{{ tab.tabname }}</uib-tab-heading>\n" +
    "                            <br/>\n" +
    "                            <dynfields\n" +
    "                                data-name=\"{{ (name ? name + '-' : '') + tab.tabname }}\"\n" +
    "                                data-options=\"tab\"\n" +
    "                                data-model=\"model[tab.tabname]\"\n" +
    "                                data-parent=\"model\"\n" +
    "                                data-root=\"root\"\n" +
    "                                data-validation=\"form\"\n" +
    "                                data-form=\"form\"\n" +
    "                                data-ng-attr-data-offset=\"tabsOffset\"\n" +
    "                                data-ng-attr-data-horizontal=\"tabsHorizontal\"\n" +
    "                                data-ng-attr-data-inline=\"tabsInline\"\n" +
    "                            ></dynfields>\n" +
    "                        <hr>\n" +
    "                    </uib-tab>\n" +
    "                </uib-tabset>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('submodules/akat-form-creator/elements/tags/tags.html',
    "<div class=\"form-group\" data-ng-class=\"{ 'has-error' : validation.$touched && validation.$invalid }\">\n" +
    "\n" +
    "    <label data-ng-if=\"options.label\" data-ng-class=\"class.label\">{{ options.label }}</label>\n" +
    "\n" +
    "    <div data-ng-class=\"class.wrapper\">\n" +
    "        <div data-ng-class=\"class.panel\">\n" +
    "\n" +
    "            <div data-ng-if=\"options.panel.heading\" class=\"panel-heading\">\n" +
    "                {{ options.panel.heading }}\n" +
    "            </div>\n" +
    "\n" +
    "            <div data-ng-class=\"{ 'panel-body': options.panel }\">\n" +
    "                <tags-input\n" +
    "                    name=\"{{ ::name }}\"\n" +
    "                    ng-model=\"model\"\n" +
    "                    ng-attr-min-tags=\"{{ options.validators.minlength }}\"\n" +
    "                    ng-attr-max-tags=\"{{ options.validators.maxlength }}\"\n" +
    "                    ng-attr-allow-leftover-text=\"{{ options.allowLeftOverText }}\"\n" +
    "                    ng-required=\"options.required\"\n" +
    "                >\n" +
    "                    <auto-complete source=\"setData($query)\"></auto-complete>\n" +
    "                </tags-input>\n" +
    "\n" +
    "                <div>\n" +
    "                    <p data-ng-show=\"validation.$touched && validation.$error.required\" class=\"help-block\">{{ options.name }} is required.</p>\n" +
    "                    <p data-ng-show=\"validation.$error.minlength\" class=\"help-block\">{{ options.name }} is too short.</p>\n" +
    "                    <p data-ng-show=\"validation.$error.maxlength\" class=\"help-block\">{{ options.name }} is too long.</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('submodules/akat-form-creator/elements/textarea/textarea.html',
    "<div class=\"form-group\" data-ng-class=\"{ 'has-error' : validation.$touched && validation.$invalid }\">\n" +
    "\n" +
    "    <label data-ng-if=\"options.label\" data-ng-class=\"class.label\">{{ options.label }}</label>\n" +
    "\n" +
    "    <div data-ng-class=\"class.wrapper\">\n" +
    "        <div data-ng-class=\"class.panel\">\n" +
    "\n" +
    "            <div data-ng-if=\"options.panel.heading\" class=\"panel-heading\">\n" +
    "                {{ options.panel.heading }}\n" +
    "            </div>\n" +
    "\n" +
    "            <div data-ng-class=\"{ 'panel-body': options.panel }\">\n" +
    "                <textarea\n" +
    "                    name=\"{{ ::name }}\"\n" +
    "                    rows=\"{{ options.rows || 4 }}\"\n" +
    "                    cols=\"{{ options.cols || 50 }}\"\n" +
    "                    class=\"form-control\"\n" +
    "                    placeholder=\"{{options.placeholder}}\"\n" +
    "                    ng-model=\"model\"\n" +
    "\n" +
    "                    ng-attr-ng-minlength=\"{{ options.validators.minlength }}\"\n" +
    "                    ng-attr-ng-maxlength=\"{{ options.validators.maxlength }}\"\n" +
    "                    ng-required=\"options.required\"\n" +
    "                ></textarea>\n" +
    "\n" +
    "                <div>\n" +
    "                    <p data-ng-show=\"validation.$touched && validation.$error.required\" class=\"help-block\">{{ options.name }} is required.</p>\n" +
    "                    <p data-ng-show=\"validation.$error.minlength\" class=\"help-block\">{{ options.name }} is too short.</p>\n" +
    "                    <p data-ng-show=\"validation.$error.maxlength\" class=\"help-block\">{{ options.name }} is too long.</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('submodules/akat-form-creator/elements/textfield/textfield.html',
    "<div class=\"form-group\" data-ng-class=\"{ 'has-error' : validation.$touched && validation.$invalid }\">\n" +
    "\n" +
    "    <label data-ng-if=\"options.label\" data-ng-class=\"class.label\">{{ options.label }}</label>\n" +
    "\n" +
    "    <div ng-style=\"inline && {'display': 'inline-block'}\" data-ng-class=\"class.wrapper\">\n" +
    "        <div data-ng-class=\"class.panel\">\n" +
    "\n" +
    "            <div data-ng-if=\"options.panel.heading\" class=\"panel-heading\">\n" +
    "                {{ options.panel.heading }}\n" +
    "            </div>\n" +
    "\n" +
    "            <div data-ng-class=\"{ 'panel-body': options.panel }\">\n" +
    "                <input\n" +
    "                    type=\"text\"\n" +
    "                    name=\"{{ name }}\"\n" +
    "                    class=\"form-control\"\n" +
    "                    placeholder=\"{{options.placeholder}}\"\n" +
    "                    data-ng-model=\"model\"\n" +
    "\n" +
    "                    data-ng-attr-ng-minlength=\"{{ options.validators.minlength }}\"\n" +
    "                    data-ng-attr-ng-maxlength=\"{{ options.validators.maxlength }}\"\n" +
    "                    data-ng-trim=\"options.trim\"\n" +
    "                    data-ng-required=\"options.required\"\n" +
    "                />\n" +
    "\n" +
    "                <div data-ng-if=\"!inline\">\n" +
    "                    <p data-ng-show=\"validation.$touched && validation.$error.required\" class=\"help-block\">{{ options.name }} is required.</p>\n" +
    "                    <p data-ng-show=\"validation.$error.minlength\" class=\"help-block\">{{ options.name }} is too short.</p>\n" +
    "                    <p data-ng-show=\"validation.$error.maxlength\" class=\"help-block\">{{ options.name }} is too long.</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('submodules/akat-form-creator/elements/uiselect/uiselect.html',
    "<div class=\"form-group\">\n" +
    "    <label data-ng-if=\"options.label\" data-ng-class=\"class.label\">{{ options.label }}</label>\n" +
    "\n" +
    "    <div data-ng-class=\"class.wrapper\">\n" +
    "        <div data-ng-class=\"class.panel\">\n" +
    "\n" +
    "            <div data-ng-if=\"options.panel.heading\" class=\"panel-heading\">\n" +
    "                {{ options.panel.heading }}\n" +
    "            </div>\n" +
    "\n" +
    "            <div data-ng-class=\"{ 'panel-body': options.panel }\">\n" +
    "                <span></span>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );

}]);
