/// <reference path="../interface.ts" />



module JSONTask {
    export function addTask(builder: GruntBuilder, name: string, data: TaskDataOneSrc): void {
        var temp_file: string = builder.tempDir + name + ".json";
        var i: number;


        // Copy
        var copy: any = {
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


        // JSON Lint
        builder.task.jsonlint = builder.task.jsonlint || {};
        builder.task.jsonlint[name] = {
            src: [data.src]
        };


        // JSON Min
        builder.task.minjson = builder.task.minjson || {};
        var min_files = {};
        for (i = 0; i < data.dest.length; i++) {
            min_files[ data.dest[i] ] = data.src;
        }
        builder.task.minjson[name] = {
            files: min_files
        };


        // Watch
        builder.watcherData.push({
            src: [data.src],
            task: ["jsonlint" + name, "copy:" + name]
        });
    }


    export function setUp(builder: GruntBuilder): void {
        if (builder.task.jsonlint) {
            builder.grunt.loadNpmTasks('grunt-jsonlint');
        }

        if (builder.task.minjson) {
            builder.grunt.loadNpmTasks('grunt-minjson');
        }
    }
}
