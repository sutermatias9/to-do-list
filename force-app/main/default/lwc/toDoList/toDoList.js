import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { MessageContext, publish, subscribe } from 'lightning/messageService';
import taskCreated from '@salesforce/messageChannel/TaskCreated__c';
import TaskAdded from '@salesforce/messageChannel/TaskAdded__c';

import currentUserId from '@salesforce/user/Id';
import getTasks from '@salesforce/apex/TaskHandler.getTasks';
import createTask from '@salesforce/apex/TaskHandler.createTask';
import markTaskAsComplete from '@salesforce/apex/TaskHandler.markTaskAsCompleted';
import deleteTask from '@salesforce/apex/TaskHandler.deleteTask';

export default class ToDoList extends LightningElement {
    userId = currentUserId;
    taskSubject;
    @track taskList = [];

    subscription = null;
    error = null;

    @wire(MessageContext)
    messageContext;

    @wire(getTasks, { todayTasks: true })
    getTasksWired(result) {
        this.wiredTasks = result;

        if (result.data) {
            this.taskList = result.data.map((task) => {
                return {
                    Id: task.Id,
                    Subject: task.Subject,
                    Status: task.Status
                };
            });
        } else if (result.error) {
            this.error = result.error;
        }
    }

    get hasTasks() {
        console.log('has tasks? ' + this.taskList.length > 0);
        return this.taskList.length > 0;
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

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
                this.publishMessage();
            })
            .catch((error) => {
                this.error = error;
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
                this.error = error;
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
                    this.error = error;
                });
        } else {
            this.showToast('Please enter a task.', null, 'error');
        }
    }

    clearInput() {
        this.taskSubject = null;
    }

    publishMessage() {
        publish(this.messageContext, taskCreated);
    }

    showToast(title, message, variant = 'success') {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(this.messageContext, TaskAdded, () => {
                refreshApex(this.wiredTasks);
                this.showToast('Task added!');
            });
        }
    }
}
