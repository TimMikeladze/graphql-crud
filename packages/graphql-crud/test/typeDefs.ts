export default `
type Author @model {
  name: String
  books: [Book]
  favoriteBook: Book
}

type Book @model {
  name: String
  authors: [Author]
}

type Query {
  _: Boolean
}

type Mutation {
  _: Boolean
}
`;
