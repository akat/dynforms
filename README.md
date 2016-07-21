# akat-form-creator
Angular JS dynamic forms generator

# What is that?
It creates forms based on JSON structure for angularJS. 

# How to install this?
You can simply install it using bower
<code>bower install akat-form-creator --save</code>
Include this on your app dependencies
<script>angular.module('myApp', [
  'akat-form-creator'
])</script>

# Controller Example
<script>
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
          placeholder: "male or female?",
          class : "col-md-4"
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
</script>

# Angular View
<script>
  <dynform structure="form" model="formdata"></dynform>
</script>
