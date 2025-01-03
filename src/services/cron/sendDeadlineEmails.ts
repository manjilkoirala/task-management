import cron from 'node-cron';
import { Task } from '../../models/task.model';
import { sendEmail } from '../email.service';
import dayjs from 'dayjs';
import { IUser } from '../../interfaces/user.interface';

const sendDeadlineEmails = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('Running cron job to check task deadlines');

    try {
      const now = dayjs();
      const next24Hours = now.add(24, 'hour');

      const tasks = await Task.find({
        deadline: { $gte: now.toDate(), $lte: next24Hours.toDate() },
        emailSent: false, // Only fetch tasks that haven't had an email sent
      }).populate<{ assignee: IUser }>('assignee');

      for (const task of tasks) {
        const { assignee, title, deadline } = task;
        if (assignee?.email) {
          const message = `Hello ${assignee.name},\n\nThis is a reminder that your task "${title}" is due by ${dayjs(
            deadline,
          ).format(
            'YYYY-MM-DD HH:mm:ss',
          )}.\n\nPlease make sure to complete it on time.`;

          await sendEmail({
            email: assignee.email,
            subject: 'Task Deadline Reminder',
            message,
          });

          // Mark the task as emailSent
          await Task.updateOne({ _id: task._id }, { emailSent: true });
        }
      }

      console.log('Deadline emails sent successfully');
    } catch (error) {
      console.error('Error running cron job:', error);
    }
  });
};

export default sendDeadlineEmails;
