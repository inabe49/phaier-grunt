/// <reference path="../interface.ts" />
/// <reference path="../dependency-seeker.ts" />



module LESSTask {
    var depSeeker: DependencySeeker = new DependencySeeker(function(stream: string): string[]{
        var files: string[] = [];
        var import_tags: string[] = stream.match(/@import[^\n\r]+/ig);
        if (!import_tags) {
            return files;
        }


        var i: number;
        for (i = 0; i < import_tags.length; i++) {
            var attr: string = import_tags[i].match(/"[^"\n\r]+"/i)[0];
            var file_name: string = attr.match(/[^"]+/g)[0];

            if (file_name) {
                files.push(file_name);
            }
        }

        return files;
    });



    export function addTask(builder: GruntBuilder, name: string, data: TaskDataOneSrc): void {
        var css_file: string = builder.tempDir + name + ".css";
        var i: number;


        // LESS
        builder.task.less = builder.task.less || {};
        builder.task.less[name] = {
            files: {}
        };
        builder.task.less[name].files[css_file] = data.src;


        // CSS Min
        builder.task.cssmin = builder.task.cssmin || {};
        builder.task.cssmin.compress = builder.task.cssmin.compress || {};
        builder.task.cssmin.compress.files = builder.task.cssmin.compress.files || {};

        for (i = 0; i < data.dest.length; i++) {
            builder.task.cssmin.compress.files[ data.dest[i] ] = css_file;
        }


        // Copy
        var copy: any = {
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


        // Watch
        var watch_files: string[] = depSeeker.getDependFiles(data.src);
        builder.watcherData.push({
            src: watch_files,
            task: ["less:"+name, "copy:"+name]
        });
    }


    export function setUp(builder: GruntBuilder): void {
        // LESS
        if (builder.task.less) {
            builder.grunt.loadNpmTasks('grunt-contrib-less');
        }

        // CSS Min
        if (builder.task.cssmin){
            builder.task.cssmin.options = {
                banner : builder.option.banner.css || ""
            };
            builder.grunt.loadNpmTasks('grunt-contrib-cssmin');
        }
    }
}
