import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number (starts from 1)',
    default: 1,
    minimum: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    minimum: 1,
    maximum: 100,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class PaginationResponseDto<T> {
  @ApiPropertyOptional({
    description: 'Array of items for the current page',
    isArray: true,
  })
  data: T[];

  @ApiPropertyOptional({
    description: 'Total number of items',
    example: 25,
  })
  total: number;

  @ApiPropertyOptional({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiPropertyOptional({
    description: 'Total number of pages',
    example: 3,
  })
  totalPages: number;

  @ApiPropertyOptional({
    description: 'Whether there is a next page',
    example: true,
  })
  hasNext: boolean;

  @ApiPropertyOptional({
    description: 'Whether there is a previous page',
    example: false,
  })
  hasPrev: boolean;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
    this.hasNext = page < this.totalPages;
    this.hasPrev = page > 1;
  }
}