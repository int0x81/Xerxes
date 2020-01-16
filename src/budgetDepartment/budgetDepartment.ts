import { XerxesContext } from "xerxesContext";

/**
 * Keeps track of all available resources (e.g. energy) and
 * calculates the budgets for the individual departments.
 * The departments then can request their budgets
 */
export class BudgetDepartment {

    /**
     * The energy budget of the farming department
     */
    private farmingEnergyBudget: number = 0;

    /**
     * The energy budget of the maintenance department
     */
    private maintenanceEnergyBudget: number = 0;

    /**
     * All spendings created in the current tick
     */
    private spendings: number = 0;

    constructor(private context: XerxesContext) {}

    /**
     * Initialize all budgets
     */
    initialize() {

        //1. Load budgets from memory
        this.loadBudgets();

        //2. Calculate last ticks income
        let income: number = this.calculateEnergyIncome();

        //3. Distribute new generated income to all budgets
        this.distributeEnergy(income);
    }

    /**
     * Stores important budget data in memory so it can be
     * used in the next tick
     */
    storeBudgetData() {
        this.saveAmountStoredEnergy();
        this.saveSpendings();
        this.saveBudgets();
    }

    /**
     * Gets the budget of the farming department
     */
    requestFarmingEnergyBudget(): number {
        return this.farmingEnergyBudget;
    }

    /**
     * Debits a sum of energy from the farming budget
     * @param charge The amount of energy that the farming budget shall be charged with
     * @returns The state, if the charge was successfull
     */
    chargeFarmingEnergyBudget(charge: number): boolean {

        if(charge > this.farmingEnergyBudget) {
            console.warn("Unable to charge farming budget");
            return false;
        }

        this.spendings += charge;
        this.farmingEnergyBudget =- charge;
        return true;
    }

    /**
     * Gets the budget of the maintenance department
     */
    requestMaintenanceEnergyBudget(): number {
        return this.maintenanceEnergyBudget;
    }

    /**
     * Debits a sum of energy from the maintenance budget
     * @param charge The amount of energy that the maintenance budget shall be charged with
     * @returns The state, if the charge was successfull
     */
    chargeMaintenanceEnergyBudget(charge: number): boolean {

        if(charge > this.maintenanceEnergyBudget) {
            console.warn("Unable to charge maintenance budget");
            return false;
        }

        this.spendings += charge;
        this.maintenanceEnergyBudget =- charge;
        return true;
    }

    /**
     * Loads all budgets from memory
     */
    private loadBudgets() {
        this.maintenanceEnergyBudget = Memory["MaintenanceEnergyBudget"];
        this.farmingEnergyBudget = Memory["FarmingEnergyBudget"];
    }

    /**
     * write all budgets to memory
     */
    private saveBudgets() {
        Memory["MaintenanceEnergyBudget"] = this.maintenanceEnergyBudget;
        Memory["FarmingEnergyBudget"] = this.farmingEnergyBudget;
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
        return Memory["LastTicksEnergySpendings"];
    }

    /**
     * Saves the total amount of energy spendings in memory
     */
    private saveSpendings() {
        Memory["LastTicksEnergySpendings"] = this.spendings;
    }

    /**
     * Loads the total amount of stored energy of the last tick from memory
     */
    private loadLastTicksStoredEnergy() {
        return Memory["LastTickStoredEnergy"];
    }

    /**
     * Saves the total amount of stored energy in memory
     */
    private saveAmountStoredEnergy() {
        Memory["LastTickStoredEnergy"] = this.getStoredEnergy();
    }

    /**
     * Distributes an amount of energy to the budgets
     * @param energy The energy to distribute 
     */
    private distributeEnergy(energy: number) {
        
        //The proportions in percentage
        const FARMING_PROPORTION: number = 0.5;
        const MAINTENANCE_PROPORTION: number = 0.5;

        //The actual amount of energy that will be added to the budgets
        let farmingActualIncrease = Math.floor(energy * FARMING_PROPORTION);
        let maintenanceActualIncrease = Math.floor(energy * MAINTENANCE_PROPORTION);

        //Add energy to budgets
        this.farmingEnergyBudget += farmingActualIncrease;
        this.maintenanceEnergyBudget += maintenanceActualIncrease;

        //Distribute the remainding energy
        let remainder = energy - farmingActualIncrease - maintenanceActualIncrease;
        this.maintenanceEnergyBudget += remainder;
    }

    /**
     * Checks if the sum of all budgets matches the total amount
     * of stored energy and logs a warning message, if there are any
     * imbalances
     */
    private checkBudgetCorrectness() {

        let storedEnergy: number = this.getStoredEnergy();

        let energyBudgetSum: number = this.farmingEnergyBudget + this.maintenanceEnergyBudget;

        if(storedEnergy != energyBudgetSum)
          console.warn("Budget sum(" + energyBudgetSum +") does not match total amount of stored energy (" + storedEnergy + ")");
    }
}