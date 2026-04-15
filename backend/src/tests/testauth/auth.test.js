const { register, login, refreshToken } = require("../../modules/auth/auth.controller.js");

jest.mock("../../config/db.js", () => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn()
  }
}));

jest.mock("../../modules/auth/auth.service.js", () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn()
}));

jest.mock("../../utils/jwt.js", () => ({
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
  verifyRefreshToken: jest.fn()
}));

const prisma = require("../../config/db.js");
const { hashPassword, comparePassword } = require("../../modules/auth/auth.service.js");
const jwt = require("../../utils/jwt.js");

describe("Auth Controller", () => {
  it("register should create user", async () => {
    hashPassword.mockResolvedValue("hashed");
    prisma.user.create.mockResolvedValue({ id: 1 });
    const req = { body: { email: "test@test.com", password: "123", role: "USER" } };
    const res = { json: jest.fn() };
    await register(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it("login user not found", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const req = { body: { email: "x", password: "y" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("login wrong password", async () => {
    prisma.user.findUnique.mockResolvedValue({ password_hash: "hash" });
    comparePassword.mockResolvedValue(false);
    const req = { body: { email: "x", password: "y" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("refresh token invalid", async () => { jwt.verifyRefreshToken.mockImplementation(() => { throw new Error("invalid"); });
    const req = { body: { refreshToken: "bad" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await refreshToken(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

});