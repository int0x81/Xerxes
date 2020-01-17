import { XerxesContext } from "xerxesContext";
import { Baptizer } from "core/baptizer";
import { CreepBodyCreationResult } from "core/creepBodyCreationResult";

/**
 * The farming creeps fabric is responsible for
 * the decision making, when to spawn new farming creeps
 * as well as for the actual creation of the creeps
 */
export class FarmingCreepsFabric {

    constructor(private context: XerxesContext) { }

    /**
     * The fabric may create new creeps if it
     * consider it necessary
     * @param budget The budget that the fabric may use to spawn new creeps
     */
    run(budget: number) {

        if(budget > this.determineEnergyFarmerSpawnTreshhold()) {

            let spawn: StructureSpawn = this.determineBestSpawnToAssign(budget);

            if(spawn == null)
                console.warn("No valid spawn found to create energy farmer");
            else
                this.spawnEnergyFarmer(budget, spawn);
        }
    }

    /**
     * Spawns a new creep with the energy farmer role
     * @param energy The energy that will be spent on the creation
     * of the creeps body parts
     * @param spawn The spawn that shall create the creep and the creep will
     * be assigned to
     */
    private spawnEnergyFarmer(energy: number, spawn: StructureSpawn) {

        let bodyCreationResult: CreepBodyCreationResult = this.createEnergyFarmerBody(energy);
        let name: string = new Baptizer().getName();
        
        if(spawn.spawnCreep(bodyCreationResult.bodyParts, name) == OK)
            this.context.budgetDepartment.chargeFarmingEnergyBudget(bodyCreationResult.energySpent);
    }

    /**
     * Determines the number of energy when a new energy farmer
     * shall be spawned. The number is calculated based on the global
     * growth
     */
    private determineEnergyFarmerSpawnTreshhold(): number {

        return 200;
    }

    /**
     * Determines the best spawn to create a creep and assign a creep to
     * @param minEnergyAvail The minimum amount of energy that the spawn
     * needs to have access to
     * @returns The spawn that shall create the creep and the creep will
     * be assigned to or null, if no spawn could be determined
     */
    private determineBestSpawnToAssign(minEnergyAvail: number): StructureSpawn {

        throw Error("Method not implemented");
    }

    /**
     * Creates the body of a creep with the energy farmer role
     * @param energy The energy that shall be spent on the body creation
     * @returns The creep body part
     */
    private createEnergyFarmerBody(energy: number): CreepBodyCreationResult {

        throw Error("Method not implemented");
    }
}