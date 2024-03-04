import { LightningElement, track } from 'lwc';
import createTask from '@salesforce/apex/TaskHandler.createTask';
import deleteTask from '@salesforce/apex/TaskHandler.deleteTask';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import currentUserId from '@salesforce/user/Id';

export default class ToDoList extends LightningElement {
    userId = currentUserId;

    taskSubject;
    @track taskList = [];

    handleInputChange(event) {
        this.taskSubject = event.detail.value;
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
        const taskId = event.currentTarget.dataset.id;
        deleteTask({ taskId })
            .then(() => {
                this.showToast('Task successfully deleted.', null, 'success');
                this.taskList = this.taskList.filter((task) => task.Id !== taskId);
            })
            .catch((error) => {
                console.error('An error ocurred... ' + error.message);
            });
    }

    addTask() {
        if (this.taskSubject) {
            createTask({ subject: this.taskSubject, userId: this.userId })
                .then((task) => {
                    this.showToast('Task successfully created.', 'ID: ' + task.Id, 'success');
                    this.taskList.push({ Subject: task.Subject, Id: task.Id });
                    this.clearInput();
                })
                .catch((error) => {
                    console.error('An error ocurred... ' + error.message);
                });
        }
    }

    clearInput() {
        this.taskSubject = null;
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
