/// <reference path="node/fs.ts" />




class DependencySeeker {
    private streamPicker: (file_stream: string) => string[];



    constructor(stream_picker: (file_stream: string) => string[]) {
        this.streamPicker = stream_picker;
    }


    getDependFilesByFileName(file_name): string[] {
        if (!fs.existsSync(file_name)) {
            console.log(file_name + "\tは存在しないファイルです。");
            throw "Error : can't find such file.";
        }

        var stream: string = fs.readFileSync(file_name).toString();
        var files: string[] = this.streamPicker(stream);
        var deps: string[] = [];

        var dir: string = path.dirname(file_name);
        var i: number;
        for (i = 0; i < files.length; i++) {
            deps.push( path.join(dir, files[i]) );
        }

        return deps;
    }

    getDependFiles(file_name): string[] {
        var depend_files: string[] = [file_name];
        var un_tested_files: string[] = this.getDependFilesByFileName(file_name);
        var i: number;


        for (i = 0; i < un_tested_files.length; i++) {
            depend_files.push(un_tested_files[i]);
        }


        while (un_tested_files.length !== 0) {
            var deps: string[] = this.getDependFilesByFileName(un_tested_files.shift());

            for (i = 0; i < deps.length; i++) {
                if (depend_files.indexOf(deps[i]) < 0) {
                    depend_files.push(deps[i]);
                    un_tested_files.push(deps[i]);
                }
            }
        }


        return depend_files;
    }
}
