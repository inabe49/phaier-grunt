/// <reference path="../interface.ts" />



module CopyTask {
    export function addTask(builder: GruntBuilder, name: string, data: TaskDataOneSrc): void {
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


        // Watch
        builder.watcherData.push({
            src: [data.src],
            task: ["copy:"+name]
        });
    }


    export function setUp(builder: GruntBuilder): void {
        // nothing
    }
}
