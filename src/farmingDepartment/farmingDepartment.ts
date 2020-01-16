import { XerxesContext } from "xerxesContext";
import { FarmingCreepsFabric } from './farmingCreepsFabric';
import { FarmingJobAdvisor } from './farmingJobAdvisor';
import { Department } from "core/department";
import { EnergyFarmer } from "./energyFarmer";

/**
 * Responsible for collecting and storing resources (e.g. energy)
 */
export class FarmingDepartment extends Department{

    private creepsFabric: FarmingCreepsFabric;
    private jobAdvisor: FarmingJobAdvisor;

    constructor(context: XerxesContext) {
        super(context);
        this.creepsFabric = new FarmingCreepsFabric(context);
        this.jobAdvisor = new FarmingJobAdvisor(context);
    }

    /**
     * The farming department performs its actions
     */
    run() {

        let budget: number = this.context.budgetDepartment.getFarmingBudget();

        //the budget is currently only used for the creation of new creeps 
        this.creepsFabric.run(budget);

        let farmers: EnergyFarmer[] = this.getAllEnergyFarmers();

        this.assignJobsToEnergyFarmers(farmers);
    }

    /**
     * Assigns jobs to all creeps of this department with the
     * energy farmer role
     * @param farmers The creeps that the department will
     * assign jobs to
     */
    private assignJobsToEnergyFarmers(farmers: EnergyFarmer[]) {

        for(let farmer of farmers)
          this.jobAdvisor.assignJobToEnergyFarmer(farmer);
    }

    /**
     * Gets all creeps with the energy farmer role
     */
    private getAllEnergyFarmers(): EnergyFarmer[] {

        throw Error("Method not implemented");
    }
}