import { z } from 'zod';

const bloodGroupEnum = z.enum(['A', 'A+', 'A-', 'B', 'B+', 'B-', 'O', 'O+', 'O-', 'AB', 'AB+', 'AB-']);

const createStudentZodSchema = z.object({
  body: z.object({
    student_name_en: z
      .string({ required_error: 'Student name (English) is required' })
      .min(1, 'Student name (English) must not be empty')
      .max(150, 'Student name (English) must not exceed 150 characters'),
    student_name_bn: z
      .string()
      .max(150, 'Student name (Bangla) must not exceed 150 characters')
      .optional()
      .nullable(),
    student_id: z
      .string()
      .max(100, 'Student ID must not exceed 100 characters')
      .optional()
      .nullable(),
    mobile: z
      .string()
      .max(20, 'Mobile number must not exceed 20 characters')
      .optional()
      .nullable(),
    group_id: z
      .number({ required_error: 'Group ID is required' })
      .int('Group ID must be an integer')
      .positive('Group ID must be positive'),
    section_id: z
      .number()
      .int('Section ID must be an integer')
      .positive('Section ID must be positive')
      .optional()
      .nullable(),
    class_id: z
      .number({ required_error: 'Class ID is required' })
      .int('Class ID must be an integer')
      .positive('Class ID must be positive'),
    shift_id: z
      .number({ required_error: 'Shift ID is required' })
      .int('Shift ID must be an integer')
      .positive('Shift ID must be positive'),
    date_of_birth_en: z
      .string()
      .optional()
      .nullable(),
    date_of_birth_bn: z
      .string()
      .optional()
      .nullable(),
    roll: z
      .number()
      .int('Roll number must be an integer')
      .positive('Roll number must be positive')
      .optional()
      .nullable(),
    category_id: z
      .number()
      .int('Category ID must be an integer')
      .positive('Category ID must be positive')
      .optional()
      .nullable(),
    blood_group: bloodGroupEnum
      .optional()
      .nullable(),
    gender: z
      .string()
      .max(20, 'Gender must not exceed 20 characters')
      .optional()
      .nullable(),
    national_id: z
      .string()
      .max(100, 'National ID must not exceed 100 characters')
      .optional()
      .nullable(),
    nationality: z
      .string()
      .max(100, 'Nationality must not exceed 100 characters')
      .optional()
      .nullable(),
    religion: z
      .string()
      .max(50, 'Religion must not exceed 50 characters')
      .optional()
      .nullable(),
    session_id: z
      .number()
      .int('Session ID must be an integer')
      .positive('Session ID must be positive')
      .optional()
      .nullable(),
    academic_year_id: z
      .number({ required_error: 'Academic year ID is required' })
      .int('Academic year ID must be an integer')
      .positive('Academic year ID must be positive'),
    admission_date: z
      .string()
      .optional()
      .nullable(),
    student_photo: z
      .string()
      .optional()
      .nullable(),
    father_name_en: z
      .string()
      .max(150, 'Father name (English) must not exceed 150 characters')
      .optional()
      .nullable(),
    father_name_bn: z
      .string()
      .max(150, 'Father name (Bangla) must not exceed 150 characters')
      .optional()
      .nullable(),
    father_nid: z
      .string()
      .max(100, 'Father NID must not exceed 100 characters')
      .optional()
      .nullable(),
    father_mobile: z
      .string()
      .max(20, 'Father mobile must not exceed 20 characters')
      .optional()
      .nullable(),
    father_dob_en: z
      .string()
      .optional()
      .nullable(),
    father_dob_bn: z
      .string()
      .optional()
      .nullable(),
    father_occupation_en: z
      .string()
      .max(100, 'Father occupation (English) must not exceed 100 characters')
      .optional()
      .nullable(),
    father_occupation_bn: z
      .string()
      .max(100, 'Father occupation (Bangla) must not exceed 100 characters')
      .optional()
      .nullable(),
    father_income: z
      .number()
      .positive('Father income must be positive')
      .optional()
      .nullable(),
    mother_name_en: z
      .string()
      .max(150, 'Mother name (English) must not exceed 150 characters')
      .optional()
      .nullable(),
    mother_name_bn: z
      .string()
      .max(150, 'Mother name (Bangla) must not exceed 150 characters')
      .optional()
      .nullable(),
    mother_nid: z
      .string()
      .max(100, 'Mother NID must not exceed 100 characters')
      .optional()
      .nullable(),
    mother_mobile: z
      .string()
      .max(20, 'Mother mobile must not exceed 20 characters')
      .optional()
      .nullable(),
    mother_dob_en: z
      .string()
      .optional()
      .nullable(),
    mother_dob_bn: z
      .string()
      .optional()
      .nullable(),
    mother_occupation_en: z
      .string()
      .max(100, 'Mother occupation (English) must not exceed 100 characters')
      .optional()
      .nullable(),
    mother_occupation_bn: z
      .string()
      .max(100, 'Mother occupation (Bangla) must not exceed 100 characters')
      .optional()
      .nullable(),
    mother_income: z
      .number()
      .positive('Mother income must be positive')
      .optional()
      .nullable(),
    current_village_en: z
      .string()
      .max(150, 'Current village (English) must not exceed 150 characters')
      .optional()
      .nullable(),
    current_village_bn: z
      .string()
      .max(150, 'Current village (Bangla) must not exceed 150 characters')
      .optional()
      .nullable(),
    current_post_office_en: z
      .string()
      .max(150, 'Current post office (English) must not exceed 150 characters')
      .optional()
      .nullable(),
    current_post_office_bn: z
      .string()
      .max(150, 'Current post office (Bangla) must not exceed 150 characters')
      .optional()
      .nullable(),
    current_post_code: z
      .string()
      .max(20, 'Current post code must not exceed 20 characters')
      .optional()
      .nullable(),
    current_district: z
      .number()
      .int('Current district must be an integer')
      .positive('Current district must be positive')
      .optional()
      .nullable(),
    current_thana: z
      .number()
      .int('Current thana must be an integer')
      .positive('Current thana must be positive')
      .optional()
      .nullable(),
    permanent_village_en: z
      .string()
      .max(150, 'Permanent village (English) must not exceed 150 characters')
      .optional()
      .nullable(),
    permanent_village_bn: z
      .string()
      .max(150, 'Permanent village (Bangla) must not exceed 150 characters')
      .optional()
      .nullable(),
    permanent_post_office_en: z
      .string()
      .max(150, 'Permanent post office (English) must not exceed 150 characters')
      .optional()
      .nullable(),
    permanent_post_office_bn: z
      .string()
      .max(150, 'Permanent post office (Bangla) must not exceed 150 characters')
      .optional()
      .nullable(),
    permanent_post_code: z
      .string()
      .max(20, 'Permanent post code must not exceed 20 characters')
      .optional()
      .nullable(),
    permanent_district: z
      .number()
      .int('Permanent district must be an integer')
      .positive('Permanent district must be positive')
      .optional()
      .nullable(),
    permanent_thana: z
      .number()
      .int('Permanent thana must be an integer')
      .positive('Permanent thana must be positive')
      .optional()
      .nullable(),
    guardian_name_en: z
      .string()
      .max(150, 'Guardian name (English) must not exceed 150 characters')
      .optional()
      .nullable(),
    guardian_name_bn: z
      .string()
      .max(150, 'Guardian name (Bangla) must not exceed 150 characters')
      .optional()
      .nullable(),
    guardian_address_en: z
      .string()
      .optional()
      .nullable(),
    guardian_address_bn: z
      .string()
      .optional()
      .nullable(),
    last_institution: z
      .string()
      .max(200, 'Last institution must not exceed 200 characters')
      .optional()
      .nullable(),
    last_class: z
      .string()
      .max(50, 'Last class must not exceed 50 characters')
      .optional()
      .nullable(),
    registration_number: z
      .string()
      .max(100, 'Registration number must not exceed 100 characters')
      .optional()
      .nullable(),
    result: z
      .string()
      .max(50, 'Result must not exceed 50 characters')
      .optional()
      .nullable(),
    year_passed: z
      .string()
      .max(10, 'Year passed must not exceed 10 characters')
      .optional()
      .nullable(),
    status: z
      .enum(['active', 'inactive'], {
        required_error: 'Status is required',
      })
      .optional(),
    password: z
      .string()
      .max(255, 'Password must not exceed 255 characters')
      .optional()
      .nullable(),
    school_id: z
      .number({ required_error: 'School ID is required' })
      .int('School ID must be an integer')
      .positive('School ID must be positive'),
  }),
});

