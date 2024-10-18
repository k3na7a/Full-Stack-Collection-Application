import { ApiProperty } from '@nestjs/swagger';
import { AfterLoad, Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from 'src/library/entities/base.entity';
import { GameEntity } from './game.entity';
import { HandlebarsPlugin } from 'src/plugins/handlebars.plugin';
import { STORAGE } from 'src/library/enums/files.enum';
import { Exclude } from 'class-transformer';

type uriProps = {
  url: string | undefined;
  dir: string;
  filename: string;
};

@Entity()
export class CoverEntity extends BaseEntity {
  @Exclude()
  @Column()
  public readonly filename!: string;

  @ApiProperty()
  public uri!: string | null;

  @OneToOne(() => GameEntity, (game: GameEntity) => game.cover, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public readonly game!: GameEntity;

  @AfterLoad()
  updateUri() {
    const compile = HandlebarsPlugin.compile;
    this.uri = compile<uriProps>({
      template: '{{ url }}/{{ dir }}/{{ filename }}',
      data: {
        url: process.env.BASE_URL,
        dir: STORAGE.COVERS,
        filename: this.filename,
      },
    });
  }
}
