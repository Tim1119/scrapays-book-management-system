import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './book.entity';

describe('BooksService', () => {
  let service: BooksService;

  const mockBook = {
    id: 1,
    name: 'Test Book',
    description: 'Test Description',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    find: jest.fn().mockResolvedValue([mockBook]),
    findOne: jest.fn().mockResolvedValue(mockBook),
    create: jest.fn().mockReturnValue(mockBook),
    save: jest.fn().mockResolvedValue(mockBook),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: getRepositoryToken(Book), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of books', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockBook]);
    });
  });

  describe('findOne', () => {
    it('should return a book', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockBook);
    });

    it('should throw NotFoundException', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a book', async () => {
      const result = await service.create({ name: 'New', description: 'Desc' });
      expect(result).toEqual(mockBook);
    });
  });

  describe('remove', () => {
    it('should delete a book', async () => {
      const result = await service.remove(1);
      expect(result).toBe(true);
    });
  });
});
