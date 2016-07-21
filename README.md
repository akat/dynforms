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
- Textfield
- Textarea
- Email
- Password
- Checkbox
- Radio buttons
- Html editor
- Select Box
- Date Picker
- Tags
- Bootstrap Tabs
- Array
- Object

## Elements JSON Format

### TextField
```Json
{
    type: 'elemtextfield',
    name: 'title',
    label: 'Title',
    placeholder: 'My Title',
    class : "col-md-6"
}
```
### Textarea
```Json
{
  "type": "elemtextarea",
  "name": "textarea",
  "label": "Comments",
  "class": "col-md-6"
}
```
### Email
```Json
{
  "type": "elememail",
  "name": "email",
  "label": "Enail",
  "placeholder" : "info@yourdomain.xxx",
  "class": "col-md-6"
}
```
### Password
```Json
{
  "type": "elempassword",
  "name": "password",
  "label": "Password",
  "placeholder" : "*******",
  "class": "col-md-6"
}
```
