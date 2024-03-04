import { LightningElement, track } from 'lwc';
import createTask from '@salesforce/apex/TaskHandler.createTask';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import currentUserId from '@salesforce/user/Id';

export default class ToDoList extends LightningElement {
    userId = currentUserId;

    inputText;
    @track taskList = [];

    handleInputChange(event) {
        this.inputText = event.detail.value;
    }

    handleInputKeyDown(event) {
        if (event.key === 'Enter') {
            this.addTask();
        }
    }

    handleAddClick() {
        this.addTask();
    }

    handleTaskCompleted(event) {
        event.currentTarget.markAsCompleted();
    }

    handleTaskDelete(event) {
        const taskIndex = this.taskList.indexOf(event.currentTarget.task);
        this.taskList.splice(taskIndex, 1);
    }

    addTask() {
        if (this.inputText) {
            createTask({ subject: this.inputText, userId: this.userId })
                .then((task) => {
                    this.showToast('Task successfully created.', 'ID: ' + task.Id, 'success');
                    this.taskList.push(this.inputText);
                    this.clearInput();
                })
                .catch((error) => {
                    console.error('An error ocurred... ' + error.message);
                });
        }
    }

    clearInput() {
        this.inputText = null;
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }
}
