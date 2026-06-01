jest.mock('../config/db.js', () => {
  const mockModel = () => ({
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
    upsert: jest.fn(),
  });
  return {
    business: mockModel(),
    user: mockModel(),
    review: mockModel(),
    category: mockModel(),
    analyticsEvent: mockModel(),
    favorite: mockModel(),
    $queryRaw: jest.fn(),
  };
});

process.env.JWT_SECRET = 'access_secret';
process.env.JWT_REFRESH_SECRET = 'access_secret';

const prisma = require('../config/db.js');
const request = require('supertest');
const app = require('../app');

function authHeader(role = 'admin', id = 1) {
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id, role }, process.env.JWT_SECRET || 'access_secret', {
    expiresIn: '15m',
  });
  return { Authorization: `Bearer ${token}` };
}

describe('Admin Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET /api/v1/admin/stats', () => {
    it('returns 401 without auth', async () => {
      const res = await request(app).get('/api/v1/admin/stats');
      expect(res.statusCode).toBe(401);
    });

    it('returns aggregated stats', async () => {
      prisma.business.count.mockResolvedValueOnce(100).mockResolvedValueOnce(1);
      prisma.user.count.mockResolvedValue(50);
      prisma.review.count.mockResolvedValue(3);
      const res = await request(app).get('/api/v1/admin/stats').set(authHeader());
      expect(res.statusCode).toBe(200);
      expect(res.body.totalBusinesses).toBe(100);
      expect(res.body.pendingApprovals).toBe(1);
      expect(res.body.activeUsers).toBe(50);
      expect(res.body.flaggedReviews).toBe(3);
    });
  });

  describe('GET /api/v1/admin/activity', () => {
    it('returns recent activities', async () => {
      prisma.business.findMany.mockResolvedValue([
        {
          id: 1,
          name: 'Test',
          created_at: new Date(),
          user: { id: 1, first_name: 'A', last_name: 'B' },
        },
      ]);
      prisma.review.findMany.mockResolvedValue([]);
      prisma.user.findMany.mockResolvedValue([]);
      const res = await request(app).get('/api/v1/admin/activity').set(authHeader());
      expect(res.statusCode).toBe(200);
      expect(res.body.activities).toBeDefined();
    });
  });

  describe('GET /api/v1/admin/dashboard', () => {
    it('returns aggregate dashboard data', async () => {
      prisma.business.count.mockResolvedValueOnce(100).mockResolvedValueOnce(2);
      prisma.user.count.mockResolvedValue(50);
      prisma.review.count.mockResolvedValue(3);
      prisma.business.findMany.mockResolvedValue([
        {
          id: 1,
          name: 'Test Business',
          status: 'approved',
          updated_at: new Date('2026-05-31T12:00:00Z'),
          user: { email: 'merchant@example.com' },
        },
      ]);
      prisma.review.findMany.mockResolvedValue([]);
      prisma.user.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ created_at: new Date() }]);
      prisma.business.groupBy.mockResolvedValue([
        { city: 'Fes', _count: { _all: 4 } },
        { city: 'Rabat', _count: { _all: 2 } },
      ]);

      const res = await request(app).get('/api/v1/admin/dashboard').set(authHeader());

      expect(res.statusCode).toBe(200);
      expect(res.body.stats.totalBusinesses).toBe(100);
      expect(res.body.activities).toHaveLength(1);
      expect(res.body.registrationTrends).toHaveLength(7);
      expect(res.body.businessesByCity[0]).toEqual({
        name: 'Fes',
        count: 4,
        percentage: 100,
      });
    });
  });

  describe('GET /api/v1/admin/export', () => {
    it('returns a downloadable export without password hashes', async () => {
      prisma.business.count.mockResolvedValueOnce(12).mockResolvedValueOnce(2);
      prisma.user.count.mockResolvedValue(8);
      prisma.review.count.mockResolvedValue(1);
      prisma.user.findMany.mockResolvedValue([
        {
          id: 1,
          email: 'admin@example.com',
          role: 'admin',
          first_name: 'Admin',
          created_at: new Date(),
        },
      ]);
      prisma.business.findMany.mockResolvedValue([
        {
          id: 7,
          name: 'Exported Business',
          _count: { reviews: 3, favorites: 2, analytics_events: 5 },
        },
      ]);
      prisma.category.findMany.mockResolvedValue([
        { id: 1, name_en: 'Craft', _count: { businesses: 4 } },
      ]);
      prisma.review.findMany.mockResolvedValue([]);
      prisma.analyticsEvent.groupBy.mockResolvedValue([{ event_type: 'view', _count: 5 }]);
      prisma.favorite.count.mockResolvedValue(2);

      const res = await request(app).get('/api/v1/admin/export').set(authHeader());

      expect(res.statusCode).toBe(200);
      expect(res.headers['content-disposition']).toContain('localboost-export-');
      expect(res.body.counts.businesses).toBe(1);
      expect(res.body.businesses[0].review_count).toBe(3);
      expect(JSON.stringify(res.body)).not.toContain('password_hash');
    });
  });

  describe('GET /api/v1/analytics', () => {
    it('returns analytics data', async () => {
      prisma.analyticsEvent.count.mockResolvedValue(500);
      prisma.analyticsEvent.groupBy.mockResolvedValue([{ event_type: 'view', _count: 300 }]);
      prisma.business.findMany.mockResolvedValue([]);
      prisma.user.groupBy.mockResolvedValue([{ preferred_lang: 'en', _count: 40 }]);
      const res = await request(app).get('/api/v1/analytics').set(authHeader());
      expect(res.statusCode).toBe(200);
      expect(res.body.totalEvents).toBe(500);
    });
  });
});

