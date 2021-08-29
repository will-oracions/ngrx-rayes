import { createAction, props } from '@ngrx/store';

export interface BaseActionsType {
  LOAD_INIT: string;
  SUCCESS_INIT: string;
  ERROR_INIT: string;

  LOAD_CREATE: string;
  SUCCESS_CREATE: string;
  ERROR_CREATE: string;

  LOAD_UPDATE: string;
  SUCCESS_UPDATE: string;
  ERROR_UPDATE: string;

  LOAD_DELETE: string;
  SUCCESS_DELETE: string;
  ERROR_DELETE: string;
}

export function getBaseActions(name: string) {
  return {
    LOAD_INIT: `[${name.toLowerCase()}] Load init`,
    SUCCESS_INIT: `[${name.toLowerCase()}] success init`,
    ERROR_INIT: `[${name.toLowerCase()}] error init`,

    LOAD_CREATE: `[${name.toLowerCase()}] load create`,
    SUCCESS_CREATE: `[${name.toLowerCase()}] successs create`,
    ERROR_CREATE: `[${name.toLowerCase()}] error create`,

    LOAD_UPDATE: `[${name.toLowerCase()}] load update`,
    SUCCESS_UPDATE: `[${name.toLowerCase()}] success update`,
    ERROR_UPDATE: `[${name.toLowerCase()}] error update`,

    LOAD_DELETE: `[${name.toLowerCase()}] load delete`,
    SUCCESS_DELETE: `[${name.toLowerCase()}] success delete`,
    ERROR_DELETE: `[${name.toLowerCase()}] error delete`,
  };
}

export class BaseActions<TModel> {
  constructor(actionsType: BaseActionsType) {
    // Init
    this.initLoad = createAction(actionsType.LOAD_INIT);
    this.initSuccess = createAction(actionsType.SUCCESS_INIT, props<{ list: TModel[]; timestamps: number }>());
    this.initError = createAction(actionsType.ERROR_INIT);

    //
    //
    // Create
    this.createLoad = createAction(actionsType.LOAD_CREATE, props<{ single: TModel }>());
    this.createSuccess = createAction(actionsType.SUCCESS_CREATE, props<{ single: TModel }>());
    this.createError = createAction(actionsType.ERROR_CREATE);

    //
    //
    // Edit
    this.editLoad = createAction(actionsType.LOAD_UPDATE, props<{ single: TModel }>());
    this.editSuccess = createAction(actionsType.SUCCESS_UPDATE, props<{ single: TModel }>());
    this.editError = createAction(actionsType.ERROR_UPDATE);

    //
    //
    // Delete
    this.deleteLoad = createAction(actionsType.LOAD_DELETE, props<{ id?: number }>());
    this.deleteSuccess = createAction(actionsType.SUCCESS_DELETE, props<{ id: number }>());
    this.deleteError = createAction(actionsType.ERROR_DELETE);
  }

  // Init
  public initLoad: any;
  public initSuccess: any;
  public initError: any;

  // Create
  public createLoad: any;
  public createSuccess: any;
  public createError: any;

  // Edit
  public editLoad: any;
  public editSuccess: any;
  public editError: any;

  // Delete
  public deleteLoad: any;
  public deleteSuccess: any;
  public deleteError: any;
}
