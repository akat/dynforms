# akat-form-creator
Angular JS dynamic forms generator
> Under Heavy development...

## What is that?
It creates forms based on JSON structure for angularJS. 

## How to install this?
You can simply install it using bower
```
bower install akat-form-creator --save
```

## Include this on your app dependencies
```Javascript
angular.module('myApp', [
  'akat-form-creator'
])
```

## Controller Example
```Javascript
$scope.formdata = {
      "gender": "male",
      "title": "Title goes here..."
    };
    
$scope.form = {
        name: 'formname',
        fields: [{
          type: 'elemtextfield',
          name: 'title',
          label: 'Title',
          placeholder: 'My Title',
          class : "col-md-6"
        },
        {
          type: "elemselectbox",
          name: "gender",
          label: "Select a gender",
          class : "col-md-4",
          options : [
            {
              name: "male",
              value: "male"
            },
            { 
              name: "female",
              value: "female"
            }
          ]
        }]
      }
```

## Angular View
```html
  <dynform structure="form" model="formdata"></dynform>
```

## Available Elements
1 Textfield
2 Textarea
3 Email
4 Password
5 Checkbox
6 Radio buttons
7 Html editor
8 Date Picker
9 Tags
10 Bootstrap Tabs
11 Array
