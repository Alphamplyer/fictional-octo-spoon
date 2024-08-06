export interface IUseCase<TParams, TResponse> {
  execute(params: TParams): Promise<TResponse>;
}

export interface INoParamsUseCase<TResponse> {
  execute(): Promise<TResponse>;
}

export interface INoResponseUseCase<TParams> {
  execute(params: TParams): Promise<void>;
}

export interface IExecutableUseCase {
  execute(): Promise<void>;
}
