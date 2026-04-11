import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProvinceDocument = Province & Document;

@Schema({ timestamps: true })
export class Province {
  _id?: string;

  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  regionId: string;
}

export const ProvinceSchema = SchemaFactory.createForClass(Province);
