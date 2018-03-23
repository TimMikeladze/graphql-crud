import {
  Store,
  StoreCreateProps,
  StoreCreateReturn,
  StoreFindOneProps,
  StoreFindOneReturn,
  StoreFindProps,
  StoreFindReturn,
  StoreRemoveProps,
  StoreRemoveReturn,
  StoreUpdateProps,
  StoreUpdateReturn,
} from 'graphql-crud';
import { cloneDeep } from 'lodash';
import mongoist from 'mongoist';

export interface MongoStoreOptions {
  connection: string;
  options?: object;
}

export class MongoStore implements Store {
  public db;
  constructor(options: MongoStoreOptions) {
    this.db = mongoist(options.connection, options.options);
  }
  public async findOne(props: StoreFindOneProps): Promise<StoreFindOneReturn> {
    const res = await this.db[props.type.name].findOne(this.formatInput(props.where));
    return this.formatOutput(res);
  }
  public async find(props: StoreFindProps): Promise<[StoreFindReturn]> {
    const res = await this.db[props.type.name].find(this.formatInput(props.where));
    return this.formatOutput(res);
  }
  public async create(props: StoreCreateProps): Promise<StoreCreateReturn> {
    const res = await this.db[props.type.name].insert(props.data);
    return this.formatOutput(res);
  }
  public async update(props: StoreUpdateProps): Promise<StoreUpdateReturn> {
    const res = await this.db[props.type.name].update(
      this.formatInput(props.where),
      {
        $set: props.data,
      },
      {
        upsert: props.upsert,
      },
    );
    return res.n > 0;
  }
  public async remove(props: StoreRemoveProps): Promise<StoreRemoveReturn> {
    const res = await this.db[props.type.name].remove(
      this.formatInput(props.where),
    );
    return res.n > 0;
  }
  // Adds an `id` field to the output
  private formatOutput(object) {
    if (Array.isArray(object)) {
      return object.map((o) => this.formatOutput(o));
    }
    if (!object) {
      return null;
    }
    if (!object._id) {
      return object;
    }
    const clonedObject = cloneDeep(object);
    clonedObject.id = clonedObject._id;
    delete clonedObject._id;
    return clonedObject;
  }
  private formatInput(object) {
    if (!object) {
      return null;
    }
    if (!object.id) {
      return object;
    }
    const clonedObject = cloneDeep(object);
    clonedObject._id = mongoist.ObjectId(clonedObject.id);
    delete clonedObject.id;
    return clonedObject;
  }
}
