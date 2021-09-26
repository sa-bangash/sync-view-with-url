import { SyncParamControl } from './sync-param-control';

export interface ParamControlsManagerConfig<T = any> {
  controls: { [key: string]: SyncParamControl<T> };
}
