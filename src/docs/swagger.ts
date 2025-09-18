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
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      SchoolUser: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', nullable: true, example: 'john@example.com' },
          username: { type: 'string', example: 'johndoe' },
          mobile_no: { type: 'string', example: '+8801700000000' },
          photo: { type: 'string', nullable: true, example: 'https://example.com/photo.jpg' },
          school_id: { type: 'integer', example: 1 },
          address: { type: 'string', nullable: true, example: 'Dhaka, Bangladesh' },
          role: {
            type: 'string',
            example: 'school_admin',
            enum: ['school_super_admin', 'school_admin', 'admin', 'user'],
          },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      RegisterSchoolUserRequest: {
        type: 'object',
        required: ['name', 'password', 'username', 'mobile_no', 'school_id'],
        properties: {
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', nullable: true, example: 'john@example.com' },
          password: { type: 'string', example: 'StrongPassword123' },
          username: { type: 'string', example: 'johndoe' },
          mobile_no: { type: 'string', example: '+8801700000000' },
          photo: { type: 'string', nullable: true, example: 'https://example.com/photo.jpg' },
          school_id: { type: 'integer', example: 1 },
          address: { type: 'string', nullable: true, example: 'Dhaka, Bangladesh' },
          role: {
            type: 'string',
            example: 'school_admin',
            enum: ['school_super_admin', 'school_admin', 'admin', 'user'],
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['usernameOrMobile', 'password'],
        properties: {
          usernameOrMobile: { type: 'string', example: 'johndoe' },
          password: { type: 'string', example: 'StrongPassword123' },
        },
      },
      LoginResponseData: {
        type: 'object',
        properties: {
          accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: { $ref: '#/components/schemas/SchoolUser' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Login successful' },
          data: { $ref: '#/components/schemas/LoginResponseData' },
        },
      },
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
      Class: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Grade 1' },
          serial_number: { type: 'integer', nullable: true, example: 1 },
          status: { type: 'string', enum: ['active','inactive'], example: 'active' },
          school_id: { type: 'integer', example: 1 },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      CreateClassRequest: {
        type: 'object',
        required: ['name','status','school_id'],
        properties: {
          name: { type: 'string' },
          serial_number: { type: 'integer', nullable: true },
          status: { type: 'string', enum: ['active','inactive'] },
          school_id: { type: 'integer' },
        },
      },
      UpdateClassRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          serial_number: { type: 'integer', nullable: true },
          status: { type: 'string', enum: ['active','inactive'] },
        },
      },
      Section: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'A' },
          serial_number: { type: 'integer', nullable: true, example: 1 },
          status: { type: 'string', enum: ['active','inactive'], example: 'active' },
          school_id: { type: 'integer', example: 1 },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      CreateSectionRequest: {
        type: 'object',
        required: ['name','status','school_id'],
        properties: {
          name: { type: 'string' },
          serial_number: { type: 'integer', nullable: true },
          status: { type: 'string', enum: ['active','inactive'] },
          school_id: { type: 'integer' },
        },
      },
      UpdateSectionRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          serial_number: { type: 'integer', nullable: true },
          status: { type: 'string', enum: ['active','inactive'] },
        },
      },
      Group: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'SCIENCE' },
          serial_number: { type: 'integer', nullable: true, example: 1 },
          status: { type: 'string', enum: ['active','inactive'], example: 'active' },
          school_id: { type: 'integer', example: 1 },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      CreateGroupRequest: {
        type: 'object',
        required: ['name','status','school_id'],
        properties: {
          name: { type: 'string' },
          serial_number: { type: 'integer', nullable: true },
          status: { type: 'string', enum: ['active','inactive'] },
          school_id: { type: 'integer' },
        },
      },
      UpdateGroupRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          serial_number: { type: 'integer', nullable: true },
          status: { type: 'string', enum: ['active','inactive'] },
        },
      },
      Shift: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'MORNING' },
          serial_number: { type: 'integer', nullable: true, example: 1 },
          status: { type: 'string', enum: ['active','inactive'], example: 'active' },
          school_id: { type: 'integer', example: 1 },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      CreateShiftRequest: {
        type: 'object',
        required: ['name','status','school_id'],
        properties: {
          name: { type: 'string' },
          serial_number: { type: 'integer', nullable: true },
          status: { type: 'string', enum: ['active','inactive'] },
          school_id: { type: 'integer' },
        },
      },
      UpdateShiftRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          serial_number: { type: 'integer', nullable: true },
          status: { type: 'string', enum: ['active','inactive'] },
        },
      },
      Subject: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Mathematics' },
          code: { type: 'string', nullable: true, example: 'MATH-101' },
          serial_number: { type: 'integer', nullable: true, example: 1 },
          status: { type: 'string', enum: ['active','inactive'], example: 'active' },
          school_id: { type: 'integer', example: 1 },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      CreateSubjectRequest: {
        type: 'object',
        required: ['name','status','school_id'],
        properties: {
          name: { type: 'string' },
          code: { type: 'string', nullable: true },
          serial_number: { type: 'integer', nullable: true },
          status: { type: 'string', enum: ['active','inactive'] },
          school_id: { type: 'integer' },
        },
      },
      UpdateSubjectRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          code: { type: 'string', nullable: true },
          serial_number: { type: 'integer', nullable: true },
          status: { type: 'string', enum: ['active','inactive'] },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Academic' },
          serial_number: { type: 'integer', nullable: true, example: 1 },
          status: { type: 'string', enum: ['active','inactive'], example: 'active' },
          school_id: { type: 'integer', example: 1 },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      CreateCategoryRequest: {
        type: 'object',
        required: ['name','status','school_id'],
        properties: {
          name: { type: 'string' },
          serial_number: { type: 'integer', nullable: true },
          status: { type: 'string', enum: ['active','inactive'] },
          school_id: { type: 'integer' },
        },
      },
      UpdateCategoryRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          serial_number: { type: 'integer', nullable: true },
          status: { type: 'string', enum: ['active','inactive'] },
        },
      },
      ClassExam: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          class_exam_name: { type: 'string', example: 'Half Yearly Exam' },
          position: { type: 'integer', example: 2 },
          serial_number: { type: 'integer', nullable: true, example: 2 },
          status: { type: 'string', enum: ['active','inactive'], example: 'active' },
          school_id: { type: 'integer', example: 1 },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      CreateClassExamRequest: {
        type: 'object',
        required: ['class_exam_name','position','status','school_id'],
        properties: {
          class_exam_name: { type: 'string' },
          position: { type: 'integer' },
          serial_number: { type: 'integer', nullable: true },
          status: { type: 'string', enum: ['active','inactive'] },
          school_id: { type: 'integer' },
        },
      },
      UpdateClassExamRequest: {
        type: 'object',
        properties: {
          class_exam_name: { type: 'string' },
          position: { type: 'integer' },
          serial_number: { type: 'integer', nullable: true },
          status: { type: 'string', enum: ['active','inactive'] },
        },
      },
        ClassGroupAssign: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            school_id: { type: 'integer', example: 1 },
            class_id: { type: 'integer', example: 5 },
            group_ids: { type: 'array', items: { type: 'integer' }, nullable: true, example: [1,2,3] },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        UpsertClassGroupRequest: {
          type: 'object',
          required: ['school_id','class_id'],
          properties: {
            school_id: { type: 'integer' },
            class_id: { type: 'integer' },
            group_ids: { type: 'array', items: { type: 'integer' }, nullable: true },
          },
        },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new school user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterSchoolUserRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'User created successfully' },
                    data: { $ref: '#/components/schemas/SchoolUser' },
                  },
                },
              },
            },
          },
          400: { description: 'Invalid input' },
          409: { description: 'Username already exists' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login with username or mobile and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' },
              },
            },
          },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout (stateless)',
        description: 'For stateless JWT auth, logout is client-side. This endpoint can be used for future blacklisting.',
        responses: {
          200: { description: 'Logout successful' },
        },
      },
    },
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
    '/basic-setting/classes': {
      get: {
        tags: ['Class'],
        summary: 'List classes',
        parameters: [
          { in: 'query', name: 'school_id', schema: { type: 'integer', minimum: 1 } },
          { in: 'query', name: 'status', schema: { type: 'string', enum: ['active','inactive'] } },
          { in: 'query', name: 'searchTerm', schema: { type: 'string' } },
          { in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1 } },
          { in: 'query', name: 'sortBy', schema: { type: 'string' } },
          { in: 'query', name: 'sortOrder', schema: { type: 'string', enum: ['asc','desc'] } },
        ],
        responses: {
          200: {
            description: 'Classes retrieved successfully',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, meta: { $ref: '#/components/schemas/PaginationMeta' }, data: { type: 'array', items: { $ref: '#/components/schemas/Class' } } } } } },
          },
        },
      },
      post: {
        tags: ['Class'],
        summary: 'Create class',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateClassRequest' } } } },
        responses: { 201: { description: 'Class created successfully', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/Class' } } } } } } },
      },
    },
    '/basic-setting/classes/{id}': {
      get: { tags: ['Class'], summary: 'Get class', parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } } ], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/Class' } } } } } } } },
      patch: { tags: ['Class'], summary: 'Update class', parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } } ], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateClassRequest' } } } }, responses: { 200: { description: 'Updated', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/Class' } } } } } } } },
      delete: { tags: ['Class'], summary: 'Delete class', parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } } ], responses: { 200: { description: 'Deleted', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' } } } } } } } },
    },
    '/basic-setting/sections': {
      get: { tags: ['Section'], summary: 'List sections', parameters: [ { in: 'query', name: 'school_id', schema: { type: 'integer', minimum: 1 } }, { in: 'query', name: 'status', schema: { type: 'string', enum: ['active','inactive'] } }, { in: 'query', name: 'searchTerm', schema: { type: 'string' } }, { in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 } }, { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1 } }, { in: 'query', name: 'sortBy', schema: { type: 'string' } }, { in: 'query', name: 'sortOrder', schema: { type: 'string', enum: ['asc','desc'] } } ], responses: { 200: { description: 'Sections retrieved successfully', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, meta: { $ref: '#/components/schemas/PaginationMeta' }, data: { type: 'array', items: { $ref: '#/components/schemas/Section' } } } } } } } } },
      post: { tags: ['Section'], summary: 'Create section', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateSectionRequest' } } } }, responses: { 201: { description: 'Section created successfully', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/Section' } } } } } } } },
    },
    '/basic-setting/sections/{id}': {
      get: { tags: ['Section'], summary: 'Get section', parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } } ], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/Section' } } } } } } } },
      patch: { tags: ['Section'], summary: 'Update section', parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } } ], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateSectionRequest' } } } }, responses: { 200: { description: 'Updated', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/Section' } } } } } } } },
      delete: { tags: ['Section'], summary: 'Delete section', parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } } ], responses: { 200: { description: 'Deleted', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' } } } } } } } },
    },
    '/basic-setting/groups': {
      get: { tags: ['Group'], summary: 'List groups', parameters: [ { in: 'query', name: 'school_id', schema: { type: 'integer', minimum: 1 } }, { in: 'query', name: 'status', schema: { type: 'string', enum: ['active','inactive'] } }, { in: 'query', name: 'searchTerm', schema: { type: 'string' } }, { in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 } }, { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1 } }, { in: 'query', name: 'sortBy', schema: { type: 'string' } }, { in: 'query', name: 'sortOrder', schema: { type: 'string', enum: ['asc','desc'] } } ], responses: { 200: { description: 'Groups retrieved successfully', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, meta: { $ref: '#/components/schemas/PaginationMeta' }, data: { type: 'array', items: { $ref: '#/components/schemas/Group' } } } } } } } } },
      post: { tags: ['Group'], summary: 'Create group', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateGroupRequest' } } } }, responses: { 201: { description: 'Group created successfully', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/Group' } } } } } } } },
    },
    '/basic-setting/groups/{id}': {
      get: { tags: ['Group'], summary: 'Get group', parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } } ], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/Group' } } } } } } } },
      patch: { tags: ['Group'], summary: 'Update group', parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } } ], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateGroupRequest' } } } }, responses: { 200: { description: 'Updated', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/Group' } } } } } } } },
      delete: { tags: ['Group'], summary: 'Delete group', parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } } ], responses: { 200: { description: 'Deleted', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' } } } } } } } },
    },
    '/basic-setting/shifts': {
      get: { tags: ['Shift'], summary: 'List shifts', parameters: [ { in: 'query', name: 'school_id', schema: { type: 'integer', minimum: 1 } }, { in: 'query', name: 'status', schema: { type: 'string', enum: ['active','inactive'] } }, { in: 'query', name: 'searchTerm', schema: { type: 'string' } }, { in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 } }, { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1 } }, { in: 'query', name: 'sortBy', schema: { type: 'string' } }, { in: 'query', name: 'sortOrder', schema: { type: 'string', enum: ['asc','desc'] } } ], responses: { 200: { description: 'Shifts retrieved successfully', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, meta: { $ref: '#/components/schemas/PaginationMeta' }, data: { type: 'array', items: { $ref: '#/components/schemas/Shift' } } } } } } } } },
      post: { tags: ['Shift'], summary: 'Create shift', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateShiftRequest' } } } }, responses: { 201: { description: 'Shift created successfully', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/Shift' } } } } } } } },
    },
    '/basic-setting/shifts/{id}': {
      get: { tags: ['Shift'], summary: 'Get shift', parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } } ], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/Shift' } } } } } } } },
      patch: { tags: ['Shift'], summary: 'Update shift', parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } } ], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateShiftRequest' } } } }, responses: { 200: { description: 'Updated', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/Shift' } } } } } } } },
      delete: { tags: ['Shift'], summary: 'Delete shift', parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } } ], responses: { 200: { description: 'Deleted', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' } } } } } } } },
    },
    '/basic-setting/subjects': {
      get: { tags: ['Subject'], summary: 'List subjects', parameters: [ { in: 'query', name: 'school_id', schema: { type: 'integer', minimum: 1 } }, { in: 'query', name: 'status', schema: { type: 'string', enum: ['active','inactive'] } }, { in: 'query', name: 'searchTerm', schema: { type: 'string' } }, { in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 } }, { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1 } }, { in: 'query', name: 'sortBy', schema: { type: 'string' } }, { in: 'query', name: 'sortOrder', schema: { type: 'string', enum: ['asc','desc'] } } ], responses: { 200: { description: 'Subjects retrieved successfully', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, meta: { $ref: '#/components/schemas/PaginationMeta' }, data: { type: 'array', items: { $ref: '#/components/schemas/Subject' } } } } } } } } },
      post: { tags: ['Subject'], summary: 'Create subject', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateSubjectRequest' } } } }, responses: { 201: { description: 'Subject created successfully', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/Subject' } } } } } } } },
    },
    '/basic-setting/subjects/{id}': {
      get: { tags: ['Subject'], summary: 'Get subject', parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } } ], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/Subject' } } } } } } } },
      patch: { tags: ['Subject'], summary: 'Update subject', parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } } ], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateSubjectRequest' } } } }, responses: { 200: { description: 'Updated', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/Subject' } } } } } } } },
      delete: { tags: ['Subject'], summary: 'Delete subject', parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } } ], responses: { 200: { description: 'Deleted', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' } } } } } } } },
    },
    '/basic-setting/categories': {
      get: { tags: ['Category'], summary: 'List categories', parameters: [ { in: 'query', name: 'school_id', schema: { type: 'integer', minimum: 1 } }, { in: 'query', name: 'status', schema: { type: 'string', enum: ['active','inactive'] } }, { in: 'query', name: 'searchTerm', schema: { type: 'string' } }, { in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 } }, { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1 } }, { in: 'query', name: 'sortBy', schema: { type: 'string' } }, { in: 'query', name: 'sortOrder', schema: { type: 'string', enum: ['asc','desc'] } } ], responses: { 200: { description: 'Categories retrieved successfully', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, meta: { $ref: '#/components/schemas/PaginationMeta' }, data: { type: 'array', items: { $ref: '#/components/schemas/Category' } } } } } } } } },
      post: { tags: ['Category'], summary: 'Create category', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCategoryRequest' } } } }, responses: { 201: { description: 'Category created successfully', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/Category' } } } } } } } },
    },
    '/basic-setting/categories/{id}': {
      get: { tags: ['Category'], summary: 'Get category', parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } } ], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/Category' } } } } } } } },
      patch: { tags: ['Category'], summary: 'Update category', parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } } ], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateCategoryRequest' } } } }, responses: { 200: { description: 'Updated', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/Category' } } } } } } } },
      delete: { tags: ['Category'], summary: 'Delete category', parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } } ], responses: { 200: { description: 'Deleted', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' } } } } } } } },
    },
    '/basic-setting/class-exams': {
      get: { tags: ['ClassExam'], summary: 'List class exams', parameters: [ { in: 'query', name: 'school_id', schema: { type: 'integer', minimum: 1 } }, { in: 'query', name: 'status', schema: { type: 'string', enum: ['active','inactive'] } }, { in: 'query', name: 'searchTerm', schema: { type: 'string' } }, { in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 } }, { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1 } }, { in: 'query', name: 'sortBy', schema: { type: 'string' } }, { in: 'query', name: 'sortOrder', schema: { type: 'string', enum: ['asc','desc'] } } ], responses: { 200: { description: 'Class exams retrieved successfully', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, meta: { $ref: '#/components/schemas/PaginationMeta' }, data: { type: 'array', items: { $ref: '#/components/schemas/ClassExam' } } } } } } } } },
      post: { tags: ['ClassExam'], summary: 'Create class exam', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateClassExamRequest' } } } }, responses: { 201: { description: 'Class exam created successfully', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/ClassExam' } } } } } } } },
    },
    '/basic-setting/class-exams/{id}': {
      get: { tags: ['ClassExam'], summary: 'Get class exam', parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } } ], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/ClassExam' } } } } } } } },
      patch: { tags: ['ClassExam'], summary: 'Update class exam', parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } } ], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateClassExamRequest' } } } }, responses: { 200: { description: 'Updated', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/ClassExam' } } } } } } } },
      delete: { tags: ['ClassExam'], summary: 'Delete class exam', parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } } ], responses: { 200: { description: 'Deleted', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' } } } } } } } },
    },
      '/basic-setting/class-groups': {
        get: {
          tags: ['ClassGroup'],
          summary: 'Get class-wise group assignment',
          parameters: [
            { in: 'query', name: 'school_id', required: true, schema: { type: 'integer', minimum: 1 } },
            { in: 'query', name: 'class_id', required: true, schema: { type: 'integer', minimum: 1 } },
          ],
          responses: {
            200: {
              description: 'Assignment fetched',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      data: { oneOf: [ { $ref: '#/components/schemas/ClassGroupAssign' }, { type: 'null' } ] },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['ClassGroup'],
          summary: 'Create or update class-wise group assignment',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UpsertClassGroupRequest' } } },
          },
          responses: {
            200: {
              description: 'Assignment saved',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/ClassGroupAssign' },
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


