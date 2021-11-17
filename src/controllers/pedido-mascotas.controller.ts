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
  Mascotas,
} from '../models';
import {PedidoRepository} from '../repositories';

export class PedidoMascotasController {
  constructor(
    @repository(PedidoRepository)
    public pedidoRepository: PedidoRepository,
  ) { }

  @get('/pedidos/{id}/mascotas', {
    responses: {
      '200': {
        description: 'Mascotas belonging to Pedido',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Mascotas)},
          },
        },
      },
    },
  })
  async getMascotas(
    @param.path.string('id') id: typeof Pedido.prototype.idPedido,
  ): Promise<Mascotas> {
    return this.pedidoRepository.mascotas(id);
  }
}
