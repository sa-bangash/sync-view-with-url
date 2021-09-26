import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SyncParamControlsManager } from './sync-param-controls-manager';
import { ParamControlsManagerConfig } from './sync-param-controls-manager.interface';

@Injectable({
  providedIn: 'root',
})
export class SyncParamBuilder {
  constructor(private router: Router, private route: ActivatedRoute) {}
  build(option: ParamControlsManagerConfig): SyncParamControlsManager {
    return new SyncParamControlsManager(option, this.router, this.route);
  }
}
