import { LightningElement, wire } from 'lwc';
import { formatDate } from 'c/ldsUtils';
import getCompletedTasks from '@salesforce/apex/TaskHandler.getCompletedTasks';

export default class CompletedTasksHistory extends LightningElement {
    completedTasks;
    tasksByDate;
    dates;

    @wire(getCompletedTasks)
    completedTasksWired({ data, error }) {
        if (data) {
            this.completedTasks = data;
            console.log('completed tasks: ' + JSON.stringify(this.completedTasks));
            this.createTaskHistory();
        } else if (error) {
            console.error(error);
        }
    }

    createTaskHistory() {
        if (this.completedTasks) {
            this.tasksByDate = this.completedTasks.reduce((array, currentTask) => {
                const date = formatDate(currentTask.ActivityDate);

                const dateEntry = array.find((entry) => entry.date === date);

                if (dateEntry) {
                    dateEntry.tasks.push(currentTask.Subject);
                } else {
                    array.push({ date, tasks: [currentTask.Subject] });
                }

                return array;
            }, []);

            console.log('tbd: ' + JSON.stringify(this.tasksByDate));
        }
    }
}
