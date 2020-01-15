import { ErrorMapper } from "utils/ErrorMapper";
import { BudgetDepartment } from "budgetDepartment/budgetDepartment";

export const loop = ErrorMapper.wrapLoop(() => {

  let budgetDepartment = new BudgetDepartment();

});
