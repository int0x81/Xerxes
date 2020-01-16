import { ErrorMapper } from "utils/ErrorMapper";
import { XerxesContext } from "xerxesContext";

export const loop = ErrorMapper.wrapLoop(() => {

  let context: XerxesContext = new XerxesContext();

  context.budgetDepartment.initialize();
  context.budgetDepartment.storeBudgetData();

});
