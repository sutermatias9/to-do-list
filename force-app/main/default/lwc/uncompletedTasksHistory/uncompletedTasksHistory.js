import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { MessageContext, publish } from 'lightning/messageService';
import taskAdded from '@salesforce/messageChannel/TaskAdded__c';

import { formatDate } from 'c/ldsUtils';
import getTasks from '@salesforce/apex/TaskHandler.getTasks';
import setActivityDate from '@salesforce/apex/TaskHandler.setActivityDate';

export default class UncompletedTasksHistory extends LightningElement {
    tasks;
    tasksByDate;

    wiredTasksResult;
    error = null;

    @wire(MessageContext)
    messageContext;

    @wire(getTasks, { status: 'In Progress', todayTasks: false })
    wiredUncompletedTasks(result) {
        if (result.data) {
            this.tasks = result.data;
            this.wiredTasksResult = result;
            this.createTaskHistory();
        } else if (result.error) {
            this.error = result.error;
        }
    }

    handleAddClick(event) {
        const taskId = event.currentTarget.dataset.id;

        setActivityDate({ taskId, newDate: this.getCurrentDate() })
            .then(() => {
                console.log('task successfully updated');
                this.publishMessage();
                refreshApex(this.wiredTasksResult);
            })
            .catch((err) => {
                this.error = err;
            });
    }

    createTaskHistory() {
        if (this.tasks) {
            this.tasksByDate = this.tasks.reduce((array, currentTask) => {
                const date = formatDate(currentTask.ActivityDate);

                const dateEntry = array.find((entry) => entry.date === date);

                if (dateEntry) {
                    dateEntry.tasks.push({ Subject: currentTask.Subject, Id: currentTask.Id });
                } else {
                    array.push({ date, tasks: [{ Subject: currentTask.Subject, Id: currentTask.Id }] });
                }

                return array;
            }, []);
        }
    }

    getCurrentDate() {
        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        const dateString = `${year}-${month < 10 ? '0' + month : month}-${day}`;

        return new Date(dateString);
    }

    publishMessage() {
        publish(this.messageContext, taskAdded);
    }
}
