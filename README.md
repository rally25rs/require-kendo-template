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
