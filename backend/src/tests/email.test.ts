const { sendReviewEmail } = require("../services/email.service.js");

jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({})
  }))
}));

describe("Email Service", () => {
  it("should call sendMail without error", async () => {
    await expect(
      sendReviewEmail("test@mail.com", {
        businessName: "Test",
        rating: 5,
        content: "Allay3ti lmok Se7a <3"
      })
    ).resolves.not.toThrow();
  });
});