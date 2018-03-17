import { GraphQLNamedType } from 'graphql';

export interface StoreFindProps {
  where: object;
  type: GraphQLNamedType;
}

export interface StoreFindReturn {
  id: string;
  [key: string]: any;
}

export interface StoreFindOneProps {
  where: object;
  type: GraphQLNamedType;
}

export interface StoreFindOneReturn {
  id: string;
  [key: string]: any;
}

export interface StoreCreateProps {
  data: object;
  type: GraphQLNamedType;
}

export interface StoreCreateReturn {
  id: string;
  [key: string]: any;
}

export interface StoreUpdateProps {
  data: object;
  type: GraphQLNamedType;
  where?: object;
  upsert?: boolean;
}

export type StoreUpdateReturn = boolean;

export interface StoreUpsertProps {
  data: object;
  where?: object;
  type: GraphQLNamedType;
}

export type StoreUpsertReturn = boolean;

export interface StoreRemoveProps {
  where: object;
  type: GraphQLNamedType;
}

export interface Store {
  find(props: StoreFindProps): Promise<[StoreFindReturn]>;
  findOne(props: StoreFindOneProps): Promise<StoreFindOneReturn>;
  create(props: StoreCreateProps): Promise<StoreCreateReturn>;
  update(props: StoreUpdateProps): Promise<StoreUpdateReturn>;
  remove(props: StoreRemoveProps): Promise<object>;
}
