phaier-grunt
============

tool for grunt


## Documentaion

## How to use
write Gruntfile.js like this.
```
    var PhaierGrunt = require("phaier-grunt");
    var js_banner = "";
        js_banner += "/* =========================================================" + "\n";
        js_banner += " * SylFile Sprite Project" + "\n";
        js_banner += " * " + "\n";
        js_banner += " * " + "\n";
        js_banner += " * " + "\n";
        js_banner += " * Copyright 2013 Phaier JAPAN" + "\n";
        js_banner += " * ========================================================= */" + "\n";

    var css_banner = "";
        css_banner += "/* =========================================================" + "\n";
        css_banner += " * SylFile Sprite Project" + "\n";
        css_banner += " * " + "\n";
        css_banner += " * " + "\n";
        css_banner += " * " + "\n";
        css_banner += " * Copyright 2013 Phaier JAPAN" + "\n";
        css_banner += " * ========================================================= */" + "\n";


    var builder = new PhaierGrunt(grunt, {
        banner : {
            js : js_banner,
            css : css_banner
        },
        temp : "temp/"
    });


    // add tasks
    builder.addTypeScript("page_index_ts", {
        src : "test/src/html/ts/index.ts",
        dest : [
            "test/dest/html/src/ts/index.js"
        ]
    });

    builder.addJavaScript("page_index_js", {
        src : [
            "test/src/html/js/intro.js",
            "test/src/html/js/main.js",
            "test/src/html/js/outro.js"
        ],
        dest : [
            "test/dest/html/src/js/index.js"
        ]
    });

    builder.addLESS("page_index_less", {
        src : "test/src/html/less/index.less",
        dest : [
            "test/dest/html/src/css/index.css"
        ]
    });

    builder.addHTML("page_index_html", {
        src : "test/src/html/index.html",
        dest : [
            "test/dest/html/index.html"
        ]
    });


    // Copy
    builder.addCopy("server_resource_favion", {
        src : "test/src/html/favicon.ico",
        dest : [
            "test/dest/html/favicon.ico",
            "test/dest/html/src/icon/favicon.ico"
        ]
    });

    builder.addDirCopy("server_py", {
        src : "test/src/server/",
        dest : "test/dest/server/",
        pattern : "*.py"
    });


    builder.start();
```