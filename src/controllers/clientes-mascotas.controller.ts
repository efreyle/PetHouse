import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Clientes,
  Mascotas,
} from '../models';
import {ClientesRepository} from '../repositories';

export class ClientesMascotasController {
  constructor(
    @repository(ClientesRepository) protected clientesRepository: ClientesRepository,
  ) { }

  @get('/clientes/{id}/mascotas', {
    responses: {
      '200': {
        description: 'Array of Clientes has many Mascotas',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Mascotas)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Mascotas>,
  ): Promise<Mascotas[]> {
    return this.clientesRepository.mascotas(id).find(filter);
  }

  @post('/clientes/{id}/mascotas', {
    responses: {
      '200': {
        description: 'Clientes model instance',
        content: {'application/json': {schema: getModelSchemaRef(Mascotas)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Clientes.prototype.idCliente,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Mascotas, {
            title: 'NewMascotasInClientes',
            exclude: ['idMascota'],
            optional: ['clientesId']
          }),
        },
      },
    }) mascotas: Omit<Mascotas, 'idMascota'>,
  ): Promise<Mascotas> {
    return this.clientesRepository.mascotas(id).create(mascotas);
  }

  @patch('/clientes/{id}/mascotas', {
    responses: {
      '200': {
        description: 'Clientes.Mascotas PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Mascotas, {partial: true}),
        },
      },
    })
    mascotas: Partial<Mascotas>,
    @param.query.object('where', getWhereSchemaFor(Mascotas)) where?: Where<Mascotas>,
  ): Promise<Count> {
    return this.clientesRepository.mascotas(id).patch(mascotas, where);
  }

  @del('/clientes/{id}/mascotas', {
    responses: {
      '200': {
        description: 'Clientes.Mascotas DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Mascotas)) where?: Where<Mascotas>,
  ): Promise<Count> {
    return this.clientesRepository.mascotas(id).delete(where);
  }
}
