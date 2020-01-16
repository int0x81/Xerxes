/**
 * The base class for all departments
 */
export abstract class Department {

    constructor(protected context: XerxesContext) {}

    /**
     * The department performs its actions and 
     * advises jobs to all of its controlled creeps
     */
    abstract run(): void;
}