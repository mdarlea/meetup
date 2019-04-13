import {BehaviorSubject, Observable, Observer, of, Subscriber } from 'rxjs';
import * as signalR from '@aspnet/signalr';

import { UserService } from './user.service';
import { Settings} from '../settings';

export abstract class SignalRService  {
  protected hubConnection: signalR.HubConnection;
  private isConnected = false;

  protected constructor(protected settings: Settings, protected userSvc: UserService, protected hubName: string) {
  }

  startConnection() {
   if (this.isConnected) {
    return;
   }

   this.buildConnection();

   this.hubConnection
        .start()
        .then(() => {
          this.isConnected = true;
          console.log(`${this.hubName} connection started`);
        })
      .catch(err => {
        console.log(`Error while starting ${this.hubName} connection: ${err}`);
      });
  }

  invoke<T>(methodName: string, args?: any): Observable<T> {
    return this.startConnectionAndInvokeMethod<T>(methodName, args);
  }

  on<T>(methodName: string): Observable<T> {
    this.buildConnection();
    return new Observable<T>(subscriber => {
      this.hubConnection.on(methodName, data => {
        subscriber.next(data as T);
      });
    });
  }

  public stopConnection() {
    if (!this.isConnected) {
        return;
    }

    this.hubConnection
        .stop()
        .then(() => {
            console.log(`${this.hubName} connection stopped`);
            this.isConnected = false;
        })
        .catch(err => {
            console.log(`Error while starting ${this.hubName} connection: ${err}`);
        });
  }

  private startConnectionAndInvokeMethod<T>(methodName: string, args?: any): Observable<T> {
    return new Observable<T>(subscriber => {
      if (this.isConnected) {
        if (methodName) {
          this.invokeMethod(subscriber, methodName, args);
        } else {
          subscriber.error('Method name not specified');
        }
      }

      this.buildConnection();

      this.hubConnection
        .start()
        .then(() => {
          this.isConnected = true;
          console.log(`${this.hubName} connection started`);
          if (methodName) {
            this.invokeMethod(subscriber, methodName, args);
          } else {
            subscriber.error('Method name not specified');
          }
        })
      .catch(err => {
        console.log(`Error while starting ${this.hubName} connection: ${err}`);
        subscriber.error(err);
      });
    });
  }

  private invokeMethod<T>(subscriber: Subscriber<T>, methodName: string, args?: any) {
    this.hubConnection.invoke(methodName, args)
                      .then(data => subscriber.next(data as T))
                      .catch(error => subscriber.error(error));
  }

  private buildConnection() {
    if (this.hubConnection) {
      return;
    }

    const user = this.userSvc.getUser();
    if (!user) { return; }

    const token = user.token;
    if (!token) { return; }

    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl(`${this.settings.configuration.apiBaseUrl}/hubs/${this.hubName}`, { accessTokenFactory: () => token })
                            .build();

    this.hubConnection.onclose(() => {
      this.isConnected = false;
    });
  }
}
