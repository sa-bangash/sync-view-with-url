import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SyncParamControlConfig } from './sync-param.interface';

export class SyncParamControl<T = any> {
  private valueSource: BehaviorSubject<T>;
  public value$: Observable<T>;

  public serializeValue$: Observable<T>;
  public deserializeValue$: Observable<T>;

  serialize = (v: any) => v;
  deserialize = (v: any) => v;

  constructor({ val, serialize, deserialize }: SyncParamControlConfig<T>) {
    this.valueSource = new BehaviorSubject<T>(val);
    if (serialize) {
      this.serialize = serialize;
    }
    if (deserialize) {
      this.deserialize = deserialize;
    }
    this.value$ = this.valueSource.asObservable();
    this.serializeValue$ = this.value$.pipe(map((val) => this.serialize(val)));

    this.deserializeValue$ = this.value$.pipe(
      map((val) => this.deserialize(val))
    );
  }

  setValue(value: T) {
    this.valueSource.next(value);
  }

  getValue() {
    return this.valueSource.getValue();
  }

  getDeserializeValue() {
    return this.deserialize(this.getValue());
  }

  setAsSerializeValue(val: T) {
    this.setValue(this.deserialize(val));
  }
}
