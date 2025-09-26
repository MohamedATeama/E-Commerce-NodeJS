import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { Product } from "../modules/product/product.model.js";
import { Category } from "../modules/category/category.model.js";

const categoryType = new GraphQLObjectType({
  name: "categoryType",
  fields: {
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
  }
})

const productType = new GraphQLObjectType({
  name: "productType",
  fields: {
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    desc: { type: GraphQLString },
    price: { type: GraphQLFloat },
    category: {
      type: categoryType, resolve: (parent) => {
        return Category.findById(parent.category)
      }
    }
  }
})

const rootQuery = new GraphQLObjectType({
  name: 'rootQuery',
  fields: {
    products: {
      type: new GraphQLList(productType),
      resolve: async () => {
        const products = await Product.find();
        return products;
      }
    }
  }
})

const rootMutation = new GraphQLObjectType({
  name: "rootMutation",
  fields: {
    addCategory: {
      type: GraphQLString,
      args: { name: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: async (parent, args) => {
        await Category.create(args)
        return "success"
      }
    }
  }
})

export const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation
})