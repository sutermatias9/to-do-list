import { LightningElement, api } from 'lwc';

export default class TodoListItem extends LightningElement {
    @api task;
    areButtonsDisabled;

    handleMarkAsCompletedClick() {
        this.fireEvent('completed');
    }

    handleDeleteClick() {
        this.fireEvent('delete');
    }

    disableButtons() {
        this.template.querySelectorAll('lightning-button-icon').forEach((btn) => {
            btn.setAttribute('disabled', 'true');
            console.log(btn);
        });
    }

    fireEvent(eventName) {
        this.dispatchEvent(new CustomEvent(eventName));
    }

    @api markAsCompleted() {
        this.template.querySelector('p').classList.add('completed');
        this.areButtonsDisabled = true;
    }
}
