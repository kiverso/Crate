import request from 'supertest';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from '../../setup/schema';
import db from '../../setup/database';
import models from '../../setup/models'


describe('user mutations', () => {
  let server;
  beforeAll(() => {
    server = express();

    server.use(
      '/',
      graphqlHTTP({
        schema: schema,
        graphiql: false
      })
    )
  })

  it('can get related products', async () => {
    const product1 = await models.Product.create({
      name: "Rocker Boots",
      slug: "rocker-boots",
      description: "Rock n Roll",
      image: "/images/quiz/rocker-shoes1.png",
      style: "rocker",
      isSurvey: true,
      category: "shoes",
    })
    const product2 = await models.Product.create({
      name: "Rocker pants",
      slug: "rocker-pants",
      description: "Rock n Roll",
      image: "/images/quiz/rocker-shoes1.png",
      style: "rocker",
      isSurvey: true,
      category: "bottoms",
    })
    const product3 = await models.Product.create({
      name: "Rocker top",
      slug: "rocker-top",
      description: "Rock n Roll",
      image: "/images/quiz/rocker-shoes1.png",
      style: "rocker",
      isSurvey: true,
      category: "tops",
    })
    const product4 = await models.Product.create({
      name: "Rocker hoodie",
      slug: "rocker-hoodie",
      description: "Rock n Roll",
      image: "/images/quiz/rocker-shoes1.png",
      style: "rocker",
      isSurvey: true,
      category: "tops",
    })
    const product5 = await models.Product.create({
      name: "Rocker shoes",
      slug: "rocker-shoes",
      description: "Rock n Roll",
      image: "/images/quiz/rocker-shoes1.png",
      style: "rocker",
      isSurvey: true,
      category: "shoes",
    })
    const product6 = await models.Product.create({
      name: "Business top",
      slug: "business-top",
      description: "Rock n Roll",
      image: "/images/quiz/rocker-shoes1.png",
      style: "business",
      isSurvey: true,
      category: "tops",
    })
    const response = await request(server)
      .post('/')
      .send({
        query: `query { productsRelated(productId: ${product1.id}) { name }}`
      });
      // Checks to make sure there are 3 related products and they are the expected products 
      // from the test setup.
      // There are 4 other products with Rocker style, only 3 should show up
      // Products with style other than Rocker (product6) should not show up.
    expect(response.body.data.productsRelated.length).toEqual(3)
    expect(response.body.data.productsRelated[0].name).toEqual('Rocker pants')
    expect(response.body.data.productsRelated[1].name).toEqual('Rocker top')
    expect(response.body.data.productsRelated[2].name).toEqual('Rocker hoodie')

    // The below code destroys all the Products in the products table so
    // the other tests won't be impacted.
    await models.Product.destroy({ where: {} }).then(function () { });
  })

  it('can be empty if no related products', async () => {
    // makes product with a unique style attribute, should have no related products
    const uniqueProduct = await models.Product.create({
      name: "Unique Boots",
      slug: "rocker-boots",
      description: "Rock n Roll",
      image: "/images/quiz/rocker-shoes1.png",
      style: "unique",
      isSurvey: true,
      category: "shoes",
    })
    const rockerProduct = await models.Product.create({
      name: "Rocker Boots",
      slug: "rocker-boots",
      description: "Rock n Roll",
      image: "/images/quiz/rocker-shoes1.png",
      style: "rocker",
      isSurvey: true,
      category: "shoes",
    })

    const response = await request(server)
      .post('/')
      .send({
        query: `query { productsRelated(productId: ${uniqueProduct.id}) { name }}`
      });
      // Checks to make sure related products is an empty array
    expect(response.body.data.productsRelated).toEqual([])

    await models.Product.destroy({ where: {} }).then(function () { });
  })
})