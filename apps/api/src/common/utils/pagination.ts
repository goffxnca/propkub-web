import { BadRequestException } from '@nestjs/common';

export interface PaginationOptions {
  page: number;
  per_page: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total_count: number;
  page: number;
  per_page: number;
}

/**
 * Interface for MongoDB query objects
 * Ensures the query has the required methods for pagination
 */
export interface MongoQuery<T> {
  skip(n: number): MongoQuery<T>;
  limit(n: number): MongoQuery<T>;
  exec(): Promise<T[]>;
  countDocuments(): Promise<number>;
}

/**
 * Generic pagination utility for MongoDB queries
 * @param baseQuery - Function that returns a fresh MongoDB query
 * @param options - Pagination options (page, per_page)
 * @returns Promise<PaginatedResponse<T>>
 */
export const paginate = async <T>(
  baseQuery: () => MongoQuery<T>,
  options: PaginationOptions
): Promise<PaginatedResponse<T>> => {
  // Validate pagination options automatically
  const validatedOptions = validatePaginationOptions(
    options.page,
    options.per_page
  );

  const { page, per_page } = validatedOptions;
  const skip = (page - 1) * per_page;

  // Create separate queries to avoid "Query was already executed" error
  const itemsQuery = baseQuery().skip(skip).limit(per_page);
  const countQuery = baseQuery();

  // Execute both queries in parallel for better performance
  const [items, total_count] = await Promise.all([
    itemsQuery.exec(),
    countQuery.countDocuments()
  ]);

  return {
    items,
    total_count,
    page,
    per_page
  };
};

/**
 * Validate pagination parameters and throw error if invalid
 * @param page - Page number (should be >= 1)
 * @param per_page - Items per page (should be between 1 and 50)
 * @returns Validated pagination options
 * @throws BadRequestException if values are invalid
 */
const validatePaginationOptions = (
  page: number,
  per_page: number
): PaginationOptions => {
  // Check for invalid types or negative values
  if (!Number.isInteger(page) || page < 1) {
    throw new BadRequestException(
      `Invalid page number: ${page}. Must be a positive integer >= 1.`
    );
  }

  if (!Number.isInteger(per_page) || per_page < 1 || per_page > 50) {
    throw new BadRequestException(
      `Invalid per_page value: ${per_page}. Must be an integer between 1 and 50.`
    );
  }

  return {
    page,
    per_page
  };
};
