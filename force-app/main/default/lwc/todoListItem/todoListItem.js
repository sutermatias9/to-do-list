import { LightningElement, api } from 'lwc';

export default class TodoListItem extends LightningElement {
    @api task;

    handleMarkAsCompletedClick() {
        this.fireEvent('completed');
    }

    handleDeleteClick() {
        this.fireEvent('delete');
    }

    fireEvent(eventName) {
        this.dispatchEvent(new CustomEvent(eventName));
    }
}
