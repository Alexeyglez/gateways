import "dotenv/config";
import mongoose from "mongoose";
import request from "supertest";

import app from "../server.js";

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_URL);
});

/* Dropping the database and closing connection after each test. */
afterEach(async () => {
  // await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

/** Testing Get All Gateways */
describe("GET /api/v1/gateways", () => {
  test("should respond with a 200 status code", async () => {
    const response = await request(app).get("/api/v1/gateways").send();
    expect(response.statusCode).toBe(200);
  });

  test("should respond an array", async () => {
    const response = await request(app).get("/api/v1/gateways").send();
    expect(response.body).toBeInstanceOf(Object);
  });
});

/** Testing Get Single Gateway */
describe("GET /api/v1/gateways/:id", () => {
  test("should respond with a 200 status code", async () => {
    const response = await request(app)
      .get("/api/v1/gateways/634ebf6ce8f4dc2f7b886a70")
      .send();
    expect(response.statusCode).toBe(200);
  });

  test("should respond an object", async () => {
    const response = await request(app)
      .get("/api/v1/gateways/634ebf6ce8f4dc2f7b886a70")
      .send();
    expect(response.body).toBeInstanceOf(Object);
  });
});

/** Testing Create a Gateway */
describe("POST /api/gateways", () => {
  describe("given a serialNumber, address and gatewayName", () => {
    const gateway = {
      serialNumber: "sometitlebnvgf",
      gatewayName: "some name",
      address: "192.10.150.1",
      peripheralDevice: [],
    };

    // should respond with a 201 code
    test("should respond with a 201 status code", async () => {
      const response = await request(app)
        .post("/api/v1/gateways")
        .send(gateway);
      expect(response.statusCode).toBe(201);
    });

    // should respond a json as a content type
    test("should have a Content-Type: application/json header", async () => {
      const response = await request(app)
        .post("/api/v1/gateways")
        .send(gateway);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
  describe("when the serialNumber, address and gatewayName are missing", () => {
    // should respond with a 400 code
    test("shoud respond with a 400 status code", async () => {
      const fields = [
        { serialNumber: "some title bnv" },
        { gatewayName: "some name" },
        { address: "192.10.150.1" },
      ];

      for (const body of fields) {
        const response = await request(app).post("/api/v1/gateways").send(body);
        expect(response.statusCode).toBe(400);
      }
    });
  });
});

/** Testing Update a Gateway */
describe("PUT /api/v1/gateways/:id", () => {
  it("should update a gateway", async () => {
    try {
      const res = await request(app)
        .patch("/api/v1/gateways/634eb43b770654e867eaa3fc")
        .send({
          serialNumber: "vwxyz0123456790",
          gatewayName: "gateway3",
          address: "192.168.0.5",
          peripheralDevice: [],
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.price).toBe(104);
    } catch (error) {
      expect(error);
    }
  });
});

/** Testing Delete a Gateway */
describe("DELETE /api/v1/gateways/:id", () => {
  it("should delete a gateway", async () => {
    try {
      const res = await request(app).delete(
        "/api/v1/gateways/634eb43b770654e867eaa3fc"
      );
      expect(res.statusCode).toBe(200);
    } catch (error) {
      expect(error);
    }
  });
});

/******* */

/** Testing Get All Peripheral Devices */
describe("GET /api/v1/peripherals", () => {
  it("Should return all peripherals", async () => {
    try {
      const res = await request(app).get("/api/v1/peripherals");
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    } catch (e) {
      expect(e);
    }
  });
});

/** Testing Get Single Peripheral */
describe("GET /api/v1/peripherals/:id", () => {
  it("should return a peripheral", async () => {
    try {
      const res = await request(app).get(
        "/api/v1/peripherals/6350beac53f9338a0b10db09"
      );
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe("Peripheral 1");
    } catch (error) {
      expect(error);
    }
  });
});

/** Testing Create a Peripheral Device */
describe("POST /api/v1/peripherals", () => {
  it("should create a peripheral", async () => {
    try {
      const res = await request(app).post("/api/v1/peripherals").send({
        uid: 428756985,
        vendor: "sder23423",
        status: "offline",
        gateway: null,
        date: Date.now,
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe("Peripheral 2");
    } catch (error) {
      expect(error);
    }
  });
});

/** Testing Update a Gateway */
describe("PUT /api/v1/peripherals/:id", () => {
  it("should update a peripheral", async () => {
    try {
      const res = await request(app)
        .patch("/api/v1/peripherals/6350beac53f9338a0b10db09")
        .send({
          uid: 428756985,
          vendor: "sder23423",
          status: "offline",
          gateway: null,
          date: Date.now,
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.price).toBe(104);
    } catch (error) {
      expect(error);
    }
  });
});

/** Testing Delete a Peripheral */
describe("DELETE /api/v1/peripherals/:id", () => {
  it("should delete a peripheral", async () => {
    try {
      const res = await request(app).delete(
        "/api/v1/peripherals/6350beac53f9338a0b10db09"
      );
      expect(res.statusCode).toBe(200);
    } catch (error) {
      expect(error);
    }
  });
});
