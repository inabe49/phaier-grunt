
interface Grunt {
    loadNpmTasks(task_name: string): void;


    registerTask(name: string, description: string, task: string[]): void;
    initConfig(task: any): void;
}


