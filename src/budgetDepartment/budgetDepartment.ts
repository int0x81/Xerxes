import { XerxesContext } from "xerxesContext";
import { Department } from "core/department";
import { Budgets } from "./budgets";
import { BudgetDepartmentMemory } from "./budgetDepartmentMemory";
import { BudgetShifter } from "./budgetShifter";

/**
 * Keeps track of all available resources (e.g. energy) and
 * calculates the budgets for the individual departments.
 * The departments then can request their budgets
 */
export class BudgetDepartment extends Department {

    /**
     * The budgets of all departments
     */
    private budgets: Budgets = new Budgets();
    private budgetShifter: BudgetShifter = new BudgetShifter(this.context);

    /**
     * All spendings created in the current tick
     */
    private spendings: number = 0;

    constructor(context: XerxesContext) {
        super(context); 
    }

    getMinimumOperationalEnergyBudget() {
        return 0;
    }

    getName() {
        return "BUDGET_DEPARTMENT";
    }

    run() {

        //1. Load budgets from memory
        this.budgets.loadBudgets();

        //2. Calculate upper bounds for all budgets
        this.calculateEnergyBudgetsUpperBounds();

        //3. Calculate last ticks income
        let income: number = this.calculateEnergyIncome();

        //4. Distribute new generated income to all budgets
        this.distributeEnergy(income);

        //5. Run budget shifter
        this.budgetShifter.run();
    }

    /**
     * Stores important budget data in memory so it can be
     * used in the next tick
     */
    storeBudgetData() {
        this.saveAmountStoredEnergy();
        this.saveSpendings();
        this.budgets.saveBudgets();
    }

    /**
     * Gets the budget of the farming department
     */
    requestFarmingEnergyBudget(): number {
        return this.budgets.farmingEnergyBudget;
    }

    /**
     * Gets the max value that the budget of the farming department can reach
     */
    requestFarmingMaxEnergyBudget(): number {
        return this.budgets.maxMaintenanceEnergyBudget;
    }

    /**
     * Debits a sum of energy from the farming budget
     * @param charge The amount of energy that the farming budget shall be charged with
     * @returns The state, if the charge was successfull
     */
    chargeFarmingEnergyBudget(charge: number): boolean {

        if(charge > this.budgets.farmingEnergyBudget) {
            console.warn("Unable to charge farming budget");
            return false;
        }

        this.spendings += charge;
        this.budgets.farmingEnergyBudget -= charge;
        return true;
    }

    /**
     * Gets the budget of the maintenance department
     */
    requestMaintenanceEnergyBudget(): number {
        return this.budgets.maintenanceEnergyBudget;
    }

    /**
     * Gets the max value that the budget of the maintenance department can reach
     */
    requestMaintenanceMaxEnergyBudget(): number {
        return this.budgets.maxMaintenanceEnergyBudget;
    }

    /**
     * Debits a sum of energy from the maintenance budget
     * @param charge The amount of energy that the maintenance budget shall be charged with
     * @returns The state, if the charge was successfull
     */
    chargeMaintenanceEnergyBudget(charge: number): boolean {

        if(charge > this.budgets.maintenanceEnergyBudget) {
            console.warn("Unable to charge maintenance budget");
            return false;
        }

        this.spendings += charge;
        this.budgets.maintenanceEnergyBudget -= charge;
        return true;
    }

    /**
     * Calculates the total income of energy that was gained
     * in the last tick
     */
    private calculateEnergyIncome(): number {

        let storedEnergy: number = this.getStoredEnergy();
        let lastTickSpendings = this.loadLastTicksEnergySpendings();
        let lastTickStoredEnergy = this.loadLastTicksStoredEnergy();

        let lastTicksIncome: number = storedEnergy + lastTickSpendings - lastTickStoredEnergy;
        return lastTicksIncome;
    }

    /**
     * Gets the total amount of energy stored in all spawns
     * and extensions
     */
    private getStoredEnergy(): number {

        let storedEnergy: number = 0;

        for(let i in Game.structures) {

            let structure: Structure = Game.structures[i];

            switch(structure.structureType) {
                case STRUCTURE_SPAWN: storedEnergy += (structure as StructureSpawn).store[RESOURCE_ENERGY]; break;
                case STRUCTURE_EXTENSION: storedEnergy += (structure as StructureExtension).store[RESOURCE_ENERGY]; break;
            }
        }

        return storedEnergy;
    }

    /**
     * Loads the total amount of energy spendings of the last tick from memory
     */
    private loadLastTicksEnergySpendings(): number {
        return ((Memory as any) as BudgetDepartmentMemory).lastTicksEnergySpendings;
    }

    /**
     * Saves the total amount of energy spendings in memory
     */
    private saveSpendings() {
        ((Memory as any) as BudgetDepartmentMemory).lastTicksEnergySpendings = this.spendings;
    }

    /**
     * Loads the total amount of stored energy of the last tick from memory
     */
    private loadLastTicksStoredEnergy() {
        return ((Memory as any) as BudgetDepartmentMemory).lastTickStoredEnergy;
    }

    /**
     * Saves the total amount of stored energy in memory
     */
    private saveAmountStoredEnergy() {
        ((Memory as any) as BudgetDepartmentMemory).lastTickStoredEnergy = this.getStoredEnergy();
    }

    /**
     * Distributes an amount of energy to the budgets
     * @param energy The energy to distribute 
     */
    private distributeEnergy(energy: number) {

        //The actual amount of energy that will be added to the budgets
        let farmingActualIncrease = Math.floor(energy * this.budgets.FARMING_PROPORTION);
        let maintenanceActualIncrease = Math.floor(energy * this.budgets.MAINTENANCE_PROPORTION);

        //Add energy to budgets
        this.budgets.farmingEnergyBudget += farmingActualIncrease;
        this.budgets.maintenanceEnergyBudget += maintenanceActualIncrease;

        //Distribute the remainding energy
        let remainder = energy - farmingActualIncrease - maintenanceActualIncrease;
        this.budgets.maintenanceEnergyBudget += remainder;
    }

    /**
     * Checks the global energy storage capacity and calculates
     * the upper limits foreach budget
     */
    private calculateEnergyBudgetsUpperBounds() {
        
        let globalEnergyCapacity: number = this.context.explorationDepartment.getGlobalEnergyStorageCapacity();
        
        this.budgets.maxFarmingEnergyBudget = Math.floor(globalEnergyCapacity * this.budgets.FARMING_PROPORTION);
        this.budgets.maxMaintenanceEnergyBudget = Math.floor(globalEnergyCapacity * this.budgets.MAINTENANCE_PROPORTION);

        let remainder = globalEnergyCapacity - this.budgets.maxMaintenanceEnergyBudget - this.budgets.maxFarmingEnergyBudget;
        this.budgets.maxMaintenanceEnergyBudget += remainder;
    }

    /**
     * Checks if the sum of all budgets matches the total amount
     * of stored energy and throws an error, if there are any
     * imbalances
     */
    private checkBudgetCorrectness() {

        let storedEnergy: number = this.getStoredEnergy();

        let energyBudgetSum: number = this.budgets.farmingEnergyBudget + this.budgets.maintenanceEnergyBudget;

        if(storedEnergy != energyBudgetSum)
          throw new Error("Budget sum(" + energyBudgetSum +") does not match total amount of stored energy (" + storedEnergy + ")");
    }
}