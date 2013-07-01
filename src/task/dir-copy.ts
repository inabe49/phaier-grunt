/// <reference path="../interface.ts" />
/// <reference path="../node/glob.ts" />
/// <reference path="../node/path.ts" />


module DirCopyTask {
    export function addTask(builder: GruntBuilder, name: string, data: TaskDataDirCopy): void {
        /*
            data = {
                src: string,
                dest: string,
                pattern: string
            };
        */
        var pattern: string = "**/" + (data.pattern || "*.*");
        var files: string[] = glob.sync(data.src + pattern);
        var i: number;


        var copy: any;
        var relative: string;
        var path_to: string;


        builder.task.copy = builder.task.copy || {};


        for (i = 0; i < files.length; i++) {
            relative = path.relative(data.src, files[i]);
            path_to = path.join(data.dest, relative);

            copy = {
                files: [{
                    src: files[i],
                    dest: path_to
                }]
            };
            builder.task.copy[name + path_to] = copy;

            builder.watcherData.push({
                src: [files[i]],
                task: ["copy:" + name + path_to]
            });
        }
    }


    export function setUp(builder: GruntBuilder): void {
        // nothing
    }
}