const updateStudentZodSchema = z.object({
  body: z.object({
    student_name: z
      .string()
      .min(1, 'Student name must not be empty')
      .max(150, 'Student name must not exceed 150 characters')
      .optional(),
    student_id: z
      .string()
      .max(100, 'Student ID must not exceed 100 characters')
      .optional()
      .nullable(),
    mobile: z
      .string()
      .max(20, 'Mobile number must not exceed 20 characters')
      .optional()
      .nullable(),
    group_id: z
      .number()
      .int('Group ID must be an integer')
      .positive('Group ID must be positive')
      .optional(),
    section_id: z
      .number()
      .int('Section ID must be an integer')
      .positive('Section ID must be positive')
      .nullable()
      .optional(),
    class_id: z
      .number()
      .int('Class ID must be an integer')
      .positive('Class ID must be positive')
      .optional(),
    date_of_birth: z
      .string()
      .optional()
      .nullable(),
    roll: z
      .number()
      .int('Roll number must be an integer')
      .positive('Roll number must be positive')
      .nullable()
      .optional(),
    category_id: z
      .number()
      .int('Category ID must be an integer')
      .positive('Category ID must be positive')
      .nullable()
      .optional(),
    blood_group: bloodGroupEnum
      .nullable()
      .optional(),
    gender: z
      .string()
      .max(20, 'Gender must not exceed 20 characters')
      .nullable()
      .optional(),
    national_id: z
      .string()
      .max(100, 'National ID must not exceed 100 characters')
      .nullable()
      .optional(),
    nationality: z
      .string()
      .max(100, 'Nationality must not exceed 100 characters')
      .nullable()
      .optional(),
    religion: z
      .string()
      .max(50, 'Religion must not exceed 50 characters')
      .nullable()
      .optional(),
    session_id: z
      .number()
      .int('Session ID must be an integer')
      .positive('Session ID must be positive')
      .nullable()
      .optional(),
    academic_year_id: z
      .number()
      .int('Academic year ID must be an integer')
      .positive('Academic year ID must be positive')
      .optional(),
    admission_date: z
      .string()
      .nullable()
      .optional(),
    student_photo: z
      .string()
      .nullable()
      .optional(),
    father_name: z
      .string()
      .max(150, 'Father name must not exceed 150 characters')
      .nullable()
      .optional(),
    father_nid: z
      .string()
      .max(100, 'Father NID must not exceed 100 characters')
      .nullable()
      .optional(),
    father_mobile: z
      .string()
      .max(20, 'Father mobile must not exceed 20 characters')
      .nullable()
      .optional(),
    father_dob: z
      .string()
      .nullable()
      .optional(),
    father_occupation: z
      .string()
      .max(100, 'Father occupation must not exceed 100 characters')
      .nullable()
      .optional(),
    father_income: z
      .number()
      .positive('Father income must be positive')
      .nullable()
      .optional(),
    mother_name: z
      .string()
      .max(150, 'Mother name must not exceed 150 characters')
      .nullable()
      .optional(),
    mother_nid: z
      .string()
      .max(100, 'Mother NID must not exceed 100 characters')
      .nullable()
      .optional(),
    mother_mobile: z
      .string()
      .max(20, 'Mother mobile must not exceed 20 characters')
      .nullable()
      .optional(),
    mother_dob: z
      .string()
      .nullable()
      .optional(),
    mother_occupation: z
      .string()
      .max(100, 'Mother occupation must not exceed 100 characters')
      .nullable()
      .optional(),
    mother_income: z
      .number()
      .positive('Mother income must be positive')
      .nullable()
      .optional(),
    current_village: z
      .string()
      .max(150, 'Current village must not exceed 150 characters')
      .nullable()
      .optional(),
    current_post_office: z
      .string()
      .max(150, 'Current post office must not exceed 150 characters')
      .nullable()
      .optional(),
    current_post_code: z
      .string()
      .max(20, 'Current post code must not exceed 20 characters')
      .nullable()
      .optional(),
    current_district: z
      .string()
      .max(100, 'Current district must not exceed 100 characters')
      .nullable()
      .optional(),
    current_thana: z
      .string()
      .max(100, 'Current thana must not exceed 100 characters')
      .nullable()
      .optional(),
    permanent_village: z
      .string()
      .max(150, 'Permanent village must not exceed 150 characters')
      .nullable()
      .optional(),
    permanent_post_office: z
      .string()
      .max(150, 'Permanent post office must not exceed 150 characters')
      .nullable()
      .optional(),
    permanent_post_code: z
      .string()
      .max(20, 'Permanent post code must not exceed 20 characters')
      .nullable()
      .optional(),
    permanent_district: z
      .string()
      .max(100, 'Permanent district must not exceed 100 characters')
      .nullable()
      .optional(),
    permanent_thana: z
      .string()
      .max(100, 'Permanent thana must not exceed 100 characters')
      .nullable()
      .optional(),
    guardian_name: z
      .string()
      .max(150, 'Guardian name must not exceed 150 characters')
      .nullable()
      .optional(),
    guardian_address: z
      .string()
      .nullable()
      .optional(),
    last_institution: z
      .string()
      .max(200, 'Last institution must not exceed 200 characters')
      .nullable()
      .optional(),
    last_class: z
      .string()
      .max(50, 'Last class must not exceed 50 characters')
      .nullable()
      .optional(),
    registration_number: z
      .string()
      .max(100, 'Registration number must not exceed 100 characters')
      .nullable()
      .optional(),
    result: z
      .string()
      .max(50, 'Result must not exceed 50 characters')
      .nullable()
      .optional(),
    year_passed: z
      .string()
      .max(10, 'Year passed must not exceed 10 characters')
      .nullable()
      .optional(),
    status: z
      .enum(['active', 'inactive'])
      .optional(),
    password: z
      .string()
      .max(255, 'Password must not exceed 255 characters')
      .nullable()
      .optional(),
  }),
});

const getSingleStudentZodSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Student ID is required' })
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Student ID must be a positive number',
      }),
  }),
});

const deleteStudentZodSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Student ID is required' })
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Student ID must be a positive number',
      }),
  }),
});

const getAllStudentsZodSchema = z.object({
  query: z.object({
    searchTerm: z.string().optional(),
    student_name: z.string().optional(),
    student_id: z.string().optional(),
    mobile: z.string().optional(),
    class_id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Class ID must be a positive number',
      })
      .transform(val => Number(val))
      .optional(),
    group_id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Group ID must be a positive number',
      })
      .transform(val => Number(val))
      .optional(),
    section_id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Section ID must be a positive number',
      })
      .transform(val => Number(val))
      .optional(),
    academic_year_id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Academic year ID must be a positive number',
      })
      .transform(val => Number(val))
      .optional(),
    session_id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Session ID must be a positive number',
      })
      .transform(val => Number(val))
      .optional(),
    status: z.enum(['active', 'inactive']).optional(),
    school_id: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'School ID must be a positive number',
      })
      .transform(val => Number(val))
      .optional(),
    page: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Page must be a positive number',
      })
      .transform(val => Number(val))
      .optional(),
    limit: z
      .string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Limit must be a positive number',
      })
      .transform(val => Number(val))
      .optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

