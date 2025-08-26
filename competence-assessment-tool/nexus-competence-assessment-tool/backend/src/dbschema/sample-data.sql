-- Enhanced Sample Data for Competence Assessment Tool
-- Run this after the main schema.sql to add more comprehensive sample data

-- Additional Skills
INSERT INTO skills (name, description, category_id, weightage) VALUES
-- More Technical Skills
('Angular', 'Angular framework for building web applications', 1, 0.9),
('Vue.js', 'Vue.js progressive framework', 1, 0.8),
('TypeScript', 'TypeScript programming language', 1, 0.9),
('MongoDB', 'NoSQL database management', 1, 0.8),
('Redis', 'In-memory data structure store', 1, 0.7),
('GraphQL', 'Query language for APIs', 1, 0.8),
('Microservices', 'Microservices architecture pattern', 1, 0.9),
('REST API', 'RESTful web services design', 1, 0.8),
('.NET Core', 'Microsoft .NET Core framework', 1, 0.9),
('Spring Boot', 'Java Spring Boot framework', 1, 0.9),

-- More Domain Skills
('Insurance Domain', 'Insurance industry knowledge and processes', 2, 0.8),
('Retail Domain', 'Retail and e-commerce business processes', 2, 0.7),
('Manufacturing', 'Manufacturing processes and systems', 2, 0.8),
('Telecommunications', 'Telecom industry knowledge', 2, 0.7),
('Government Systems', 'Public sector and government processes', 2, 0.8),
('Supply Chain', 'Supply chain management expertise', 2, 0.8),

-- More Behavioral Skills
('Conflict Resolution', 'Managing and resolving workplace conflicts', 3, 0.8),
('Mentoring', 'Coaching and developing team members', 3, 0.8),
('Negotiation', 'Negotiation and persuasion skills', 3, 0.7),
('Presentation Skills', 'Public speaking and presentation abilities', 3, 0.8),
('Time Management', 'Effective time and priority management', 3, 0.7),
('Adaptability', 'Flexibility and change management', 3, 0.7),

-- More Process Skills
('Waterfall Methodology', 'Traditional waterfall project management', 4, 0.6),
('Lean Six Sigma', 'Process improvement methodologies', 4, 0.8),
('ITIL', 'IT Infrastructure Library practices', 4, 0.7),
('Risk Management', 'Project and operational risk management', 4, 0.8),
('Quality Assurance', 'QA processes and standards', 4, 0.8),
('Documentation', 'Technical writing and documentation', 4, 0.6);

-- Additional Job Roles
INSERT INTO job_roles (title, description, department, level) VALUES
('Frontend Developer', 'Specialized in user interface development', 'Engineering', 'Mid'),
('Backend Developer', 'Specialized in server-side development', 'Engineering', 'Mid'),
('Full Stack Developer', 'Both frontend and backend development', 'Engineering', 'Mid'),
('DevOps Engineer Senior', 'Senior infrastructure and deployment specialist', 'Engineering', 'Senior'),
('QA Engineer', 'Quality assurance and testing specialist', 'Engineering', 'Mid'),
('Business Analyst', 'Requirements analysis and business processes', 'Business Analysis', 'Mid'),
('Product Manager', 'Product strategy and roadmap management', 'Product', 'Manager'),
('Scrum Master', 'Agile process facilitation', 'PMO', 'Mid'),
('Solutions Architect', 'Technical architecture and solution design', 'Architecture', 'Senior'),
('Data Scientist', 'Data analysis and machine learning', 'Analytics', 'Senior');

-- More comprehensive job role skills mapping
INSERT INTO job_role_skills (job_role_id, skill_id, required_level, is_mandatory, weightage) VALUES
-- Frontend Developer (role id will be 10 based on insert order)
(10, 1, 'Expert', true, 1.0),      -- JavaScript
(10, 2, 'Expert', true, 0.9),      -- React
(10, 11, 'Intermediate', false, 0.8), -- Angular
(10, 12, 'Intermediate', false, 0.7), -- Vue.js
(10, 13, 'Intermediate', true, 0.8),  -- TypeScript
(10, 16, 'Intermediate', true, 0.7),  -- Communication
(10, 20, 'Intermediate', true, 0.8),  -- Agile Methodology

