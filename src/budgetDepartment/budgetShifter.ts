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
        let undersuppliedDepartments = this.checkForUndersuppliedDepartments();

        //2. Remove supplied departments from queue
        this.removeSuppliedDepartments();

        //3. Enqueue undersupplied departments
        this.enqueueUndersuppliedDepartments(undersuppliedDepartments);

        //4. Dequeue undersupplied department and declare it as next receiver
        let nextReceiver: string = this.undersuppliedDepartments.dequeue();

        //5. Check the energy need of the undersupplied department
        let missingEnergy: number = this.determineRequiredEnergy(nextReceiver);

        //6. Shift the collected energy to the budget of the next receiver
        this.performBudgetShift(nextReceiver, missingEnergy);
    }

    /**
     * Creates a list of all departments that are currently undersupplied
     */
    private checkForUndersuppliedDepartments(): string[] {
        
        let currentUndersuppliedDepartments: string[] = new Array<string>();

        if(this.context.farmingDepartment.getMinimumOperationalEnergyBudget() > this.context.budgetDepartment.requestFarmingMaxEnergyBudget())
            currentUndersuppliedDepartments.push(this.context.farmingDepartment.getName());
           
        if(this.context.maintenanceDepartment.getMinimumOperationalEnergyBudget() > this.context.budgetDepartment.requestMaintenanceMaxEnergyBudget())
            currentUndersuppliedDepartments.push(this.context.maintenanceDepartment.getName());

        return currentUndersuppliedDepartments;
    }

    /**
     * Removes all departments from the queue, that have a
     * sufficient budget this tick 
     */
    private removeSuppliedDepartments() {

        let newQueue: Queue<string> = new Queue<string>();
        
        for(let depName of this.undersuppliedDepartments) {

            if(this.isUndersupplied(depName))
                newQueue.enqueue(depName);
        }

        this.undersuppliedDepartments = newQueue;
    }

    /**
     * Enqueues all undersupplied departments, if they are not already in the queue
     * @param departments A list of names of all departments that are undersupplied
     */
    private enqueueUndersuppliedDepartments(departments: string[]) {
        
        for(let dep of departments) {

            let exists: boolean = false;

            for(let el of this.undersuppliedDepartments) {

                if(dep == el)
                    exists = true;
            }

            if(!exists)
                this.undersuppliedDepartments.enqueue(dep);
        }
    }

    /**
     * Determines the amount of energy, that next receiving undersupplied department
     * needs to reach the minimal operational budget
     * @param department The name of the next receiving department
     * @returns The amount of energy that is needed to reach the minimum operational
     * budget
     */
    private determineRequiredEnergy(department: string): number {
        
        switch(department) {
            case this.context.farmingDepartment.getName(): {
                return this.context.farmingDepartment.getMinimumOperationalEnergyBudget() - this.context.budgetDepartment.requestFarmingMaxEnergyBudget();
            }
            case this.context.maintenanceDepartment.getName(): {
                return this.context.maintenanceDepartment.getMinimumOperationalEnergyBudget() - this.context.budgetDepartment.requestMaintenanceMaxEnergyBudget();
            }
            default: throw new Error("Unable to resolve department name: " + department);
        }
    }

    /**
     * Withdraw energy from all departments budgets and shift it
     * to the receiving undersupplied departments budget. This method currently only
     * respects the maintenance and the farming budget since they are considered
     * essential
     * @param department The name of the receiving, undersupplied department
     * @param energy The amount of energy, that the department needs to reach
     * a minimum operational level
     */
    private performBudgetShift(department: string, energy: number) {

        switch(department) {
            case this.context.farmingDepartment.getName(): {
                if(energy <= this.context.budgetDepartment.requestMaintenanceEnergyBudget()) {
                    if(this.context.budgetDepartment.chargeMaintenanceEnergyBudget(energy)) {
                        this.context.budgetDepartment.enterFarmingBudget(energy);
                    }
                } else {
                    let canBeShifted: number = this.context.budgetDepartment.requestMaintenanceEnergyBudget();
                    if(this.context.budgetDepartment.chargeMaintenanceEnergyBudget(canBeShifted)) {
                        this.context.budgetDepartment.enterFarmingBudget(canBeShifted);
                    }
                }
            }
            case this.context.maintenanceDepartment.getName(): {
                if(energy <= this.context.budgetDepartment.requestFarmingEnergyBudget()) {
                    if(this.context.budgetDepartment.chargeFarmingEnergyBudget(energy)) {
                        this.context.budgetDepartment.enterMaintenanceBudget(energy);
                    }
                } else {
                    let canBeShifted: number = this.context.budgetDepartment.requestFarmingEnergyBudget();
                    if(this.context.budgetDepartment.chargeFarmingEnergyBudget(canBeShifted)) {
                        this.context.budgetDepartment.enterMaintenanceBudget(canBeShifted);
                    }
                }
            }
            default: return false;
        }
    }

    /**
     * Checks if a department with a given name is undersupplied with energy
     */
    private isUndersupplied(department: string): boolean {
        
        switch(department) {
            case this.context.farmingDepartment.getName(): {
                return this.context.farmingDepartment.getMinimumOperationalEnergyBudget() > this.context.budgetDepartment.requestFarmingMaxEnergyBudget();
            }
            case this.context.maintenanceDepartment.getName(): {
                return this.context.maintenanceDepartment.getMinimumOperationalEnergyBudget() > this.context.budgetDepartment.requestMaintenanceMaxEnergyBudget();
            }
            default: return false;
        }
    }
} 