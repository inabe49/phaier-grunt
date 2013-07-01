/// <reference path="../interface.ts" />
/// <reference path="../dependency-seeker.ts" />



module TypeScriptTask {
    var depSeeker: DependencySeeker = new DependencySeeker(function(stream: string): string[]{
        var files: string[] = [];

        var reference_tags: string[] = stream.match(/\/\/\/\s*<reference[^>\n\r]+\/>/ig);
        if (!reference_tags) {
            return files;
        }

        var i: number;
        for (i = 0; i < reference_tags.length; i++) {
            var attr: string = reference_tags[i].match(/path="[^\n\r"]+"/i)[0];
            var file_name: string = attr.match(/[^"]+/g)[1];

            if (file_name) {
                files.push(file_name);
            }
        }

        return files;
    });


    export function addTask(builder: GruntBuilder, name: string, data: TaskDataOneSrc): void {
        var js_file: string = builder.tempDir + name + ".js";
        var i: number;
        builder.task.typescript = builder.task.typescript || {};


        // Type Script
        builder.task.typescript[name] = {
            src: data.src,
            dest: js_file
        };


        // Uglify-JS
        builder.task.uglify = builder.task.uglify || {};
        var uglify_files: any = {};
        for (i = 0; i < data.dest.length; i++) {
            uglify_files[ data.dest[i] ] = [js_file];
        }
        builder.task.uglify[name] = {
            files: uglify_files
        };


        // Copy
        var copy: any = {
            files: []
        };
        for (i = 0; i < data.dest.length; i++){
            copy.files.push({
                src: js_file,
                dest: data.dest[i],
                filter: "isFile"
            });
        }
        builder.task.copy = builder.task.copy || {};
        builder.task.copy[name] = copy;


        // watch
        var watch_files: string[] = depSeeker.getDependFiles(data.src);
        builder.watcherData.push({
            src: watch_files,
            task: ["typescript:"+name, "copy:"+name]
        });
    }


    export function setUp(builder: GruntBuilder): void {
        if (builder.task.typescript) {
            builder.grunt.loadNpmTasks("grunt-typescript");
        }
    }
}
