/**
 * The result of a body creation process
 */
export interface CreepBodyCreationResult {

    /**
     * The created body
     */
    bodyParts: BodyPartConstant[];

    /**
     * The cost of the body creation
     */
    energySpent: number;
}