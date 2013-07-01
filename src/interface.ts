

interface GruntBuilderOptionBanner {
    js?: string;
    css?: string;
}

interface GruntBuilderOption {
    banner?: GruntBuilderOptionBanner;
    temp?: string;
}


interface GruntWatcherData {
    src: string[];
    task: string[];
}




interface TaskDataOneSrc {
    src: string;
    dest: string[];
}

interface TaskDataMultiSrc {
    src: string[];
    dest: string[];
}

interface TaskDataDirCopy {
    src: string;
    dest: string;
    pattern: string;
}






interface GruntBuilder {
    tempDir: string;
    grunt: Grunt;
    task: any;
    option: GruntBuilderOption;
    watcherData: GruntWatcherData[];
}
