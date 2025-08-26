-- Competence Assessment Tool (CAT) Database Schema
-- PostgreSQL Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS project_allocations CASCADE;
DROP TABLE IF EXISTS project_skill_requirements CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS assessment_responses CASCADE;
DROP TABLE IF EXISTS assessment_questions CASCADE;
DROP TABLE IF EXISTS employee_assessments CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS training_progress CASCADE;
DROP TABLE IF EXISTS training_programs CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS job_role_skills CASCADE;
DROP TABLE IF EXISTS job_roles CASCADE;
DROP TABLE IF EXISTS employee_competencies CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS skill_categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create skill categories table
CREATE TABLE skill_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create skills table
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category_id INTEGER NOT NULL REFERENCES skill_categories(id),
    weightage DECIMAL(3,2) DEFAULT 1.0 CHECK (weightage >= 0 AND weightage <= 1),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, category_id)
);

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_type VARCHAR(20) NOT NULL CHECK (role_type IN ('employee', 'manager', 'hr', 'admin', 'leader')),
    job_role VARCHAR(100),
    department VARCHAR(100),
    manager_id INTEGER REFERENCES users(id),
    hire_date DATE,
    phone VARCHAR(20),
    location VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create job roles table
CREATE TABLE job_roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    department VARCHAR(100),
    level VARCHAR(20) CHECK (level IN ('Junior', 'Mid', 'Senior', 'Lead', 'Manager')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create job role skills mapping table
CREATE TABLE job_role_skills (
    id SERIAL PRIMARY KEY,
    job_role_id INTEGER NOT NULL REFERENCES job_roles(id),
    skill_id INTEGER NOT NULL REFERENCES skills(id),
    required_level VARCHAR(20) NOT NULL CHECK (required_level IN ('Beginner', 'Intermediate', 'Expert')),
    is_mandatory BOOLEAN DEFAULT true,
    weightage DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_role_id, skill_id)
);

-- Create employee competencies table
CREATE TABLE employee_competencies (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES users(id),
    skill_id INTEGER NOT NULL REFERENCES skills(id),
    current_level VARCHAR(20) CHECK (current_level IN ('Beginner', 'Intermediate', 'Expert')),
    score INTEGER CHECK (score >= 0 AND score <= 100),
    assessment_based BOOLEAN DEFAULT false,
    self_assessed BOOLEAN DEFAULT false,
    manager_validated BOOLEAN DEFAULT false,
    validated_by INTEGER REFERENCES users(id),
    last_assessed DATE,
    next_assessment_due DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, skill_id)
);

-- Create certifications table
CREATE TABLE certifications (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES users(id),
    skill_id INTEGER REFERENCES skills(id),
    certificate_name VARCHAR(255) NOT NULL,
    issuing_authority VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    certificate_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    verified_by INTEGER REFERENCES users(id),
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create assessments table
CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assessment_type VARCHAR(20) NOT NULL CHECK (assessment_type IN ('MCQ', 'coding', 'case_study', 'simulation', 'self_assessment')),
    skill_id INTEGER NOT NULL REFERENCES skills(id),
    duration_minutes INTEGER DEFAULT 60,
    total_marks INTEGER DEFAULT 100,
    passing_marks INTEGER DEFAULT 60,
    is_proctored BOOLEAN DEFAULT false,
    is_timed BOOLEAN DEFAULT true,
    randomize_questions BOOLEAN DEFAULT true,
    max_attempts INTEGER DEFAULT 3,
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create assessment questions table
CREATE TABLE assessment_questions (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('MCQ', 'coding', 'essay', 'true_false')),
    options JSONB, -- For MCQ options
    correct_answer TEXT,
    marks INTEGER NOT NULL DEFAULT 1,
    difficulty_level VARCHAR(10) DEFAULT 'Medium' CHECK (difficulty_level IN ('Easy', 'Medium', 'Hard')),
    explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create employee assessments table
CREATE TABLE employee_assessments (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES users(id),
    assessment_id INTEGER NOT NULL REFERENCES assessments(id),
    assigned_by INTEGER NOT NULL REFERENCES users(id),
    scheduled_date TIMESTAMP NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(20) DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'expired', 'cancelled')),
    score INTEGER,
    percentage DECIMAL(5,2),
    passed BOOLEAN,
    attempt_number INTEGER DEFAULT 1,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create assessment responses table
