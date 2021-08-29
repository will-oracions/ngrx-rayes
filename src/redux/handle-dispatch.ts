import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';

interface DispathProcessStatus {
  Loading: boolean;
  Success: boolean;
}

/**
 *
 */
export class HandleDispatch {
  private store: any;

  private _loadAction: Function | any[];

  // Selector
  private _selectorData: any;
  private _selectorProcessStatus: any;
  private _selectTimestamps: any;

  // Store Observable
  private status$: Observable<DispathProcessStatus>;
  private data$: Observable<any>;
  private timestamps$: Observable<number>;

  // Subscription
  private statusSubscription: Subscription | null;
  private dataSubscription: Subscription | null;
  private timestampsSubscription: Subscription | null;

  constructor(store: any, selectorData: Function, selectProcessStatus: Function, selectTimestamps?: Function) {
    this.store = store;
    this.statusSubscription = null;
    this.dataSubscription = null;
    this.timestampsSubscription = null;

    this._loadAction = () => {};
    this._selectorProcessStatus = () => {};

    // Selectors
    this._selectorData = selectorData;
    this._selectorProcessStatus = selectProcessStatus;
    this._selectTimestamps = selectTimestamps;

    // Bind Listeners to store
    this.status$ = this.store.pipe(select(this._selectorProcessStatus));
    this.data$ = this.store.pipe(select(this._selectorData));

    if (this._selectTimestamps) {
      this.timestamps$ = this.store.pipe(select(this._selectTimestamps));
    } else {
      this.timestamps$ = new Observable<number>();
    }
  }

  /**
   * Get the requiements
   * Store object,
   * Load Action
   * status and Data selector
   */
  static load(
    // Global store object
    store: Store<any>,

    // Load action that is captured by the effect
    // to launch action procession in the service
    loadAction: Function | any[],

    // Select from state, the part of data that will change
    selectorData: Function,

    //
    selectProcessStatus: Function,

    //
    selectTimestamps?: Function,
  ): HandleDispatch {
    //  Create Instance to be able to chain differents methods
    const hd = new HandleDispatch(store, selectorData, selectProcessStatus, selectTimestamps);
    hd._loadAction = loadAction;
    return hd;
  }

  /**
   * Dispatch load action and wait while process is running
   * listen to success or errors status and then
   * handle resolve or reject
   */
  async done(cache = false): Promise<any> {
    // console.log('CACHE: ', cache);
    let inCache = false;
    if (cache == true) {
      // console.log('******** Getting cached values');
      this.timestampsSubscription = this.timestamps$
        // .pipe(skip(1))
        .subscribe((timestamp: number) => {
          // console.log('Timessssss: ', timestamp);
          if (timestamp) {
            const now = new Date();
            inCache = now.getTime() < timestamp;
            // console.log('Now: ', now.getTime());
            // console.log('Timestamps: ', timestamp);
            // console.log('Cache expired: ', !inCache);
          }
        });
      if (inCache) {
        return;
      }
    }
    // console.log('Get from API !!!!!!!');
    return new Promise((resolve, reject) => {
      // console.log('Exécution: ');
      // console.log(typeof this._loadAction);

      // Dispatch main action
      if (typeof this._loadAction === 'function') {
        // if type is function where just call that function
        this.store.dispatch(this._loadAction());
      } else if (this._loadAction && this._loadAction.length === 2) {
        // If type is array we call the first element that
        // are a function and give the seconds element of array as
        // argument
        // console.log(this._loadAction[1]);
        this.store.dispatch(this._loadAction[0](this._loadAction[1]));
      } else {
        throw new Error('Syntaxe error !');
      }

      // listen when success or errors and then resolve or reject
      // console.log('**** bind listener');
      //
      this.statusSubscription = this.status$.pipe(skip(1)).subscribe((status: DispathProcessStatus) => {
        // console.log('Loading change...', status);
        if (!status.Success) {
          reject(new Error('Error ! Ouupss'));
          this.unsubscribe();
        }
      });

      //
      this.dataSubscription = this.data$.pipe(skip(1)).subscribe((data: any[]) => {
        // console.log('Request finish: data found !');
        // console.log(data);
        resolve(data);
        this.unsubscribe();
      });
      // }, 1000);
    });
  }

  /**
   * Unsubscribe to succes and data observable
   * when action process is finish
   */
  private unsubscribe(): void {
    this.statusSubscription?.unsubscribe();
    this.dataSubscription?.unsubscribe();
    this.timestampsSubscription?.unsubscribe();
  }
}
