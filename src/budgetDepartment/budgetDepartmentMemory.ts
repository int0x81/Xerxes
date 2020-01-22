import { Queue } from "queue-typescript";

/**
 * Represents the memory of the budget department
 */
export interface BudgetDepartmentMemory {

    maintenanceEnergyBudget: number;
    farmingEnergyBudget: number;
    
    lastTickStoredEnergy: number;
    lastTicksEnergySpending: number;
    undersuppliedDepartments: Queue<string>;
}