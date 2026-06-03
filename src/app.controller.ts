import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('inicial')
  getHello(): object {
    return {
      titulo: 'UpClass Web',
      horaAgora: new Date().toLocaleString('pt-BR'),
    };
  }

  @Get('sobre')
  @Render('_sobre')
  getSobre(): object {
    return {
      titulo: 'Sobre o UpClass Web',
    };
  }

  @Get('login')
  @Render('autenticacao/login')
  login(): object {
    return { layout: false };
  }
}
