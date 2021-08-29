import { Action, on } from '@ngrx/store';
import { BaseActions } from './base-action';
import { BaseModel } from '../models/base.model';

export interface BaseState {
  Timestamp?: number;
  List: BaseModel[];
  Status: {
    Loading: boolean;
    Success: boolean;
  };
  Operation?: any;
}

export interface ReducerProcess {
  action: Action;
  onFunc: Function;
}

export class BaseReducer {
  // Update
  _loadUpdate = (state: BaseState): BaseState => ({
    ...state,
    Status: { Loading: true, Success: false },
  });
  _successUpdate = (state: BaseState, single: BaseModel) => ({
    ...state,
    Status: { Loading: false, Success: true },
    List: state.List.map((t: BaseModel) => (t.id === single.id ? single : t)),
    Operation: { edited: single },
  });
  _errorUpdate = (state: BaseState) => ({
    ...state,
    Status: { Loading: false, Success: false },
  });

  // Delete
  _loadDelete = (state: BaseState): BaseState => ({
    ...state,
    Status: { Loading: true, Success: false },
  });
  _successDelete = (state: BaseState, id: number): BaseState => ({
    ...state,
    Status: { Loading: false, Success: true },
    List: state.List.filter((single) => single.id !== id),
    Operation: { deleted: id },
  });
  _errorDelete = (state: BaseState): BaseState => ({
    ...state,
    Status: { Loading: false, Success: false },
  });

  // Create
  _loadCreate = (state: BaseState) => ({
    ...state,
    Status: { Loading: true, Success: false },
  });
  _successCreate = (state: BaseState, single: BaseModel) => ({
    ...state,
    Status: { Loading: false, Success: true },
    List: [...state.List, single],
    Operation: { created: single },
  });
  _errorCreate = (state: BaseState) => ({
    ...state,
    Status: { Loading: false, Success: false },
  });

  // Init
  _loadInit = (state: BaseState): BaseState => ({
    ...state,
    Status: { Loading: true, Success: false },
  });
  _successInit = (state: BaseState, data: BaseModel[], timestamp: number): BaseState => ({
    ...state,
    Status: { Loading: false, Success: true },
    List: data,
    Timestamp: timestamp,
  });
  _errorInit = (state: BaseState): BaseState => ({
    ...state,
    Status: { Loading: false, Success: false },
  });

  protected reducerBaseProcess: ReducerProcess[];

  constructor(modelActions: BaseActions<BaseModel>) {
    this.reducerBaseProcess = [
      // Init
      {
        action: modelActions.initLoad,
        onFunc: (state: BaseState) => this._loadInit(state),
      },
      {
        action: modelActions.initSuccess,
        onFunc: (state: BaseState, payload: { list: BaseModel[]; timestamps: number }) =>
          this._successInit(state, payload.list, payload.timestamps),
      },
      {
        action: modelActions.initError,
        onFunc: (state: BaseState) => this._errorInit(state),
      },

      // // Create
      {
        action: modelActions.createLoad,
        onFunc: (state: BaseState) => this._loadCreate(state),
      },
      {
        action: modelActions.createSuccess,
        onFunc: (state: BaseState, payload: { single: BaseModel }) => this._successCreate(state, payload.single),
      },
      {
        action: modelActions.createError,
        onFunc: (state: BaseState) => this._errorCreate(state),
      },

      // // Delete
      {
        action: modelActions.deleteLoad,
        onFunc: (state: BaseState) => this._loadDelete(state),
      },
      {
        action: modelActions.deleteSuccess,
        onFunc: (state: BaseState, payload: { id: number }) => this._successDelete(state, payload.id),
      },
      {
        action: modelActions.deleteError,
        onFunc: (state: BaseState) => this._errorDelete(state),
      },

      // // update
      {
        action: modelActions.editLoad,
        onFunc: (state: BaseState) => this._loadUpdate(state),
      },
      {
        action: modelActions.editSuccess,
        onFunc: (state: BaseState, payload: { single: BaseModel }) => this._successUpdate(state, payload.single),
      },
      {
        action: modelActions.editError,
        onFunc: (state: BaseState) => this._errorUpdate(state),
      },
    ];
  }

  getBaseProcess(): any[] {
    const r = this.reducerBaseProcess.map((process: any) => on(process?.action, process?.onFunc));
    // console.log('FFFFFF: ', r);
    return r;
  }
}
