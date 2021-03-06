import MiddlewreToken from '../../data/useCase/loadAccountToken/loadAccountToken';
import Decode from '../../infra/token/jwtokenVerifyTokenAdapter';
import s from '../../../.authenticateKey';


export const middlewreTokenFacory = () => {
  const decode = new Decode(s);

  return new MiddlewreToken(decode);
};