-- Backend Developer (role id 11)
(11, 1, 'Expert', true, 1.0),      -- JavaScript
(11, 3, 'Expert', true, 0.9),      -- Node.js
(11, 4, 'Expert', false, 0.9),     -- Python
(11, 5, 'Expert', false, 0.9),     -- Java
(11, 6, 'Expert', true, 0.8),      -- SQL
(11, 14, 'Intermediate', false, 0.7), -- MongoDB
(11, 16, 'Expert', true, 0.9),     -- REST API

-- Full Stack Developer (role id 12)
(12, 1, 'Expert', true, 1.0),      -- JavaScript
(12, 2, 'Expert', true, 0.9),      -- React
(12, 3, 'Expert', true, 0.9),      -- Node.js
(12, 6, 'Expert', true, 0.8),      -- SQL
(12, 13, 'Intermediate', true, 0.8), -- TypeScript
(12, 17, 'Intermediate', true, 0.8), -- Microservices

-- Solutions Architect (role id 18)
(18, 7, 'Expert', true, 0.9),      -- AWS
(18, 17, 'Expert', true, 0.9),     -- Microservices
(18, 21, 'Expert', true, 0.9),     -- DevOps
(18, 15, 'Expert', true, 0.9),     -- Leadership
(18, 16, 'Expert', true, 0.8);     -- Communication

-- More Users
INSERT INTO users (employee_id, email, first_name, last_name, role_type, job_role, department, manager_id) VALUES
-- Engineering Team
('EMP007', 'alice.johnson@nexusai.com', 'Alice', 'Johnson', 'employee', 'Frontend Developer', 'Engineering', 3),
('EMP008', 'bob.williams@nexusai.com', 'Bob', 'Williams', 'employee', 'Backend Developer', 'Engineering', 3),
('EMP009', 'carol.brown@nexusai.com', 'Carol', 'Brown', 'employee', 'Full Stack Developer', 'Engineering', 3),
('EMP010', 'david.miller@nexusai.com', 'David', 'Miller', 'employee', 'DevOps Engineer Senior', 'Engineering', 3),
('EMP011', 'eva.davis@nexusai.com', 'Eva', 'Davis', 'employee', 'QA Engineer', 'Engineering', 3),

-- Business Team
('EMP012', 'frank.wilson@nexusai.com', 'Frank', 'Wilson', 'employee', 'Business Analyst', 'Business Analysis', 2),
('EMP013', 'grace.moore@nexusai.com', 'Grace', 'Moore', 'employee', 'Product Manager', 'Product', 2),
('EMP014', 'henry.taylor@nexusai.com', 'Henry', 'Taylor', 'employee', 'Scrum Master', 'PMO', 2),

-- Senior Roles
('EMP015', 'iris.anderson@nexusai.com', 'Iris', 'Anderson', 'employee', 'Solutions Architect', 'Architecture', 6),
('EMP016', 'jack.thomas@nexusai.com', 'Jack', 'Thomas', 'employee', 'Data Scientist', 'Analytics', 6),

-- Another Manager
('EMP017', 'karen.jackson@nexusai.com', 'Karen', 'Jackson', 'manager', 'Engineering Manager', 'Engineering', 6),

-- More HR and Admin
('EMP018', 'leo.white@nexusai.com', 'Leo', 'White', 'hr', 'HR Business Partner', 'HR', 2),
('EMP019', 'maria.harris@nexusai.com', 'Maria', 'Harris', 'admin', 'System Administrator', 'IT', 1);

-- Set additional manager relationships
UPDATE users SET manager_id = 17 WHERE id IN (7, 8, 9); -- Karen manages some engineering team

