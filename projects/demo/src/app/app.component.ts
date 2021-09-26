import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  SyncParamControl,
  SyncParamControlsManager,
  SyncParamBuilder,
} from 'sync-view-with-url';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  destory$ = new Subject();
  name: string = '';
  level: string = '';
  syncManagers: SyncParamControlsManager;
  constructor(private qpBuilder: SyncParamBuilder) {
    this.syncManagers = this.getManager();
    this.inilizeFormValue();
  }
  inilizeFormValue() {
    const data = this.syncManagers.deserialize$
      .pipe(takeUntil(this.destory$))
      .subscribe(({ name, level }) => {
        console.log({ name, level });
        this.name = name;
        this.level = level;
      });
    // this.name = data['name'];
    // this.level = data['level'];
  }
  getManager() {
    return this.qpBuilder.build({
      controls: {
        name: new SyncParamControl({
          serialize: (val) => {
            if (val) {
              return `${val}-sometext`;
            }
            return null;
          },
          deserialize: (val: string) => {
            if (val) {
              return val.split('-')[0];
            }
            return null;
          },
        }),
        level: new SyncParamControl(),
      },
    });
  }

  onNameChange(event: string) {
    console.log(event);
    this.name = event;
    this.syncManagers.get('name').setValue(event);
  }
  onLevelChange(event: string) {
    console.log(event);
    this.level = event;
    this.syncManagers.get('level').setValue(event);
  }
  ngOnDestroy(): void {
    this.syncManagers.destroy();
  }
}
