import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateBookInput {
  @Field()
  @IsNotEmpty({ message: 'Book name is required' })
  @IsString()
  @MaxLength(255)
  name: string;

  @Field()
  @IsString()
  description: string;
}
