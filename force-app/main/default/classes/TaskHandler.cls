public with sharing class TaskHandler {
    @AuraEnabled(cacheable=true)
    public static List<Task> getTasks(String status, Boolean todayTasks) {
        try {
            String query = 'SELECT Id, ActivityDate, Subject, Status FROM Task ';

            if (!String.isBlank(status)) {
                query += 'WHERE Status = :status ';
            }

            if (todayTasks != null) {
                if (query.contains('WHERE')) {
                    query += 'AND ';
                } else {
                    query += 'WHERE ';
                }
                query += todayTasks ? 'ActivityDate = TODAY ' : 'ActivityDate != TODAY ';
            }

            System.debug(query);
            System.debug(status);
            System.debug(todayTasks);

            return (List<Task>) Database.query(query + 'ORDER BY ActivityDate DESC ');
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Task createTask(String subject, Id userId) {
        Task t = new Task();
        t.OwnerId = userId;
        t.Subject = subject;
        t.ActivityDate = Date.today();
        t.Status = 'In Progress';
        t.Priority = 'Normal';

        insert t;
        return t;
    }

    @AuraEnabled
    public static void setActivityDate(Id taskId, Date newDate) {
        try {
            Task t = getTask(taskId);
            t.ActivityDate = newDate;
            update t;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void markTaskAsCompleted(Id taskId) {
        try {
            Task task = getTask(taskId);
            task.Status = 'Completed';
            update task;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteTask(Id taskId) {
        try {
            Task taskToDelete = getTask(taskId);

            delete taskToDelete;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    private static Task getTask(Id taskId) {
        return [SELECT Id, Status, ActivityDate FROM Task WHERE Id = :taskId LIMIT 1];
    }
}
