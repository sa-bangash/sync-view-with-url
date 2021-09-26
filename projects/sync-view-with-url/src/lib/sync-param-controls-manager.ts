import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { merge, Observable, Subject } from 'rxjs';
import { auditTime, filter, map, takeUntil, tap } from 'rxjs/operators';
import { SyncParamControl } from './sync-param-control';
import { ParamControlsManagerConfig } from './sync-param-controls-manager.interface';

export class SyncParamControlsManager {
  private destroy$ = new Subject();
  constructor(
    private confg: ParamControlsManagerConfig,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.watchOnChange();
    let shouldTrigger = false;

    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((i) => {
          if (
            i instanceof NavigationStart &&
            i.navigationTrigger === 'popstate'
          ) {
            shouldTrigger = true;
            return false;
          }
          if (i instanceof NavigationEnd && shouldTrigger) {
            shouldTrigger = false;
            return true;
          }
          return false;
        })
      )
      .subscribe((event) => {
        const param = this.route.snapshot.queryParams;
        this.updateControls(param);
      });
  }

  private get controls(): { [key: string]: SyncParamControl } {
    return this.confg.controls;
  }
  private watchOnChange() {
    const controls = Object.keys(this.controls).map((key) => {
      return this.controls[key].serializeValue$.pipe(
        map((resp) => {
          return {
            [key]: resp,
          };
        })
      );
    });
    let buffer: Record<string, any> = {};
    merge(...controls)
      .pipe(
        takeUntil(this.destroy$),
        map((resp: Record<string, any>) => {
          return (buffer = { ...buffer, ...resp });
        }),
        auditTime(0)
      )
      .subscribe(() => {
        this.updateUrl(buffer);
        buffer = {};
      });
  }

  updateUrl(paramData: Record<string, any>) {
    console.log('update url', paramData);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: paramData,
      queryParamsHandling: 'merge',
      replaceUrl: false,
    });
  }

  getDeserializeValue(): Record<string, any> {
    const controls = this.confg.controls;
    return Object.keys(controls).reduce((acc, key) => {
      return {
        ...acc,
        [key]: controls[key].getDeserializeValue(),
      };
    }, {});
  }

  get deserialize$(): Observable<Record<string, any>> {
    const controls = Object.keys(this.controls).map((key) =>
      this.controls[key].deserializeValue$.pipe(
        map((resp) => {
          return {
            [key]: resp,
          };
        })
      )
    );
    let buffer: Record<string, any> = {};
    return merge(...controls).pipe(
      map((resp: Record<string, any>) => {
        return this.getDeserializeValue();
      })
    );
  }
  get(key: string): SyncParamControl<any> {
    return this.confg.controls[key];
  }

  updateControls(param: Record<string, any>) {
    console.log('update control', param);
    Object.keys(this.controls).forEach((key) => {
      this.controls[key].setAsSerializeValue(param[key]);
    });
  }

  destroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
