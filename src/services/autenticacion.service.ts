import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Llaves} from '../config/llaves';
import {Clientes} from '../models';
import {ClientesRepository} from '../repositories';
const generador = require("password-generator");
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    @repository(ClientesRepository)
    public clientesRepository: ClientesRepository
  ) { }

  /*
  * Add service methods here
  */

  GenararClave() {
    let clave = generador(8, false);
    return clave;
  }


  CifrarClave(clave: string) {
    let claveCifrada = cryptoJS.MD5(clave).toString();
    return claveCifrada;
  }

  IdentificarClientes(usuario: string, clave: string) {
    try {
      let p = this.clientesRepository.findOne({where: {correo: usuario, clave: clave}});
      if (p) {
        return p;
      }
      return false;
    } catch {
      return false;
    }

  }

  GenerarTokenJWT(clientes: Clientes) {
    let token = jwt.sign({
      data: {
        id: clientes.idCliente,
        correo: clientes.correo,
        nombre: clientes.nombre + "" + clientes.apellidos
      }

    },
      Llaves.claveJWT);
    return token;
  }

  ValidarTokenJWT(token: string) {
    try {
      let datos = jwt.verify(token, Llaves.claveJWT);
      return datos;

    } catch {
      return false;
    }

  }

}
