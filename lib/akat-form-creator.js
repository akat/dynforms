'use strict';

angular.module("akat-form-creator", ['textAngular', 'ngTagsInput', 'ui.bootstrap', 'ui.select']);

'use strict';

angular.module('akat-form-creator').directive('elembox', ['$compile', function ($compile) {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/box/elembox.html',
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
        }
    };
}]);

'use strict';

angular.module('akat-form-creator').directive('elemboxarray', ['$compile', 'lodash', function ($compile, lodash) {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/boxarray/boxarray.html',
        replace: true,
        restrict: 'E',
        scope: {
            model: '=',
            options: '='
        },
        link: function link($scope, element, attr) {
            var options = _.get($scope, 'options', {});

            $scope.class = {};
            $scope.model = [{}, {}];
            $scope.objectHorizontal = _.has(options, 'horizontal') ? options.horizontal : $scope.horizontal;
            $scope.objectInline = _.has(options, 'inline') ? options.inline : $scope.inline;
            $scope.objectOffset = _.has(options, 'offset') ? options.offset : $scope.offset;

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
                element.addClass('panel panel-default');
            }
            /*
            function addElement(primarykey) {
                $scope.options.subfields.forEach(function(elem) {
                    var template = angular.element('<' + elem.type + ' />');
                    template.attr('options', elem);
                    template.attr('model', 'model["' + $scope.options.name + '"][' + primarykey + ']');
                     var compiled = $compile(template)($scope);
                     //add panel class if is true
                    if (elem.panel) {
                        element.addClass('panel panel-default');
                    }
                     //append compiled element
                    element.append(compiled);
                }, this);
            }
             $scope.subfields = $scope.options.subfields;
            lodash.set($scope, 'model["' + $scope.options.name + '"]', [{}]);
            $scope.keysize = $scope.model[$scope.options.name].length;
             function prepareArrayElement(newValue) {
                if (newValue) {
                    element.empty();
                    lodash.each(lodash.range($scope.keysize), addElement);
                }
            }
             $scope.$watch('keysize', prepareArrayElement);
             $scope.addElement = function() {
                $scope.model[$scope.options.name].push({});
                ++$scope.keysize;
            };
             $scope.removeElement = function(id) {
                delete $scope.model[$scope.options.name][id];
                --$scope.keysize;
            };
             // $timeout(function(params) {
            //     alert('timeout');
            //     $scope.addElement();
            // },2000);
             // $timeout(function(params) {
            //     $scope.removeElement(1);
            // },4000);
             //set class
             element.parent().addClass($scope.options.class);
            */
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
        }
    };
});

'use strict';

angular.module('akat-form-creator').directive('elemdirective', ['$compile', function ($compile) {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/directive/directive.html',
        restrict: 'E',
        replace: true,
        scope: {
            name: '@',
            model: '=',
            options: '=',
            validation: '=',
            offset: '=',
            inline: '=',
            horizontal: '='
        },
        link: function link($scope, element) {
            $scope.class = {};

            if (!$scope.model && _.has($scope, 'options.default')) {
                $scope.model = $scope.options.default;
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
        }
    };
}]);

'use strict';

angular.module('akat-form-creator').directive('elememail', function () {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/email/email.html',
        restrict: 'E',
        replace: true,
        scope: {
            name: '@',
            model: '=',
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
        }
    };
});

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
                child.attr('data-root', 'model');
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
            options: '=',
            validation: '=',
            offset: '=',
            horizontal: '='
        },
        link: function link($scope) {
            $scope.value = null;
            $scope.class = {};

            $scope.key = {
                value: _.get($scope, 'options.ajax.value', 'value'),
                text: _.get($scope, 'options.ajax.text', 'text')
            };

            if (!$scope.model && _.has($scope, 'options.default')) {
                $scope.model = $scope.options.default;
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

            $scope.update = function (value) {
                $scope.model = value;
            };
        }
    };
}]);

'use strict';

