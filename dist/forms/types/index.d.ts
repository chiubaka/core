export interface IModelFormProps<T> {
    model: Partial<T>;
    onModelDetailsUpdate: (model: Partial<T>) => void;
}
export declare type ModelFormErrors<T> = {
    [P in keyof T]?: string;
};
