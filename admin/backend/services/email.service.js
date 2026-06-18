const { Resend } = require('resend');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class EmailService {
    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }
    
        async sendOrderConfirmation(order) {
            try {
                if (!process.env.RESEND_API_KEY) {
                    console.error('[EmailService] RESEND_API_KEY is missing in environment variables');
                }
    
                // Calculate subtotal
                const subtotal = order.items.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);
                
                // Calculate total using our stored amounts
                const totalAmount = (order.prepaid_amount || 0) + (order.cod_amount || 0);
    
                // Generate Items HTML
                const itemsHtml = order.items.map(item => `
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <table width="100%">
                                <tr>
                                    <td>
                                        <strong>${item.name}</strong><br />
                                        <span style="font-size: 13px; color: #666;">Qty: ${item.quantity}</span>
                                    </td>
                                    <td align="right">
                                        <strong>₹${item.unit_price}</strong>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                `).join('');
    
                const html = await this.renderEmailTemplate('order-confirmation', {
                    order_id: order.order_id,
                    order_date: new Date().toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    }),
                    items_html: itemsHtml,
                    subtotal: subtotal.toFixed(2),
                    shipping_cost: order.payment_type === 'COD' ? '₹100' : 'FREE',
                    total_amount: totalAmount.toFixed(2),
                    customer_name: order.customer.name,
                    customer_address: `${order.customer.address_line_one}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`,
                    payment_method: order.payment_type
                });
                
                const mailOptions = {
                    from: `"EnergeniX" <order-confirmation@energenix.store>` ,
                    to: [order.customer.email],
                    subject: `Order Confirmation #${order.order_id}`,
                    html,
                };
                
                const { data, error } = await this.resend.emails.send(mailOptions);
    
                if (error) {
                    console.error('[EmailService] Resend API error:', error);
                }
                
                return data;
            } catch (error) {
                console.error('[EmailService] Critical failure in sendOrderConfirmation:', error);
            }
        }
    
        generateSecureToken(orderId) {
            const hash = crypto.createHmac('sha256', process.env.EMAIL_SECRET)
                .update(orderId + Date.now())
                .digest('hex');
            return hash.substring(0, 32);
        }
        
        async renderEmailTemplate(templateName, data) {
            const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
            try {
                let html = await fs.readFile(templatePath, 'utf8');
                
                // Replace placeholders
                Object.keys(data).forEach(key => {
                    const regex = new RegExp(`{{${key}}}`, 'g');
                    html = html.replace(regex, data[key]);
                });
                
                return html;
            } catch (err) {
                console.error(`[EmailService] Failed to read template ${templateName}:`, err.message);
                throw err;
            }
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
}

module.exports = new EmailService();