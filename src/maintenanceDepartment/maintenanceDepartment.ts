import { Department } from "core/department";
import { XerxesContext } from "xerxesContext";

export class MaintenanceDepartment extends Department {

    constructor(context: XerxesContext) {
        super(context);
    }
    
    getMinimumOperationalEnergyBudget(): number {
        throw new Error("Method not implemented.");
    }    
    
    getName(): string {
        return "MAINTENANCE_DEPARTMENT";
    }

    run(): void {
        throw new Error("Method not implemented.");
    } 
}