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
  Pedido,
} from '../models';
import {ClientesRepository} from '../repositories';

export class ClientesPedidoController {
  constructor(
    @repository(ClientesRepository) protected clientesRepository: ClientesRepository,
  ) { }

  @get('/clientes/{id}/pedidos', {
    responses: {
      '200': {
        description: 'Array of Clientes has many Pedido',
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
    return this.clientesRepository.pedidos(id).find(filter);
  }

  @post('/clientes/{id}/pedidos', {
    responses: {
      '200': {
        description: 'Clientes model instance',
        content: {'application/json': {schema: getModelSchemaRef(Pedido)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Clientes.prototype.idCliente,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pedido, {
            title: 'NewPedidoInClientes',
            exclude: ['idPedido'],
            optional: ['clientesId']
          }),
        },
      },
    }) pedido: Omit<Pedido, 'idPedido'>,
  ): Promise<Pedido> {
    return this.clientesRepository.pedidos(id).create(pedido);
  }

  @patch('/clientes/{id}/pedidos', {
    responses: {
      '200': {
        description: 'Clientes.Pedido PATCH success count',
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
    return this.clientesRepository.pedidos(id).patch(pedido, where);
  }

  @del('/clientes/{id}/pedidos', {
    responses: {
      '200': {
        description: 'Clientes.Pedido DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Pedido)) where?: Where<Pedido>,
  ): Promise<Count> {
    return this.clientesRepository.pedidos(id).delete(where);
  }
}
