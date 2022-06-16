import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  
  // Se muestra en la pantalla principal de la ruta API
  getHello() {
    return `Hello, this is BSale Backend!
    Web FrontEnd: bsale-rayflores.herokuapp.com
    APIS: https://github.com/rayfn98/bsale-backend#api-rest
    `;
  }
}
