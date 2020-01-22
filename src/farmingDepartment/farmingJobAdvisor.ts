import { EnergyFarmer } from './energyFarmer';
import { XerxesContext } from 'xerxesContext';
import { EnergyFarmerMemory } from './energyFarmerMemory';

/**
 * The job advisor tells all creeps in the farming department
 * what to do
 */
export class FarmingJobAdvisor {

    constructor(private context: XerxesContext) {}

    /**
     * Assigns a job to an energy farmer
     * @param farmer The creep that the department will
     * assign the job to
     */
    assignJobToEnergyFarmer(farmer: EnergyFarmer) {

        if(farmer.getFarmingMode()) {

            if(farmer.creep.store.energy == farmer.creep.store.getCapacity()) {
                farmer.toggleFarmingMode();
                this.depositEnergy(farmer);
            } else
                this.farmEnergy(farmer);
        } else
            this.depositEnergy(farmer);
    }

    /**
     * Advises a creep to farm energy
     * @param farmer The creep that shall farm energy
     */
    private farmEnergy(farmer: EnergyFarmer) {

        if(farmer.getTargetingEnergySource == undefined) {
            let source = this.determineBestEnergySource(farmer.creep);
            if(source != null)
                farmer.setTargetingEnergySource(source);
            else
                console.warn("No energy source found for energy farmer");
        }

        if(farmer.creep.harvest(farmer.getTargetingEnergySource()) == ERR_NOT_IN_RANGE)
            farmer.creep.moveTo(farmer.getTargetingEnergySource());
    }

    /**
     * Determines a energy source for an energy farmer so it can harvest from there
     * @param creep The creep, that is looking for energy
     * @return The energy source that is considered most adequate for the farming creep or null
     * if no energy source was found
     */
    private determineBestEnergySource(creep: Creep): Source | null {
        
        let sources: Source[] = creep.room.find(FIND_SOURCES);
        if(sources.length == 0)
            return null;
        return sources[0];
    }

    /**
     * Advises the creep to deposit its energy to moves it
     * to the target location if the creep is not in range
     * @param creep The creep that carries the energy
     */
    private depositEnergy(farmer: EnergyFarmer) {

        let spawn: StructureSpawn = Game.getObjectById(((farmer.creep.memory as any) as EnergyFarmerMemory).assignedSpawnId) as StructureSpawn;
        
        if(farmer.creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            farmer.creep.moveTo(spawn);
    }
}