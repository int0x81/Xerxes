import { BudgetDepartment } from "budgetDepartment/budgetDepartment";
import { FarmingDepartment } from "farmingDepartment/farmingDepartment";

/**
 * The bots global context that stores global information
 * and also serves als dependency injection container
 */
export class XerxesContext {

    //instantiate departments
    public budgetDepartment = new BudgetDepartment(this);
    public farmingDepartment = new FarmingDepartment(this);
}