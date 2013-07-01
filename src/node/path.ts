/// <reference path="node.d.ts" />


interface Path {
    relative(from: string, to: string): string;
    join(path1: string, path2: string): string;

    dirname(file_name: string): string;
}

var path:Path = <Path>require("path");
