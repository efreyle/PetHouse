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
  Servicio,
  Pedido,
} from '../models';
import {ServicioRepository} from '../repositories';

export class ServicioPedidoController {
  constructor(
    @repository(ServicioRepository) protected servicioRepository: ServicioRepository,
  ) { }

  @get('/servicios/{id}/pedidos', {
    responses: {
      '200': {
        description: 'Array of Servicio has many Pedido',
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
    return this.servicioRepository.pedidos(id).find(filter);
  }

  @post('/servicios/{id}/pedidos', {
    responses: {
      '200': {
        description: 'Servicio model instance',
        content: {'application/json': {schema: getModelSchemaRef(Pedido)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Servicio.prototype.idServicio,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pedido, {
            title: 'NewPedidoInServicio',
            exclude: ['idPedido'],
            optional: ['servicioId']
          }),
        },
      },
    }) pedido: Omit<Pedido, 'idPedido'>,
  ): Promise<Pedido> {
    return this.servicioRepository.pedidos(id).create(pedido);
  }

  @patch('/servicios/{id}/pedidos', {
    responses: {
      '200': {
        description: 'Servicio.Pedido PATCH success count',
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
    return this.servicioRepository.pedidos(id).patch(pedido, where);
  }

  @del('/servicios/{id}/pedidos', {
    responses: {
      '200': {
        description: 'Servicio.Pedido DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Pedido)) where?: Where<Pedido>,
  ): Promise<Count> {
    return this.servicioRepository.pedidos(id).delete(where);
  }
}
