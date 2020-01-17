import { BudgetDepartmentMemory } from "./budgetDepartmentMemory";

/**
 * This class contains all budgets and should 
 * only be accessed by the budget department
 */
export class Budgets {

    //The proportions of each budget in relation to the global budget
    readonly FARMING_PROPORTION: number = 0.5;
    readonly MAINTENANCE_PROPORTION: number = 0.5;
    readonly EXPLORATION_PROPORTION: number = 0;

    /**
     * The energy budget of the farming department
     */
    farmingEnergyBudget: number = 0;

    /**
     * The upper limit of energy for the farming budget.
     * Based on the maximum energy storage capacity
     */
    maxFarmingEnergyBudget: number = 0;

    /**
     * The energy budget of the maintenance department
     */
    maintenanceEnergyBudget: number = 0;

    /**
     * The upper limit of energy for the maintenance budget.
     * Based on the maximum energy storage capacity
     */
    maxMaintenanceEnergyBudget: number = 0;

    /**
     * Loads all budgets from memory
     */
    loadBudgets() {
        this.maintenanceEnergyBudget = ((Memory as any) as BudgetDepartmentMemory).maintenanceEnergyBudget;
        this.farmingEnergyBudget = ((Memory as any) as BudgetDepartmentMemory).farmingEnergyBudget;
    }

    /**
     * write all budgets to memory
     */
    saveBudgets() {
        ((Memory as any) as BudgetDepartmentMemory).maintenanceEnergyBudget = this.maintenanceEnergyBudget;
        ((Memory as any) as BudgetDepartmentMemory).farmingEnergyBudget = this.farmingEnergyBudget;
    }
}