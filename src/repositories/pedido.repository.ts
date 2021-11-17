import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Pedido, PedidoRelations, Clientes, Servicio, Mascotas} from '../models';
import {ClientesRepository} from './clientes.repository';
import {ServicioRepository} from './servicio.repository';
import {MascotasRepository} from './mascotas.repository';

export class PedidoRepository extends DefaultCrudRepository<
  Pedido,
  typeof Pedido.prototype.idPedido,
  PedidoRelations
> {

  public readonly clientes: BelongsToAccessor<Clientes, typeof Pedido.prototype.idPedido>;

  public readonly servicio: BelongsToAccessor<Servicio, typeof Pedido.prototype.idPedido>;

  public readonly mascotas: BelongsToAccessor<Mascotas, typeof Pedido.prototype.idPedido>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('ClientesRepository') protected clientesRepositoryGetter: Getter<ClientesRepository>, @repository.getter('ServicioRepository') protected servicioRepositoryGetter: Getter<ServicioRepository>, @repository.getter('MascotasRepository') protected mascotasRepositoryGetter: Getter<MascotasRepository>,
  ) {
    super(Pedido, dataSource);
    this.mascotas = this.createBelongsToAccessorFor('mascotas', mascotasRepositoryGetter,);
    this.registerInclusionResolver('mascotas', this.mascotas.inclusionResolver);
    this.servicio = this.createBelongsToAccessorFor('servicio', servicioRepositoryGetter,);
    this.registerInclusionResolver('servicio', this.servicio.inclusionResolver);
    this.clientes = this.createBelongsToAccessorFor('clientes', clientesRepositoryGetter,);
    this.registerInclusionResolver('clientes', this.clientes.inclusionResolver);
  }
}
