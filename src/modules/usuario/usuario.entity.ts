import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { UsuarioPerfil } from './usuario.utils';

@Entity('usuarios')
export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 120 })
  nome!: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  email!: string;

  @Column({ name: 'senha_hash', type: 'varchar', length: 255, select: false })
  senhaHash!: string;

  @Column({ name: 'senha_salt', type: 'varchar', length: 64, select: false })
  senhaSalt!: string;

  @Column({ type: 'varchar', length: 11, nullable: true, unique: true })
  cpf?: string | null;

  @Column({ type: 'varchar', length: 20, default: 'aluno' })
  perfil!: UsuarioPerfil;

  @Column({ type: 'boolean', default: true })
  ativo!: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm!: Date;

  @UpdateDateColumn({ name: 'atualizado_em', nullable: true })
  atualizadoEm!: Date;
}
