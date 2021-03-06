import Authenticate from './authenticate';
import {Encrytp} from '../../../infra/criptography/bcrypt.adapter';
import {Error} from '../../../domain/protocols/errors/ProcessError';
import {SqliteAccountRepo} from '../../../infra/db/sqlite/accountRepo/sqliteAccountRepo';
import {Querys} from '../../../infra/db/Querys/typeOrmQuerysAccount';
import accountentity from '../../../infra/db/sqlite/database/entity/Accounts.entity';
import connection from '../../../infra/db/ConnectionHelper';
import {LoadToken} from '../../../infra/token/jwtokenLoadTokenAdapter';
import authenticatekey from '../../../../.authenticateKey';

const makeAuthenticate = () => {
  const tokenGenerator = new LoadToken(authenticatekey);
  const compare = new Encrytp;

  const querys = new Querys(accountentity);
  const dbrepo = new SqliteAccountRepo(querys);
  const authenticate = new Authenticate(dbrepo, tokenGenerator, compare);
  return {
    authenticate,
    dbrepo,
    tokenGenerator,
    compare,
  };
};

describe('authenticate', () => {
  beforeAll(async ()=>{
    await connection.create();
  });

  afterAll(async ()=>{
    await connection.close();
  });

  test('should with correct data ', async () => {
    const {authenticate} = makeAuthenticate();
    const data = {
      email: 'lucas@gmail',
      password: '1234',
    };
    const spy = spyOn(authenticate, 'auth');
    await authenticate.auth(data.email, data.password);
    expect(spy).toHaveBeenCalledWith(data.email, data.password);
  });
  test('should return error if  password not combine', async () => {
    const {authenticate} = makeAuthenticate();
    const data = {
      email: 'lucas@gmail',
      password: '2222',
    };

    const res = await authenticate.auth(data.email, data.password);
    expect(res).toEqual(new Error(400).return('Invalid email/password'));
  });


  test('should return a token', async () => {
    const {authenticate} = makeAuthenticate();
    const data = {
      email: 'lucas@gmail',
      password: '2222',
    };

    const res = await authenticate.auth(data.email, data.password);
    expect(res).toEqual(new Error(400).return('Invalid email/password'));
  });

  test('Ensure loadToken be called with correct data', async () => {
    const {authenticate, tokenGenerator, dbrepo, compare} = makeAuthenticate();
    jest.spyOn(dbrepo, 'getOfDb').mockReturnValueOnce(new Promise((resolve) => resolve({
      id: 10,
      name: 'lucas',
      email: 'lucas@gmail.com',
      password: '222',
    })));
    jest.spyOn(compare, 'compare').mockReturnValueOnce(Promise.resolve(true));
    const spy = jest.spyOn(tokenGenerator, 'loadToken');
    const data = {
      email: 'lucas@gmail',
      password: '222',
    };

    await authenticate.auth(data.email, data.password);
    expect(spy).toHaveBeenCalledWith( {'email': 'lucas@gmail.com', 'id': '10', 'name': 'lucas'});
  });
});
