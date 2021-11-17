import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Clientes} from './clientes.model';
import {Servicio} from './servicio.model';
import {Mascotas} from './mascotas.model';

@model()
export class Pedido extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  idPedido?: string;

  @property({
    type: 'string',
    required: true,
  })
  idServicio: string;

  @property({
    type: 'number',
    required: true,
  })
  cantidad: number;

  @property({
    type: 'number',
    required: true,
  })
  total: number;

  @property({
    type: 'string',
    required: true,
  })
  estadoPlan: string;

  @property({
    type: 'string',
    required: true,
  })
  idCliente: string;

  @property({
    type: 'string',
    required: true,
  })
  idMascota: string;

  @belongsTo(() => Clientes)
  clientesId: string;

  @belongsTo(() => Servicio)
  servicioId: string;

  @belongsTo(() => Mascotas)
  mascotasId: string;

  constructor(data?: Partial<Pedido>) {
    super(data);
  }
}

export interface PedidoRelations {
  // describe navigational properties here
}

export type PedidoWithRelations = Pedido & PedidoRelations;
