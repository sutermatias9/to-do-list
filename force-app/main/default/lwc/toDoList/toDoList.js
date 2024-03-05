import { LightningElement, track } from 'lwc';
import createTask from '@salesforce/apex/TaskHandler.createTask';
import markTaskAsComplete from '@salesforce/apex/TaskHandler.markTaskAsCompleted';
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
        const taskItemElement = event.currentTarget;
        const taskId = taskItemElement.dataset.id;

        markTaskAsComplete({ taskId })
            .then(() => {
                this.showToast('Task Status updated.');
                // Call c-todo-list-item @api method
                taskItemElement.markAsCompleted();
            })
            .catch((error) => {
                console.error('An error ocurred... ' + JSON.stringify(error));
            });
    }

    handleTaskDelete(event) {
        const taskId = event.currentTarget.dataset.id;

        deleteTask({ taskId })
            .then(() => {
                this.showToast('Task successfully deleted.');
                this.taskList = this.taskList.filter((task) => task.Id !== taskId);
            })
            .catch((error) => {
                console.error('An error ocurred... ' + error.body.message);
            });
    }

    addTask() {
        if (this.taskSubject) {
            createTask({ subject: this.taskSubject, userId: this.userId })
                .then((task) => {
                    this.showToast('Task successfully created.', 'ID: ' + task.Id);
                    this.taskList.push({ Subject: task.Subject, Id: task.Id });
                    this.clearInput();
                })
                .catch((error) => {
                    console.error('An error ocurred... ' + error.body.message);
                });
        }
    }

    clearInput() {
        this.taskSubject = null;
    }

    showToast(title, message, variant = 'success') {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }
}
