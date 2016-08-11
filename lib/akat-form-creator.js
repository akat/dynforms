'use strict';

angular.module("akat-form-creator", ['textAngular', 'ngTagsInput']);

'use strict';

angular.module('akat-form-creator').directive('elembox', ['$compile', function ($compile) {
  return {
    templateUrl: 'submodules/akat-form-creator/elements/box/elembox.html',
    replace: true,
    restrict: 'E',
    scope: {
      options: '='
    },
    link: function link($scope, element, attr) {
      var tmp = $scope.options && $scope.options.class ? $scope.options.class : null;
      if (tmp) {
        element.parent().addClass(tmp);
      }

      if ($scope.options.fields) {
        var subfields = $compile("<div class='subfields'></div>")($scope);

        _.forEach($scope.options.fields, function (value, key) {
          var template = angular.element('<' + value.type + ' />');
          template.attr('options', 'options.fields[' + key + ']');
          template.attr('parent', $scope.options.name);
          template.attr('model', 'model["' + $scope.options.name + '"]');

          var compiled = $compile(template)($scope);
          element.append($compile(template)($scope));
        });

        element.append(subfields);
      }
    }
  };
}]);

'use strict';

angular.module('akat-form-creator').directive('elemboxarray', ['$compile', 'lodash', '$timeout', function ($compile, lodash, $timeout) {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/boxarray/boxarray.html',
        replace: true,
        restrict: 'E',
        scope: { model: "=", options: "=" },
        link: function link($scope, element, attr) {
            $scope.subfields = $scope.options.subfields;
            lodash.set($scope, 'model["' + $scope.options.name + '"]', [{}]);
            $scope.keysize = $scope.model[$scope.options.name].length;

            function prepareArrayElement(newValue) {
                if (!newValue) return;
                element.empty();
                lodash.each(lodash.range($scope.keysize), addElement);
            }

            $scope.$watch('keysize', prepareArrayElement);

            $scope.addElement = function () {
                $scope.model[$scope.options.name].push({});
                ++$scope.keysize;
            };

            $scope.removeElement = function (id) {
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

            function addElement(primarykey) {

                $scope.options.subfields.forEach(function (elem, key) {
                    var template = angular.element('<' + elem.type + ' />');
                    template.attr('options', elem);
                    template.attr('model', 'model["' + $scope.options.name + '"][' + primarykey + ']');

                    var compiled = $compile(template)($scope);

                    //add panel class if is true
                    if (elem.panel) element.addClass('panel panel-default');

                    //append compiled element
                    element.append(compiled);
                }, this);
            }
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
                $scope.class.wrapper = 'col-sm-' + (12 - ($scope.offset || 2));
                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + $scope.offset || 2;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + $scope.offset || 2;
                }
            }

            if (_.has($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.get($scope, 'options.panel', false)) {
                element.addClass('panel panel-default');
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
                $scope.class.wrapper = 'col-sm-' + (12 - ($scope.offset || 2));
                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + $scope.offset || 2;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + $scope.offset || 2;
                }
            }

            if (_.has($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.get($scope, 'options.panel', false)) {
                element.addClass('panel panel-default');
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
                $scope.class.wrapper = 'col-sm-' + (12 - ($scope.offset || 2));
                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + $scope.offset || 2;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + $scope.offset || 2;
                }
            }

            if (_.has($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.get($scope, 'options.panel', false)) {
                element.addClass('panel panel-default');
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
            options: '=',
            validation: '=',
            form: '='
        },
        link: function link($scope, element) {
            if (!$scope.model) {
                $scope.model = {};
            }

            var options = _.get($scope, 'options', {});
            var parent = _.get($scope, 'name', null);

            if (options.fields) {
                _(options.fields).forEach(function (field, key) {
                    var tmp = angular.element('<' + field.type + ' />');
                    var name = (parent ? parent + '-' : '') + field.name;

                    tmp.attr('options', 'options.fields[' + key + ']');
                    tmp.attr('offset', 'offset');
                    tmp.attr('horizontal', 'horizontal');
                    tmp.attr('inline', 'inline');
                    tmp.attr('model', 'model["' + field.name + '"]');
                    tmp.attr('name', name);
                    tmp.attr('form', 'form');
                    tmp.attr('validation', 'validation["' + name + '"]');

                    element.append($compile(tmp)($scope));
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

            _.defaults(options, {
                root: 'form',
                novalidate: true
            });

            if (!($scope.name || options.name)) {
                var hash = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
                options.name = 'dynform_' + hash;
            }

            var tmp = angular.element('<' + options.root + ' />');

            tmp.attr('data-name', $scope.name || options.name);
            tmp.attr('data-options', 'options');
            tmp.attr('data-model', 'model');

            if (options.horizontal) {
                horizontal = true;
                tmp.addClass('form-horizontal');
                offset = options.offset || 2;
            } else if (options.inline) {
                inline = true;
                tmp.addClass('form-inline');
            }

            if (options.novalidate) {
                tmp.attr('novalidate');
            }

            if (options.panel) {
                tmp.addClass('panel panel-default');
            }

            if (options.class) {
                tmp.addClass(options.class);
            }

            var root = $compile(tmp)($scope);

            if (options.fields) {
                var tmp = angular.element('<dynfields />');
                tmp.attr('data-options', 'structure');
                tmp.attr('data-model', 'model');
                tmp.attr('data-name', options.name);
                tmp.attr('data-form', options.name);
                tmp.attr('data-validation', options.name);
                if (false !== offset) {
                    tmp.attr('data-offset', offset);
                }
                if (horizontal) {
                    tmp.attr('data-horizontal', 'true');
                }
                if (inline) {
                    tmp.attr('data-inline', 'true');
                }
                root.append($compile(tmp)($scope));
            }

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
                $scope.class.wrapper = 'col-sm-' + (12 - ($scope.offset || 2));
                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + $scope.offset || 2;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + $scope.offset || 2;
                }
            }

            if (_.has($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.get($scope, 'options.panel', false)) {
                element.addClass('panel panel-default');
            }
        }
    };
});

'use strict';

angular.module('akat-form-creator').directive('elemradio', function () {
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
        link: function link($scope, element) {
            $scope.value = null;
            $scope.class = {};

            if ($scope.horizontal) {
                $scope.class.wrapper = 'col-sm-' + (12 - ($scope.offset || 2));
                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + $scope.offset || 2;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + $scope.offset || 2;
                }
            }

            if (_.get($scope, 'options.panel', false)) {
                element.addClass('panel panel-default');
            }

            $scope.update = function (value) {
                $scope.model = value;
            };
        }
    };
});

'use strict';

angular.module('akat-form-creator').directive('elemrichtext', function () {
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
                $scope.class.wrapper = 'col-sm-' + (12 - ($scope.offset || 2));
                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + $scope.offset || 2;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + $scope.offset || 2;
                }
            }

            if (_.has($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.get($scope, 'options.panel', false)) {
                element.addClass('panel panel-default');
            }
        }
    };
});