describe('Business Moderate Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('PUT /api/v1/businesses/:id/moderate', () => {
    it('returns 401 without auth', async () => {
      const res = await request(app)
        .put('/api/v1/businesses/1/moderate')
        .send({ status: 'approved' });
      expect(res.statusCode).toBe(401);
    });

    it('rejects invalid status', async () => {
      const res = await request(app)
        .put('/api/v1/businesses/1/moderate')
        .set(authHeader())
        .send({ status: 'invalid' });
      expect(res.statusCode).toBe(400);
    });

    it('approves a business', async () => {
      prisma.business.findUnique.mockResolvedValue({ id: 1, status: 'pending' });
      prisma.business.update.mockResolvedValue({ id: 1, status: 'approved' });
      const res = await request(app)
        .put('/api/v1/businesses/1/moderate')
        .set(authHeader())
        .send({ status: 'approved' });
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('approved');
    });
  });
});

describe('Users Routes - Status', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('PUT /api/v1/users/:id with status', () => {
    it('allows admin to suspend user', async () => {
      prisma.user.update.mockResolvedValue({ id: 2, status: 'suspended' });
      const res = await request(app)
        .put('/api/v1/users/2')
        .set(authHeader())
        .send({ status: 'suspended' });
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('suspended');
    });

    it('rejects invalid status value', async () => {
      const res = await request(app)
        .put('/api/v1/users/2')
        .set(authHeader())
        .send({ status: 'banned' });
      expect(res.statusCode).toBe(400);
    });

    it('rejects non-admin changing status', async () => {
      const res = await request(app)
        .put('/api/v1/users/2')
        .set(authHeader('merchant', 1))
        .send({ status: 'suspended' });
      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/v1/users with status filter', () => {
    it('filters by status', async () => {
      prisma.user.findMany.mockResolvedValue([{ id: 1, status: 'suspended' }]);
      const res = await request(app).get('/api/v1/users?status=suspended').set(authHeader());
      expect(res.statusCode).toBe(200);
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'suspended' },
        })
      );
    });
  });
});

describe('Categories Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('POST /api/v1/categories', () => {
    it('requires auth', async () => {
      const res = await request(app).post('/api/v1/categories').send({ name_en: 'Test' });
      expect(res.statusCode).toBe(401);
    });

    it('creates category with name', async () => {
      prisma.category.findFirst.mockResolvedValue(null);
      prisma.category.create.mockResolvedValue({ id: 1, name_en: 'Test' });
      const res = await request(app)
        .post('/api/v1/categories')
        .set(authHeader())
        .send({ name_en: 'Test' });
      expect(res.statusCode).toBe(201);
    });

    it('rejects without name fields', async () => {
      const res = await request(app).post('/api/v1/categories').set(authHeader()).send({});
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/v1/categories/suggest', () => {
    it('returns suggestions for a query', async () => {
      prisma.category.findMany.mockResolvedValue([
        {
          id: 1,
          name_en: 'Restaurant',
          name_fr: 'Restaurant',
          name_ar: 'مطعم',
          name_es: 'Restaurante',
        },
      ]);
      const res = await request(app)
        .post('/api/v1/categories/suggest')
        .set(authHeader())
        .send({ q: 'rest' });
      expect(res.statusCode).toBe(200);
    });
  });
});

describe('Analytics Event Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('POST /api/v1/analytics/event', () => {
    it('creates an analytics event', async () => {
      prisma.analyticsEvent.create.mockResolvedValue({ id: 1, business_id: 1, event_type: 'view' });
      const res = await request(app)
        .post('/api/v1/analytics/event')
        .send({ businessId: 1, eventType: 'view' });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('rejects invalid body', async () => {
      const res = await request(app).post('/api/v1/analytics/event').send({});
      expect(res.statusCode).toBe(400);
    });
  });
});

describe('Admin Settings Routes', () => {
  const fs = require('fs');
  const path = require('path');
  const SETTINGS_PATH = path.join(__dirname, '..', 'modules', 'adminSettings', 'settings.json');
  let backup;

  beforeAll(() => {
    if (fs.existsSync(SETTINGS_PATH)) {
      backup = fs.readFileSync(SETTINGS_PATH, 'utf-8');
      fs.unlinkSync(SETTINGS_PATH);
    }
  });

  afterAll(() => {
    if (backup) fs.writeFileSync(SETTINGS_PATH, backup, 'utf-8');
    else if (fs.existsSync(SETTINGS_PATH)) fs.unlinkSync(SETTINGS_PATH);
  });

  describe('GET /api/v1/admin/settings', () => {
    it('returns default settings when no file', async () => {
      const res = await request(app).get('/api/v1/admin/settings').set(authHeader());
      expect(res.statusCode).toBe(200);
      expect(res.body.maintenanceMode).toBe(false);
      expect(res.body.serverHealth.status).toBe('healthy');
      expect(res.body.recentSessions[0].current).toBe(true);
    });

    it('normalizes legacy setting keys on update', async () => {
      const res = await request(app)
        .put('/api/v1/admin/settings')
        .set(authHeader())
        .send({
          maxPhotos: 15,
          moderationThreshold: 0.65,
          passwordRotation: 60,
          twoFactorEnabled: true,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.maxPhotosPerBusiness).toBe(15);
      expect(res.body.aiModerationThreshold).toBe(0.65);
      expect(res.body.passwordRotationDays).toBe(60);
      expect(res.body.twoFactorAuth).toBe(true);
      expect(res.body.maxPhotos).toBeUndefined();
    });
  });
});
