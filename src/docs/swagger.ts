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
      School: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Dhaka University Laboratory School' },
          eiin: { type: 'string', nullable: true, example: '123456' },
          mobile: { type: 'string', nullable: true, example: '+8801234567890' },
          logo: { type: 'string', nullable: true, example: 'https://example.com/logo.png' },
          district_id: { type: 'integer', example: 1 },
          thana_id: { type: 'integer', example: 1 },
          website: { type: 'string', nullable: true, example: 'https://example.com' },
          email: { type: 'string', nullable: true, example: 'info@example.com' },
          address: { type: 'string', nullable: true, example: '123 Main Street, Dhaka' },
          payable_amount: { type: 'number', nullable: true, example: 5000.50 },
          established_at: { type: 'string', nullable: true, example: '1990' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          district: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              name: { type: 'string', example: 'Dhaka' },
            },
          },
          thana: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              name: { type: 'string', example: 'Tejgaon' },
            },
          },
        },
      },
      CreateSchoolRequest: {
        type: 'object',
        required: ['name', 'district_id', 'thana_id'],
        properties: {
          name: { type: 'string', example: 'Dhaka University Laboratory School' },
          eiin: { type: 'string', nullable: true, example: '123456' },
          mobile: { type: 'string', nullable: true, example: '+8801234567890' },
          logo: { type: 'string', nullable: true, example: 'https://example.com/logo.png' },
          district_id: { type: 'integer', example: 1 },
          thana_id: { type: 'integer', example: 1 },
          website: { type: 'string', nullable: true, example: 'https://example.com' },
          email: { type: 'string', nullable: true, example: 'info@example.com' },
          address: { type: 'string', nullable: true, example: '123 Main Street, Dhaka' },
          payable_amount: { type: 'number', nullable: true, example: 5000.50 },
          established_at: { type: 'string', nullable: true, example: '1990' },
        },
      },
      UpdateSchoolRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Dhaka University Laboratory School' },
          eiin: { type: 'string', nullable: true, example: '123456' },
          mobile: { type: 'string', nullable: true, example: '+8801234567890' },
          logo: { type: 'string', nullable: true, example: 'https://example.com/logo.png' },
          district_id: { type: 'integer', example: 1 },
          thana_id: { type: 'integer', example: 1 },
          website: { type: 'string', nullable: true, example: 'https://example.com' },
          email: { type: 'string', nullable: true, example: 'info@example.com' },
          address: { type: 'string', nullable: true, example: '123 Main Street, Dhaka' },
          payable_amount: { type: 'number', nullable: true, example: 5000.50 },
          established_at: { type: 'string', nullable: true, example: '1990' },
        },
      },
      PaginatedSchoolResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Schools retrieved successfully' },
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
            items: { $ref: '#/components/schemas/School' },
          },
        },
      },
      SingleSchoolResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'School retrieved successfully' },
          data: { $ref: '#/components/schemas/School' },
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
    '/schools': {
      get: {
        tags: ['School'],
        summary: 'List schools with advanced filtering, search, pagination, and sorting',
        description: 'Retrieve a paginated list of schools with support for search, filtering by district/thana, and sorting',
        parameters: [
          { 
            in: 'query', 
            name: 'searchTerm', 
            schema: { type: 'string' },
            description: 'Search in school name, EIIN, or email'
          },
          { 
            in: 'query', 
            name: 'name', 
            schema: { type: 'string' },
            description: 'Filter by exact school name'
          },
          { 
            in: 'query', 
            name: 'eiin', 
            schema: { type: 'string' },
            description: 'Filter by exact EIIN'
          },
          { 
            in: 'query', 
            name: 'district_id', 
            schema: { type: 'integer' },
            description: 'Filter by district ID'
          },
          { 
            in: 'query', 
            name: 'thana_id', 
            schema: { type: 'integer' },
            description: 'Filter by thana ID'
          },
          { 
            in: 'query', 
            name: 'page', 
            schema: { type: 'integer', minimum: 1, default: 1 },
            description: 'Page number for pagination'
          },
          { 
            in: 'query', 
            name: 'limit', 
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
            description: 'Number of items per page'
          },
          { 
            in: 'query', 
            name: 'sortBy', 
            schema: { type: 'string', enum: ['name', 'eiin', 'created_at', 'updated_at'], default: 'created_at' },
            description: 'Field to sort by'
          },
          { 
            in: 'query', 
            name: 'sortOrder', 
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
            description: 'Sort order'
          },
        ],
        responses: {
          200: {
            description: 'Schools retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedSchoolResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['School'],
        summary: 'Create a new school',
        description: 'Create a new school with all required and optional information',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateSchoolRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'School created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SingleSchoolResponse' },
              },
            },
          },
          400: { description: 'Invalid input data' },
        },
      },
    },
    '/schools/{id}': {
      get: {
        tags: ['School'],
        summary: 'Get a school by ID',
        description: 'Retrieve detailed information about a specific school including district and thana details',
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } },
        ],
        responses: {
          200: {
            description: 'School retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SingleSchoolResponse' },
              },
            },
          },
          404: { description: 'School not found' },
        },
      },
      patch: {
        tags: ['School'],
        summary: 'Update a school',
        description: 'Update school information. All fields are optional.',
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateSchoolRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'School updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SingleSchoolResponse' },
              },
            },
          },
          404: { description: 'School not found' },
        },
      },
      delete: {
        tags: ['School'],
        summary: 'Delete a school',
        description: 'Permanently delete a school from the system',
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } },
        ],
        responses: {
          200: { description: 'School deleted successfully' },
          404: { description: 'School not found' },
        },
      },
    },
    '/schools/district/{districtId}': {
      get: {
        tags: ['School'],
        summary: 'List schools by district',
        description: 'Retrieve all schools within a specific district',
        parameters: [
          { in: 'path', name: 'districtId', required: true, schema: { type: 'integer', minimum: 1 } },
        ],
        responses: {
          200: {
            description: 'Schools retrieved successfully by district',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/School' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/schools/thana/{thanaId}': {
      get: {
        tags: ['School'],
        summary: 'List schools by thana',
        description: 'Retrieve all schools within a specific thana',
        parameters: [
          { in: 'path', name: 'thanaId', required: true, schema: { type: 'integer', minimum: 1 } },
        ],
        responses: {
          200: {
            description: 'Schools retrieved successfully by thana',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/School' },
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