'use strict';

angular.module('akat-form-creator').directive('elemselectbox', function () {
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

            if ($scope.horizontal) {
                $scope.class.wrapper = 'col-sm-' + (12 - ($scope.offset || 2));
                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + $scope.offset || 2;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + $scope.offset || 2;
                }
            }

            if (_.has($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.get($scope, 'options.panel', false)) {
                element.addClass('panel panel-default');
            }
        }
    };
});

'use strict';

angular.module('akat-form-creator').directive('elemtabs', function () {
    return {
        templateUrl: 'submodules/akat-form-creator/elements/tabs/tabs.html',
        restrict: 'E',
        replace: true,
        scope: {
            name: '@',
            model: '=',
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

            $scope.tabsHorizontal = _.has(options, 'horizontal') ? options.horizontal : $scope.horizontal;
            $scope.tabsInline = _.has(options, 'inline') ? options.inline : $scope.inline;
            $scope.tabsOffset = _.has(options, 'offset') ? options.offset : $scope.offset;

            if ($scope.horizontal) {
                $scope.class.wrapper = 'col-sm-' + (12 - ($scope.offset || 2));
                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + $scope.offset || 2;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + $scope.offset || 2;
                }
            }

            console.log($scope['tabs-offset']);

            if (options.panel) {
                element.addClass('panel panel-default');
            }

            if (!$scope.model) {
                $scope.model = {};
            }
        }
    };
});