-- Comprehensive Employee Competencies
INSERT INTO employee_competencies (employee_id, skill_id, current_level, score, self_assessed, last_assessed, next_assessment_due) VALUES
-- Alice Johnson (Frontend Developer) - EMP007 (id=7)
(7, 1, 'Expert', 92, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months'),
(7, 2, 'Expert', 88, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months'),
(7, 11, 'Intermediate', 75, true, CURRENT_DATE - INTERVAL '2 months', CURRENT_DATE + INTERVAL '4 months'),
(7, 13, 'Intermediate', 78, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months'),
(7, 16, 'Intermediate', 80, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months'),

-- Bob Williams (Backend Developer) - EMP008 (id=8)
(8, 1, 'Expert', 85, true, CURRENT_DATE - INTERVAL '2 months', CURRENT_DATE + INTERVAL '4 months'),
(8, 3, 'Expert', 90, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months'),
(8, 5, 'Expert', 87, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months'),
(8, 6, 'Expert', 89, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months'),
(8, 14, 'Intermediate', 72, true, CURRENT_DATE - INTERVAL '3 months', CURRENT_DATE + INTERVAL '3 months'),

-- Carol Brown (Full Stack Developer) - EMP009 (id=9)
(9, 1, 'Expert', 88, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months'),
(9, 2, 'Expert', 85, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months'),
(9, 3, 'Expert', 83, true, CURRENT_DATE - INTERVAL '2 months', CURRENT_DATE + INTERVAL '4 months'),
(9, 6, 'Expert', 86, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months'),
(9, 13, 'Intermediate', 75, true, CURRENT_DATE - INTERVAL '2 months', CURRENT_DATE + INTERVAL '4 months'),

-- David Miller (DevOps Engineer Senior) - EMP010 (id=10)
(10, 7, 'Expert', 91, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months'),
(10, 8, 'Expert', 88, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months'),
(10, 9, 'Expert', 85, true, CURRENT_DATE - INTERVAL '2 months', CURRENT_DATE + INTERVAL '4 months'),
(10, 21, 'Expert', 92, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months'),
(10, 1, 'Intermediate', 70, true, CURRENT_DATE - INTERVAL '3 months', CURRENT_DATE + INTERVAL '3 months'),

-- Eva Davis (QA Engineer) - EMP011 (id=11)
(11, 22, 'Expert', 89, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months'),
(11, 30, 'Expert', 87, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months'),
(11, 1, 'Intermediate', 72, true, CURRENT_DATE - INTERVAL '2 months', CURRENT_DATE + INTERVAL '4 months'),
(11, 20, 'Intermediate', 78, true, CURRENT_DATE - INTERVAL '2 months', CURRENT_DATE + INTERVAL '4 months'),
(11, 16, 'Intermediate', 80, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months'),

-- Frank Wilson (Business Analyst) - EMP012 (id=12)
(12, 14, 'Expert', 85, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months'),
(12, 16, 'Expert', 88, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months'),
(12, 17, 'Intermediate', 75, true, CURRENT_DATE - INTERVAL '2 months', CURRENT_DATE + INTERVAL '4 months'),
(12, 29, 'Intermediate', 72, true, CURRENT_DATE - INTERVAL '3 months', CURRENT_DATE + INTERVAL '3 months'),
(12, 31, 'Intermediate', 78, true, CURRENT_DATE - INTERVAL '2 months', CURRENT_DATE + INTERVAL '4 months'),

-- Iris Anderson (Solutions Architect) - EMP015 (id=15)
(15, 7, 'Expert', 93, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months'),
(15, 17, 'Expert', 91, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months'),
(15, 21, 'Expert', 89, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months'),
(15, 15, 'Expert', 87, true, CURRENT_DATE - INTERVAL '2 months', CURRENT_DATE + INTERVAL '4 months'),
(15, 16, 'Expert', 85, true, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '5 months');

-- More Training Programs
INSERT INTO training_programs (title, description, provider, duration_hours, delivery_mode, cost, skill_id, created_by) VALUES
('TypeScript Fundamentals', 'Learn TypeScript from basics to advanced concepts', 'TechEd Solutions', 20, 'online', 299.00, 13, 2),
('Microservices Architecture', 'Design and implement microservices-based systems', 'Cloud Academy', 32, 'hybrid', 799.00, 17, 2),
('Advanced DevOps Practices', 'CI/CD, Infrastructure as Code, and monitoring', 'DevOps Institute', 40, 'online', 899.00, 21, 2),
('Agile Project Management', 'Comprehensive agile and scrum methodology training', 'Agile Alliance', 24, 'classroom', 699.00, 20, 2),
('Business Analysis Fundamentals', 'Requirements gathering and business process analysis', 'BA Institute', 28, 'hybrid', 599.00, 14, 2),
('Effective Communication Skills', 'Professional communication and presentation skills', 'Communication Pro', 16, 'classroom', 399.00, 16, 2),
('Quality Assurance Best Practices', 'Modern testing methodologies and tools', 'QA Masters', 30, 'online', 549.00, 22, 2);

-- Sample Training Progress
INSERT INTO training_progress (employee_id, training_program_id, enrolled_date, start_date, status, progress_percentage, assigned_by) VALUES
-- Recent enrollments
(7, 4, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '8 days', 'in_progress', 45.0, 3),
(8, 5, CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE - INTERVAL '12 days', 'in_progress', 60.0, 3),
(9, 4, CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '18 days', 'in_progress', 75.0, 3),
(10, 5, CURRENT_DATE - INTERVAL '25 days', CURRENT_DATE - INTERVAL '20 days', 'completed', 100.0, 3),
(11, 7, CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '25 days', 'completed', 100.0, 3),
(12, 8, CURRENT_DATE - INTERVAL '35 days', CURRENT_DATE - INTERVAL '30 days', 'completed', 100.0, 2),

-- Completed trainings with scores
(4, 1, CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE - INTERVAL '55 days', 'completed', 100.0, 3),
(5, 2, CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE - INTERVAL '40 days', 'completed', 100.0, 3);

-- Update completed training records with completion dates and scores
UPDATE training_progress SET 
    completion_date = enrolled_date + INTERVAL '30 days',
    score = 85,
    certification_earned = true 
WHERE status = 'completed' AND training_program_id = 5;

UPDATE training_progress SET 
    completion_date = enrolled_date + INTERVAL '25 days',
    score = 88,
    certification_earned = true 
WHERE status = 'completed' AND training_program_id = 7;

UPDATE training_progress SET 
    completion_date = enrolled_date + INTERVAL '28 days',
    score = 82,
    certification_earned = true 
WHERE status = 'completed' AND training_program_id = 8;

UPDATE training_progress SET 
    completion_date = enrolled_date + INTERVAL '35 days',
    score = 90,
    certification_earned = true 
WHERE status = 'completed' AND training_program_id = 1;

UPDATE training_progress SET 
    completion_date = enrolled_date + INTERVAL '38 days',
    score = 87,
    certification_earned = true 
WHERE status = 'completed' AND training_program_id = 2;

-- More Assessment Templates
INSERT INTO assessments (title, description, assessment_type, skill_id, duration_minutes, total_marks, passing_marks, created_by) VALUES
('TypeScript Proficiency Test', 'Comprehensive TypeScript knowledge assessment', 'MCQ', 13, 45, 100, 70, 2),
('React Advanced Concepts', 'Advanced React patterns and best practices', 'coding', 2, 90, 100, 75, 2),
('Node.js Backend Development', 'Server-side development with Node.js', 'coding', 3, 120, 100, 70, 2),
('AWS Cloud Architecture', 'Cloud solution design and implementation', 'case_study', 7, 60, 100, 70, 2),
('DevOps Practices Assessment', 'CI/CD and infrastructure management', 'simulation', 21, 75, 100, 75, 2),
('Communication Skills Evaluation', 'Professional communication assessment', 'case_study', 16, 30, 100, 65, 2),
('Agile Methodology Quiz', 'Scrum and agile practices knowledge test', 'MCQ', 20, 30, 100, 60, 2);

-- Sample Assessment Questions for TypeScript test (assessment_id = 4)
INSERT INTO assessment_questions (assessment_id, question_text, question_type, options, correct_answer, marks, difficulty_level) VALUES
(4, 'What is the main benefit of using TypeScript over JavaScript?', 'MCQ', 
 '["Static type checking", "Faster execution", "Smaller bundle size", "Better browser support"]', 
 'Static type checking', 5, 'Easy'),

(4, 'Which TypeScript feature allows you to define optional properties in an interface?', 'MCQ',
 '["? operator", "| operator", "& operator", "! operator"]',
 '? operator', 5, 'Easy'),

(4, 'What is a generic in TypeScript?', 'MCQ',
 '["A way to create reusable components", "A type of variable", "A function modifier", "A class decorator"]',
 'A way to create reusable components', 10, 'Medium'),

(4, 'How do you define a union type in TypeScript?', 'MCQ',
 '["type | type", "type & type", "type + type", "type = type"]',
 'type | type', 5, 'Easy'),

(4, 'What does the "never" type represent in TypeScript?', 'MCQ',
 '["Values that never occur", "Null values", "Undefined values", "Empty objects"]',
 'Values that never occur', 10, 'Hard');

-- Sample Assessment Questions for Communication Skills (assessment_id = 9)
INSERT INTO assessment_questions (assessment_id, question_text, question_type, options, correct_answer, marks, difficulty_level) VALUES
(9, 'What is the most important aspect of active listening?', 'MCQ',
 '["Giving full attention to the speaker", "Preparing your response", "Taking notes", "Asking questions"]',
 'Giving full attention to the speaker', 10, 'Easy'),

(9, 'In a conflict situation, what should be your first priority?', 'MCQ',
 '["Understanding all perspectives", "Proving your point", "Finding a quick solution", "Avoiding the conflict"]',
 'Understanding all perspectives', 15, 'Medium'),

(9, 'Describe a situation where you had to communicate complex technical information to a non-technical stakeholder. How did you approach it?', 'essay',
 null, null, 25, 'Medium');

-- More Employee Assessments
INSERT INTO employee_assessments (employee_id, assessment_id, assigned_by, scheduled_date, status, start_time, end_time, score, percentage, passed) VALUES
-- Completed assessments
(7, 4, 3, CURRENT_DATE - INTERVAL '10 days', 'completed', 
 CURRENT_DATE - INTERVAL '10 days' + INTERVAL '9 hours',
 CURRENT_DATE - INTERVAL '10 days' + INTERVAL '9 hours 45 minutes',
 32, 91.4, true),

(8, 4, 3, CURRENT_DATE - INTERVAL '12 days', 'completed',
 CURRENT_DATE - INTERVAL '12 days' + INTERVAL '14 hours',
 CURRENT_DATE - INTERVAL '12 days' + INTERVAL '14 hours 40 minutes',
 28, 80.0, true),

(9, 5, 3, CURRENT_DATE - INTERVAL '8 days', 'completed',
 CURRENT_DATE - INTERVAL '8 days' + INTERVAL '10 hours',
 CURRENT_DATE - INTERVAL '8 days' + INTERVAL '11 hours 25 minutes',
 78, 78.0, true),

-- Pending assessments
(10, 8, 3, CURRENT_DATE + INTERVAL '2 days', 'assigned', null, null, null, null, null),
(11, 9, 3, CURRENT_DATE + INTERVAL '3 days', 'assigned', null, null, null, null, null),
(12, 9, 2, CURRENT_DATE + INTERVAL '5 days', 'assigned', null, null, null, null, null);

-- Sample Assessment Responses for completed assessments
INSERT INTO assessment_responses (employee_assessment_id, question_id, response, is_correct, marks_obtained, time_spent) VALUES
-- Alice's TypeScript test responses (employee_assessment_id = 1, based on insert order)
(1, 1, 'Static type checking', true, 5, 45),
(1, 2, '? operator', true, 5, 30),
(1, 3, 'A way to create reusable components', true, 10, 120),
(1, 4, 'type | type', true, 5, 25),
(1, 5, 'Values that never occur', true, 7, 180),

-- Bob's TypeScript test responses (employee_assessment_id = 2)
(2, 1, 'Static type checking', true, 5, 40),
(2, 2, '? operator', true, 5, 35),
(2, 3, 'A way to create reusable components', true, 10, 150),
(2, 4, 'type | type', true, 5, 30),
(2, 5, 'Null values', false, 0, 200);

-- More Projects
INSERT INTO projects (name, description, project_manager_id, start_date, end_date, status, priority, budget, client_name) VALUES
('E-commerce Platform Upgrade', 'Migration to modern tech stack and improved UX', 3, CURRENT_DATE - INTERVAL '2 months', CURRENT_DATE + INTERVAL '4 months', 'active', 'high', 250000.00, 'RetailCorp'),
('Mobile Banking App', 'Native mobile application for banking services', 17, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '8 months', 'active', 'critical', 500000.00, 'FinanceBank'),
('Data Analytics Dashboard', 'Real-time business intelligence dashboard', 6, CURRENT_DATE + INTERVAL '1 month', CURRENT_DATE + INTERVAL '6 months', 'planning', 'medium', 150000.00, 'DataCorp'),
('Legacy System Migration', 'Migration of legacy systems to cloud infrastructure', 17, CURRENT_DATE - INTERVAL '3 months', CURRENT_DATE + INTERVAL '3 months', 'active', 'high', 400000.00, 'TechLegacy Inc');

-- Project Skill Requirements
INSERT INTO project_skill_requirements (project_id, skill_id, required_level, required_count, priority) VALUES
-- E-commerce Platform Upgrade (project_id = 2)
(2, 1, 'Expert', 3, 'high'),        -- JavaScript
(2, 2, 'Expert', 2, 'high'),        -- React
(2, 3, 'Expert', 2, 'high'),        -- Node.js
(2, 6, 'Intermediate', 2, 'medium'), -- SQL
(2, 14, 'Intermediate', 1, 'medium'), -- MongoDB
(2, 13, 'Intermediate', 2, 'medium'), -- TypeScript

-- Mobile Banking App (project_id = 3)
(3, 1, 'Expert', 2, 'high'),        -- JavaScript
(3, 2, 'Expert', 2, 'high'),        -- React
(3, 13, 'Expert', 2, 'high'),       -- TypeScript
(3, 23, 'Expert', 2, 'high'),       -- Financial Services domain
(3, 7, 'Intermediate', 1, 'medium'), -- AWS
(3, 30, 'Expert', 1, 'high'),       -- Quality Assurance

-- Data Analytics Dashboard (project_id = 4)
(4, 4, 'Expert', 2, 'high'),        -- Python
(4, 14, 'Expert', 2, 'high'),       -- Data Analytics
(4, 6, 'Expert', 1, 'high'),        -- SQL
(4, 2, 'Intermediate', 1, 'medium'), -- React

-- Legacy System Migration (project_id = 5)
(5, 7, 'Expert', 2, 'critical'),    -- AWS
(5, 8, 'Expert', 1, 'high'),        -- Docker
(5, 9, 'Expert', 1, 'high'),        -- Kubernetes
(5, 21, 'Expert', 2, 'critical');   -- DevOps

-- Project Allocations
INSERT INTO project_allocations (project_id, employee_id, skill_id, allocation_percentage, start_date, allocated_by, status) VALUES
-- Customer Portal Redesign allocations
(1, 7, 2, 90, CURRENT_DATE - INTERVAL '1 month', 3, 'active'),  -- Alice for React
(1, 9, 1, 75, CURRENT_DATE - INTERVAL '1 month', 3, 'active'),  -- Carol for JavaScript

-- E-commerce Platform Upgrade allocations
(2, 7, 2, 80, CURRENT_DATE - INTERVAL '1 month', 3, 'active'),  -- Alice for React
(2, 8, 3, 90, CURRENT_DATE - INTERVAL '1 month', 3, 'active'),  -- Bob for Node.js
(2, 9, 1, 85, CURRENT_DATE - INTERVAL '1 month', 3, 'active'),  -- Carol for JavaScript

-- Mobile Banking App allocations
(3, 5, 2, 100, CURRENT_DATE - INTERVAL '3 weeks', 17, 'active'), -- Jane for React
(3, 9, 13, 70, CURRENT_DATE - INTERVAL '3 weeks', 17, 'active'), -- Carol for TypeScript

-- Legacy System Migration allocations
(5, 10, 7, 100, CURRENT_DATE - INTERVAL '2 months', 17, 'active'), -- David for AWS
(5, 10, 21, 80, CURRENT_DATE - INTERVAL '2 months', 17, 'active'); -- David for DevOps

-- Additional Certifications
INSERT INTO certifications (employee_id, skill_id, certificate_name, issuing_authority, issue_date, expiry_date, is_verified, verified_by) VALUES
(7, 2, 'React Developer Certification', 'React Training Institute', CURRENT_DATE - INTERVAL '6 months', CURRENT_DATE + INTERVAL '18 months', true, 2),
(8, 3, 'Node.js Certified Developer', 'Node.js Foundation', CURRENT_DATE - INTERVAL '8 months', CURRENT_DATE + INTERVAL '16 months', true, 2),
(9, 1, 'JavaScript Specialist', 'JS Academy', CURRENT_DATE - INTERVAL '4 months', CURRENT_DATE + INTERVAL '20 months', true, 2),
(10, 7, 'AWS Solutions Architect Associate', 'Amazon Web Services', CURRENT_DATE - INTERVAL '10 months', CURRENT_DATE + INTERVAL '14 months', true, 2),
(10, 21, 'Certified DevOps Engineer', 'DevOps Institute', CURRENT_DATE - INTERVAL '5 months', CURRENT_DATE + INTERVAL '19 months', true, 2),
(11, 22, 'ISTQB Certified Tester', 'International Software Testing Board', CURRENT_DATE - INTERVAL '12 months', CURRENT_DATE + INTERVAL '12 months', true, 2),
(15, 7, 'AWS Solutions Architect Professional', 'Amazon Web Services', CURRENT_DATE - INTERVAL '3 months', CURRENT_DATE + INTERVAL '21 months', true, 2);

-- Update some manager validations
UPDATE employee_competencies SET 
    manager_validated = true,
    validated_by = 3
WHERE employee_id IN (7, 8, 9, 10, 11) AND score >= 80;

UPDATE employee_competencies SET 
    manager_validated = true,
    validated_by = 17
WHERE employee_id IN (5) AND score >= 85;

-- Add some self-assessments that need validation
INSERT INTO employee_competencies (employee_id, skill_id, current_level, score, self_assessed, last_assessed, next_assessment_due) VALUES
(12, 19, 'Intermediate', 75, true, CURRENT_DATE - INTERVAL '1 week', CURRENT_DATE + INTERVAL '5 months'),
(12, 25, 'Beginner', 65, true, CURRENT_DATE - INTERVAL '1 week', CURRENT_DATE + INTERVAL '5 months'),
(13, 15, 'Intermediate', 78, true, CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '5 months'),
(13, 16, 'Expert', 85, true, CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '5 months'),
(14, 20, 'Expert', 92, true, CURRENT_DATE - INTERVAL '1 week', CURRENT_DATE + INTERVAL '5 months'),
(14, 15, 'Intermediate', 72, true, CURRENT_DATE - INTERVAL '1 week', CURRENT_DATE + INTERVAL '5 months');

COMMIT;