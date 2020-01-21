import { XerxesCreep } from './xerxesCreep';

/**
 * Represents a creep, that needs to extract energy to be
 * able to perform its tasks
 */
export abstract class EnergyReliantCreep extends XerxesCreep {

    constructor(creep: Creep) {
        super(creep);
    }
}