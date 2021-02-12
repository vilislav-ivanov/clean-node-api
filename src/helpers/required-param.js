import { RequiredParamsError } from './errors';

const requiredParam = (param) => {
  throw new RequiredParamsError(param);
};

export default requiredParam;
