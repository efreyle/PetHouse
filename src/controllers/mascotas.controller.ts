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
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Mascotas} from '../models';
import {MascotasRepository} from '../repositories';

export class MascotasController {
  constructor(
    @repository(MascotasRepository)
    public mascotasRepository: MascotasRepository,
  ) { }

  @post('/mascotas')
  @response(200, {
    description: 'Mascotas model instance',
    content: {'application/json': {schema: getModelSchemaRef(Mascotas)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Mascotas, {
            title: 'NewMascotas',
            //exclude: ['id'],
          }),
        },
      },
    })
    mascotas: Omit<Mascotas, 'id'>,
  ): Promise<Mascotas> {
    return this.mascotasRepository.create(mascotas);
  }

  @get('/mascotas/count')
  @response(200, {
    description: 'Mascotas model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Mascotas) where?: Where<Mascotas>,
  ): Promise<Count> {
    return this.mascotasRepository.count(where);
  }

  @get('/mascotas')
  @response(200, {
    description: 'Array of Mascotas model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Mascotas, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Mascotas) filter?: Filter<Mascotas>,
  ): Promise<Mascotas[]> {
    return this.mascotasRepository.find(filter);
  }

  @patch('/mascotas')
  @response(200, {
    description: 'Mascotas PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Mascotas, {partial: true}),
        },
      },
    })
    mascotas: Mascotas,
    @param.where(Mascotas) where?: Where<Mascotas>,
  ): Promise<Count> {
    return this.mascotasRepository.updateAll(mascotas, where);
  }

  @get('/mascotas/{id}')
  @response(200, {
    description: 'Mascotas model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Mascotas, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Mascotas, {exclude: 'where'}) filter?: FilterExcludingWhere<Mascotas>
  ): Promise<Mascotas> {
    return this.mascotasRepository.findById(id, filter);
  }

  @patch('/mascotas/{id}')
  @response(204, {
    description: 'Mascotas PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Mascotas, {partial: true}),
        },
      },
    })
    mascotas: Mascotas,
  ): Promise<void> {
    await this.mascotasRepository.updateById(id, mascotas);
  }

  @put('/mascotas/{id}')
  @response(204, {
    description: 'Mascotas PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() mascotas: Mascotas,
  ): Promise<void> {
    await this.mascotasRepository.replaceById(id, mascotas);
  }

  @del('/mascotas/{id}')
  @response(204, {
    description: 'Mascotas DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.mascotasRepository.deleteById(id);
  }
}
