import { XerxesContext } from "xerxesContext";

/**
 * Responsible for collecting and storing resources (e.g. energy)
 */
export class FarmingDepartment {

    constructor(private context: XerxesContext) {}

    /**
     * Advises jobs to all creeps of this department
     */
    adviseCreeps() {

        throw Error("Method not implemented");
    }
}