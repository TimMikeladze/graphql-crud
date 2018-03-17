import {
  Store,
  StoreCreateProps,
  StoreCreateReturn,
  StoreFindOneProps,
  StoreFindOneReturn,
  StoreFindProps,
} from 'graphql-model-directive';
import { cloneDeep } from 'lodash';
import mongoist from 'mongoist';

export interface MongoStoreOptions {
  connection: string;
  options?: object;
}

export class MongoStore implements Store {
  private db;
  constructor(options: MongoStoreOptions) {
    this.db = mongoist(options.connection, options.options);
  }
  public async findOne(props: StoreFindOneProps): Promise<StoreFindOneReturn> {
    const res = await this.db[props.type.name].findOne(this.formatInput(props.where));
    return this.formatOutput(res);
  }
  public async create(props: StoreCreateProps): Promise<StoreCreateReturn> {
    const res = await this.db[props.type.name].insert(props.data);
    return this.formatOutput(res);
  }
  // Adds an `id` field to the output
  private formatOutput(object) {
    if (!object) {
      return null;
    }
    if (!object._id) {
      return object;
    }
    const clonedObject = cloneDeep(object);
    const id = clonedObject._id;
    delete clonedObject._id;
    return {
      ...clonedObject,
      id,
    };
  }
  private formatInput(object) {
    if (!object.id) {
      return object;
    }
    const clonedObject = cloneDeep(object);
    // tslint:disable-next-line variable-name
    const _id = mongoist.ObjectId(clonedObject.id);
    delete clonedObject.id;
    return {
      ...clonedObject,
      _id,
    };
  }
}
