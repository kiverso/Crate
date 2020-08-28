import request from 'supertest'
import express from 'express'
import schema from '../../setup/schema'
import graphqlHTTP from 'express-graphql'
import models from "../../setup/models";
const params = require("../../config/params");

describe('product query', () => {
  let server = express();

  beforeAll(async () => {
    server.use(
      "/",
      graphqlHTTP({
        schema: schema,
        graphiql: false,
      })
    );
    await models.Product.destroy({ where: {} });
  });

  beforeEach(async () => {
    const product1 = {
      name: "Soup Shirt",
      id: 1,
      slug: "soup-shirt",
      description: "Chicken noodle soup",
      type: params.product.types.cloth.id,
      gender: params.user.gender.female.id,
      image: "/images/quiz/artsy-top2.png",
      style: "artsy",
      isSurvey: true,
      category: "top",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const product2 = {
      name: "Bohemian Pants",
      slug: "bohemian-pants",
      description: "Super comfy for those Coachella shows",
      type: params.product.types.cloth.id,
      gender: params.user.gender.male.id,
      image: "/images/quiz/bohemian-bottom1.png",
      style: "bohemian",
      isSurvey: true,
      category: "bottoms",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const product3 = {
      name: "Colorblock Shoes",
      slug: "colorblock-shoes",
      description: "Let your feet be bold",
      type: params.product.types.cloth.id,
      gender: params.user.gender.female.id,
      image: "/images/quiz/bohemian-shoes1.png",
      style: "bohemian",
      isSurvey: true,
      category: "shoes",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const product4 = {
      name: "Rainbow Shoes",
      slug: "rainbow-shoes",
      description: "Let your feet be bold",
      type: params.product.types.cloth.id,
      gender: params.user.gender.female.id,
      image: "/images/quiz/bohemian-shoes1.png",
      style: "bohemian",
      isSurvey: false,
      category: "shoes",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const product5 = {
      name: "Colorblock Top",
      slug: "colorblock-top",
      description: "Let your feet be bold",
      type: params.product.types.cloth.id,
      gender: params.user.gender.female.id,
      image: "/images/quiz/bohemian-shoes1.png",
      style: "bohemian",
      isSurvey: false,
      category: "shoes",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await models.Product.create(product1);
    await models.Product.create(product2);
    await models.Product.create(product3);
    await models.Product.create(product4);
    await models.Product.create(product5);

  });

  afterEach(async () => {
    await models.Product.destroy({ where: {} });
  });

  afterAll(() => {
    db.close();
  });

  it("is true", () => {
    expect(true).toBe(true)
  })

  it("returns products with isSurvey: false", async () => {
    const response = await request(server)
    .get('/')
    .send({
      query: `{productSurveyTrue(productSurvey: false){
      name
      id
      isSurvey
      }}`
    })
    .expect(200)

    expect(response.body.data.productSurveyTrue.length).toEqual(2)
  })

  it("returns products with isSurvey: true", async () => {
    const response = await request(server)
      .get('/')
      .send({
        query: `{productSurveyTrue(productSurvey: true){
      name
      id
      isSurvey
      }}`
      })
      .expect(200)

    expect(response.body.data.productSurveyTrue.length).toEqual(3)
  })

  it("returns all products", async () => {
    const response = await request(server)
      .get("/")
      .send({ query: '{products {name id style category}}' })
  
    expect(response.body.data.products.length).toEqual(5);
    expect(response.body.data.products[0].name).toEqual("Colorblock Top");
    expect(response.body.data.products[4].name).toEqual("Soup Shirt");
  });

  it("returns a product by id", async() => {
    const response = await request(server)
      .get("/")
      .send({ query: "{productById (productId: 1) {id name style}}" });

    expect(response.body.data.productById.name).toEqual("Soup Shirt");
    expect(response.body.data.productById.id).toEqual(1);
    expect(response.body.data.productById.style).toEqual("artsy");
  })

  it("returns a product by slug", async () => {
    const response = await request(server)
      .get('/')
      .send({ query: '{product (slug: "rainbow-shoes") {name slug}}'});
   
    expect(response.body.data.product.name).toEqual("Rainbow Shoes");
    expect(response.body.data.product.slug).toEqual("rainbow-shoes");
  })

  it("returns a product by type", async () => {
    const response = await request(server)
      .get("/")
      .send({ query: "{productTypes  {name}}" })

    expect(response.body.data.productTypes.length).toEqual(2);
    expect(response.body.data.productTypes[0].name).toEqual("Cloth");
    expect(response.body.data.productTypes[1].name).toEqual("Accessories");
  })

  it("returns a related product", async () => {
    const response = await request(server)
      .get("/")
      .send({ query: "{productsRelated (productId: 123) { name type id }}" })

    expect(response.body.data.productsRelated).toEqual(null);
  })
})