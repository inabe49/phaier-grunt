/// <reference path="node.d.ts" />


interface Glob {
    sync(pattern: string): string[];
}

var glob:Glob = <Glob>require("glob");
