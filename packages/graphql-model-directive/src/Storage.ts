export interface StorageFindProps {
  data: object;
  where: object;
}

export interface StorageFindOneProps {
  data: object;
  where: object;
}

export interface StorageFindOneReturn {
  id: string;
  [key: string]: any;
}

export interface StorageCreateProps {
  data: object;
}

export interface StorageCreateReturn {
  id: string;
  [key: string]: any;
}

export interface StorageUpdateProps {
  data: object;
  where?: object;
}

export interface StorageUpsertProps {
  data: object;
  where?: object;
}

export interface StorageRemoveProps {
  where: object;
}

export interface Storage {
  find(props: StorageFindProps): Promise<object>;
  findOne(props: StorageFindOneProps): Promise<StorageFindOneProps>;
  create(props: StorageCreateProps): Promise<StorageCreateReturn>;
  update(props: StorageUpdateProps): Promise<object>;
  upsert(props: StorageUpsertProps): Promise<object>;
  remove(props: StorageRemoveProps): Promise<object>;
}