CREATE TABLE assessment_responses (
    id SERIAL PRIMARY KEY,
    employee_assessment_id INTEGER NOT NULL REFERENCES employee_assessments(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES assessment_questions(id),
    response TEXT,
    is_correct BOOLEAN,
    marks_obtained INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- in seconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create training programs table
CREATE TABLE training_programs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    provider VARCHAR(255),
    duration_hours INTEGER,
    delivery_mode VARCHAR(20) CHECK (delivery_mode IN ('online', 'classroom', 'hybrid', 'self_paced')),
    cost DECIMAL(10,2),
    max_participants INTEGER,
    skill_id INTEGER REFERENCES skills(id),
    prerequisites TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create training progress table
CREATE TABLE training_progress (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES users(id),
    training_program_id INTEGER NOT NULL REFERENCES training_programs(id),
    enrolled_date DATE NOT NULL,
    start_date DATE,
    completion_date DATE,
    status VARCHAR(20) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped', 'cancelled')),
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    score INTEGER,
    certification_earned BOOLEAN DEFAULT false,
    assigned_by INTEGER REFERENCES users(id),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, training_program_id)
);

-- Create projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    project_manager_id INTEGER NOT NULL REFERENCES users(id),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    budget DECIMAL(12,2),
    client_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create project skill requirements table
CREATE TABLE project_skill_requirements (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id),
    required_level VARCHAR(20) NOT NULL CHECK (required_level IN ('Beginner', 'Intermediate', 'Expert')),
    required_count INTEGER NOT NULL DEFAULT 1,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, skill_id)
);

-- Create project allocations table
CREATE TABLE project_allocations (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id),
    employee_id INTEGER NOT NULL REFERENCES users(id),
    skill_id INTEGER NOT NULL REFERENCES skills(id),
    allocation_percentage DECIMAL(5,2) NOT NULL CHECK (allocation_percentage > 0 AND allocation_percentage <= 100),
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    allocated_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_type ON users(role_type);
CREATE INDEX idx_users_manager_id ON users(manager_id);
CREATE INDEX idx_skills_category_id ON skills(category_id);
CREATE INDEX idx_employee_competencies_employee_id ON employee_competencies(employee_id);
CREATE INDEX idx_employee_competencies_skill_id ON employee_competencies(skill_id);
CREATE INDEX idx_assessments_skill_id ON assessments(skill_id);
CREATE INDEX idx_employee_assessments_employee_id ON employee_assessments(employee_id);
CREATE INDEX idx_employee_assessments_status ON employee_assessments(status);
CREATE INDEX idx_training_progress_employee_id ON training_progress(employee_id);
CREATE INDEX idx_project_allocations_project_id ON project_allocations(project_id);
CREATE INDEX idx_project_allocations_employee_id ON project_allocations(employee_id);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_skill_categories_updated_at BEFORE UPDATE ON skill_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_roles_updated_at BEFORE UPDATE ON job_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employee_competencies_updated_at BEFORE UPDATE ON employee_competencies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employee_assessments_updated_at BEFORE UPDATE ON employee_assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_training_programs_updated_at BEFORE UPDATE ON training_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_training_progress_updated_at BEFORE UPDATE ON training_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_allocations_updated_at BEFORE UPDATE ON project_allocations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO skill_categories (name, description) VALUES
('Technical', 'Programming languages, frameworks, and technical tools'),
('Domain', 'Business domain knowledge and industry-specific skills'),
('Behavioral', 'Soft skills, leadership, and interpersonal abilities'),
('Process', 'Methodologies, processes, and quality practices');

