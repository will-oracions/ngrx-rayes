import { Observable } from 'rxjs';

export abstract class BaseHttpService<TModel> {
  public CACHE_EXPIRATION_MIN_DELAY = 1;

  constructor() {}

  public abstract create(TModel: TModel): Observable<TModel>;

  public abstract getAll(): Observable<TModel[]>;

  public abstract edit(partialTModel: Partial<TModel>, id: any): Observable<TModel>;

  public abstract delete(id: any): Observable<number>;
}
