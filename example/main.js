(function () {
    require.config({
        deps: ["jquery"]
    });

    require(["kendo", "helloView"], function (kendo, helloView) {
        var router = new kendo.Router();

        router.route("/", function() {
            helloView.render("#app");
        });

        $(function() {
            router.start();
        });
    });
})();