INSERT INTO skills (name, description, category_id, weightage) VALUES
-- Technical Skills
('JavaScript', 'Modern JavaScript programming including ES6+', 1, 1.0),
('React', 'React framework for building user interfaces', 1, 0.9),
('Node.js', 'Server-side JavaScript runtime', 1, 0.9),
('Python', 'Python programming language', 1, 1.0),
('Java', 'Java programming language', 1, 1.0),
('SQL', 'Structured Query Language for databases', 1, 0.8),
('AWS', 'Amazon Web Services cloud platform', 1, 0.9),
('Docker', 'Containerization technology', 1, 0.7),
('Kubernetes', 'Container orchestration platform', 1, 0.8),
('Git', 'Version control system', 1, 0.6),

-- Domain Skills
('Healthcare Domain', 'Knowledge of healthcare industry and regulations', 2, 0.8),
('Financial Services', 'Banking and financial services domain knowledge', 2, 0.8),
('E-commerce', 'Online retail and e-commerce business understanding', 2, 0.7),
('Data Analytics', 'Business intelligence and data analysis', 2, 0.9),

-- Behavioral Skills
('Leadership', 'Team leadership and people management', 3, 0.9),
('Communication', 'Effective verbal and written communication', 3, 0.8),
('Problem Solving', 'Analytical thinking and solution development', 3, 0.8),
('Team Collaboration', 'Working effectively in team environments', 3, 0.7),
('Client Management', 'Managing client relationships and expectations', 3, 0.8),

-- Process Skills
('Agile Methodology', 'Scrum, Kanban, and agile practices', 4, 0.8),
('DevOps', 'CI/CD, automation, and DevOps practices', 4, 0.9),
('Code Review', 'Code quality assessment and peer review', 4, 0.6),
('Testing', 'Unit testing, integration testing, QA practices', 4, 0.7);

INSERT INTO job_roles (title, description, department, level) VALUES
('Junior Software Developer', 'Entry-level developer role', 'Engineering', 'Junior'),
('Software Developer', 'Mid-level developer role', 'Engineering', 'Mid'),
('Senior Software Developer', 'Senior developer role with mentoring responsibilities', 'Engineering', 'Senior'),
('Tech Lead', 'Technical leadership role', 'Engineering', 'Lead'),
('Project Manager', 'Project management role', 'PMO', 'Manager'),
('DevOps Engineer', 'Infrastructure and deployment specialist', 'Engineering', 'Mid'),
('Data Analyst', 'Business intelligence and analytics specialist', 'Analytics', 'Mid'),
('HR Generalist', 'Human resources generalist role', 'HR', 'Mid'),
('Team Manager', 'People management role', 'Management', 'Manager');

-- Map skills to job roles
INSERT INTO job_role_skills (job_role_id, skill_id, required_level, is_mandatory, weightage) VALUES
-- Junior Software Developer
(1, 1, 'Beginner', true, 1.0),    -- JavaScript
(1, 6, 'Beginner', true, 0.8),    -- SQL
(1, 10, 'Beginner', true, 0.6),   -- Git
(1, 17, 'Beginner', false, 0.7),  -- Problem Solving
(1, 22, 'Beginner', false, 0.6),  -- Testing

-- Software Developer
(2, 1, 'Intermediate', true, 1.0), -- JavaScript
(2, 2, 'Intermediate', true, 0.9), -- React
(2, 3, 'Beginner', false, 0.8),   -- Node.js
(2, 6, 'Intermediate', true, 0.8), -- SQL
(2, 10, 'Intermediate', true, 0.6),-- Git
(2, 20, 'Intermediate', true, 0.8),-- Agile Methodology
(2, 22, 'Intermediate', true, 0.7),-- Testing

