import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../config/constants.js';

/**
 * Parse and sanitize pagination parameters from query string
 * @param {Object} query - Express req.query object
 * @returns {{ page: number, limit: number, skip: number }}
 */
export const parsePagination = (query = {}) => {
    let page = Math.max(1, parseInt(query.page) || 1);
    let limit = Math.min(
        MAX_PAGE_SIZE,
        Math.max(1, parseInt(query.limit) || DEFAULT_PAGE_SIZE)
    );
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

/**
 * Build a paginated response object
 * @param {Array} data - Array of documents
 * @param {number} total - Total count of matching documents
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 */
export const paginatedResponse = (data, total, page, limit) => {
    return {
        data,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1
        }
    };
};

export default { parsePagination, paginatedResponse };
