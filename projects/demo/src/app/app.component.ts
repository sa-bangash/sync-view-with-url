import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  SyncParamControl,
  SyncParamControlsManager,
  SyncViewWithUrlService,
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
    // console.log(this.syncManagers.getValue());
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
          val: 'dd',
          serialize: (val) => {
            return `${val}-sometext`;
          },
          deserialize: (val: string) => {
            return val.split('-')[0];
          },
        }),
        level: new SyncParamControl({
          val: 'hello',
        }),
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
