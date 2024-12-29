
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as nodemailer from 'nodemailer';

@Processor('email-queue')
export class EmailProcessor {
    private transporter;
    private readonly logger = new Logger(EmailProcessor.name);

    constructor() {
        this.transporter = nodemailer.createTransport({
            // Configure email service here
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    @Process('registration-confirmation')
    async sendRegistrationEmail(job: Job) {
        const { attendee, event } = job.data;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: attendee.email,
            subject: `Registration Confirmation for ${event.name}`,
            html: `
                <h1>Registration Confirmed!</h1>
                <p>Dear ${attendee.name},</p>
                <p>Your registration for ${event.name} has been confirmed.</p>
                <p>Event Details:</p>
                <ul>
                    <li>Date: ${new Date(event.date).toLocaleDateString()}</li>
                    <li>Time: ${new Date(event.date).toLocaleTimeString()}</li>
                    <li>Location: ${event.location || 'TBA'}</li>
                </ul>
                <p>We look forward to seeing you!</p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    }


    @Process('event-reminder')
    async handleEventReminder(job: Job) {
        const { attendee, event } = job.data;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: attendee.email,
            subject: `Reminder: ${event.name} is tomorrow!`,
            html: `
                <h1>Event Reminder</h1>
                <p>Dear ${attendee.name},</p>
                <p>This is a friendly reminder that you're registered for <strong>${event.name}</strong> tomorrow.</p>
                <p>Event Details:</p>
                <ul>
                    <li>Date: ${new Date(event.date).toLocaleDateString()}</li>
                    <li>Time: ${new Date(event.date).toLocaleTimeString()}</li>
                    <li>Location: ${event.location || 'TBA'}</li>
                    <li>Description: ${event.description || 'No description provided'}</li>
                </ul>
                <p>We look forward to seeing you!</p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Sent reminder email to ${attendee.email} for event ${event.name}`);
        } catch (error) {
            this.logger.error(
                `Failed to send reminder email to ${attendee.email} for event ${event.name}`,
                error.stack
            );
            throw error; // Retry based on Bull configuration
        }
    }


}