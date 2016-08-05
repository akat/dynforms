'use strict';

angular.module("akat-form-creator", ['ngLodash', 'textAngular', 'ngTagsInput']);

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
    restrict: 'E',
    replace: true,
    scope: {
      model: "=",
      options: "="
    },
    templateUrl: 'submodules/akat-form-creator/elements/checkbox/checkbox.html',
    link: function link($scope, element, attr, ctrl) {
      element.addClass($scope.options.class);

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
});

'use strict';

angular.module('akat-form-creator').directive('elemdatepicker', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      model: "=",
      options: "="
    },
    templateUrl: 'submodules/akat-form-creator/elements/datepicker/datepicker.html',
    link: function link($scope, element, attr, ctrl) {
      $scope.init = function () {
        console.log('initialize datepicker default options');
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

      // Disable weekend selection
      function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
      }

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

      //set class
      element.addClass($scope.options.class);

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
});

'use strict';

angular.module('akat-form-creator').directive('elememail', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      model: "=",
      options: "="
    },
    templateUrl: 'submodules/akat-form-creator/elements/email/email.html',
    link: function link($scope, element, attr) {
      //set class
      element.addClass($scope.options.class);

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
});

'use strict';

angular.module('akat-form-creator').directive('dynform', function () {
  return {
    templateUrl: 'submodules/akat-form-creator/elements/form.html',
    restrict: 'E',
    replace: true,
    scope: { structure: "=", model: "=" }
  };
});

'use strict';

angular.module('akat-form-creator').directive('formobjects', ['$compile', function ($compile) {
  return {
    templateUrl: 'submodules/akat-form-creator/elements/formobjects.html',
    restrict: 'E',
    replace: true,
    scope: { options: "=", model: "=", id: "=" },
    link: function link($scope, element, attr) {

      var template = angular.element('<' + $scope.options.type + ' />');

      template.attr('options', 'options');
      template.attr('parent', false);
      template.attr('model', 'model');

      var compiled = $compile(template)($scope);

      //add panel class if is true
      if ($scope.options.panel) {
        element.addClass('panel panel-default');
      }

      //append compiled element
      element.append(compiled);

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

angular.module('akat-form-creator').directive('elempassword', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      model: "=",
      options: "="
    },
    templateUrl: 'submodules/akat-form-creator/elements/password/password.html',
    link: function link($scope, element, attr) {
      //set class
      element.addClass($scope.options.class);

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
});

'use strict';

angular.module('akat-form-creator').directive('elemradio', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      model: "=",
      options: '='
    },
    templateUrl: 'submodules/akat-form-creator/elements/radio/radio.html',
    link: function link($scope, element, attr) {
      element.addClass($scope.options.class);

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
});

'use strict';

angular.module('akat-form-creator').directive('elemrichtext', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      model: "=",
      options: "="
    },
    templateUrl: 'submodules/akat-form-creator/elements/richtext/richtext.html',
    link: function link($scope, element, attr) {
      element.addClass($scope.options.class);

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
});

'use strict';

angular.module('akat-form-creator').directive('elemselectbox', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      model: "=",
      options: '='
    },
    templateUrl: 'submodules/akat-form-creator/elements/selectbox/selectbox.html',
    link: function link($scope, element, attr) {
      element.addClass($scope.options.class);

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
});

'use strict';

angular.module('akat-form-creator').directive('elemtabs', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      model: "=",
      options: '='
    },
    templateUrl: 'submodules/akat-form-creator/elements/tabs/tabs.html',
    link: function link($scope, element, attr, ctrl) {
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
});

'use strict';

angular.module('akat-form-creator').directive('elemtags', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      model: '=',
      options: '='
    },
    templateUrl: 'submodules/akat-form-creator/elements/tags/tags.html',
    link: function link($scope, element, attr) {
      element.addClass($scope.options.class);

      $scope.setData = function (query) {
        return [{
          id: '1213',
          text: query
        }];
        //   if(attr.parent === "false"){
        //     formdata[$scope.directiveOptions.name] = $scope.fieldata;
        //   }else{
        //     formdata[attr.parent] = formdata[attr.parent] || {};
        //     formdata[attr.parent][$scope.directiveOptions.name] = $scope.fieldata;
        //   }
      };

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
});

'use strict';

angular.module('akat-form-creator').directive('elemtextarea', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      model: '=',
      options: '='
    },
    templateUrl: 'submodules/akat-form-creator/elements/textarea/textarea.html',
    link: function link($scope, element, attr, ctrl) {
      element.addClass($scope.options.class);

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
});

'use strict';

