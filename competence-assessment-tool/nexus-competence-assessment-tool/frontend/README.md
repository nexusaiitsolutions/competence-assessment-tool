// Database setup instructions (README.md content)
# Nexus Competence Assessment Tool (CAT)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Database Setup

1. Install PostgreSQL and create a database:
```sql
CREATE DATABASE nexus_cat_db;
CREATE USER postgres WITH PASSWORD 'Welcome123';
GRANT ALL PRIVILEGES ON DATABASE nexus_cat_db TO postgres;
```

2. Run the schema creation script:
```bash
psql -U postgres -d nexus_cat_db -f backend/src/dbschema/schema.sql
```

3. Load sample data:
```bash
psql -U postgres -d nexus_cat_db -f backend/src/dbschema/enhanced-sample-data.sql
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your configuration (see .env.example)

4. Start the server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Demo Accounts

The system comes with pre-configured demo accounts:

- **Admin**: admin@nexusai.com / password123
- **HR**: hr@nexusai.com / password123  
- **Manager**: manager@nexusai.com / password123
- **Employee**: john.doe@nexusai.com / password123
- **Employee**: jane.smith@nexusai.com / password123

## Features

### Core Functionality
- **User Management**: Role-based access control (Employee, Manager, HR, Admin, Leader)
- **Skills Management**: Categorized skills with proficiency levels
- **Competency Assessment**: Self-assessment, manager validation, and objective testing
- **Training Programs**: Course enrollment and progress tracking
- **Project Management**: Resource allocation based on competencies
- **Analytics Dashboard**: Comprehensive reporting and insights

### User Roles & Permissions

#### Employee
- View personal competency profile
- Take assigned assessments
- Enroll in training programs
- Self-assess skills
- Upload certifications

#### Manager
- View team competency matrix
- Assign assessments to team members
- Validate employee self-assessments
- Manage project resources
- Access team analytics

#### HR
- Manage organizational skill framework
- Create and schedule assessments
- Design training programs
- Generate compliance reports
- Organization-wide analytics

#### Admin
- Full system access
- User management
- System configuration
- Data export/import

### API Endpoints

#### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration

#### Users
- GET `/api/users` - List users
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update profile
- POST `/api/users` - Create user (HR/Admin)

#### Skills
- GET `/api/skills` - List skills by category
- POST `/api/skills` - Create skill (HR/Admin)
- GET `/api/skills/categories` - List skill categories

#### Competencies
- GET `/api/competencies/profile/:userId?` - Get competency profile
- POST `/api/competencies/self-assess` - Self-assessment
- POST `/api/competencies/validate` - Manager validation
- GET `/api/competencies/gaps-analysis/:userId?` - Skill gaps

#### Assessments
- GET `/api/assessments/my-assessments` - Employee assessments
- POST `/api/assessments/template` - Create assessment
- POST `/api/assessments/assign` - Assign assessment
- POST `/api/assessments/:id/start` - Start assessment
- POST `/api/assessments/:id/submit` - Submit assessment

#### Training
- GET `/api/training/programs` - List training programs
- GET `/api/training/my-trainings` - Employee trainings
- POST `/api/training/enroll` - Enroll in training
- POST `/api/training/programs` - Create program (HR/Admin)

#### Projects
- GET `/api/projects` - List projects
- POST `/api/projects` - Create project
- GET `/api/projects/:id/available-employees` - Find employees by skills

#### Analytics
- GET `/api/analytics/employee-dashboard` - Employee analytics
- GET `/api/analytics/manager-dashboard` - Manager analytics
- GET `/api/analytics/organization-dashboard` - Organization analytics

## Technology Stack

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate limiting
- **Logging**: Winston

### Frontend
- **Framework**: React 18
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Lucide React
- **Charts**: Recharts (planned)
- **HTTP Client**: Fetch API

### Database Schema

The system uses a comprehensive PostgreSQL schema with the following main entities:

- **Users**: Employee information and roles
- **Skills & Categories**: Skill taxonomy
- **Employee Competencies**: Skill assessments and levels
- **Assessments**: Test templates and results
- **Training Programs**: Learning content and progress
- **Projects**: Resource allocation and requirements
- **Certifications**: External skill validation

## Security Features

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- SQL injection prevention
- Input validation and sanitization

## Future Enhancements

- Real-time notifications
- Advanced analytics with ML insights
- Mobile application
- Integration with external LMS systems
- API rate limiting per user
- Advanced reporting with custom filters
- Skill recommendation engine
- Automated competency gap analysis
- Integration with project management tools