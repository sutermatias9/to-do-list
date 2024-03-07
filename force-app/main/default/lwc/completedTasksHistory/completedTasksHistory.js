import { LightningElement, wire } from 'lwc';
import { formatDate } from 'c/ldsUtils';
import getCompletedTasks from '@salesforce/apex/TaskHandler.getCompletedTasks';

import { subscribe, MessageContext } from 'lightning/messageService';
import taskCreated from '@salesforce/messageChannel/TaskCreated__c';
import { refreshApex } from '@salesforce/apex';

export default class CompletedTasksHistory extends LightningElement {
    completedTasks;
    tasksByDate;
    dates;
    wiredCompletedTasksResult;

    subscription = null;

    @wire(MessageContext)
    messageContext;

    @wire(getCompletedTasks)
    wiredCompletedTasks(result) {
        this.wiredCompletedTasksResult = result;

        if (result.data) {
            this.completedTasks = result.data;
            console.log('completed tasks: ' + JSON.stringify(this.completedTasks));
            this.createTaskHistory();
        } else if (result.error) {
            console.error(result.error);
        }
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    createTaskHistory() {
        if (this.completedTasks) {
            this.tasksByDate = this.completedTasks.reduce((array, currentTask) => {
                const date = formatDate(currentTask.ActivityDate);

                const dateEntry = array.find((entry) => entry.date === date);

                if (dateEntry) {
                    dateEntry.tasks.push({ Subject: currentTask.Subject });
                } else {
                    array.push({ date, tasks: [{ Subject: currentTask.Subject }] });
                }

                return array;
            }, []);
        }
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(this.messageContext, taskCreated, () =>
                refreshApex(this.wiredCompletedTasksResult)
            );
        }
    }
}
