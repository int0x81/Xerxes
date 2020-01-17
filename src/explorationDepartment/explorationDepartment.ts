import { Department } from "core/department";
import { XerxesContext } from "xerxesContext";

/**
 * Responsible the exploration of the shard, claiming new controllers
 * but also providing global intelligence
 */
export class ExplorationDepartment extends Department {

    constructor(context: XerxesContext) {
        super(context);
    }

    getMinimumOperationalEnergyBudget() {
        return 0;
    }

    run() {
        throw Error("Method not implemented");
    }

    /**
     * Gets the total amount of stored energy of all spawns and extensions
     * in all rooms
     */
    getGlobalStoredEnergy(): number {

        let storedEnergy: number = 0;
        
        for(let i in Game.rooms) {
            storedEnergy += Game.rooms[i].energyAvailable;
        }

        return storedEnergy;
    }

    /**
     * Gets the total amount of energy capacity of all spawns and extensions
     * in all rooms
     */
    getGlobalEnergyStorageCapacity(): number {

        let storageCapacity: number = 0;
        
        for(let i in Game.rooms) {
            storageCapacity += Game.rooms[i].energyCapacityAvailable;
        }

        return storageCapacity;
    }
}