angular.module('akat-form-creator').directive('elemtextfield', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      model: '=',
      options: '='
    },
    templateUrl: 'submodules/akat-form-creator/elements/textfield/textfield.html',
    link: function link($scope, element, attr, ctrl) {
      element.addClass($scope.options.class);

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
    "<div class=\"form-group\" >\n" +
    "    <label>{{options.label}}</label>\n" +
    "    <p class=\"input-group\">\n" +
    "    <input type=\"checkbox\" name=\"{{options.name}}\"  ng-model=\"model[options.name]\" required=\"\"> {{options.text}}\n" +
    "    </p>\n" +
    "</div>"
  );


  $templateCache.put('submodules/akat-form-creator/elements/datepicker/datepicker.html',
    "<div class=\"form-group\" ng-init=\"init()\">\n" +
    "    <label>{{options.label}}</label>\n" +
    "    <p class=\"input-group\">\n" +
    "         \n" +
    "        <input type=\"text\" class=\"form-control\" name=\"{{options.name}}\" uib-datepicker-popup=\"{{format}}\" ng-model=\"model[options.name]\" is-open=\"popup1.opened\" datepicker-options=\"dateOptions\" ng-required=\"true\" close-text=\"Close\" alt-input-formats=\"altInputFormats\" />\n" +
    "        <span class=\"input-group-btn\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" ng-click=\"open1()\"><i class=\"glyphicon glyphicon-calendar\"></i></button>\n" +
    "        </span>\n" +
    "    </p>\n" +
    "</div>"
  );


  $templateCache.put('submodules/akat-form-creator/elements/email/email.html',
    "<div class=\"form-group\">\n" +
    "    <label>{{options.label}}</label>\n" +
    "    <div class=\"input-group\">\n" +
    "        <span class=\"input-group-addon\">@</span>\n" +
    "        <input type=\"text\" class=\"form-control\" name=\"{{options.name}}\" placeholder=\"{{options.placeholder}}\" ng-model=\"model[options.name]\" >\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('submodules/akat-form-creator/elements/form.html',
    "    <form>\n" +
    "        <div ng-repeat=\"formobj in structure.fields track by $index\">\n" +
    "            <formobjects options=\"formobj\" model=\"model\" id=\"$index\"></formobjects>\n" +
    "        </div>\n" +
    "    </form>"
  );


  $templateCache.put('submodules/akat-form-creator/elements/formobjects.html',
    "<div class=\"row\"></div>"
  );


  $templateCache.put('submodules/akat-form-creator/elements/password/password.html',
    "<div class=\"form-group\" >\n" +
    "    <label>{{options.label}}</label>\n" +
    "    <input type=\"password\" name=\"{{options.name}}\"  class=\"form-control\" ng-model=\"model[options.name]\" ng-value=\"options.defaultvalue\">\n" +
    "</div>"
  );


  $templateCache.put('submodules/akat-form-creator/elements/radio/radio.html',
    "<div class=\"form-group\" >\n" +
    "    <label>{{options.label}}</label>\n" +
    "    <p class=\"input-group\" ng-repeat=\"rad in options.values\">\n" +
    "        <input type=\"radio\" name=\"{{options.name}}\" ng-model=\"model[options.name]\" value=\"{{rad.value}}\" required=\"\"> {{rad.text}}\n" +
    "    </p>\n" +
    "</div>"
  );


  $templateCache.put('submodules/akat-form-creator/elements/richtext/richtext.html',
    "<div class=\"form-group\" >\n" +
    "    <label>{{options.label}}</label>\n" +
    "    <text-angular ng-model=\"model[options.name]\"></text-angular>\n" +
    "</div>"
  );


  $templateCache.put('submodules/akat-form-creator/elements/selectbox/selectbox.html',
    "<div class=\"form-group\" >\n" +
    "    <label class=\"control-label\">{{options.label}}</label>\n" +
    "    <select class=\"form-control\"  ng-model=\"model[options.name]\" ng-options=\"item.name as item.value for item in options.options\" >\n" +
    "    </select>\n" +
    "</div>"
  );


  $templateCache.put('submodules/akat-form-creator/elements/tabs/tabs.html',
    "  <div>\n" +
    "    <uib-tabset active=\"active\">\n" +
    "        <uib-tab index=\"$index + 1\" ng-repeat=\"tab in options.tabs\" heading=\"{{tab.tabname}}\">\n" +
    "            <uib-tab-heading>{{tab.tabname}}</uib-tab-heading>\n" +
    "            <formobjects options=\"tab\" model=\"model\"></formobjects>\n" +
    "            <hr>\n" +
    "        </uib-tab>\n" +
    "    </uib-tabset>\n" +
    "  </div>"
  );


  $templateCache.put('submodules/akat-form-creator/elements/tags/tags.html',
    "<div class=\"form-group\" >\n" +
    "    <label>{{options.label}}</label>\n" +
    "    <tags-input ng-model=\"model[options.name]\">\n" +
    "        <auto-complete source=\"setData($query)\"></auto-complete>\n" +
    "    </tags-input>\n" +
    "</div>"
  );


  $templateCache.put('submodules/akat-form-creator/elements/textarea/textarea.html',
    "<div class=\"form-group\" >\n" +
    "    <label>{{options.label}}</label>\n" +
    "    <textarea rows=\"4\" name=\"{{options.name}}\" cols=\"50\" ng-model=\"model[options.name]\"  class=\"form-control\"></textarea>\n" +
    "</div>"
  );


  $templateCache.put('submodules/akat-form-creator/elements/textfield/textfield.html',
    "<div class=\"form-group\" >\n" +
    "    <label>{{options.label}}</label>\n" +
    "    <input type=\"text\" name=\"{{options.name}}\" class=\"form-control\" ng-model=\"model[options.name]\" placeholder=\"{{options.placeholder}}\" required=\"\">\n" +
    "</div>\n" +
    "\n"
  );

}]);
