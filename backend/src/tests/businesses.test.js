const request = require("supertest");
const app = require("../app");

jest.mock("../config/db.js", () => ({
  business: { findMany: jest.fn() },
  $queryRaw: jest.fn()
}));

const prisma = require("../config/db.js");

describe("Businesses Routes", () => {
  it("GET /businesses should return list", async () => {
    prisma.business.findMany.mockResolvedValue([{ id: 1, name: "Test" }]);
    const res = await request(app).get("/api/v1/businesses");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(-1);
  });

  it("GET /businesses/search should filter", async () => {
    prisma.business.findMany.mockResolvedValue([{ name: "Cafe" }]);
    const res = await request(app).get("/api/v1/businesses/search?q=cafe");
    expect(res.statusCode).toBe(200);
  });

  it("GET /businesses/near invalid params", async () => {
    const res = await request(app).get("/api/v1/businesses/near?lat=a&lng=b&distance=c");
    expect(res.statusCode).toBe(400);
  });

  it("GET /businesses/near success", async () => {
    prisma.$queryRaw.mockResolvedValue([{ id: 1 }]);
    const res = await request(app).get("/api/v1/businesses/near?lat=34&lng=-5&distance=10");
    expect(res.statusCode).toBe(200);
  });

});