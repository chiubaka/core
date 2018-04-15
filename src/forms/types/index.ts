export interface IModelFormProps<T> {
  model: Partial<T>;
  onModelDetailsUpdate: (model: Partial<T>) => void;
}
