import { LightningElement, wire } from 'lwc';
import getCompletedTasks from '@salesforce/apex/TaskHandler.getCompletedTasks';

export default class CompletedTasksHistory extends LightningElement {
    completedTasks = [];

    @wire(getCompletedTasks)
    completedTasksWired({ data, error }) {
        if (data) {
            this.completedTasks = data;
            console.log('completed tasks: ' + JSON.stringify(this.completedTasks));
        } else if (error) {
            console.error(error);
        }
    }
}
