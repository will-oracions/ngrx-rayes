import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BaseHttpService } from '../services/base-http.service';
import { BaseActions } from './base-action';

export class BaseEffect<TModel> {
  constructor(actions$: any, modelService: BaseHttpService<TModel>, modelActions: BaseActions<TModel>) {
    this.create$ = createEffect(() =>
      actions$.pipe(
        ofType<{ type: string; single: TModel }>(modelActions.createLoad),
        switchMap((action: { type: string; single: TModel }) => {
          return modelService.create(action.single);
        }),
        map((single: TModel) => modelActions.createSuccess({ single })),
        catchError(() => of(modelActions.createError())),
      ),
    );

    this.load$ = createEffect(() =>
      actions$.pipe(
        ofType<{ type: string; list: TModel[] }>(modelActions.initLoad),
        switchMap((action) => modelService.getAll()),
        map((list: TModel[]) =>
          modelActions.initSuccess({
            list,
            timestamps: this.getTimestamps(modelService.CACHE_EXPIRATION_MIN_DELAY),
          }),
        ),
        catchError(() => of(modelActions.initError())),
      ),
    );

    this.edit$ = createEffect(() =>
      actions$.pipe(
        ofType<{ type: string; single: TModel }>(modelActions.editLoad),
        switchMap((action: { type: string; single: TModel }) => {
          const { id, ...changes } = action.single as any;
          return modelService.edit(changes, id);
        }),
        map((single: TModel) => modelActions.editSuccess({ single })),
        catchError(() => of(modelActions.editError())),
      ),
    );

    this.delete$ = createEffect(() =>
      actions$.pipe(
        ofType<{ type: string; id: number }>(modelActions.deleteLoad),
        switchMap((action: { type: string; id: number }) => modelService.delete(action.id)),
        map((id: number) => modelActions.deleteSuccess({ id })),
        catchError(() => of(modelActions.deleteError())),
      ),
    );
  }

  public create$: any;
  public load$: any;
  public edit$: any;
  public delete$: any;

  private getTimestamps(minDelay: number): number {
    const d = new Date(new Date().getTime() + minDelay * 60000);
    // console.log('Timestamps delay: ', d.getTime());
    return d.getTime();
  }
}
