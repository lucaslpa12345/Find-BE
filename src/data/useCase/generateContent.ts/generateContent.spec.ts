import {GenerateContent} from './generateContent';
import {DataAccountTypesRes} from '../../interfaces';
import {LoadToken} from '../../../infra/token/jwtokenLoadTokenAdapter';
class GetaccountStub {
  get(email: string ): Promise<DataAccountTypesRes> {
    return new Promise((resolve) => resolve({
      id: 999,
      name: '1lucaslpa12345@gmail.com',
      email: '1lucaslpa12345@gmail.com',
      password: '',
    }));
  }
}


const makeSuts = () => {
  const getaccount = new GetaccountStub;
  const loadtoken = new LoadToken('3232323232323');

  return {
    sut: new GenerateContent(getaccount, loadtoken),
    getaccount,
  };
};


describe('Generate Content', () => {
  test('ensure take account is called with correct value', () => {
    const {sut, getaccount} = makeSuts();
    const spy = jest.spyOn( getaccount, 'get');
    const email = '1lucaslpa12345@gmail.com';
    sut.generate(email);
    expect(spy).toBeCalledWith(email);
  });
});
