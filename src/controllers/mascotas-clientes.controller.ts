import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Mascotas,
  Clientes,
} from '../models';
import {MascotasRepository} from '../repositories';

export class MascotasClientesController {
  constructor(
    @repository(MascotasRepository)
    public mascotasRepository: MascotasRepository,
  ) { }

  @get('/mascotas/{id}/clientes', {
    responses: {
      '200': {
        description: 'Clientes belonging to Mascotas',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Clientes)},
          },
        },
      },
    },
  })
  async getClientes(
    @param.path.string('id') id: typeof Mascotas.prototype.idMascota,
  ): Promise<Clientes> {
    return this.mascotasRepository.clientes(id);
  }
}
