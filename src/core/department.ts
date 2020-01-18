import { XerxesContext } from "xerxesContext";

/**
 * The base class for all departments
 */
export abstract class Department {

    constructor(protected context: XerxesContext) {}

    /**
     * Gets the smallest amount of energy that this
     * department needs to operate properly
     */
    abstract getMinimumOperationalEnergyBudget(): number;

    /**
     * Gets the departments name
     */
    abstract getName(): string;

    /**
     * The department performs its actions and 
     * advises jobs to all of its controlled creeps
     */
    abstract run(): void;
}