import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Pedido,
  Clientes,
} from '../models';
import {PedidoRepository} from '../repositories';

export class PedidoClientesController {
  constructor(
    @repository(PedidoRepository)
    public pedidoRepository: PedidoRepository,
  ) { }

  @get('/pedidos/{id}/clientes', {
    responses: {
      '200': {
        description: 'Clientes belonging to Pedido',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Clientes)},
          },
        },
      },
    },
  })
  async getClientes(
    @param.path.string('id') id: typeof Pedido.prototype.idPedido,
  ): Promise<Clientes> {
    return this.pedidoRepository.clientes(id);
  }
}
