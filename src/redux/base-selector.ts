import { createSelector } from '@ngrx/store';
import { BaseState } from './base-reducer';

export class BaseSelector {
  constructor(selectState$: any) {
    this.selectList = createSelector(selectState$, (state: BaseState) => state.List);

    this.selectStatus = createSelector(selectState$, (state: BaseState) => state.Status);

    this.selectOperation = createSelector(selectState$, (state: BaseState) => state.Operation);

    this.selectTimestamp = createSelector(selectState$, (state: BaseState) => state.Timestamp);
  }

  public selectList: any;
  public selectStatus: any;
  public selectOperation: any;
  public selectTimestamp: any;
}
