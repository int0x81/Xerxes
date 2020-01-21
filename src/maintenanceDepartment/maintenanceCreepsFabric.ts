/**
 * The maintenance creeps fabric is responsible for
 * the decision making, when to spawn new maintaining creeps
 * as well as for the actual creation of the creeps
 */
export class MaintenanceCreepsFabric {

    constructor(private context: XerxesContext) { }

    /**
     * The fabric may create new creeps if it
     * consider it necessary
     * @param budget The budget that the fabric may use to spawn new creeps
     */
    run(budget: number) {

        if(budget > this.determineMaintainerSpawnThreshold()) {

            let spawn: StructureSpawn = this.determineBestSpawnToAssign(budget);

            if(spawn == null)
                console.warn("No valid spawn found to create maintainer");
            else
                this.spawnMaintainer(budget, spawn);
        }
    }

    /**
     * Spawns a new creep with the maintainer role
     * @param energy The energy that will be spent on the creation
     * of the creeps body parts
     * @param spawn The spawn that shall create the creep and the creep will
     * be assigned to
     */
    private spawnMaintainer(energy: number, spawn: StructureSpawn) {

        let bodyCreationResult: CreepBodyCreationResult = this.createMaintainerBody(energy);
        let name: string = new Baptizer().getName();
        
        if(spawn.spawnCreep(bodyCreationResult.bodyParts, name) == OK)
            this.context.budgetDepartment.chargeMaintenanceEnergyBudget(bodyCreationResult.energySpent);
    }

    /**
     * Determines the number of energy when a new maintainer
     * shall be spawned. The number is calculated based on the global
     * growth
     */
    private determineMaintainerSpawnThreshold(): number {

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

        throw new Error("Method not implemented.");

        
    }

    /**
     * Creates the body of a creep with the maintainer role
     * @param energy The energy that shall be spent on the body creation
     * @returns The creep body part
     */
    private createMaintainerBody(energy: number): CreepBodyCreationResult {

        throw new Error("Method not implemented.");
    }

    /**
     * Gets a map of the hashes of every owned spawn and its amount
     * of assigned creeps
     */
    private generateSpawnAssignmentMap(): Map<string, number> {
        
        let spawnsAssignmentsMap: Map<string, number> = new Map<string, number>();

        let allSpawns = Game.FindMySpawns();

        for(let spawn of allSpawns) {
            spawnsAssignmentsMap.set(spawn.id, 0);
        }

        let allCreepsWithAssignedSpawn = Game.FindMyCreeps(c => c.memory["assignedSpawnId"] != null);

        for(let creep of allCreepsWithAssignedSpawn) {
            let assignedSpawnId: string = creep.memory["assignedSpawnId"];
            let amount: number = spawnsAssignmentsMap.get(assignedSpawnId);
            spawnsAssignmentsMap.set(assignedSpawnId, amount + 1);
        }
    }
}