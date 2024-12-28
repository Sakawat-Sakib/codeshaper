// src/email/email.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as nodemailer from 'nodemailer';

@Processor('email-queue')
export class EmailProcessor {
    private transporter;

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
}