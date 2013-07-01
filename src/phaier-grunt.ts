/// <reference path="grunt.d.ts" />
/// <reference path="interface.ts" />
/// <reference path="node/node.d.ts" />


/// <reference path="task/common.ts" />
/// <reference path="task/type-script.ts" />
/// <reference path="task/java-script.ts" />
/// <reference path="task/less.ts" />
/// <reference path="task/html.ts" />
/// <reference path="task/json.ts" />

/// <reference path="task/copy.ts" />
/// <reference path="task/dir-copy.ts" />





class PhaierGrunt {
    private builder: GruntBuilder;


    constructor(grunt_obj: Grunt, opt: GruntBuilderOption) {
        this.builder = {
            tempDir: opt.temp || "temp/",
            grunt: grunt_obj,
            task: {},
            option: opt,
            watcherData: []
        };
    }


    start(): void {
        CommonTask.makeWatchTask(this.builder);
        CommonTask.makeBuildTask(this.builder);
        CommonTask.makeReleaseTask(this.builder);

        this.makeOption();

        this.builder.grunt.initConfig(this.builder.task);
    }


    addTypeScript(name: string, data: TaskDataOneSrc): void {
        TypeScriptTask.addTask(this.builder, name, data);
    }

    addJavaScript(name: string, data: TaskDataMultiSrc): void {
        JavaScriptTask.addTask(this.builder, name, data);
    }

    addLESS(name: string, data: TaskDataOneSrc): void {
        LESSTask.addTask(this.builder, name, data);
    }

    addHTML(name: string, data: TaskDataOneSrc): void {
        HTMLTask.addTask(this.builder, name, data);
    }

    addJSON(name: string, data: TaskDataOneSrc): void {
        JSONTask.addTask(this.builder, name, data);
    }

    addCopy(name: string, data: TaskDataOneSrc): void {
        CopyTask.addTask(this.builder, name, data);
    }

    addDirCopy(name: string, data: TaskDataDirCopy): void {
        DirCopyTask.addTask(this.builder, name, data);
    }


    private makeOption(): void {
        this.builder.grunt.loadNpmTasks('grunt-contrib-copy');
        this.builder.grunt.loadNpmTasks('grunt-contrib-watch');


        TypeScriptTask.setUp(this.builder);
        JavaScriptTask.setUp(this.builder);
        LESSTask.setUp(this.builder);
        HTMLTask.setUp(this.builder);
        JSONTask.setUp(this.builder);

        DirCopyTask.setUp(this.builder);
        CopyTask.setUp(this.builder);
    }
}


module.exports = PhaierGrunt;
