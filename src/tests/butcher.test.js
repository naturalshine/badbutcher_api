const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const fsPromises = require('fs').promises;
const sharp = require("sharp");
//const fs = require('fs');

require("dotenv").config();

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

/* Dropping the database and closing connection after each test. */
afterEach(async () => {
  // await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

/* Testing the API endpoints. */
describe("POST /api/slaughtered", () => {
    it("should create a slaughtered", async () => {
      const res = await request(app).post("/api/slaughtered").send({
        name: "name",
        description: "description",
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe("name");
    });
  });
  
describe("GET /api/slaughtered", () => {
  it("should return all slaughtered", async () => {
    const res = await request(app).get("/api/slaughtered");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("GET /api/slaughtered/:id", () => {
  it("should return a slaughtered", async () => {
    const res1 = await request(app).post("/api/slaughtered").send({
      name: "getName",
      description: "getDesc"
    });
    const getId = res1.body._id;
    const res = await request(app).get(
      "/api/slaughtered/" + getId
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("getName");
  });
});


describe("PUT /api/slaughtered/:id", () => {
  it("should update a slaughtered", async () => {
    const res1 = await request(app).post("/api/slaughtered").send({
      name: "imgchange",
      description: "imgchangedesc"
    });
    const changeId = res1.body._id;
    const res = await request(app)
      .patch("/api/slaughtered/" + changeId)
      .send({
        name: "changedName",
        description: "changedText",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe("changedText");
  });
});

describe("DELETE /api/slaughtered/:id", () => {
  it("should delete a slaughtered", async () => {
    const res1 = await request(app).post("/api/slaughtered").send({
      name: "delName",
      description: "delDesc"
    });
    const delId = res1.body._id;
    const res = await request(app).delete(
      "/api/slaughtered/" + delId
    );
    expect(res.statusCode).toBe(200);
  });
});

describe("BUTCHER /api/butcher", () => {
    it("it should butcher", async () => {
        //img = jest.mock('../scripts/butcherpy/src_img/001.png')
        //const img = await fsPromises.readFile(path.resolve(__dirname, './001.png'));
        //const img = fs.readFileSync(path.resolve(__dirname, './001.png'));
        const img = '';
        const metadata = [
          {
           'name': 'BAD BUTCHER 002',
           'description': 'A BUTCHER IS BAD',
           'attributes': [
              { 'trait_type': 'project',
                'value': 'BADBUTCHER'
              },
              { 'trait_type': 'butcheredContract',
                'value': '0x0000'
              },
              { 'trait_type': 'butcheredTokenId',
                'value': '13'
              },
              { 'trait_type': 'butcheredChain',
              'value': 'ETH'
              },
              { 'trait_type': 'butcheredName',
              'value': 'Dumb Thing'
              },
              { 'trait_type': 'butcheredProject',
                'value': 'Dumb Things'
              },
              { 'trait_type': 'butcheredOwner',
              'value': '0x7809E6d27473A26a0eFc3D90F38b2e3d3b086D24'
              },
              { 'trait_type': 'butcheredSymbol',
              'value': 'DMBTHNG'
              },
              { 'trait_type': 'butcheredRoyaltyHolder',
                'value': '0x7809E6d27473A26a0eFc3D90F38b2e3d3b086D24'
              },
              { 'trait_type': 'butcheredRoyalty',
                'value': 30.0
              },
              { 'trait_type': 'butcheredImageUrl',
                'value': 'URL'
              },
              { 'trait_type': 'butcheredMetadataUrl',
                'value': 'URL'
              },
              { 
                'trait_type': 'butcherMinter',
                'value': '0x91Aa0e1b1B553a0441B03E1FE100609dDA4a2119'
              }
            ]
          }
        ]
        const res = await request(app).post("/api/butcher").send({
          image: img,
          metadata: metadata,
        });
        console.log("BODY =>", res.body);
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe("BAD BUTCHER 002");
      });
  });


