export default `
type Role @model{
  key: String!
  title: String!
  description: String
  users: [User]
  userGroups: [UserGroup]
}

type UserGroup @model {
  title: String!
  description: String
  users: [User]
  userRoles: [Role]
}

type User @model {
  username: String @unique
  userGroups: [UserGroup]
  userRoles: [Role]
}

type Query {
  _: Boolean
}

type Mutation {
  _: Boolean
}
`;