const generateStudentIdZodSchema = z.object({
  query: z.object({
    school_id: z
      .string({ required_error: 'School ID is required' })
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'School ID must be a positive number',
      })
      .transform(val => Number(val)),
  }),
});

const getClassesWithAssignmentsZodSchema = z.object({
  query: z.object({
    school_id: z
      .string({ required_error: 'School ID is required' })
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'School ID must be a positive number',
      })
      .transform(val => Number(val)),
  }),
});



// const bulkUpdateStudentsZodSchema = z.object({
//   body: z.object({
//     updates: z.array(
//       z.object({
//         student_id: z.number().int().positive('Student ID must be a positive integer'),
//         data: z.object({
//           student_name_en: z.string().min(1).max(150).optional(),
//           student_name_bn: z.string().max(150).optional(),
//           student_id: z.string().max(100).optional(),
//           mobile: z.string().max(20).optional(),
//           group_id: z.number().int().positive().optional(),
//           section_id: z.number().int().positive().optional(),
//           class_id: z.number().int().positive().optional(),
//           shift_id: z.number().int().positive().optional(),
//           date_of_birth_en: z.string().optional(),
//           date_of_birth_bn: z.string().max(50).optional(),
//           roll: z.number().int().positive().optional(),
//           category_id: z.number().int().positive().optional(),
//           blood_group: z.enum(['A', 'A+', 'A-', 'B', 'B+', 'B-', 'O', 'O+', 'O-', 'AB', 'AB+', 'AB-']).optional(),
//           gender: z.string().max(20).optional(),
//           national_id: z.string().max(100).optional(),
//           nationality: z.string().max(100).optional(),
//           religion: z.string().max(50).optional(),
//           session_id: z.number().int().positive().optional(),
//           academic_year_id: z.number().int().positive().optional(),
//           admission_date: z.string().optional(),
//           student_photo: z.string().optional(),
//           father_name_en: z.string().max(150).optional(),
//           father_name_bn: z.string().max(150).optional(),
//           father_nid: z.string().max(100).optional(),
//           father_mobile: z.string().max(20).optional(),
//           father_dob_en: z.string().optional(),
//           father_dob_bn: z.string().max(50).optional(),
//           father_occupation_en: z.string().max(100).optional(),
//           father_occupation_bn: z.string().max(100).optional(),
//           father_income: z.number().positive().optional(),
//           mother_name_en: z.string().max(150).optional(),
//           mother_name_bn: z.string().max(150).optional(),
//           mother_nid: z.string().max(100).optional(),
//           mother_mobile: z.string().max(20).optional(),
//           mother_dob_en: z.string().optional(),
//           mother_dob_bn: z.string().max(50).optional(),
//           mother_occupation_en: z.string().max(100).optional(),
//           mother_occupation_bn: z.string().max(100).optional(),
//           mother_income: z.number().positive().optional(),
//           current_village_en: z.string().max(150).optional(),
//           current_village_bn: z.string().max(150).optional(),
//           current_post_office_en: z.string().max(150).optional(),
//           current_post_office_bn: z.string().max(150).optional(),
//           current_post_code: z.string().max(20).optional(),
//           current_district: z.number().int().positive().optional(),
//           current_thana: z.number().int().positive().optional(),
//           permanent_village_en: z.string().max(150).optional(),
//           permanent_village_bn: z.string().max(150).optional(),
//           permanent_post_office_en: z.string().max(150).optional(),
//           permanent_post_office_bn: z.string().max(150).optional(),
//           permanent_post_code: z.string().max(20).optional(),
//           permanent_district: z.number().int().positive().optional(),
//           permanent_thana: z.number().int().positive().optional(),
//           guardian_name_en: z.string().max(150).optional(),
//           guardian_name_bn: z.string().max(150).optional(),
//           guardian_address_en: z.string().optional(),
//           guardian_address_bn: z.string().optional(),
//           last_institution: z.string().max(200).optional(),
//           last_class: z.string().max(50).optional(),
//           registration_number: z.string().max(100).optional(),
//           result: z.string().max(50).optional(),
//           year_passed: z.string().max(10).optional(),
//           status: z.enum(['active', 'inactive']).optional(),
//           password: z.string().max(255).optional(),
//           school_id: z.number().int().positive().optional(),
//         }).refine((data) => Object.keys(data).length > 0, {
//           message: 'At least one field must be provided for update',
//         }),
//       })
//     ).min(1, 'At least one student update is required')
//   })
// });

const bulkCreateStudentsZodSchema = z.object({
  body: z.object({
    students: z.array(createStudentZodSchema.shape.body).min(1, 'At least one student is required').max(100, 'Maximum 100 students allowed per request'),
  }),
});

export const StudentValidation = {
  createStudentZodSchema,
  updateStudentZodSchema,
  getSingleStudentZodSchema,
  deleteStudentZodSchema,
  getAllStudentsZodSchema,
  generateStudentIdZodSchema,
  getClassesWithAssignmentsZodSchema,
  bulkCreateStudentsZodSchema,
  // bulkUpdateStudentsZodSchema,
};