'use strict';

angular.module('akat-form-creator').directive('elemtags', function () {
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
                $scope.class.wrapper = 'col-sm-' + (12 - ($scope.offset || 2));
                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + $scope.offset || 2;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + $scope.offset || 2;
                }
            }

            if (_.has($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.get($scope, 'options.panel', false)) {
                element.addClass('panel panel-default');
            }

            $scope.setData = function (query) {
                return [{
                    text: query
                }];
            };
        }
    };
});

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

            if ($scope.horizontal) {
                $scope.class.wrapper = 'col-sm-' + (12 - ($scope.offset || 2));
                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + $scope.offset || 2;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + $scope.offset || 2;
                }
            }

            if (_.has($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.get($scope, 'options.panel', false)) {
                element.addClass('panel panel-default');
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

            if ($scope.horizontal) {
                $scope.class.wrapper = 'col-sm-' + (12 - ($scope.offset || 2));
                if (_.get($scope, 'options.label', false)) {
                    $scope.class.label = 'control-label col-sm-' + $scope.offset || 2;
                } else {
                    $scope.class.wrapper += ' col-sm-offset-' + $scope.offset || 2;
                }
            }

            if (_.has($scope, 'options.class')) {
                element.addClass($scope.options.class);
            }

            if (_.get($scope, 'options.panel', false)) {
                element.addClass('panel panel-default');
            }
        }
    };
});

