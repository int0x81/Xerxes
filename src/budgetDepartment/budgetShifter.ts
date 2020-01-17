import { Queue } from 'queue-typescript';
import { XerxesContext } from "xerxesContext";
import { BudgetDepartmentMemory } from './budgetDepartmentMemory';

/**
 * The budget shifter ensures that all departments budgets are not deceeding 
 * their minimum amount of energy they need to operate properly. 
 * If he detects such an undersupply, he will perform a budget shift, 
 * so at least one department is able to operate. 
 * This department is then the next shifting receiver. Once the next shifting receiver
 * performs an action, it has to requeue so the next undersupplied department can receive
 * the energy from the budget shift
 */
export class BudgetShifter {

    private undersuppliedDepartments: Queue<string>;

    constructor(private context: XerxesContext) {

        this.undersuppliedDepartments = ((Memory as unknown) as BudgetDepartmentMemory).undersuppliedDepartments;

        if(this.undersuppliedDepartments == undefined)
            this.undersuppliedDepartments = new Queue<string>();
    }

    /**
     * Performs the budget shift if needed
     */
    run() {

        //1. Check for undersupplied departments

        //2. Remove supplied departments out of the queue

        //3. Enqueue undersupplied departments

        //4. Dequeue undersupplied deparment and declare it as next receiver

        //5. Check the energy need of the undersupplied department

        //6. Takes the needed energy from other budgets

        //7. Shift the collected energy to the budget of the next receiver

        throw Error("Method not implemented");
    }

    private checkForUndersuppliedDepartments(): string[] {
        throw Error("Method not implemented");
    }
} 