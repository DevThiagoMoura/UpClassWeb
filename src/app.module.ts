import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/database.module';
import { AutenticacaoModule } from './modules/autenticacao/autenticacao.module';
import { CategoriaModule } from './modules/categoria/categoria.module';
import { CursoModule } from './modules/curso/curso.module';
import { UsuarioModule } from './modules/usuario/usuario.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AutenticacaoModule,
    CategoriaModule,
    CursoModule,
    UsuarioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
