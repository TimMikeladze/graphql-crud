import { GraphQLNamedType } from 'graphql';

export interface StoreFindProps {
  data: object;
  where: object;
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
  where?: object;
}

export interface StoreUpsertProps {
  data: object;
  where?: object;
}

export interface StoreRemoveProps {
  where: object;
}

export interface Store {
  find(props: StoreFindProps): Promise<object>;
  findOne(props: StoreFindOneProps): Promise<StoreFindOneReturn>;
  create(props: StoreCreateProps): Promise<StoreCreateReturn>;
  update(props: StoreUpdateProps): Promise<object>;
  upsert(props: StoreUpsertProps): Promise<object>;
  remove(props: StoreRemoveProps): Promise<object>;
}
