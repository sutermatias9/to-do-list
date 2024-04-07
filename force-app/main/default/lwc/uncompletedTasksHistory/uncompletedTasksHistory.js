import { LightningElement, wire } from 'lwc';
import { formatDate } from 'c/ldsUtils';
import { refreshApex } from '@salesforce/apex';
import getTasks from '@salesforce/apex/TaskHandler.getTasks';
import setActivityDate from '@salesforce/apex/TaskHandler.setActivityDate';

export default class UncompletedTasksHistory extends LightningElement {
    tasks;
    tasksByDate;

    wiredTasksResult;

    @wire(getTasks, { status: 'In Progress', todayTasks: false })
    wiredUncompletedTasks(result) {
        if (result.data) {
            this.tasks = result.data;
            this.wiredTasksResult = result;
            this.createTaskHistory();
        } else if (result.error) {
            console.log('Error ut..');
            console.error(result.error);
        }
    }

    handleAddClick(event) {
        const taskId = event.currentTarget.dataset.id;

        setActivityDate({ taskId, newDate: this.getCurrentDate() })
            .then(() => {
                console.log('task successfully updated');
                refreshApex(this.wiredTasksResult);
            })
            .catch((err) => {
                console.log('ERROR AL UPDATEAR');
                console.error(err);
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
            console.log(JSON.stringify(this.tasksByDate));
        }
    }

    getCurrentDate() {
        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        return `${year}-${month < 10 ? '0' + month : month}-${day}`;
    }
}
