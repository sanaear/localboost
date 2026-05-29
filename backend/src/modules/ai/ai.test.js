const request = require("supertest");
const app = require("../../app.js");

// Mock Prisma pour les tests
jest.mock("../../config/db.js", () => ({
  business: {
    findMany: jest.fn()
  }
}));

const prisma = require("../../config/db.js");

// Data de test
const mockBusinesses = [
  {
    id: 1,
    name: "Café Clock",
    city: "Fès",
    description: "Café culturel avec cuisine végétarienne",
    category: { name_fr: "Restaurant", name_en: "Restaurant", name_ar: "مطعم" },
    lat: 34.0631,
    lng: -5.0009,
    images: [],
    reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }]
  },
  {
    id: 2,
    name: "The Ruined Garden",
    city: "Fès",
    description: "Restaurant dans un riad historique",
    category: { name_fr: "Restaurant", name_en: "Restaurant", name_ar: "مطعم" },
    lat: 34.0641,
    lng: -5.0019,
    images: [],
    reviews: [{ rating: 4 }, { rating: 5 }]
  }
];

beforeEach(() => {
  prisma.business.findMany.mockResolvedValue(mockBusinesses);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("AI Module - Health Check", () => {
  it("GET /api/v1/ai/health → 200 + status operational", async () => {
    const res = await request(app).get("/api/v1/ai/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe("operational");
    expect(res.body.service).toBe("LocalBoost AI");
  });
});

describe("AI Module - Chat", () => {
  it("POST /api/v1/ai/chat → 200 avec réponse valide", async () => {
    const res = await request(app)
      .post("/api/v1/ai/chat")
      .send({ message: "Je cherche un restaurant végétarien à Fès avec un budget de 150 MAD" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("text");
    expect(res.body.data).toHaveProperty("suggestions");
    expect(Array.isArray(res.body.data.suggestions)).toBe(true);
  });

  it("POST /api/v1/ai/chat → 400 si message vide", async () => {
    const res = await request(app)
      .post("/api/v1/ai/chat")
      .send({ message: "" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /api/v1/ai/chat → 400 si message absent", async () => {
    const res = await request(app)
      .post("/api/v1/ai/chat")
      .send({});

    expect(res.status).toBe(400);
  });

  it("POST /api/v1/ai/chat → parse correctement la ville et catégorie", async () => {
    const res = await request(app)
      .post("/api/v1/ai/chat")
      .send({ message: "restaurant halal à Marrakech" });

    expect(res.status).toBe(200);
    expect(res.body.data.intent.halal).toBe(true);
  });

  it("POST /api/v1/ai/chat → 400 si message > 500 caractères", async () => {
    const longMsg = "a".repeat(501);
    const res = await request(app)
      .post("/api/v1/ai/chat")
      .send({ message: longMsg });

    expect(res.status).toBe(400);
  });
});

describe("AI Module - Recommandations", () => {
  it("GET /api/v1/ai/recommend → 200 avec liste de businesses", async () => {
    const res = await request(app)
      .get("/api/v1/ai/recommend")
      .query({ city: "Fès", category: "restaurant" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty("count");
  });

  it("GET /api/v1/ai/recommend → retourne avgRating calculé", async () => {
    const res = await request(app)
      .get("/api/v1/ai/recommend")
      .query({ city: "Fès" });

    expect(res.status).toBe(200);
    if (res.body.data.length > 0) {
      expect(res.body.data[0]).toHaveProperty("avgRating");
      expect(res.body.data[0]).toHaveProperty("reviewCount");
    }
  });
});

describe("AI Module - Itinéraire", () => {
  it("POST /api/v1/ai/itinerary → 200 avec steps", async () => {
    const res = await request(app)
      .post("/api/v1/ai/itinerary")
      .send({ city: "Fès" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("steps");
    expect(Array.isArray(res.body.data.steps)).toBe(true);
  });

  it("POST /api/v1/ai/itinerary → 400 si ville absente", async () => {
    const res = await request(app)
      .post("/api/v1/ai/itinerary")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /api/v1/ai/itinerary → chaque step a un business avec name", async () => {
    const res = await request(app)
      .post("/api/v1/ai/itinerary")
      .send({ city: "Fès" });

    expect(res.status).toBe(200);
    for (const step of res.body.data.steps) {
      expect(step).toHaveProperty("business");
      expect(step.business).toHaveProperty("name");
      expect(step).toHaveProperty("time");
    }
  });
});