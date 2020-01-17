import { Queue } from "queue-typescript";

export interface BudgetDepartmentMemory {

    maintenanceEnergyBudget: number;
    farmingEnergyBudget: number;
    
    lastTickStoredEnergy: number;
    lastTicksEnergySpendings: number;
    undersuppliedDepartments: Queue<string>;
}