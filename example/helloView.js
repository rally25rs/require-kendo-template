define(["kendo", "kendo-template!helloView"], function (kendo, helloViewTemplateId) {
    var viewModel = kendo.observable({
        name: "World!"
    });

    var options = {
        model: viewModel
    };
    
    return new kendo.View(
        helloViewTemplateId,
        options
    );
});