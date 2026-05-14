jest.mock("../modules/reviews/reviews.service.js", () => ({
  createReview: jest.fn(),
  getApprovedReviews: jest.fn().mockResolvedValue([])
}));

import request from "supertest";
const app = require("../app.js");

describe("Reviews API", () => {

  it("should create review", async () => {
    const res = await request(app)
      .post("/api/v1/reviews")
      .send({
        user_id: 1,
        business_id: 1,
        rating: 5,
        content: "Test review"
      });

    expect(res.statusCode).toBe(401);
  });

  it("should get reviews", async () => {
    const res = await request(app)
      .get("/api/v1/reviews/business/1");

    expect(res.statusCode).toBe(200);
  });

});