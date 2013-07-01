/// <reference path="../interface.ts" />



module JavaScriptTask {
    export function addTask(builder: GruntBuilder, name: string, data: TaskDataMultiSrc): void {
        var temp_file: string = builder.tempDir + name + ".js";
        var i: number;


        // Concat
        builder.task.concat = builder.task.concat || {};
        builder.task.concat[name] = {
            src: data.src,
            dest: temp_file
        };


        // JSHint
        builder.task.jshint = builder.task.jshint || {};
        builder.task.jshint[name] = {
            files: {
                src: [temp_file]
            }
        };


        // Uglify-JS
        builder.task.uglify = builder.task.uglify || {};
        var uglify_files: any = {};
        for (i = 0; i < data.dest.length; i++) {
            uglify_files[ data.dest[i] ] = [temp_file];
        }
        builder.task.uglify[name] = {
            files: uglify_files
        };


        // Copy
        var copy: any = {
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


        // watch
        builder.watcherData.push({
            src: data.src,
            task : ["concat:"+name, "jshint:"+name, "copy:"+name]
        });
    }


    export function setUp(builder: GruntBuilder): void {
        // Concat
        if (builder.task.concat) {
            builder.grunt.loadNpmTasks('grunt-contrib-concat');
        }


        // JSHint
        if (builder.task.jshint) {
            builder.task.jshint.options = {
                // browser: true, // define globals exposed by modern browsers?
                // es5: true, // code uses ECMAScript 5 features?
                node: false, // define globals in Node runtime?

                validthis   : true,
                laxcomma    : true,
                laxbreak    : true,
                browser     : true,
                eqnull      : true,
                debug       : true,
                devel       : true,
                boss        : true,
                expr        : true,
                asi         : true
            };
            builder.grunt.loadNpmTasks('grunt-contrib-jshint');
        }


        // Uglify-JS
        if (builder.task.uglify) {
            builder.task.uglify.options = {
                banner: builder.option.banner.js || ""
            };
            builder.grunt.loadNpmTasks('grunt-contrib-uglify');
        }
    }
}
