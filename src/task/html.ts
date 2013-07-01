/// <reference path="../interface.ts" />



module HTMLTask {
    export function addTask(builder: GruntBuilder, name: string, data: TaskDataOneSrc): void {
        var i: number;


        // HTML Min
        builder.task.htmlmin = builder.task.htmlmin || {};
        var html_min: any = {};
        for (i = 0; i < data.dest.length; i++) {
            html_min[ data.dest[i] ] = data.src;
        }
        builder.task.htmlmin[name] = {
            files: html_min
        };


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


        // Watch
        builder.watcherData.push({
            src: [data.src],
            task: ["copy:"+name]
        });
    }


    export function setUp(builder: GruntBuilder): void {
        // HTML min
        if (builder.task.htmlmin){
            builder.task.htmlmin.options = {
                removeComments: true
            };
            builder.grunt.loadNpmTasks('grunt-contrib-htmlmin');
        }
    }
}
