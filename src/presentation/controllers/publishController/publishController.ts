export {} from '../../../';
import {publish} from '../../../domain/useCase/publish.interfaace';

export class PublishController {
  constructor(
         private readonly publish: publish,
  ) {}
  async pub(data: any ) {
    const fields = ['title',
      'companyName',
      'tecnology',
      'informações',
      'contato',
      'preço',
      'localizaçao',
      'typo'];
    for (const field of fields ) {
      if (data[field]) {
        return {
          status: 400,
          body: `${field} não inserido`,
        };
      }
    }

    const res = await this.publish.pub(data);

    if (res.ip) {
      return {
        status: 200,
        body: `Publicado com sucesso.`,
      };
    }
  }
}
