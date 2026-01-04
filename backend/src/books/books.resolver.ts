import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Book } from './book.entity';
import { BooksService } from './books.service';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => Book)
@UseGuards(GqlAuthGuard)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Query(() => [Book], { name: 'books' })
  findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Query(() => Book, { name: 'book' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @Mutation(() => Book)
  createBook(@Args('input') input: CreateBookInput): Promise<Book> {
    return this.booksService.create(input);
  }

  @Mutation(() => Book)
  updateBook(@Args('input') input: UpdateBookInput): Promise<Book> {
    return this.booksService.update(input);
  }

  @Mutation(() => Boolean)
  deleteBook(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.booksService.remove(id);
  }
}
