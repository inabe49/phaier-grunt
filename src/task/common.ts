/// <reference path="../interface.ts" />



module CommonTask {
    export function makeWatchTask(builder: GruntBuilder): void {
        var i: number;
        var j: number;
        var key: string;
        var src_files: string[];
        var src_list: any = {};


        for (i = 0; i < builder.watcherData.length; i++) {
            src_files = builder.watcherData[i].src;

            for (j = 0; j < src_files.length; j++) {
                if (src_list[ src_files[j] ]) {
                    // this code have error.
                    src_list[ src_files[j] ] = src_list[ src_files[j] ].concat( this.watcherData[i].task );
                } else {
                    src_list[ src_files[j] ] = builder.watcherData[i].task;
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





    export function makeBuildTask(builder: GruntBuilder): void {
        // build task : build JavaScript, LESS and HTML.
        var build_tasks: string[] = ["concat", "jshint", "jsonlint", "typescript", "less", "copy"];
        var active_build_tasks: string[] = [];
        var i: number;

        for (i = 0; i < build_tasks.length; i++) {
            if (builder.task[ build_tasks[i] ]) {
                active_build_tasks.push(build_tasks[i]);
            }
        }

        builder.grunt.registerTask("build", "Build all resource.", active_build_tasks);
    }



    export function makeReleaseTask(builder: GruntBuilder): void {
        // 使ってないタスクは入れないようにする
        var release_tasks: string[] = ["concat", "jshint", "jsonlint", "typescript", "uglify", "less", "cssmin", "htmlmin"];
        var active_release_tasks: string[] = [];
        var i: number;

        for ( i = 0; i < release_tasks.length; i++ ) {
            if (builder.task[ release_tasks[i] ]) {
                active_release_tasks.push(release_tasks[i]);
            }
        }

        builder.grunt.registerTask("release", "Build all resource with minimize.", active_release_tasks);
    }
}
