define(["module"], function (module) {
    'use strict';

    var buildMap = {};

    function cleanName(name) {
        return name.replace(/\//g, "-");
    }

    function wrapInScript(name, contents) {
        return '<script id="' + cleanName(name) + '" type="text/x-kendo-template">' + contents + '</script>';
    }

    function jsEscape(content) {
        return content.replace(/(['\\])/g, '\\$1')
            .replace(/[\f]/g, "\\f")
            .replace(/[\b]/g, "\\b")
            .replace(/[\n]/g, "\\n")
            .replace(/[\t]/g, "\\t")
            .replace(/[\r]/g, "\\r")
            .replace(/[\u2028]/g, "\\u2028")
            .replace(/[\u2029]/g, "\\u2029")
            .replace(/\"/g, "\\\"");
    }

    function loadForNodeJs(name, req, load, config) {
        var url = req.toUrl(name) + '.html';
        var fs = require.nodeRequire('fs');
        var file = fs.readFileSync(url, 'utf8');

        //Remove BOM (Byte Mark Order) from utf8 files if it is there.
        if (file.indexOf('\uFEFF') === 0) {
            file = file.substring(1);
        }

        buildMap[name] = wrapInScript(name, file);
        load(cleanName(name));
    }

    function loadForWebBrowser(name, req, load, config) {
        req(['jquery', 'text!' + name + '.html'], function ($, value) {
            var template = wrapInScript(name, value);

            if (config.isBuild) {
                buildMap[name] = template;
            } else {
                $(template).appendTo("body");
            }
            load(cleanName(name));
        });
    }

    return {
        load: function (name, req, load, config) {
            if (config.env === 'node' || (!config.env &&
                typeof process !== "undefined" &&
                process.versions &&
                !!process.versions.node &&
                !process.versions['node-webkit'])) {

                loadForNodeJs(name, req, load, config);
            } else {
                loadForWebBrowser(name, req, load, config);
            }
        },

        write: function (pluginName, moduleName, write) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var template = jsEscape(buildMap[moduleName]);

                write('define("' + pluginName + '!' + moduleName + '", [], function() { ' +
                    '$("' + template + '").appendTo("body");' +
                    'return "' + cleanName(moduleName) + '";' +
                '});\n'
                );
            }
        }
    };
});