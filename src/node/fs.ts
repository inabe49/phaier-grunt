/// <reference path="node.d.ts" />


interface Fs {
    existsSync(file_path: string): boolean;
    readFileSync(filename: string): any;
}

var fs:Fs = <Fs>require("fs");
