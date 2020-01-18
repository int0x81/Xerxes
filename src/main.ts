import { ErrorMapper } from "utils/ErrorMapper";
import { XerxesContext } from "xerxesContext";

/**
 * The game loop that runs each tick
 */
export const loop = ErrorMapper.wrapLoop(() => {

  let context: XerxesContext = new XerxesContext();

  context.budgetDepartment.run();
  context.farmingDepartment.run();
  context.budgetDepartment.storeBudgetData();
});
