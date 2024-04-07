import { LightningElement, api } from 'lwc';

export default class TodoListItem extends LightningElement {
    _task;
    taskClass = 'slds-text-title_caps';

    @api isHistoryItem = false;
    areButtonsDisabled;

    @api
    get task() {
        return this._task;
    }
    set task(value) {
        this._task = value;
        if (this._task.Status === 'Completed' && !this.isHistoryItem) {
            this.markAsCompleted();
        }
    }

    handleMarkAsCompletedClick() {
        this.fireEvent('completed');
    }

    handleDeleteClick() {
        this.fireEvent('delete');
    }

    fireEvent(eventName) {
        this.dispatchEvent(new CustomEvent(eventName));
    }

    @api markAsCompleted() {
        this.taskClass += ' completed';
        this.areButtonsDisabled = true;
    }
}
