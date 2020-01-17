import { EnergyFarmerMemory } from "./energyFarmerMemory";

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
        
        let spawnId: string = (this.creep.memory as EnergyFarmerMemory).assignedSpawnId;
        let spawn: StructureSpawn = Game.getObjectById(spawnId) as StructureSpawn;
        return spawn;
    }

    /**
     * Sets the spawn where this creep is assigned to
     * @param assignedSpawn The spawn where this creep is
     * assigned to
     */
    setAssignedSpawn(assignedSpawn: StructureSpawn) {
        (this.creep.memory as EnergyFarmerMemory).assignedSpawnId;
    }

    /**
     * Gets the energy source that this creep is aiming to harvest
     */
    getTargetingEnergySource(): Source {
        
        let sourceId: string = (this.creep.memory as EnergyFarmerMemory).targetingEnergySourceId;
        let source: Source = Game.getObjectById(sourceId) as Source;
        return source;
    }

    /**
     * Sets the energy source that this creep is aiming to harvest 
     * @param source The energy source
     */
    setTargetingEnergySource(source: Source) {
        (this.creep.memory as EnergyFarmerMemory).targetingEnergySourceId = source.id;
    }

    /**
     * Gets the creeps farmer mode state. If the creep is on farming
     * mode, it will aim to farm energy. If it is not in farming mode, the
     * creep will bring back the farmed energy
     */
    getFarmingMode(): boolean {
        return (this.creep.memory as EnergyFarmerMemory).farmingMode;
    }
  
    /**
     * Toggles the creeps farmer mode state. If the creep is on farming
     * mode, it will aim to farm energy. If it is not in farming mode, the
     * creep will bring back the farmed energy
    */
    toggleFarmingMode() {
        (this.creep.memory as EnergyFarmerMemory).farmingMode = !(this.creep.memory as EnergyFarmerMemory).farmingMode;
    }
}