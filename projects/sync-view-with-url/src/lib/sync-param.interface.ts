export interface SyncParamControlConfig<T = any> {
  val: T;
  serialize?: (v: any) => any;
  deserialize?: (v: any) => any;
}
