import { makeAutoObservable } from 'mobx';

export default class NotificationInfo {
  constructor() {
    this._requests = [];
    this._notifications = [
      { id: 1, text: 'Hello. some comment text', sender: { name: 'no non', id: 2 }, reciever: {  id: 1 }, date: new Date() },
      { id: 2, text: 'Hello. some comment text', sender: { name: 'no non', id: 2 }, reciever: {  id: 1 }, date: new Date() },

    ];
    makeAutoObservable(this);
  }

  addNotification(notification) { this._notifications.push(notification); }

  getNotifications(userId) {
    const notifications = this._notifications.filter(notification => notification.reciever.id === userId);
    return notifications.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  set notifications(notifications) { this._notifications = notifications; }

  deleteRequest(request) { this._requests = this._requests.filter(({ id }) => id !== request.id) }

  get requests() { return this._requests; }

  set requests(requests) { this._requests = requests; }

}
