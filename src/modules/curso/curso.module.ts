import { Module } from '@nestjs/common';
import { CategoriaModule } from '../categoria/categoria.module';
import { CursoController } from './curso.controller';
import { CursoService } from './curso.service';

@Module({
  imports: [CategoriaModule],
  controllers: [CursoController],
  providers: [CursoService],
  exports: [CursoService],
})
export class CursoModule {}
