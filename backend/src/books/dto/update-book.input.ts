import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsInt, Min, MaxLength } from 'class-validator';

@InputType()
export class UpdateBookInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}
