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
      .get("/api/v1/gateways/63543c9c35ba103f7dcc4738")
      .send();
    expect(response.statusCode).toBe(200);
  });

  test("should respond an object", async () => {
    const response = await request(app)
      .get("/api/v1/gateways/63543c9c35ba103f7dcc4738")
      .send();
    expect(response.body).toBeInstanceOf(Object);
  });

  test("should respond with a 404 status code", async () => {
    const response = await request(app)
      .get("/api/v1/gateways/63541a766a4966909f491a45")
      .send();
    expect(response.statusCode).toBe(404);
  });
});

/** Testing Create a Gateway */
describe("POST /api/gateways", () => {
  describe("given a serialNumber, address and gatewayName", () => {
    const gateway = {
      serialNumber: "sometitleb1",
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
        { peripheralDevice: [] },
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
  test("should respond with a 200 status code", async () => {
    const response = await request(app)
      .get("/api/v1/gateways/63543c9c35ba103f7dcc4738")
      .send();
    expect(response.statusCode).toBe(200);
  });

  test("should respond with a 404 status code", async () => {
    const response = await request(app)
      .get("/api/v1/gateways/63541a766a4966909f491a45")
      .send();
    expect(response.statusCode).toBe(404);
  });
});

/** Testing Delete a Gateway */
describe("DELETE /api/v1/gateways/:id", () => {
  test("should respond with a 200 status code", async () => {
    const response = await request(app)
      .delete("/api/v1/gateways/63543c9c35ba103f7dcc4738")
      .send();
    expect(response.statusCode).toBe(200);
  });

  test("should respond with a 404 status code", async () => {
    const response = await request(app)
      .get("/api/v1/gateways/634eb43b770654e867eaa300")
      .send();
    expect(response.statusCode).toBe(404);
  });
});

/*******  Testing Peripheral Devices  */

/** Testing Get All Peripheral Devices */
describe("GET /api/v1/peripherals", () => {
  test("should respond with a 200 status code", async () => {
    const response = await request(app).get("/api/v1/peripherals").send();
    expect(response.statusCode).toBe(200);
  });

  test("should respond an Object", async () => {
    const response = await request(app).get("/api/v1/peripherals").send();
    expect(response.body).toBeInstanceOf(Object);
  });
});

/** Testing Get Single Peripheral */
describe("GET /api/v1/peripherals/:id", () => {
  test("should respond with a 200 status code", async () => {
    const response = await request(app)
      .get("/api/v1/peripherals/6354aabc79cb2729c8e69941")
      .send();
    expect(response.statusCode).toBe(200);
  });

  test("should respond an object", async () => {
    const response = await request(app)
      .get("/api/v1/peripherals/6354aabc79cb2729c8e69941")
      .send();
    expect(response.body).toBeInstanceOf(Object);
  });

  test("should respond with a 404 status code", async () => {
    const response = await request(app)
      .get("/api/v1/peripherals/63541a766a4966909f491a45")
      .send();
    expect(response.statusCode).toBe(404);
  });
});

/** Testing Create a Peripheral Device */
describe("POST /api/v1/peripherals", () => {
  describe("given a uid, vendor, status, date and gateway", () => {
    const peripheralDevice = {
      uid: 428756985,
      vendor: "sder23423",
      status: "offline",
      date: Date.now,
    };

    // should respond with a 201 code
    test("should respond with a 201 status code", async () => {
      const response = await request(app)
        .post("/api/v1/peripherals")
        .send(peripheralDevice);
      expect(response.statusCode).toBe(201);
    });

    // should respond a json as a content type
    test("should have a Content-Type: application/json header", async () => {
      const response = await request(app)
        .post("/api/v1/peripherals")
        .send(peripheralDevice);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
  describe("when the uid, vendor, status, date and gateway are missing", () => {
    // should respond with a 400 code
    test("shoud respond with a 400 status code", async () => {
      const fields = [
        { uid: 428756985 },
        { vendor: "sder23423" },
        { status: "offline" },
        { date: Date.now },
      ];

      for (const body of fields) {
        const response = await request(app)
          .post("/api/v1/peripherals")
          .send(body);
        expect(response.statusCode).toBe(400);
      }
    });
  });
});

/** Testing Update a Peripheral */
describe("PUT /api/v1/peripherals/:id", () => {
  test("should respond with a 404 status code", async () => {
    const response = await request(app)
      .get("/api/v1/peripherals/6354aabc79cb2729c8e69945")
      .send();
    expect(response.statusCode).toBe(404);
  });

  test("should respond with a 200 status code", async () => {
    const response = await request(app)
      .get("/api/v1/peripherals/6354aabc79cb2729c8e69941")
      .send({
        uid: 428756985,
        vendor: "sder23423",
        status: "offline",
        gateway: null,
        date: Date.now,
      });
    expect(response.statusCode).toBe(200);
  });
});

/** Testing Delete a Peripheral */
describe("DELETE /api/v1/peripherals/:id", () => {
  test("should respond with a 404 status code", async () => {
    const response = await request(app)
      .get("/api/v1/peripherals/63541a766a4966909f491a00")
      .send();
    expect(response.statusCode).toBe(404);
  });

  test("should respond with a 200 status code", async () => {
    const response = await request(app)
      .delete("/api/v1/peripherals/6354aabc79cb2729c8e69941")
      .send();
    expect(response.statusCode).toBe(200);
  });
});