angular.module('akat-form-creator').directive('elemrichtext', ['textAngularManager', 'taSelection', '$uibModal', '$timeout', function (textAngularManager, taSelection, $uibModal, $timeout) {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/richtext/richtext.html',
        restrict: 'E',
        replace: true,

        scope: {
            name: '@',
            model: '=',
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

            if (_.has($scope, 'options.tools')) {
                var tools = {};

                var build = function build(html, tool) {
                    var el = angular.element(html);
                    el.attr('data-tool-key', tool.tile || tool.key);
                    el.attr('data-tool-type', tool.key);
                    el.addClass('pre-directive');
                    return el;
                };

                var insert = function insert(node, html, tool) {
                    var space = document.createTextNode(' ');
                    var el = build(html, tool);
                    var sel = rangy.getSelection();

                    if (sel.rangeCount) {
                        var range = sel.getRangeAt(0);
                        $timeout(function () {
                            range.collapse(false);
                            range.insertNode(space);
                            range.insertNode(el[0]);
                            range.collapseAfter(space);
                            sel.setSingleRange(range);
                        });
                    }
                };

                var space = function space(node) {
                    if (!_.get(node, 'nextSibling.nodeValue', null)) {
                        node.parentNode.insertBefore(document.createTextNode(' '), node.nextSibling);
                    }
                };

                var replace = function replace(node, html, tool) {
                    if (html) {
                        space(node);
                        node.parentNode.replaceChild(build(html, tool)[0], node);
                    } else {
                        node.parentNode.removeChild(node);
                    }
                };

                var modal = function modal(node, tool, done, cancel) {
                    _.set(tool, 'modal.resolve.element', function () {
                        return node;
                    });
                    $uibModal.open(tool.modal).result.then(done ? function (html) {
                        return done(node, html, tool);
                    } : null, cancel ? function () {
                        return cancel(node);
                    } : null);
                };

                element.on('click', function (event) {
                    var key = event.target.getAttribute('data-tool-key');
                    if (key && tools[key]) {
                        modal(event.target, tools[key], replace, space);
                    }
                });

                /*element.on('keyup', () => {
                    var node = rangy.getSelection().anchorNode;
                    var key = node.getAttribute ? node.getAttribute('data-tool-key') : null;
                    if (key && tools[key]) {
                        modal(node, tools[key], replace, space);
                    }
                });*/

                _.each($scope.options.tools, function (tool) {
                    _.set(tool, 'modal.resolve.selection', function () {
                        return rangy.getSelection();
                    });
                    _.set(tool, 'modal.resolve.element', function () {
                        return null;
                    });
                    tool.action = function () {
                        modal(null, tool, insert);
                    };

                    var group = tool.group ? tool.group : undefined;
                    var index = tool.index ? tool.index : undefined;
                    tools[tool.key] = tool;
                    textAngularManager.addTool(tool.key, tool, group, index);
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

            if (!$scope.model && _.has($scope, 'options.default')) {
                $scope.model = $scope.options.default;
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
        }
    };
}]);

'use strict';

angular.module('akat-form-creator').directive('elemtextarea', function () {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/textarea/textarea.html',
        restrict: 'E',
        replace: true,
        scope: {
            name: '@',
            model: '=',
            options: '=',
            validation: '=',
            offset: '=',
            horizontal: '='
        },

        link: function link($scope, element) {
            $scope.class = {};

            if (!$scope.model && _.has($scope, 'options.default')) {
                $scope.model = $scope.options.default;
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
        }
    };
});

'use strict';

angular.module('akat-form-creator').directive('elemtextfield', function () {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/textfield/textfield.html',
        restrict: 'E',
        replace: true,
        scope: {
            name: '@',
            model: '=',
            options: '=',
            validation: '=',
            offset: '=',
            inline: '=',
            horizontal: '='
        },
        link: function link($scope, element) {
            $scope.class = {};

            if (!$scope.model && _.has($scope, 'options.default')) {
                $scope.model = $scope.options.default;
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
        }
    };
});

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

            if (_.get($scope, 'options.multiple', false)) {
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

            if (!$scope.model && _.has($scope, 'options.default')) {
                $scope.model = $scope.options.default;
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

            select.append(match).append(choices);
            console.log(select[0].outerHTML);
            element.find('span').replaceWith($compile(select)($scope));
        }
    };
}]);

angular.module('akat-form-creator').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('submodules/akat-form-creator/elements/box/elembox.html',
    "<div class=\"box form-group\">\n" +
    "    <label data-ng-if=\"options.label\" data-ng-class=\"class.label\">{{ options.label }}</label>\n" +
    "</div>"
  );


  $templateCache.put('submodules/akat-form-creator/elements/boxarray/boxarray.html',
    "<div class=\"box form-group\">\n" +
    "    <label data-ng-if=\"options.label\" data-ng-class=\"class.label\">{{ options.label }}</label>\n" +
    "\n" +
    "    <div data-ng-class=\"class.wrapper\">\n" +
    "        <dynfields ng-repeat=\"row in model\"\n" +
    "            data-options=\"options\"\n" +
    "            data-model=\"row\"\n" +
    "            data-ng-attr-data-name=\"{{ name + '-' + $index }}\"\n" +
    "            data-form=\"form\"\n" +
    "            data-validation=\"validation\"\n" +
    "            data-ng-attr-data-offset=\"objectOffset\"\n" +
    "            data-ng-attr-data-horizontal=\"objectHorizontal\"\n" +
    "            data-ng-attr-data-inline=\"objectInline\"\n" +
    "        >\n" +
    "        </dynfields>\n" +
    "    </div>\n" +
    "</div>"
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
    "                        <input type=\"radio\" data-ng-model=\"value\" data-ng-change=\"update(radio[key.value])\" name=\"{{ name }}\" value=\"{{ radio[key.value] }}\" >\n" +
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


  $templateCache.put('submodules/akat-form-creator/elements/richtext/something.html',
    "<div class=\"modal-header\">\n" +
    "    <h3 class=\"modal-title\" id=\"modal-title\">I'm a modal!</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\" id=\"modal-body\">\n" +
    "    <ul>\n" +
    "        <li ng-repeat=\"item in items\">\n" +
    "            <a href=\"#\" ng-click=\"$event.preventDefault(); selected.item = item\">{{ item }}</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    Selected: <b>{{ selected.item }}</b>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-primary\" type=\"button\" ng-click=\"ok()\">OK</button>\n" +
    "    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>"
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
