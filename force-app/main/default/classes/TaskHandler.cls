public with sharing class TaskHandler {

    @AuraEnabled
    public static Task createTask(String subject, Id userId) {
        System.debug(subject);
        System.debug(userId);
        Task t = new Task();
        t.OwnerId = userId;
        t.Subject = subject;
        t.ActivityDate = Date.today();
        t.Status = 'In Progress';
        t.Priority = 'Normal';

        insert t;
        return t;
    }
}