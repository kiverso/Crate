// App Imports
import params from '../../config/params'
import models from '../../setup/models'

// Get all products
export async function getAll() {
  return await models.Product.findAll({ order: [['id', 'DESC']] })
}

// Get product by slug
export async function getBySlug(parentValue, { slug }) {
  const product = await models.Product.findOne({ where: { slug } })

  if (!product) {
    // Product does not exists
    throw new Error('The product you are looking for does not exists or has been discontinued.')
  } else {
    return product
  }
}

// Get product by ID
export async function getById(parentValue, { productId }) {
  const product = await models.Product.findOne({ where: { id: productId } })

  if (!product) {
    // Product does not exists
    throw new Error('The product you are looking for does not exists or has been discontinued.')
  } else {
    return product
  }
}

// Get product if 'isSurvey: true' 
export async function getProductOnSurvey(parentValue, { productSurvey }) {
  const product = await models.Product.findAll({ where: { isSurvey: productSurvey } })

  if (!product) {
    // Product is not on survey
    throw new Error('This product is not on the survey.')
  } else {
    return product
  }
}

// Get related products
export async function getRelated(parentValue, { productId }) {
  const product = await models.Product.findOne({ where: productId })
  return await models.Product.findAll({
    where: {
      style: product.style,
      id: { [models.Sequelize.Op.not] : product.id }
    },
    limit: 3
  })
}

// Create product
export async function create(parentValue, { name, slug, description, type, gender, image }, { auth }) {
  if(auth.user && auth.user.role === params.user.roles.admin) {
    return await models.Product.create({
      name,
      slug,
      description,
      type,
      gender,
      image
    })
  } else {
    throw new Error('Operation denied.')
  }
}

// Update product
export async function update(parentValue, { id, name, slug, description, type, gender, image }, { auth }) {
  if(auth.user && auth.user.role === params.user.roles.admin) {
    return await models.Product.update(
      {
        name,
        slug,
        description,
        type,
        gender,
        image
      },
      { where: { id } }
    )
  } else {
    throw new Error('Operation denied.')
  }
}

// Delete product
export async function remove(parentValue, { id }, { auth }) {
  if(auth.user && auth.user.role === params.user.roles.admin) {
    const product = await models.Product.findOne({where: {id}})

    if (!product) {
      // Product does not exists
      throw new Error('The product does not exists.')
    } else {
      return await models.Product.destroy({where: {id}})
    }
  } else {
    throw new Error('Operation denied.')
  }
}

// Product types
export async function getTypes() {
  return Object.values(params.product.types)
}