-- Senior Software Developer
(3, 1, 'Expert', true, 1.0),       -- JavaScript
(3, 2, 'Expert', true, 0.9),       -- React
(3, 3, 'Intermediate', true, 0.8), -- Node.js
(3, 15, 'Beginner', false, 0.8),   -- Leadership
(3, 16, 'Intermediate', true, 0.8),-- Communication
(3, 21, 'Intermediate', false, 0.8),-- Code Review

-- Add demo users
INSERT INTO users (employee_id, email, first_name, last_name, role_type, job_role, department) VALUES
('EMP001', 'admin@nexusai.com', 'System', 'Admin', 'admin', 'System Administrator', 'IT'),
('EMP002', 'hr@nexusai.com', 'Sarah', 'Johnson', 'hr', 'HR Generalist', 'HR'),
('EMP003', 'manager@nexusai.com', 'Mike', 'Wilson', 'manager', 'Team Manager', 'Engineering'),
('EMP004', 'john.doe@nexusai.com', 'John', 'Doe', 'employee', 'Software Developer', 'Engineering'),
('EMP005', 'jane.smith@nexusai.com', 'Jane', 'Smith', 'employee', 'Senior Software Developer', 'Engineering'),
('EMP006', 'leader@nexusai.com', 'David', 'Brown', 'leader', 'Engineering Director', 'Engineering');

-- Set manager relationships
UPDATE users SET manager_id = 3 WHERE id IN (4, 5); -- Mike Wilson manages John and Jane
UPDATE users SET manager_id = 6 WHERE id = 3;       -- David Brown manages Mike Wilson

-- Add some sample competencies
INSERT INTO employee_competencies (employee_id, skill_id, current_level, score, self_assessed, last_assessed, next_assessment_due) VALUES
(4, 1, 'Intermediate', 75, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '6 months'), -- John - JavaScript
(4, 2, 'Beginner', 60, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '6 months'),     -- John - React
(4, 6, 'Intermediate', 70, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '6 months'), -- John - SQL
(5, 1, 'Expert', 90, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '6 months'),       -- Jane - JavaScript
(5, 2, 'Expert', 88, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '6 months'),       -- Jane - React
(5, 3, 'Intermediate', 78, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '6 months'); -- Jane - Node.js

-- Add sample training programs
INSERT INTO training_programs (title, description, provider, duration_hours, delivery_mode, cost, skill_id, created_by) VALUES
('Advanced React Development', 'Deep dive into React hooks, context, and performance optimization', 'TechEd Solutions', 40, 'online', 599.00, 2, 2),
('AWS Cloud Fundamentals', 'Introduction to AWS services and cloud architecture', 'AWS Training', 24, 'online', 399.00, 7, 2),
('Leadership Essentials', 'Core leadership skills for technical professionals', 'Leadership Institute', 16, 'classroom', 799.00, 15, 2);

-- Add sample project
INSERT INTO projects (name, description, project_manager_id, start_date, end_date, status) VALUES
('Customer Portal Redesign', 'Complete redesign of customer-facing web portal using React', 3, CURRENT_DATE, CURRENT_DATE + INTERVAL '6 months', 'active');

-- Add project skill requirements
INSERT INTO project_skill_requirements (project_id, skill_id, required_level, required_count, priority) VALUES
(1, 1, 'Intermediate', 2, 'high'),  -- JavaScript
(1, 2, 'Expert', 1, 'high'),        -- React
(1, 6, 'Intermediate', 1, 'medium'), -- SQL
(1, 16, 'Intermediate', 2, 'medium'); -- Communication

-- Add project allocations
INSERT INTO project_allocations (project_id, employee_id, skill_id, allocation_percentage, start_date, allocated_by) VALUES
(1, 4, 1, 80, CURRENT_DATE, 3), -- John allocated for JavaScript
(1, 5, 2, 100, CURRENT_DATE, 3); -- Jane allocated for React

COMMIT;