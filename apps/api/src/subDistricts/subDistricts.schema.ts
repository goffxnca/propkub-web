import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubDistrictDocument = SubDistrict & Document;

@Schema({ timestamps: true })
export class SubDistrict {
  _id?: string;

  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  districtId: string;
}

export const SubDistrictSchema = SchemaFactory.createForClass(SubDistrict);
