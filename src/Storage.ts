export interface StorageCreateProps {
  data: object;
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
  create(props: StorageCreateProps): Promise<object>;
  update(props: StorageUpdateProps): Promise<object>;
  upsert(props: StorageUpsertProps): Promise<object>;
  remove(props: StorageRemoveProps): Promise<object>;
}
