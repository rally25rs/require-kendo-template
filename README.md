#RequireJS Kendo UI Template Loader

##What it is.

This [RequireJS](http://www.requirejs.org) plugin can be used to load templates for [Kendo UI](http://www.telerik.com/kendo-ui).

The primary use for this would be to load view HTML when using the Kendo UI SPA framework.

##What it does.

Kendo UI templates are put into script tags, and look like:

```
<script id="my-template" type="text/x-kendo-template">
    <div>
        <span data-bind="text:message"></span>
    </div>
</script>
```

Typically you would simply include these in your HTML file, but when you have a large application with a lot of templates, this can be difficult to maintain. This is especially true when building a single-page application (SPA).

Require.js can be used to load individual JavaScript files that would become the View Model for each page of your SPA. The RequireJS Text plugin could be used to load separate HTML files to use as the views. However you would still need to wrap the string returned by the text plugin in a script tag and add it to the DOM.

**This is where the kendo-template RequireJS plugin comes in!** This plugin uses the RequireJS text plugin to load an HTML file. It then wraps it in a `<script>` tag, with an `id` set to the name of the file. The elements are then added to the `<body>` of your page. It then returns the string name of the template to RequireJS.

The easy way to think of it is that the `kendo-text` plugin basically does this, if you make a call to:

```
define(["kendo-template!myAwesomeView"], function myAwesomeView) {}
```

then the plugin does:

```
define("kendo-template!myAwesomeView-template", ["text!myAwesomeView-template.html"], function (myAwesomeTemplate) {
    $('<script id="myAwesomeView-template" type="text/x-kendo-template">' + myAwesomeTemplate + '</script>')
    .appendTo("body");
    
    return "myAwesomeView-template";
});
```

It's not exactly this simple, but it should give you a clearer picture of what the plugin does:

1. Add ".html" extension to your requested URL
2. Use the Require.js Text plugin to load the HTML file
3. Wrap the result in a script tag using the URL as the ID
4. Use jQuery to append the elements to the body
5. Return the ID of the script element

##Dependencies.

To use this plugin, you must also include:

* [RequireJS](http://www.requirejs.org)
* [RequireJS Text Plugin](https://github.com/requirejs/text)
* [jQuery](http://jquery.com/download/)

##Usage.

See the "example" directory included in this repo.

```
require(["kendo-template!views/home"], function (homeTemplateId) {
    console.log(homeTemplateId); // Would output "views-home-template"

    var homeViewModel = kendo.observable({});

    // The first parameter to kendo.View is the string element ID of the template,
    // so we can use the string returned by the kendo-template plugin.
    var homeView = new kendo.View(homeTemplateId, {
        model: homeViewModel
    });
});
```

##Optimization.

The kendo-template plugin also works in the optimizer (so far this has only been tested when running the optimizer in Node.js).

When running in the optimizer, the Require.js Text plugin is not used. Instead, the file is read directly using Node's file system module.

The resulting optimized code will contain the HTML template as a string, and use jQuery to append it to the body of your page when the module is first used. The optimized version of:

```
define(["kendo-template!myAwesomeView"], function myAwesomeView) {}
```

would look something like:

```
define("kendo-template!myAwesomeView-template", [], function () {
    $('<script id="myAwesomeView-template" type="text/x-kendo-template">...</script>')
    .appendTo("body");
    
    return "myAwesomeView-template";
});

define(["kendo-template!myAwesomeView"], function myAwesomeView) {}
```
