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
  Mascotas,
  Pedido,
} from '../models';
import {MascotasRepository} from '../repositories';

export class MascotasPedidoController {
  constructor(
    @repository(MascotasRepository) protected mascotasRepository: MascotasRepository,
  ) { }

  @get('/mascotas/{id}/pedidos', {
    responses: {
      '200': {
        description: 'Array of Mascotas has many Pedido',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Pedido)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Pedido>,
  ): Promise<Pedido[]> {
    return this.mascotasRepository.pedidos(id).find(filter);
  }

  @post('/mascotas/{id}/pedidos', {
    responses: {
      '200': {
        description: 'Mascotas model instance',
        content: {'application/json': {schema: getModelSchemaRef(Pedido)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Mascotas.prototype.idMascota,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pedido, {
            title: 'NewPedidoInMascotas',
            exclude: ['idPedido'],
            optional: ['mascotasId']
          }),
        },
      },
    }) pedido: Omit<Pedido, 'idPedido'>,
  ): Promise<Pedido> {
    return this.mascotasRepository.pedidos(id).create(pedido);
  }

  @patch('/mascotas/{id}/pedidos', {
    responses: {
      '200': {
        description: 'Mascotas.Pedido PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pedido, {partial: true}),
        },
      },
    })
    pedido: Partial<Pedido>,
    @param.query.object('where', getWhereSchemaFor(Pedido)) where?: Where<Pedido>,
  ): Promise<Count> {
    return this.mascotasRepository.pedidos(id).patch(pedido, where);
  }

  @del('/mascotas/{id}/pedidos', {
    responses: {
      '200': {
        description: 'Mascotas.Pedido DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Pedido)) where?: Where<Pedido>,
  ): Promise<Count> {
    return this.mascotasRepository.pedidos(id).delete(where);
  }
}
