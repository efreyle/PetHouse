import {Entity, hasMany, model, property} from '@loopback/repository';
import {Mascotas} from './mascotas.model';
import {Pedido} from './pedido.model';

@model()
export class Clientes extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  idCliente?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  apellidos: string;

  @property({
    type: 'string',
    required: true,
  })
  correo: string;

  @property({
    type: 'string',
    required: true,
  })
  telefono: string;

  @property({
    type: 'string',
    required: false,
  })
  clave: string;

  @hasMany(() => Pedido)
  pedidos: Pedido[];

  @hasMany(() => Mascotas)
  mascotas: Mascotas[];

  constructor(data?: Partial<Clientes>) {
    super(data);
  }
}

export interface ClientesRelations {
  // describe navigational properties here
}

export type ClientesWithRelations = Clientes & ClientesRelations;
