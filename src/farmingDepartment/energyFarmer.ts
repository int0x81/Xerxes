/**
 * Represents a creep with the task of farming energy
 */
export class EnergyFarmer {

    /**
     * @param creep A reference to the actual creep object
     */
    constructor(public creep: Creep) { }

    /**
     * Gets the spawn where this creep is assigned to
     */
    getAssignedSpawn(): StructureSpawn {
        throw Error("Method not implemented");
    }

    /**
     * Sets the spawn where this creep is assigned to
     * @param assignedSpawn The spawn where this creep is
     * assigned to
     */
    setAssignedSpawn(assignedSpawn: StructureSpawn) {
        this.creep.memory["assignedSpawnId"] = assignedSpawn.id;
    }

    /**
     * Gets the energy source that this creep is aiming to harvest
     */
    getTargetingEnergySource(): Source {
        
        let sourceId: string = this.creep.memory["targetingEnergySourceId"];
        let source: Source = Game.getObjectById(sourceId) as Source;
        return source;
    }

    /**
     * Sets the energy source that this creep is aiming to harvest 
     * @param source The energy source
     */
    setTargetingEnergySource(source: Source) {
        this.creep.memory["targetingEnergySourceId"] = source.id;
    }

    /**
     * Gets the creeps farmer mode state. If the creep is on farming
     * mode, it will aim to farm energy. If it is not in farming mode, the
     * creep will bring back the farmed energy
     */
    getFarmingMode(): boolean {
        return this.creep.memory["farmingMode"];
    }
  
    /**
     * Toggles the creeps farmer mode state. If the creep is on farming
     * mode, it will aim to farm energy. If it is not in farming mode, the
     * creep will bring back the farmed energy
    */
    toggleFarmingMode() {
        this.creep.memory["farmingMode"] = !this.creep.memory["farmingMode"];
    }
}