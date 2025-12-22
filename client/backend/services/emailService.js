const { Resend } = require('resend');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class EmailService {
    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }
    
    async sendOrderConfirmation(order, items, token) {
        // Generate secure link with expiry
        const secureToken = this.generateSecureToken(order.order_id);
        const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
        
        const confirmationLink = `${process.env.FRONTEND_URL}/order/confirm/${order.order_id}?token=${secureToken}&expiry=${expiryTime}`;
        
        const html = await this.renderEmailTemplate('order-confirmation', {
            order,
            items,
            confirmationLink,
            secureToken,
            expiry: new Date(expiryTime).toLocaleString(),
            supportEmail: process.env.SUPPORT_EMAIL,
            contactPhone: process.env.CONTACT_PHONE
        });
        
        const mailOptions = {
            from: `"EnergeniX" <${process.env.SENDER_EMAIL}>` ,
            to: order.customer_details.email,
            subject: `Order Confirmation #${order.order_id}`,
            html,
            headers: {
                'X-Order-ID': order.order_id,
                'X-Secure-Token': secureToken
            }
        };
        
        try {
            const { data, error } = await this.resend.emails.send({
                from: mailOptions.from,
                to: [order.customer_details.email],
                subject: mailOptions.subject,
                html: mailOptions.html,
                headers: mailOptions.headers,
            });

            if (error) {
                throw new Error(error.message);
            }
            
            // Store email record with token
            await this.storeEmailRecord({
                orderId: order.order_id,
                emailType: 'confirmation',
                recipient: order.customer_details.email,
                secureToken,
                expiry: expiryTime,
                messageId: data.id // Resend returns an 'id' for the message
            });
            
            return data;
        } catch (error) {
            console.error('Email send error:', error);
            throw error;
        }
    }
    
    generateSecureToken(orderId) {
        const hash = crypto.createHmac('sha256', process.env.EMAIL_SECRET)
            .update(orderId + Date.now())
            .digest('hex');
        return hash.substring(0, 32);
    }
    
    async renderEmailTemplate(templateName, data) {
        const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
        let html = await fs.readFile(templatePath, 'utf8');
        
        // Replace placeholders
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(regex, data[key]);
        });
        
        return html;
    }
    
    async storeEmailRecord(record) {
        // Store in database for tracking
        // Implement your database storage logic
    }
    
    async sendPaymentFailedEmail(order) {
        const retryLink = `${process.env.FRONTEND_URL}/order/retry/${order.order_id}`;
        const supportLink = `${process.env.FRONTEND_URL}/contact`;
        
        const html = await this.renderEmailTemplate('payment-failed', {
            order,
            retryLink,
            supportLink,
            orderId: order.order_id,
            amount: order.totals.total_amount
        });
        
        const mailOptions = {
            from: `"EnergeniX" <${process.env.SENDER_EMAIL}>`,
            to: [order.customer_details.email],
            subject: `Payment Failed for Order #${order.order_id}`,
            html
        };
        
        const { data, error } = await this.resend.emails.send(mailOptions);

        if (error) {
            console.error('Email send error:', error);
            throw new Error(error.message);
        }
        return data;
    }

    async sendAuthOtp(email, otp, type) {
        const templates = {
            signup: { name: 'registration', subject: 'OTP for Registration' },
            signin: { name: 'login', subject: 'OTP for Sign In' },
            update: { name: 'emailupdate', subject: 'OTP for Email Update' },
            resend: { name: 'resendEmail', subject: 'Your Resent OTP' }
        };
        
        const config = templates[type];
        if (!config) throw new Error('Invalid OTP type');
        
        const html = await this.renderEmailTemplate(config.name, { otp });
        
        const { data, error } = await this.resend.emails.send({
            from: `"EnergeniX" <${process.env.SENDER_EMAIL}>` ,
            to: [email],
            subject: config.subject,
            html: html,
        });

        if (error) {
            console.error('Auth OTP email send error:', error);
            throw new Error(error.message);
        }
        
        return data;
    }
}

module.exports = new EmailService();