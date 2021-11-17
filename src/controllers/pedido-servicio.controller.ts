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
  Servicio,
} from '../models';
import {PedidoRepository} from '../repositories';

export class PedidoServicioController {
  constructor(
    @repository(PedidoRepository)
    public pedidoRepository: PedidoRepository,
  ) { }

  @get('/pedidos/{id}/servicio', {
    responses: {
      '200': {
        description: 'Servicio belonging to Pedido',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Servicio)},
          },
        },
      },
    },
  })
  async getServicio(
    @param.path.string('id') id: typeof Pedido.prototype.idPedido,
  ): Promise<Servicio> {
    return this.pedidoRepository.servicio(id);
  }
}
