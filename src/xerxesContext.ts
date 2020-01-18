import { BudgetDepartment } from "budgetDepartment/budgetDepartment";
import { FarmingDepartment } from "farmingDepartment/farmingDepartment";
import { ExplorationDepartment } from "explorationDepartment/explorationDepartment";
import { MaintenanceDepartment } from "maintenanceDepartment/maintenanceDepartment";

/**
 * The bots global context, that stores global information
 * and also serves als dependency injection container
 */
export class XerxesContext {

    //instantiate departments
    public budgetDepartment = new BudgetDepartment(this);
    public farmingDepartment = new FarmingDepartment(this);
    public maintenanceDepartment = new MaintenanceDepartment(this);
    public explorationDepartment = new ExplorationDepartment(this);
}