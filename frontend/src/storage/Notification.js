import { makeAutoObservable } from 'mobx';

export default class NotificationInfo {
  constructor() {
    this._requests = [];
    this._notifications = [];
    makeAutoObservable(this);
  }

  getNotifications(userId) {
    const notifications = this._notifications.filter(notification => notification.receiverId === userId);
    return notifications.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  set notifications(notifications) { this._notifications = notifications; }

  deleteRequest(request) { this._requests = this._requests.filter(({ id }) => id !== request.id) }

  get requests() { return this._requests; }

  set requests(requests) { this._requests = requests; }

}
