public with sharing class TaskHandler {
    @AuraEnabled(cacheable=true)
    public static List<Task> getCompletedTasks() {
        try {
            return [SELECT  ActivityDate, Subject FROM Task WHERE Status = 'Completed' ORDER BY ActivityDate DESC];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Task> getTodayTasks(){
        Date today = Date.today();
        try {
            return [SELECT Id, Subject, Status FROM Task WHERE ActivityDate = :today];
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
    public static void markTaskAsCompleted(Id taskId){
        try {
            Task task = getTask(taskId);
            task.Status = 'Completed';
            update task;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteTask(Id taskId){
        try {
            Task taskToDelete = getTask(taskId);

            delete taskToDelete;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    private static Task getTask(Id taskId) {
        return [SELECT Id, Status FROM Task WHERE Id = :taskId LIMIT 1];
    }
}