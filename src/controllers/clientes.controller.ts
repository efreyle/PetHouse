import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Llaves} from '../config/llaves';
import {Clientes, Credenciales} from '../models';
import {ClientesRepository} from '../repositories';
import {AutenticacionService} from '../services';
const fetch = require("node-fetch");

export class ClientesController {
  constructor(
    @repository(ClientesRepository)
    public clientesRepository: ClientesRepository,
    @service(AutenticacionService)
    public servicioAutenticacion: AutenticacionService,
  ) { }
  @post('/identificarClientes', {
    responses: {
      '200': {
        description: "identificacion de usuarios"
      }
    }
  })
  async identificarClientes(
    @requestBody() Credenciales: Credenciales
  ) {

    let p = await this.servicioAutenticacion.IdentificarClientes(Credenciales.usuario, Credenciales.clave);
    if (p) {
      let token = this.servicioAutenticacion.GenerarTokenJWT(p);
      return {
        datos: {
          nombre: p.nombre,
          correo: p.correo,
          id: p.idCliente
        },
        tk: token
      }

    } else {
      throw new HttpErrors[401]("Datos no Validos");

    }
  }

  @post('/clientes')
  @response(200, {
    description: 'Clientes model instance',
    content: {'application/json': {schema: getModelSchemaRef(Clientes)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Clientes, {
            title: 'NewClientes',
            //exclude: ['id'],
          }),
        },
      },
    })
    clientes: Omit<Clientes, 'id'>,
  ): Promise<Clientes> {

    let clave = this.servicioAutenticacion.GenararClave();
    let claveCifrada = this.servicioAutenticacion.CifrarClave(clave);
    clientes.clave = claveCifrada;
    let p = await this.clientesRepository.create(clientes);

    //Notificar al  Usuario
    let destino = clientes.correo;
    let asunto = 'Registro en la plataforma';
    let contenido = `Hola ${clientes.nombre}, su nombre es: ${clientes.correo} y su contraseña es: ${clientes.clave}`;
    fetch(`${Llaves.urlServicioNotificaciones}/envio-correo?correo_destino=${destino}&asunto${asunto}&contenido=${contenido}`)
      .then((data: any) => {
        console.log(data);
      })
    return p;

  }

  @get('/clientes/count')
  @response(200, {
    description: 'Clientes model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Clientes) where?: Where<Clientes>,
  ): Promise<Count> {
    return this.clientesRepository.count(where);
  }

  @get('/clientes')
  @response(200, {
    description: 'Array of Clientes model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Clientes, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Clientes) filter?: Filter<Clientes>,
  ): Promise<Clientes[]> {
    return this.clientesRepository.find(filter);
  }

  @patch('/clientes')
  @response(200, {
    description: 'Clientes PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Clientes, {partial: true}),
        },
      },
    })
    clientes: Clientes,
    @param.where(Clientes) where?: Where<Clientes>,
  ): Promise<Count> {
    return this.clientesRepository.updateAll(clientes, where);
  }

  @get('/clientes/{id}')
  @response(200, {
    description: 'Clientes model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Clientes, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Clientes, {exclude: 'where'}) filter?: FilterExcludingWhere<Clientes>
  ): Promise<Clientes> {
    return this.clientesRepository.findById(id, filter);
  }

  @patch('/clientes/{id}')
  @response(204, {
    description: 'Clientes PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Clientes, {partial: true}),
        },
      },
    })
    clientes: Clientes,
  ): Promise<void> {
    await this.clientesRepository.updateById(id, clientes);
  }

  @put('/clientes/{id}')
  @response(204, {
    description: 'Clientes PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() clientes: Clientes,
  ): Promise<void> {
    await this.clientesRepository.replaceById(id, clientes);
  }

  @del('/clientes/{id}')
  @response(204, {
    description: 'Clientes DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.clientesRepository.deleteById(id);
  }
}
