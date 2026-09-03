import * as bcrypt from 'bcryptjs';

export type Role = 'ADMIN' | 'USER';
export type UserStatus = 'ACTIVE' | 'DISABLED';
export type ContractType = 'CDI' | 'CDD' | 'Freelance' | 'Contract';
export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';
export type ExperienceLevel = 'Junior' | 'Mid' | 'Senior' | 'Lead';
export type OpportunitySource =
  | 'LinkedIn'
  | 'Indeed'
  | 'Company'
  | 'FreelancePlatform'
  | 'Referral'
  | 'Other';

export type SkillCategory =
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'DevOps'
  | 'Cloud'
  | 'Mobile'
  | 'Other';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type ApplicationStatus =
  | 'SAVED'
  | 'APPLIED'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED';

export interface SkillRecord {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
}

export interface UserRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  status: UserStatus;
  title: string;
  bio: string;
  experienceLevel: ExperienceLevel;
  location: string;
  available: boolean;
  preferredContract: ContractType[];
  preferredWorkMode: WorkMode[];
  links: {
    portfolio?: string;
    github?: string;
    linkedin?: string;
  };
  skills: SkillRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface OpportunitySkillRecord {
  name: string;
  category?: SkillCategory;
}

export interface OpportunityRecord {
  id: string;
  title: string;
  company: string;
  description: string;
  url: string;
  contractType: ContractType;
  location: string;
  workMode: WorkMode;
  source: OpportunitySource;
  requiredSkills: OpportunitySkillRecord[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationRecord {
  id: string;
  opportunityId: string;
  userId: string;
  status: ApplicationStatus;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface SeedData {
  users: UserRecord[];
  opportunities: OpportunityRecord[];
  applications: ApplicationRecord[];
}

const DAY = 24 * 60 * 60 * 1000;
const now = () => new Date().toISOString();
const iso = (daysAgo: number, jitter = 0) =>
  new Date(Date.now() - daysAgo * DAY - jitter * 3600 * 1000).toISOString();

const mockSkills: SkillRecord[] = [
  { id: 'skill-1', name: 'JavaScript', category: 'Frontend', level: 'Advanced' },
  { id: 'skill-2', name: 'TypeScript', category: 'Frontend', level: 'Advanced' },
  { id: 'skill-3', name: 'React', category: 'Frontend', level: 'Expert' },
  { id: 'skill-4', name: 'Next.js', category: 'Frontend', level: 'Advanced' },
  { id: 'skill-5', name: 'Node.js', category: 'Backend', level: 'Advanced' },
  { id: 'skill-6', name: 'NestJS', category: 'Backend', level: 'Intermediate' },
  { id: 'skill-7', name: 'Express', category: 'Backend', level: 'Advanced' },
  { id: 'skill-8', name: 'PostgreSQL', category: 'Database', level: 'Intermediate' },
  { id: 'skill-9', name: 'Prisma', category: 'Database', level: 'Intermediate' },
  { id: 'skill-10', name: 'Docker', category: 'DevOps', level: 'Intermediate' },
  { id: 'skill-11', name: 'Git', category: 'DevOps', level: 'Advanced' },
  { id: 'skill-12', name: 'GitHub Actions', category: 'DevOps', level: 'Intermediate' },
  { id: 'skill-13', name: 'Linux', category: 'DevOps', level: 'Intermediate' },
  { id: 'skill-14', name: 'AWS', category: 'Cloud', level: 'Beginner' },
  { id: 'skill-15', name: 'MongoDB', category: 'Database', level: 'Intermediate' },
  { id: 'skill-16', name: 'GraphQL', category: 'Backend', level: 'Intermediate' },
  { id: 'skill-17', name: 'Tailwind CSS', category: 'Frontend', level: 'Advanced' },
  { id: 'skill-18', name: 'Redis', category: 'Database', level: 'Beginner' },
];

export async function buildSeed(): Promise<SeedData> {
  const hash = (p: string) => bcrypt.hashSync(p, 10);

  const users: UserRecord[] = [
    {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: hash('password123'),
      role: 'USER',
      status: 'ACTIVE',
      title: 'Full Stack Developer',
      bio: 'Développeur full stack passionné par React, Node.js et les architectures scalables. 5 ans d’expérience sur des produits SaaS.',
      experienceLevel: 'Senior',
      location: 'Paris, France',
      available: true,
      preferredContract: ['CDI', 'Freelance'],
      preferredWorkMode: ['Remote', 'Hybrid'],
      links: {
        portfolio: 'https://johndoe.dev',
        github: 'https://github.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
      },
      skills: mockSkills.slice(0, 13),
      createdAt: iso(120, 2),
      updatedAt: iso(120, 2),
    },
    {
      id: 'user-admin-1',
      firstName: 'Alice',
      lastName: 'Admin',
      email: 'admin@opportunity-match.com',
      password: hash('admin123'),
      role: 'ADMIN',
      status: 'ACTIVE',
      title: 'Administrator',
      bio: '',
      experienceLevel: 'Senior',
      location: 'Paris, France',
      available: false,
      preferredContract: [],
      preferredWorkMode: [],
      links: {},
      skills: [],
      createdAt: iso(100, 1),
      updatedAt: iso(100, 1),
    },
  ];

  const oppDefaults = {
    ownerId: 'user-1',
    updatedAt: iso(0, 0),
  };

  const opportunities: OpportunityRecord[] = [
    {
      id: 'opp-1',
      title: 'Frontend Developer',
      company: 'TechCorp',
      description: 'Rejoignez notre équipe produit pour construire des interfaces performantes avec React et TypeScript. Vous travaillerez sur notre dashboard SaaS et notre design system.',
      url: 'https://example.com/jobs/techcorp-frontend',
      contractType: 'CDI',
      location: 'Paris, France',
      workMode: 'Remote',
      source: 'LinkedIn',
      requiredSkills: [
        { name: 'React', category: 'Frontend' },
        { name: 'TypeScript', category: 'Frontend' },
        { name: 'Tailwind CSS', category: 'Frontend' },
        { name: 'Next.js', category: 'Frontend' },
      ],
      createdAt: '2026-08-20T09:00:00.000Z',
      ...oppDefaults,
      updatedAt: '2026-08-20T09:00:00.000Z',
    },
    {
      id: 'opp-2',
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      description: 'Nous cherchons un développeur full stack pour construire notre plateforme de zéro. Stack moderne : React, Node.js, PostgreSQL, Docker.',
      url: 'https://example.com/jobs/startupxyz-fullstack',
      contractType: 'CDI',
      location: 'Remote',
      workMode: 'Remote',
      source: 'Indeed',
      requiredSkills: [
        { name: 'React', category: 'Frontend' },
        { name: 'Node.js', category: 'Backend' },
        { name: 'PostgreSQL', category: 'Database' },
        { name: 'Docker', category: 'DevOps' },
        { name: 'TypeScript', category: 'Frontend' },
      ],
      createdAt: '2026-08-21T14:30:00.000Z',
      ...oppDefaults,
      updatedAt: '2026-08-21T14:30:00.000Z',
    },
    {
      id: 'opp-3',
      title: 'Backend Engineer',
      company: 'CloudNative',
      description: 'Conception et développement de microservices NestJS déployés sur AWS avec CI/CD GitHub Actions.',
      url: 'https://example.com/jobs/cloudnative-backend',
      contractType: 'CDI',
      location: 'Lyon, France',
      workMode: 'Hybrid',
      source: 'Company',
      requiredSkills: [
        { name: 'NestJS', category: 'Backend' },
        { name: 'PostgreSQL', category: 'Database' },
        { name: 'AWS', category: 'Cloud' },
        { name: 'Docker', category: 'DevOps' },
        { name: 'GitHub Actions', category: 'DevOps' },
      ],
      createdAt: '2026-08-22T11:15:00.000Z',
      ...oppDefaults,
      updatedAt: '2026-08-22T11:15:00.000Z',
    },
    {
      id: 'opp-4',
      title: 'React Developer',
      company: 'DesignFirst',
      description: 'Création d’une nouvelle application React avec TypeScript et Tailwind. Focus sur la performance et l’accessibilité.',
      url: 'https://example.com/jobs/designfirst-react',
      contractType: 'Freelance',
      location: 'Remote',
      workMode: 'Remote',
      source: 'FreelancePlatform',
      requiredSkills: [
        { name: 'React', category: 'Frontend' },
        { name: 'TypeScript', category: 'Frontend' },
        { name: 'Tailwind CSS', category: 'Frontend' },
        { name: 'GraphQL', category: 'Backend' },
      ],
      createdAt: '2026-08-23T08:45:00.000Z',
      ...oppDefaults,
      updatedAt: '2026-08-23T08:45:00.000Z',
    },
    {
      id: 'opp-5',
      title: 'DevOps Engineer',
      company: 'InfraOps',
      description: 'Mise en place de pipelines CI/CD, gestion de l’infrastructure Docker et AWS, automatisation avec GitHub Actions.',
      url: 'https://example.com/jobs/infraops-devops',
      contractType: 'CDI',
      location: 'Toulouse, France',
      workMode: 'On-site',
      source: 'Referral',
      requiredSkills: [
        { name: 'Docker', category: 'DevOps' },
        { name: 'AWS', category: 'Cloud' },
        { name: 'GitHub Actions', category: 'DevOps' },
        { name: 'Linux', category: 'DevOps' },
        { name: 'Redis', category: 'Database' },
        { name: 'Kubernetes', category: 'DevOps' },
      ],
      createdAt: '2026-08-18T13:00:00.000Z',
      ...oppDefaults,
      updatedAt: '2026-08-18T13:00:00.000Z',
    },
    {
      id: 'opp-6',
      title: 'Node.js Backend Developer',
      company: 'APIForge',
      description: 'Développement d’APIs Express et Node.js hautes performances, intégration PostgreSQL et Redis.',
      url: 'https://example.com/jobs/apiforge-node',
      contractType: 'CDD',
      location: 'Nantes, France',
      workMode: 'Hybrid',
      source: 'LinkedIn',
      requiredSkills: [
        { name: 'Node.js', category: 'Backend' },
        { name: 'Express', category: 'Backend' },
        { name: 'PostgreSQL', category: 'Database' },
        { name: 'Redis', category: 'Database' },
        { name: 'Docker', category: 'DevOps' },
      ],
      createdAt: '2026-08-24T10:30:00.000Z',
      ...oppDefaults,
      updatedAt: '2026-08-24T10:30:00.000Z',
    },
    {
      id: 'opp-7',
      title: 'Next.js Developer',
      company: 'SSRStudio',
      description: 'Développement d’une application Next.js avec App Router, Prisma et PostgreSQL. SEO et performance au cœur du produit.',
      url: 'https://example.com/jobs/ssrstudio-nextjs',
      contractType: 'Freelance',
      location: 'Remote',
      workMode: 'Remote',
      source: 'FreelancePlatform',
      requiredSkills: [
        { name: 'Next.js', category: 'Frontend' },
        { name: 'React', category: 'Frontend' },
        { name: 'Prisma', category: 'Database' },
        { name: 'PostgreSQL', category: 'Database' },
        { name: 'TypeScript', category: 'Frontend' },
      ],
      createdAt: '2026-08-25T09:00:00.000Z',
      ...oppDefaults,
      updatedAt: '2026-08-25T09:00:00.000Z',
    },
    {
      id: 'opp-8',
      title: 'Database Administrator',
      company: 'DataCore',
      description: 'Administration et optimisation de bases PostgreSQL et MongoDB. Mise en place de sauvegardes et réplication.',
      url: 'https://example.com/jobs/datacore-dba',
      contractType: 'CDI',
      location: 'Bordeaux, France',
      workMode: 'On-site',
      source: 'Company',
      requiredSkills: [
        { name: 'PostgreSQL', category: 'Database' },
        { name: 'MongoDB', category: 'Database' },
        { name: 'Redis', category: 'Database' },
        { name: 'Linux', category: 'DevOps' },
      ],
      createdAt: '2026-08-15T14:00:00.000Z',
      ...oppDefaults,
      updatedAt: '2026-08-15T14:00:00.000Z',
    },
    {
      id: 'opp-9',
      title: 'Full Stack Engineer',
      company: 'ScaleUp',
      description: 'Développeur full stack sur une stack React + NestJS + Prisma + AWS. Vous serez responsable de features end-to-end.',
      url: 'https://example.com/jobs/scaleup-fullstack',
      contractType: 'CDI',
      location: 'Remote',
      workMode: 'Remote',
      source: 'LinkedIn',
      requiredSkills: [
        { name: 'React', category: 'Frontend' },
        { name: 'NestJS', category: 'Backend' },
        { name: 'Prisma', category: 'Database' },
        { name: 'AWS', category: 'Cloud' },
        { name: 'TypeScript', category: 'Frontend' },
        { name: 'Docker', category: 'DevOps' },
      ],
      createdAt: '2026-08-26T11:00:00.000Z',
      ...oppDefaults,
      updatedAt: '2026-08-26T11:00:00.000Z',
    },
    {
      id: 'opp-10',
      title: 'Mobile Developer',
      company: 'AppMobile',
      description: 'Développement d’une application mobile cross-platform. Connaissance React et TypeScript requise.',
      url: 'https://example.com/jobs/appmobile-mobile',
      contractType: 'Freelance',
      location: 'Remote',
      workMode: 'Remote',
      source: 'FreelancePlatform',
      requiredSkills: [
        { name: 'React', category: 'Frontend' },
        { name: 'TypeScript', category: 'Frontend' },
        { name: 'GraphQL', category: 'Backend' },
        { name: 'Redux', category: 'Frontend' },
      ],
      createdAt: '2026-08-19T16:00:00.000Z',
      ...oppDefaults,
      updatedAt: '2026-08-19T16:00:00.000Z',
    },
    {
      id: 'opp-11',
      title: 'Cloud Architect',
      company: 'SkyHigh',
      description: 'Conception d’architectures cloud AWS scalables, mise en place de Kubernetes et Terraform.',
      url: 'https://example.com/jobs/skyhigh-architect',
      contractType: 'Contract',
      location: 'Paris, France',
      workMode: 'Hybrid',
      source: 'Referral',
      requiredSkills: [
        { name: 'AWS', category: 'Cloud' },
        { name: 'Docker', category: 'DevOps' },
        { name: 'Kubernetes', category: 'DevOps' },
        { name: 'Terraform', category: 'Cloud' },
        { name: 'Linux', category: 'DevOps' },
      ],
      createdAt: '2026-08-10T09:00:00.000Z',
      ...oppDefaults,
      updatedAt: '2026-08-10T09:00:00.000Z',
    },
    {
      id: 'opp-12',
      title: 'Frontend Lead',
      company: 'PixelPerfect',
      description: 'Lead technique d’une équipe de 5 développeurs React. Mise en place des bonnes pratiques et mentorat.',
      url: 'https://example.com/jobs/pixelperfect-lead',
      contractType: 'CDI',
      location: 'Lille, France',
      workMode: 'Hybrid',
      source: 'LinkedIn',
      requiredSkills: [
        { name: 'React', category: 'Frontend' },
        { name: 'TypeScript', category: 'Frontend' },
        { name: 'Next.js', category: 'Frontend' },
        { name: 'Tailwind CSS', category: 'Frontend' },
        { name: 'GraphQL', category: 'Backend' },
      ],
      createdAt: '2026-08-27T08:00:00.000Z',
      ...oppDefaults,
      updatedAt: '2026-08-27T08:00:00.000Z',
    },
    {
      id: 'opp-13',
      title: 'JavaScript Developer',
      company: 'WebAgency',
      description: 'Développement de sites vitrines et e-commerce en JavaScript vanilla et React. Connaissance Git requise.',
      url: 'https://example.com/jobs/webagency-js',
      contractType: 'CDD',
      location: 'Marseille, France',
      workMode: 'On-site',
      source: 'Indeed',
      requiredSkills: [
        { name: 'JavaScript', category: 'Frontend' },
        { name: 'React', category: 'Frontend' },
        { name: 'Git', category: 'DevOps' },
        { name: 'HTML/CSS', category: 'Frontend' },
      ],
      createdAt: '2026-08-28T09:30:00.000Z',
      ...oppDefaults,
      updatedAt: '2026-08-28T09:30:00.000Z',
    },
    {
      id: 'opp-14',
      title: 'Backend Developer NestJS',
      company: 'NestFactory',
      description: 'Développement d’une API NestJS avec PostgreSQL et Prisma. Tests automatisés et CI/CD GitHub Actions.',
      url: 'https://example.com/jobs/nestfactory-backend',
      contractType: 'CDI',
      location: 'Remote',
      workMode: 'Remote',
      source: 'Company',
      requiredSkills: [
        { name: 'NestJS', category: 'Backend' },
        { name: 'Prisma', category: 'Database' },
        { name: 'PostgreSQL', category: 'Database' },
        { name: 'GitHub Actions', category: 'DevOps' },
        { name: 'TypeScript', category: 'Frontend' },
      ],
      createdAt: '2026-08-27T15:00:00.000Z',
      ...oppDefaults,
      updatedAt: '2026-08-27T15:00:00.000Z',
    },
    {
      id: 'opp-15',
      title: 'Data Engineer',
      company: 'BigDataInc',
      description: 'Construction de pipelines de données avec PostgreSQL, MongoDB et Redis. Déploiement Docker sur AWS.',
      url: 'https://example.com/jobs/bigdatainc-data',
      contractType: 'Freelance',
      location: 'Remote',
      workMode: 'Remote',
      source: 'Referral',
      requiredSkills: [
        { name: 'PostgreSQL', category: 'Database' },
        { name: 'MongoDB', category: 'Database' },
        { name: 'Redis', category: 'Database' },
        { name: 'Docker', category: 'DevOps' },
        { name: 'AWS', category: 'Cloud' },
        { name: 'Python', category: 'Backend' },
      ],
      createdAt: '2026-08-24T12:00:00.000Z',
      ...oppDefaults,
      updatedAt: '2026-08-24T12:00:00.000Z',
    },
  ];

  const applications: ApplicationRecord[] = [
    {
      id: 'app-1',
      opportunityId: 'opp-1',
      userId: 'user-1',
      status: 'SAVED',
      note: 'À postuler cette semaine, très bon match.',
      createdAt: '2026-08-20T10:00:00.000Z',
      updatedAt: '2026-08-20T10:00:00.000Z',
    },
    {
      id: 'app-2',
      opportunityId: 'opp-2',
      userId: 'user-1',
      status: 'APPLIED',
      note: 'Candidature envoyée via Indeed.',
      createdAt: '2026-08-21T15:00:00.000Z',
      updatedAt: '2026-08-22T09:00:00.000Z',
    },
    {
      id: 'app-3',
      opportunityId: 'opp-3',
      userId: 'user-1',
      status: 'INTERVIEW',
      note: 'Entretien technique prévu le 05/09.',
      createdAt: '2026-08-22T12:00:00.000Z',
      updatedAt: '2026-08-25T16:00:00.000Z',
    },
    {
      id: 'app-4',
      opportunityId: 'opp-4',
      userId: 'user-1',
      status: 'OFFER',
      note: 'Offre reçue — négociation en cours sur le TJM.',
      createdAt: '2026-08-23T09:00:00.000Z',
      updatedAt: '2026-08-27T11:00:00.000Z',
    },
    {
      id: 'app-5',
      opportunityId: 'opp-7',
      userId: 'user-1',
      status: 'SAVED',
      note: '',
      createdAt: '2026-08-25T09:30:00.000Z',
      updatedAt: '2026-08-25T09:30:00.000Z',
    },
    {
      id: 'app-6',
      opportunityId: 'opp-9',
      userId: 'user-1',
      status: 'APPLIED',
      note: 'Relance envoyée.',
      createdAt: '2026-08-26T11:30:00.000Z',
      updatedAt: '2026-08-28T08:00:00.000Z',
    },
    {
      id: 'app-7',
      opportunityId: 'opp-6',
      userId: 'user-1',
      status: 'REJECTED',
      note: 'Profil non retenu : manque d’expérience Redis.',
      createdAt: '2026-08-24T11:00:00.000Z',
      updatedAt: '2026-08-26T10:00:00.000Z',
    },
    {
      id: 'app-8',
      opportunityId: 'opp-12',
      userId: 'user-1',
      status: 'INTERVIEW',
      note: 'Entretien RH ok, entretien technique à venir.',
      createdAt: '2026-08-27T08:30:00.000Z',
      updatedAt: '2026-08-28T14:00:00.000Z',
    },
  ];

  return { users, opportunities, applications };
}

export { now };