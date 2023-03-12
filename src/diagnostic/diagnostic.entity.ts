import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('diagnostico')
export class Diagnostic extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'medico_id', type: 'integer' })
  public medicId: number;

  @Column({ name: 'lesion_id', type: 'uuid', unique: true })
  public injuryId: string;

  @Column({ name: 'afeccion', type: 'varchar' })
  public condition: string;

  @Column({ name: 'grado', type: 'varchar' })
  public level: string;

  @Column({ name: 'requiere_tratamiento', type: 'boolean' })
  public requeresTreatment: boolean;

  @Column({ name: 'duracion_tratamiento', type: 'varchar' })
  public treatmentTerm: string;

  @Column({ name: 'medicacion', type: 'varchar' })
  public medicines: string;

  @Column({ name: 'control_tratamiento', type: 'varchar' })
  public treatmentControl: string;

  @Column({ name: 'recomendaciones', type: 'varchar' })
  public recommendations: string;

  @CreateDateColumn({
    name: 'fecha_creacion',
    type: 'timestamp',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'fecha_actualizacion',
    type: 'timestamp',
  })
  public updatedAt: Date;
  // @SONAR_STOP@
  public static of(params: Partial<Diagnostic>): Diagnostic {
    const diagnostic = new Diagnostic();

    Object.assign(diagnostic, params);

    return diagnostic;
  }
}

export class DiagnosticRepositoryFake {
  public create(): void {}
  public async save(): Promise<void> {}
  public async remove(): Promise<void> {}
  public async findOne(): Promise<void> {}
}
// @SONAR_START@
