import pool from '../utils/dbClient';

export const name = '1758310005001_create_students_table';

export const run = async () => {
  // Write your SQL query here
  await pool.query(`
CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,

    -- Student Information
    student_name_en VARCHAR(150) NOT NULL,
    student_name_bn VARCHAR(150),
    student_id VARCHAR(100),
    mobile VARCHAR(20),
    group_id INTEGER NOT NULL REFERENCES group(id) ON DELETE RESTRICT,
    section_id INTEGER REFERENCES section(id) ON DELETE RESTRICT,
    class_id INTEGER NOT NULL REFERENCES class(id) ON DELETE RESTRICT,
    shift_id INTEGER NOT NULL REFERENCES shift(id) ON DELETE RESTRICT,
    date_of_birth_en DATE,
    date_of_birth_bn VARCHAR(50), -- Bangla date can be stored as string
    roll INT,
    category_id INTEGER REFERENCES category(id) ON DELETE RESTRICT,
    blood_group VARCHAR(10) CHECK (blood_group IN ('A', 'A+', 'A-', 'B', 'B+', 'B-', 'O', 'O+', 'O-', 'AB', 'AB+', 'AB-')),
    gender VARCHAR(20),
    national_id VARCHAR(100),
    nationality VARCHAR(100) DEFAULT 'Bangladeshi',
    religion VARCHAR(50),
    session_id INTEGER REFERENCES academic_session(id) ON DELETE RESTRICT,
    academic_year_id INTEGER NOT NULL REFERENCES academic_year(id) ON DELETE RESTRICT,
    admission_date DATE,
    student_photo TEXT,

    -- Parent Details (English & Bangla)
    father_name_en VARCHAR(150),
    father_name_bn VARCHAR(150),
    father_nid VARCHAR(100),
    father_mobile VARCHAR(20),
    father_dob_en DATE,
    father_dob_bn VARCHAR(50),
    father_occupation_en VARCHAR(100),
    father_occupation_bn VARCHAR(100),
    father_income NUMERIC,

    mother_name_en VARCHAR(150),
    mother_name_bn VARCHAR(150),
    mother_nid VARCHAR(100),
    mother_mobile VARCHAR(20),
    mother_dob_en DATE,
    mother_dob_bn VARCHAR(50),
    mother_occupation_en VARCHAR(100),
    mother_occupation_bn VARCHAR(100),
    mother_income NUMERIC,

    -- Current Address (English & Bangla)
    current_village_en VARCHAR(150),
    current_village_bn VARCHAR(150),
    current_post_office_en VARCHAR(150),
    current_post_office_bn VARCHAR(150),
    current_post_code VARCHAR(20),
    current_district INT REFERENCES district(id) ON DELETE SET NULL,
    current_thana INT REFERENCES thana(id) ON DELETE SET NULL,

    -- Permanent Address (English & Bangla)
    permanent_village_en VARCHAR(150),
    permanent_village_bn VARCHAR(150),
    permanent_post_office_en VARCHAR(150),
    permanent_post_office_bn VARCHAR(150),
    permanent_post_code VARCHAR(20),
    permanent_district INT REFERENCES district(id) ON DELETE SET NULL,
    permanent_thana INT REFERENCES thana(id) ON DELETE SET NULL,

    -- Guardian Details (English & Bangla)
    guardian_name_en VARCHAR(150),
    guardian_name_bn VARCHAR(150),
    guardian_address_en TEXT,
    guardian_address_bn TEXT,

    -- Education Details
    last_institution VARCHAR(200),
    last_class VARCHAR(50),
    registration_number VARCHAR(100),
    result VARCHAR(50),
    year_passed VARCHAR(10),

    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    password VARCHAR(255) DEFAULT '123456',
    school_id INTEGER NOT NULL REFERENCES school(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_student UNIQUE (student_id, school_id)
);
  `);
};