angular.module('akat-form-creator').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('submodules/akat-form-creator/elements/box/elembox.html',
    "<div class=\"box\">\n" +
    "    <h2>{{options.title}}</h2>\n" +
    "</div>"
  );


  $templateCache.put('submodules/akat-form-creator/elements/boxarray/boxarray.html',
    "<div class=\"box subfields\">\n" +
    "    <h2>{{options.title}}</h2>\n" +
    "</div>"
  );


  $templateCache.put('submodules/akat-form-creator/elements/checkbox/checkbox.html',
    "<div class=\"form-group\" data-ng-class=\"{ 'has-error' : validation.$touched && validation.$invalid }\">\n" +
    "\n" +
    "    <label data-ng-if=\"options.label\" data-ng-class=\"class.label\">{{ options.label }}</label>\n" +
    "\n" +
    "    <div ng-style=\"inline && {'display': 'inline-block'}\" data-ng-class=\"class.wrapper\">\n" +
    "        <div class=\"checkbox\">\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" name=\"{{ name }}\" ng-model=\"model\">\n" +
    "                {{options.text}}\n" +
    "            </label>\n" +
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
    "        <div class=\"input-group\">\n" +
    "            <input\n" +
    "                type=\"text\"\n" +
    "                name=\"{{ name }}\"\n" +
    "                class=\"form-control\"\n" +
    "                uib-datepicker-popup=\"{{format}}\"\n" +
    "                ng-model=\"model\"\n" +
    "                is-open=\"popup1.opened\"\n" +
    "                datepicker-options=\"dateOptions\"\n" +
    "                ng-required=\"true\"\n" +
    "                close-text=\"Close\"\n" +
    "                alt-input-formats=\"altInputFormats\"\n" +
    "            />\n" +
    "\n" +
    "            <span class=\"input-group-btn\">\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-click=\"open1()\"><i class=\"glyphicon glyphicon-calendar\"></i></button>\n" +
    "            </span>\n" +
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
    "        <div class=\"input-group\">\n" +
    "            <span class=\"input-group-addon\">@</span>\n" +
    "            <input\n" +
    "                type=\"email\"\n" +
    "                name=\"{{ name }}\"\n" +
    "                class=\"form-control\"\n" +
    "                placeholder=\"{{options.placeholder}}\"\n" +
    "                ng-model=\"model\"\n" +
    "\n" +
    "                ng-attr-ng-minlength=\"{{ options.validators.minlength }}\"\n" +
    "                ng-attr-ng-maxlength=\"{{ options.validators.maxlength }}\"\n" +
    "                ng-required=\"options.required\"\n" +
    "            />\n" +
    "        </div>\n" +
    "\n" +
    "        <div data-ng-if=\"!inline\">\n" +
    "            <p data-ng-show=\"validation.$touched && validation.$error.required\" class=\"help-block\">{{ options.name }} is required.</p>\n" +
    "            <p data-ng-show=\"validation.$error.minlength\" class=\"help-block\">{{ options.name }} is too short.</p>\n" +
    "            <p data-ng-show=\"validation.$error.maxlength\" class=\"help-block\">{{ options.name }} is too long.</p>\n" +
    "            <p data-ng-show=\"validation.$error.email\" class=\"help-block\">{{ options.name }} is not a valid email.</p>\n" +
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
    "        <input\n" +
    "            type=\"password\"\n" +
    "            name=\"{{ name }}\"\n" +
    "            class=\"form-control\"\n" +
    "            placeholder=\"{{options.placeholder}}\"\n" +
    "            data-ng-model=\"model\"\n" +
    "\n" +
    "            data-ng-attr-ng-minlength=\"{{ options.validators.minlength }}\"\n" +
    "            data-ng-attr-ng-maxlength=\"{{ options.validators.maxlength }}\"\n" +
    "            data-ng-required=\"options.required\"\n" +
    "        />\n" +
    "\n" +
    "        <div data-ng-if=\"!inline\">\n" +
    "            <p data-ng-show=\"validation.$touched && validation.$error.required\" class=\"help-block\">{{ options.name }} is required.</p>\n" +
    "            <p data-ng-show=\"validation.$error.minlength\" class=\"help-block\">{{ options.name }} is too short.</p>\n" +
    "            <p data-ng-show=\"validation.$error.maxlength\" class=\"help-block\">{{ options.name }} is too long.</p>\n" +
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
    "        <div class=\"radio\" ng-repeat=\"radio in options.values\">\n" +
    "            <label>\n" +
    "                <input type=\"radio\" data-ng-model=\"value\" data-ng-change=\"update(radio.value)\" name=\"{{ name }}\" value=\"{{ radio.value }}\" >\n" +
    "                {{ radio.text }}\n" +
    "            </label>\n" +
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
    "        <text-angular ng-model=\"model\"></text-angular>\n" +
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
    "        <select name=\"{{ name }}\" class=\"form-control\" data-ng-model=\"model\">\n" +
    "            <option ng-repeat=\"option in options.options\" value=\"{{option.id}}\">{{option.name}}</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('submodules/akat-form-creator/elements/tabs/tabs.html',
    "<div class=\"form-group\">\n" +
    "\n" +
    "    <label data-ng-if=\"options.label\" data-ng-class=\"class.label\">{{ options.label }}</label>\n" +
    "\n" +
    "    <div data-ng-class=\"class.wrapper\">\n" +
    "        <uib-tabset active=\"active\">\n" +
    "            <uib-tab index=\"$index + 1\" ng-repeat=\"tab in options.tabs\" heading=\"{{ tab.tabname }}\">\n" +
    "                <uib-tab-heading>{{ tab.tabname }}</uib-tab-heading>\n" +
    "                    <br/>\n" +
    "                    <dynfields\n" +
    "                        data-name=\"{{ (name ? name + '-' : '') + tab.tabname }}\"\n" +
    "                        data-options=\"tab\"\n" +
    "                        data-model=\"model[tab.tabname]\"\n" +
    "                        data-validation=\"form\"\n" +
    "                        data-form=\"form\"\n" +
    "                        data-offset=\"tabsOffset\"\n" +
    "                        data-inline=\"tabsInline\"\n" +
    "                        data-horizontal=\"tabsHorizontal\"\n" +
    "                    ></dynfields>\n" +
    "                <hr>\n" +
    "            </uib-tab>\n" +
    "        </uib-tabset>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('submodules/akat-form-creator/elements/tags/tags.html',
    "<div class=\"form-group\" data-ng-class=\"{ 'has-error' : validation.$touched && validation.$invalid }\">\n" +
    "\n" +
    "    <label data-ng-if=\"options.label\" data-ng-class=\"class.label\">{{ options.label }}</label>\n" +
    "\n" +
    "    <div data-ng-class=\"class.wrapper\">\n" +
    "        <tags-input\n" +
    "            name=\"{{ ::name }}\"\n" +
    "            ng-model=\"model\"\n" +
    "            ng-attr-min-tags=\"{{ options.validators.minlength }}\"\n" +
    "            ng-attr-max-tags=\"{{ options.validators.maxlength }}\"\n" +
    "            ng-attr-allow-leftover-text=\"{{ options.allowLeftOverText }}\"\n" +
    "            ng-required=\"options.required\"\n" +
    "        >\n" +
    "            <auto-complete source=\"setData($query)\"></auto-complete>\n" +
    "        </tags-input>\n" +
    "\n" +
    "        <div>\n" +
    "            <p data-ng-show=\"validation.$touched && validation.$error.required\" class=\"help-block\">{{ options.name }} is required.</p>\n" +
    "            <p data-ng-show=\"validation.$error.minlength\" class=\"help-block\">{{ options.name }} is too short.</p>\n" +
    "            <p data-ng-show=\"validation.$error.maxlength\" class=\"help-block\">{{ options.name }} is too long.</p>\n" +
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
    "        <textarea\n" +
    "            name=\"{{ ::name }}\"\n" +
    "            rows=\"{{ options.rows || 4 }}\"\n" +
    "            cols=\"{{ options.cols || 50 }}\"\n" +
    "            class=\"form-control\"\n" +
    "            placeholder=\"{{options.placeholder}}\"\n" +
    "            ng-model=\"model\"\n" +
    "\n" +
    "            ng-attr-ng-minlength=\"{{ options.validators.minlength }}\"\n" +
    "            ng-attr-ng-maxlength=\"{{ options.validators.maxlength }}\"\n" +
    "            ng-required=\"options.required\"\n" +
    "        ></textarea>\n" +
    "\n" +
    "        <div>\n" +
    "            <p data-ng-show=\"validation.$touched && validation.$error.required\" class=\"help-block\">{{ options.name }} is required.</p>\n" +
    "            <p data-ng-show=\"validation.$error.minlength\" class=\"help-block\">{{ options.name }} is too short.</p>\n" +
    "            <p data-ng-show=\"validation.$error.maxlength\" class=\"help-block\">{{ options.name }} is too long.</p>\n" +
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
    "        <input\n" +
    "            type=\"text\"\n" +
    "            name=\"{{ name }}\"\n" +
    "            class=\"form-control\"\n" +
    "            placeholder=\"{{options.placeholder}}\"\n" +
    "            data-ng-model=\"model\"\n" +
    "\n" +
    "            data-ng-attr-ng-minlength=\"{{ options.validators.minlength }}\"\n" +
    "            data-ng-attr-ng-maxlength=\"{{ options.validators.maxlength }}\"\n" +
    "            data-ng-required=\"options.required\"\n" +
    "        />\n" +
    "\n" +
    "        <div data-ng-if=\"!inline\">\n" +
    "            <p data-ng-show=\"validation.$touched && validation.$error.required\" class=\"help-block\">{{ options.name }} is required.</p>\n" +
    "            <p data-ng-show=\"validation.$error.minlength\" class=\"help-block\">{{ options.name }} is too short.</p>\n" +
    "            <p data-ng-show=\"validation.$error.maxlength\" class=\"help-block\">{{ options.name }} is too long.</p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n"
  );

}]);
