import swaggerJSDoc, { OAS3Definition, OAS3Options } from 'swagger-jsdoc';

const definition: OAS3Definition = {
  openapi: '3.0.3',
  info: {
    title: 'School Management API',
    version: '1.0.0',
    description: 'API documentation for District resources',
  },
  servers: [
    { url: 'http://localhost:5000/api/v1', description: 'Base API' },
  ],
  components: {
    schemas: {
      District: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Dhaka' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      PaginatedDistrictResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Districts retrieved successfully' },
          meta: {
            type: 'object',
            properties: {
              page: { type: 'integer', example: 1 },
              limit: { type: 'integer', example: 10 },
              total: { type: 'integer', example: 25 },
              totalPages: { type: 'integer', example: 3 },
              hasNext: { type: 'boolean', example: true },
              hasPrev: { type: 'boolean', example: false },
            },
          },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/District' },
          },
        },
      },
      SingleDistrictResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'District retrieved successfully' },
          data: { $ref: '#/components/schemas/District' },
        },
      },
      CreateDistrictRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Chattogram' },
        },
      },
      UpdateDistrictRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Chattogram' },
        },
      },
      Thana: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Tejgaon' },
          district_id: { type: 'integer', example: 1 },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      CreateThanaRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Banani' },
          district_id: { type: 'integer', nullable: true, example: 1 },
        },
      },
      UpdateThanaRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Banani' },
          district_id: { type: 'integer', nullable: true, example: 1 },
        },
      },
      PaginatedThanaResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Thanas retrieved successfully' },
          meta: {
            type: 'object',
            properties: {
              page: { type: 'integer', example: 1 },
              limit: { type: 'integer', example: 10 },
              total: { type: 'integer', example: 25 },
              totalPages: { type: 'integer', example: 3 },
              hasNext: { type: 'boolean', example: true },
              hasPrev: { type: 'boolean', example: false },
            },
          },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Thana' },
          },
        },
      },
      SingleThanaResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Thana retrieved successfully' },
          data: { $ref: '#/components/schemas/Thana' },
        },
      },
    },
  },
  paths: {
    '/districts': {
      get: {
        tags: ['District'],
        summary: 'List districts',
        parameters: [
          { in: 'query', name: 'searchTerm', schema: { type: 'string' } },
          { in: 'query', name: 'name', schema: { type: 'string' } },
          { in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1 } },
          { in: 'query', name: 'sortBy', schema: { type: 'string', example: 'created_at' } },
          { in: 'query', name: 'sortOrder', schema: { type: 'string', enum: ['asc', 'desc'] } },
        ],
        responses: {
          200: {
            description: 'Districts retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedDistrictResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['District'],
        summary: 'Create district',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateDistrictRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'District created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SingleDistrictResponse' },
              },
            },
          },
        },
      },
    },
    '/districts/{id}': {
      get: {
        tags: ['District'],
        summary: 'Get a district by ID',
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } },
        ],
        responses: {
          200: {
            description: 'District retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SingleDistrictResponse' },
              },
            },
          },
          404: { description: 'District not found' },
        },
      },
      patch: {
        tags: ['District'],
        summary: 'Update a district',
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateDistrictRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'District updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SingleDistrictResponse' },
              },
            },
          },
          404: { description: 'District not found' },
        },
      },
      delete: {
        tags: ['District'],
        summary: 'Delete a district',
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } },
        ],
        responses: {
          200: { description: 'District deleted successfully' },
          404: { description: 'District not found' },
        },
      },
    },
    '/thanas': {
      get: {
        tags: ['Thana'],
        summary: 'List thanas',
        parameters: [
          { in: 'query', name: 'searchTerm', schema: { type: 'string' } },
          { in: 'query', name: 'name', schema: { type: 'string' } },
          { in: 'query', name: 'district_id', schema: { type: 'integer' } },
          { in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1 } },
          { in: 'query', name: 'sortBy', schema: { type: 'string', example: 'created_at' } },
          { in: 'query', name: 'sortOrder', schema: { type: 'string', enum: ['asc', 'desc'] } },
        ],
        responses: {
          200: {
            description: 'Thanas retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedThanaResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Thana'],
        summary: 'Create thana',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateThanaRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Thana created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SingleThanaResponse' },
              },
            },
          },
        },
      },
    },
    '/thanas/{id}': {
      get: {
        tags: ['Thana'],
        summary: 'Get a thana by ID',
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } },
        ],
        responses: {
          200: {
            description: 'Thana retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SingleThanaResponse' },
              },
            },
          },
          404: { description: 'Thana not found' },
        },
      },
      patch: {
        tags: ['Thana'],
        summary: 'Update a thana',
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateThanaRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Thana updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SingleThanaResponse' },
              },
            },
          },
          404: { description: 'Thana not found' },
        },
      },
      delete: {
        tags: ['Thana'],
        summary: 'Delete a thana',
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } },
        ],
        responses: {
          200: { description: 'Thana deleted successfully' },
          404: { description: 'Thana not found' },
        },
      },
    },
    '/thanas/district/{districtId}': {
      get: {
        tags: ['Thana'],
        summary: 'List thanas for a district',
        parameters: [
          { in: 'path', name: 'districtId', required: true, schema: { type: 'integer', minimum: 1 } },
        ],
        responses: {
          200: {
            description: 'Thanas retrieved successfully by district',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Thana' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const options: OAS3Options = {
  definition,
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);


