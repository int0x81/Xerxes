import { EnergyFarmer } from './energyFarmer';
import { XerxesContext } from 'xerxesContext';

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
                this.bringBackEnergy(farmer);
            } else
                this.farmEnergy(farmer);
        } else
            this.bringBackEnergy(farmer);
    }

    /**
     * Advises a creep to bring back its energy
     * @param farmer The energy carryieng creep
     */
    private bringBackEnergy(farmer: EnergyFarmer) {

        if(this.isInRoomOfAssignedSpawn(farmer))
            this.depositEnergy(farmer);
        else 
            this.moveToRoomOfAssignedSpawn(farmer);
    }

    /**
     * Advises a creep to farm energy
     * @param farmer The creep that shall farm energy
     */
    private farmEnergy(farmer: EnergyFarmer) {

        if(farmer.getTargetingEnergySource == undefined)
            farmer.setTargetingEnergySource(this.determineBestEnergySource(farmer.creep.pos));

        if(farmer.creep.harvest(farmer.getTargetingEnergySource()) == ERR_NOT_IN_RANGE)
            farmer.creep.moveTo(farmer.getTargetingEnergySource());
    }

    /**
     * Checks if a creep is in the same room as
     * the spawn it is assigned to
     * @param farmer The creep
     */
    private isInRoomOfAssignedSpawn(farmer: EnergyFarmer): boolean {
        
        let assignedSpawn: StructureSpawn = farmer.getAssignedSpawn();

        return assignedSpawn.room.name == farmer.creep.room.name;
    }

    /**
     * 
     * @param position The position of the creep
     * @return The energy source that is considered most adequate fro the farming creep
     */
    private determineBestEnergySource(position: RoomPosition): Source {
        throw Error("Method not implemented");
    }

    /**
     * Advises the creep to deposit its energy to moves it
     * to the target location if the creep is not in range
     * @param creep The creep that carries the energy
     */
    private depositEnergy(farmer: EnergyFarmer) {
        throw Error("Method not implemented");
    }

    /**
     * Moves the creep to the room of its assigned spawn
     * @param creep The creep that carries the energy
     */
    private moveToRoomOfAssignedSpawn(farmer: EnergyFarmer) {
        throw Error("Method not implemented");
    }
}