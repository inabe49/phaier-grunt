var CommonTask;
(function (CommonTask) {
    function makeWatchTask(builder) {
        var i;
        var j;
        var key;
        var src_files;
        var src_list = {};

        for (i = 0; i < builder.watcherData.length; i++) {
            src_files = builder.watcherData[i].src;

            for (j = 0; j < src_files.length; j++) {
                if (src_list[src_files[j]]) {
                    src_list[src_files[j]] = src_list[src_files[j]].concat(this.watcherData[i].task);
                } else {
                    src_list[src_files[j]] = builder.watcherData[i].task;
                }
            }
        }

        builder.task.watch = {};
        for (key in src_list) {
            builder.task.watch[key] = {
                files: [key],
                tasks: src_list[key]
            };
        }

        builder.grunt.registerTask("default", "default task is watch.", ["watch"]);
    }
    CommonTask.makeWatchTask = makeWatchTask;

    function makeBuildTask(builder) {
        var build_tasks = ["concat", "jshint", "jsonlint", "typescript", "less", "copy"];
        var active_build_tasks = [];
        var i;

        for (i = 0; i < build_tasks.length; i++) {
            if (builder.task[build_tasks[i]]) {
                active_build_tasks.push(build_tasks[i]);
            }
        }

        builder.grunt.registerTask("build", "Build all resource.", active_build_tasks);
    }
    CommonTask.makeBuildTask = makeBuildTask;

    function makeReleaseTask(builder) {
        var release_tasks = ["concat", "jshint", "jsonlint", "typescript", "uglify", "less", "cssmin", "htmlmin"];
        var active_release_tasks = [];
        var i;

        for (i = 0; i < release_tasks.length; i++) {
            if (builder.task[release_tasks[i]]) {
                active_release_tasks.push(release_tasks[i]);
            }
        }

        builder.grunt.registerTask("release", "Build all resource with minimize.", active_release_tasks);
    }
    CommonTask.makeReleaseTask = makeReleaseTask;
})(CommonTask || (CommonTask = {}));
var fs = require("fs");
var DependencySeeker = (function () {
    function DependencySeeker(stream_picker) {
        this.streamPicker = stream_picker;
    }
    DependencySeeker.prototype.getDependFilesByFileName = function (file_name) {
        if (!fs.existsSync(file_name)) {
            console.log(file_name + "\tは存在しないファイルです。");
            throw "Error : can't find such file.";
        }

        var stream = fs.readFileSync(file_name).toString();
        var files = this.streamPicker(stream);
        var deps = [];

        var dir = path.dirname(file_name);
        var i;
        for (i = 0; i < files.length; i++) {
            deps.push(path.join(dir, files[i]));
        }

        return deps;
    };

    DependencySeeker.prototype.getDependFiles = function (file_name) {
        var depend_files = [file_name];
        var un_tested_files = this.getDependFilesByFileName(file_name);
        var i;

        for (i = 0; i < un_tested_files.length; i++) {
            depend_files.push(un_tested_files[i]);
        }

        while (un_tested_files.length !== 0) {
            var deps = this.getDependFilesByFileName(un_tested_files.shift());

            for (i = 0; i < deps.length; i++) {
                if (depend_files.indexOf(deps[i]) < 0) {
                    depend_files.push(deps[i]);
                    un_tested_files.push(deps[i]);
                }
            }
        }

        return depend_files;
    };
    return DependencySeeker;
})();
var TypeScriptTask;
(function (TypeScriptTask) {
    var depSeeker = new DependencySeeker(function (stream) {
        var files = [];

        var reference_tags = stream.match(/\/\/\/\s*<reference[^>\n\r]+\/>/ig);
        if (!reference_tags) {
            return files;
        }

        var i;
        for (i = 0; i < reference_tags.length; i++) {
            var attr = reference_tags[i].match(/path="[^\n\r"]+"/i)[0];
            var file_name = attr.match(/[^"]+/g)[1];

            if (file_name) {
                files.push(file_name);
            }
        }

        return files;
    });

    function addTask(builder, name, data) {
        var js_file = builder.tempDir + name + ".js";
        var i;
        builder.task.typescript = builder.task.typescript || {};

        builder.task.typescript[name] = {
            src: data.src,
            dest: js_file
        };

        builder.task.uglify = builder.task.uglify || {};
        var uglify_files = {};
        for (i = 0; i < data.dest.length; i++) {
            uglify_files[data.dest[i]] = [js_file];
        }
        builder.task.uglify[name] = {
            files: uglify_files
        };

        var copy = {
            files: []
        };
        for (i = 0; i < data.dest.length; i++) {
            copy.files.push({
                src: js_file,
                dest: data.dest[i],
                filter: "isFile"
            });
        }
        builder.task.copy = builder.task.copy || {};
        builder.task.copy[name] = copy;

        var watch_files = depSeeker.getDependFiles(data.src);
        builder.watcherData.push({
            src: watch_files,
            task: ["typescript:" + name, "copy:" + name]
        });
    }
    TypeScriptTask.addTask = addTask;

    function setUp(builder) {
        if (builder.task.typescript) {
            builder.grunt.loadNpmTasks("grunt-typescript");
        }
    }
    TypeScriptTask.setUp = setUp;
})(TypeScriptTask || (TypeScriptTask = {}));
var JavaScriptTask;
(function (JavaScriptTask) {
    function addTask(builder, name, data) {
        var temp_file = builder.tempDir + name + ".js";
        var i;

        builder.task.concat = builder.task.concat || {};
        builder.task.concat[name] = {
            src: data.src,
            dest: temp_file
        };

        builder.task.jshint = builder.task.jshint || {};
        builder.task.jshint[name] = {
            files: {
                src: [temp_file]
            }
        };

        builder.task.uglify = builder.task.uglify || {};
        var uglify_files = {};
        for (i = 0; i < data.dest.length; i++) {
            uglify_files[data.dest[i]] = [temp_file];
        }
        builder.task.uglify[name] = {
            files: uglify_files
        };

        var copy = {
            files: []
        };
        for (i = 0; i < data.dest.length; i++) {
            copy.files.push({
                src: temp_file,
                dest: data.dest[i],
                filter: "isFile"
            });
        }
        builder.task.copy = builder.task.copy || {};
        builder.task.copy[name] = copy;

        builder.watcherData.push({
            src: data.src,
            task: ["concat:" + name, "jshint:" + name, "copy:" + name]
        });
    }
    JavaScriptTask.addTask = addTask;

    function setUp(builder) {
        if (builder.task.concat) {
            builder.grunt.loadNpmTasks('grunt-contrib-concat');
        }

        if (builder.task.jshint) {
            builder.task.jshint.options = {
                node: false,
                validthis: true,
                laxcomma: true,
                laxbreak: true,
                browser: true,
                eqnull: true,
                debug: true,
                devel: true,
                boss: true,
                expr: true,
                asi: true
            };
            builder.grunt.loadNpmTasks('grunt-contrib-jshint');
        }

        if (builder.task.uglify) {
            builder.task.uglify.options = {
                banner: builder.option.banner.js || ""
            };
            builder.grunt.loadNpmTasks('grunt-contrib-uglify');
        }
    }
    JavaScriptTask.setUp = setUp;
})(JavaScriptTask || (JavaScriptTask = {}));
var LESSTask;
(function (LESSTask) {
    var depSeeker = new DependencySeeker(function (stream) {
        var files = [];
        var import_tags = stream.match(/@import[^\n\r]+/ig);
        if (!import_tags) {
            return files;
        }

        var i;
        for (i = 0; i < import_tags.length; i++) {
            var attr = import_tags[i].match(/"[^"\n\r]+"/i)[0];
            var file_name = attr.match(/[^"]+/g)[0];

            if (file_name) {
                files.push(file_name);
            }
        }

        return files;
    });

    function addTask(builder, name, data) {
        var css_file = builder.tempDir + name + ".css";
        var i;

        builder.task.less = builder.task.less || {};
        builder.task.less[name] = {
            files: {}
        };
        builder.task.less[name].files[css_file] = data.src;

        builder.task.cssmin = builder.task.cssmin || {};
        builder.task.cssmin.compress = builder.task.cssmin.compress || {};
        builder.task.cssmin.compress.files = builder.task.cssmin.compress.files || {};

        for (i = 0; i < data.dest.length; i++) {
            builder.task.cssmin.compress.files[data.dest[i]] = css_file;
        }

        var copy = {
            files: []
        };
        for (i = 0; i < data.dest.length; i++) {
            copy.files.push({
                src: css_file,
                dest: data.dest[i],
                filter: "isFile"
            });
        }
        builder.task.copy = builder.task.copy || {};
        builder.task.copy[name] = copy;

        var watch_files = depSeeker.getDependFiles(data.src);
        builder.watcherData.push({
            src: watch_files,
            task: ["less:" + name, "copy:" + name]
        });
    }
    LESSTask.addTask = addTask;

    function setUp(builder) {
        if (builder.task.less) {
            builder.grunt.loadNpmTasks('grunt-contrib-less');
        }

        if (builder.task.cssmin) {
            builder.task.cssmin.options = {
                banner: builder.option.banner.css || ""
            };
            builder.grunt.loadNpmTasks('grunt-contrib-cssmin');
        }
    }
    LESSTask.setUp = setUp;
})(LESSTask || (LESSTask = {}));
var HTMLTask;
(function (HTMLTask) {
    function addTask(builder, name, data) {
        var i;

        builder.task.htmlmin = builder.task.htmlmin || {};
        var html_min = {};
        for (i = 0; i < data.dest.length; i++) {
            html_min[data.dest[i]] = data.src;
        }
        builder.task.htmlmin[name] = {
            files: html_min
        };

        var copy = {
            files: []
        };
        for (i = 0; i < data.dest.length; i++) {
            copy.files.push({
                src: data.src,
                dest: data.dest[i],
                filter: "isFile"
            });
        }
        builder.task.copy = builder.task.copy || {};
        builder.task.copy[name] = copy;

        builder.watcherData.push({
            src: [data.src],
            task: ["copy:" + name]
        });
    }
    HTMLTask.addTask = addTask;

    function setUp(builder) {
        if (builder.task.htmlmin) {
            builder.task.htmlmin.options = {
                removeComments: true
            };
            builder.grunt.loadNpmTasks('grunt-contrib-htmlmin');
        }
    }
    HTMLTask.setUp = setUp;
})(HTMLTask || (HTMLTask = {}));
var JSONTask;
(function (JSONTask) {
    function addTask(builder, name, data) {
        var temp_file = builder.tempDir + name + ".json";
        var i;

        var copy = {
            files: []
        };
        for (i = 0; i < data.dest.length; i++) {
            copy.files.push({
                src: data.src,
                dest: data.dest[i],
                filter: "isFile"
            });
        }
        builder.task.copy = builder.task.copy || {};
        builder.task.copy[name] = copy;

        builder.task.jsonlint = builder.task.jsonlint || {};
        builder.task.jsonlint[name] = {
            src: [data.src]
        };

        builder.task.minjson = builder.task.minjson || {};
        var min_files = {};
        for (i = 0; i < data.dest.length; i++) {
            min_files[data.dest[i]] = data.src;
        }
        builder.task.minjson[name] = {
            files: min_files
        };

        builder.watcherData.push({
            src: [data.src],
            task: ["jsonlint" + name, "copy:" + name]
        });
    }
    JSONTask.addTask = addTask;

    function setUp(builder) {
        if (builder.task.jsonlint) {
            builder.grunt.loadNpmTasks('grunt-jsonlint');
        }

        if (builder.task.minjson) {
            builder.grunt.loadNpmTasks('grunt-minjson');
        }
    }
    JSONTask.setUp = setUp;
})(JSONTask || (JSONTask = {}));
var CopyTask;
(function (CopyTask) {
    function addTask(builder, name, data) {
        var i;

        var copy = {
            files: []
        };
        for (i = 0; i < data.dest.length; i++) {
            copy.files.push({
                src: data.src,
                dest: data.dest[i],
                filter: "isFile"
            });
        }
        builder.task.copy = builder.task.copy || {};
        builder.task.copy[name] = copy;

        builder.watcherData.push({
            src: [data.src],
            task: ["copy:" + name]
        });
    }
    CopyTask.addTask = addTask;

    function setUp(builder) {
    }
    CopyTask.setUp = setUp;
})(CopyTask || (CopyTask = {}));
var glob = require("glob");
var path = require("path");
var DirCopyTask;
(function (DirCopyTask) {
    function addTask(builder, name, data) {
        var pattern = "**/" + (data.pattern || "*.*");
        var files = glob.sync(data.src + pattern);
        var i;

        var copy;
        var relative;
        var path_to;

        builder.task.copy = builder.task.copy || {};

        for (i = 0; i < files.length; i++) {
            relative = path.relative(data.src, files[i]);
            path_to = path.join(data.dest, relative);

            copy = {
                files: [
                    {
                        src: files[i],
                        dest: path_to
                    }
                ]
            };
            builder.task.copy[name + path_to] = copy;

            builder.watcherData.push({
                src: [files[i]],
                task: ["copy:" + name + path_to]
            });
        }
    }
    DirCopyTask.addTask = addTask;

    function setUp(builder) {
    }
    DirCopyTask.setUp = setUp;
})(DirCopyTask || (DirCopyTask = {}));
var PhaierGrunt = (function () {
    function PhaierGrunt(grunt_obj, opt) {
        this.builder = {
            tempDir: opt.temp || "temp/",
            grunt: grunt_obj,
            task: {},
            option: opt,
            watcherData: []
        };
    }
    PhaierGrunt.prototype.start = function () {
        CommonTask.makeWatchTask(this.builder);
        CommonTask.makeBuildTask(this.builder);
        CommonTask.makeReleaseTask(this.builder);

        this.makeOption();

        this.builder.grunt.initConfig(this.builder.task);
    };

    PhaierGrunt.prototype.addTypeScript = function (name, data) {
        TypeScriptTask.addTask(this.builder, name, data);
    };

    PhaierGrunt.prototype.addJavaScript = function (name, data) {
        JavaScriptTask.addTask(this.builder, name, data);
    };

    PhaierGrunt.prototype.addLESS = function (name, data) {
        LESSTask.addTask(this.builder, name, data);
    };

    PhaierGrunt.prototype.addHTML = function (name, data) {
        HTMLTask.addTask(this.builder, name, data);
    };

    PhaierGrunt.prototype.addJSON = function (name, data) {
        JSONTask.addTask(this.builder, name, data);
    };

    PhaierGrunt.prototype.addCopy = function (name, data) {
        CopyTask.addTask(this.builder, name, data);
    };

    PhaierGrunt.prototype.addDirCopy = function (name, data) {
        DirCopyTask.addTask(this.builder, name, data);
    };

    PhaierGrunt.prototype.makeOption = function () {
        this.builder.grunt.loadNpmTasks('grunt-contrib-copy');
        this.builder.grunt.loadNpmTasks('grunt-contrib-watch');

        TypeScriptTask.setUp(this.builder);
        JavaScriptTask.setUp(this.builder);
        LESSTask.setUp(this.builder);
        HTMLTask.setUp(this.builder);
        JSONTask.setUp(this.builder);

        DirCopyTask.setUp(this.builder);
        CopyTask.setUp(this.builder);
    };
    return PhaierGrunt;
})();

module.exports = PhaierGrunt;
