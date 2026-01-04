import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    return this.booksRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async create(input: CreateBookInput): Promise<Book> {
    const book = this.booksRepository.create(input);
    const saved = await this.booksRepository.save(book);
    this.logger.log(`Created book: ${saved.name} (ID: ${saved.id})`);
    return saved;
  }

  async update(input: UpdateBookInput): Promise<Book> {
    const { id, ...updateData } = input;
    await this.findOne(id); // Check exists
    
    const filtered = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== undefined),
    );
    
    if (Object.keys(filtered).length > 0) {
      await this.booksRepository.update(id, filtered);
      this.logger.log(`Updated book ID: ${id}`);
    }
    
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    await this.findOne(id); // Check if the book exists
    const result = await this.booksRepository.delete(id);
    this.logger.log(`Deleted book ID: ${id}`);
    return (result.affected ?? 0) > 0;
  }
}