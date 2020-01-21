import { EnergyReliantCreep } from './energyDependentCreep';

/**
 * Represents a creep with the task of upgrading controllers
 */
export class Maintainer extends EnergyReliantCreep {

    private memory: MaintainerMemory = new MaintainerMemory();

    /**
     * The maintainer carries its energy to its assigned controller
     */
    upgradeController() {

        let controller: StructureController =

        if(this.creep.transfer(controller) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(controller);
        }
    }
}