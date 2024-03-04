public with sharing class TaskHandler {

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
    public static void deleteTask(Id taskId){
        try {
            Task taskToDelete = [SELECT Id FROM Task WHERE Id = :taskId LIMIT 1];

            delete taskToDelete;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}