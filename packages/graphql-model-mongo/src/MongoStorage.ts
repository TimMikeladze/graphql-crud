import {
  Storage,
  StorageCreateProps,
  StorageCreateReturn,
  StorageFindOneProps,
  StorageFindOneReturn,
  StorageFindProps,
} from 'graphql-model-directive';
import mongoist from 'mongoist';

export interface MongoStorageOptions {
  connection: string;
  options?: object;
}

export class MongoStorage implements Storage {
  private db;
  constructor(options: MongoStorageOptions) {
    this.db = mongoist(options.connection, options.options);
  }
  public async findOne(props: StorageFindOneProps): Promise<StorageFindOneReturn> {
    const res = await this.db[props.type.name].findOne(this.formatInput(props.where));
    return this.formatOutput(res);
  }
  public async create(props: StorageCreateProps): Promise<StorageCreateReturn> {
    const res = await this.db[props.type.name].insert(props.data);
    return this.formatOutput(res);
  }
  // Adds an `id` field to the output
  private formatOutput(object) {
    if (!object) {
      return null;
    }
    const id = object._id;
    delete object._id;
    return {
      ...object,
      id,
    };
  }
  private formatInput(object) {
    // tslint:disable-next-line variable-name
    const _id = object.id;
    delete object.id;
    return {
      ...object,
      _id,
    };
  }
}
