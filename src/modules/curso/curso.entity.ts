import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Categoria } from '../categoria/categoria.entity';

@Entity('cursos')
export class Curso extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 160 })
  titulo!: string;

  @Column({ type: 'text', nullable: true })
  descricao?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco!: number;

  @Column({ type: 'varchar', length: 30, default: 'rascunho' })
  status!: string;

  @Column({ name: 'instrutor_id', type: 'int', nullable: true })
  instrutorId?: number | null;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm!: Date;

  @UpdateDateColumn({ name: 'atualizado_em', nullable: true })
  atualizadoEm!: Date;

  @ManyToOne(() => Categoria, (categoria) => categoria.cursos, {
    nullable: false,
  })
  @JoinColumn({
    name: 'categoria_id',
  })
  categoria!: Categoria;
}
