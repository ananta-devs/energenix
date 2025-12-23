import html2pdf from 'html2pdf.js';

export const downloadInvoice = (order) => {
    // Calculations
    const isCOD = order.payment_type === "COD";
    const shippingCost = isCOD ? 100 : 0;
    
    // Calculate subtotal
    const subtotal = order.items.reduce((acc, item) => {
        return acc + (item.unit_price * item.quantity);
    }, 0);

    // Calculate Discount
    let discount = 0;
    if (order.payment_type === "PREPAID") {
        discount = subtotal - (Number(order.prepaid_amount) || 0);
    } else if (order.payment_type === "COD") {
        discount = subtotal - (Number(order.cod_amount) || 0);
    }
    if (discount < 0) discount = 0;

    const total = subtotal + shippingCost - discount;

    // Date formatting
    const orderDate = new Date(order.order_date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const downloadDateTime = new Date().toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    // Generate Items HTML
    const itemsHtml = order.items.map((item, index) => {
        const gstPercent = item.gst_percentage || 0;
        const amount = item.unit_price * item.quantity; // Total inclusive amount
        
        // Assuming item.unit_price is inclusive of tax
        const baseUnitPrice = item.unit_price / (1 + (gstPercent / 100));
        const taxAmount = amount - (baseUnitPrice * item.quantity);
        
        return `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <div class="item-name">${item.name}</div>
                    <div class="pack-type">${item.pack_type || 'Pack of 1'}</div>
                    <div class="pack-type">HSN: ${item.hsn || 'N/A'}</div>
                </td>
                <td>${item.quantity}</td>
                <td>₹${baseUnitPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                <td>
                    ₹${taxAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    <div class="gst-per">(${gstPercent}%)</div>
                </td>
                <td>₹${amount.toLocaleString('en-IN')}</td>
            </tr>
        `;
    }).join('');

    // HTML Content
    const content = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <style>
                .invoice-container * { margin: 0; padding: 0; box-sizing: border-box; }
                .invoice-container { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: white; color: #1a1a1a; width: 100%; max-width: 210mm; margin: 0 auto; padding: 20px; }
                .invoice-header { padding: 5mm; border-bottom: 1px solid #e5e5e5; }
                .header-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10mm; }
                .logo-section { display: flex; align-items: center; gap: 15px; }
                .logo-placeholder { width: 60px; height: 60px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
                .logo-placeholder img { width: 100%; height: 100%; object-fit: contain; }
                .company-info h1 { font-size: 28px; font-weight: 300; letter-spacing: 2px; color: #1a1a1a; margin-bottom: 4px; }
                .company-info p { font-size: 12px; color: #666; font-weight: 300; letter-spacing: 0.5px; }
                .invoice-title { text-align: right; }
                .invoice-title h2 { font-size: 13px; font-weight: 400; letter-spacing: 2px; color: #666; margin-bottom: 8px; }
                .invoice-number { font-size: 22px; font-weight: 300; color: #1a1a1a; margin-bottom: 4px; }
                .invoice-date { font-size: 12px; color: #999; font-weight: 300; }
                .parties-section { display: grid; grid-template-columns: 1fr 1fr; gap: 110mm; padding: 0 5mm; margin-top: 5mm; }
                .party-box h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; font-weight: 500; color: #999; }
                .party-box .company-name { font-size: 15px; font-weight: 400; margin-bottom: 4px; color: #1a1a1a; }
                .party-box p { color: #666; font-size: 13px; line-height: 1.8; font-weight: 300; }
                .invoice-body { padding: 5mm 5mm; }
                .items-table { width: 100%; border-collapse: collapse; margin-bottom: 5px; }
                .items-table thead { border-bottom: 1px solid #e5e5e5; }
                .items-table th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #999; font-weight: 500; padding-bottom: 10px; }
                .items-table tbody tr { border-bottom: 1px solid #f5f5f5; }
                .items-table td { padding: 10px 0; color: #666; font-size: 13px; font-weight: 300; vertical-align: top; }
                .item-name { font-weight: 400; color: #1a1a1a; }
                .pack-type { font-size: 11px; color: #999; font-weight: 300; }
                .gst-per { font-size: 11px; color: #999; font-weight: 300; }
                .totals-section { display: flex; justify-content: flex-end; margin-bottom: 10mm; }
                .totals-box { width: 300px; }
                .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 13px; color: #666; font-weight: 300; }
                .total-row.final { border-top: 1px solid #1a1a1a; margin-top: 12px; padding-top: 16px; font-size: 17px; font-weight: 400; color: #1a1a1a; }
                .signature-section { margin-top: 20px; text-align: right; }
                .signature-box { display: inline-block; text-align: center; }
                .signature-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #999; margin-bottom: 8px; font-weight: 500; }
                .signature-placeholder { width: 200px; height: 60px; margin: 6px auto 8px; border-bottom: 1px solid #e5e5e5; display: flex; align-items: center; justify-content: center; }
                .signature-placeholder img { max-width: 100%; max-height: 100%; object-fit: contain; }
                .invoice-footer { border-top: 1px solid #e5e5e5; margin-top: auto; }
                .thank-you { text-align: center; color: #999; font-size: 11px; font-weight: 300; letter-spacing: 0.5px; padding: 5mm 0; }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                <div style="font-size: 8px; color: #999; margin-bottom: 2px; text-align: left;">
                    Generated on: ${downloadDateTime}
                </div>
                <div class="invoice-header">
                    <div class="header-top">
                        <div class="logo-section">
                            <div class="logo-placeholder">
                                <img src="https://res.cloudinary.com/djva05hfi/image/upload/v1766300056/logo_vhed4u.png" alt="logo" crossorigin="anonymous" />
                            </div>
                            <div class="company-info">
                                <h1>ENERGENIX</h1>
                                <p>where ancient wisdom meets modern science</p>
                            </div>
                        </div>
                        <div class="invoice-title">
                            <h2>INVOICE</h2>
                            <div class="invoice-number">#${order.order_id}</div>
                            <div class="invoice-date">${orderDate}</div>
                        </div>
                    </div>

                    <div class="parties-section">
                        <div class="party-box">
                            <h3>From</h3>
                            <div class="company-name">EnergeniX</div>
                            <p>
                                Bhita<br />
                                Bardhaman, 713102<br />
                                West Bengal, India<br />
                                GSTIN : 19HXIPD8906E1Z8<br />
                                energenix.0@gmail.com
                            </p>
                        </div>

                        <div class="party-box">
                            <h3>Bill To</h3>
                            <div class="company-name">${order.customer.name}</div>
                            <p>
                                ${order.customer.address_line_one}<br />
                                ${order.customer.address_line_two ? order.customer.address_line_two + '<br />' : ''}
                                ${order.customer.city}, ${order.customer.state} ${order.customer.pincode}<br />
                                ${order.customer.email || order.customer.phone}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="invoice-body">
                    <table class="items-table">
                        <thead>
                            <tr>
                                <th>SL. No.</th>
                                <th>Description</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>IGST</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>

                    <div class="totals-section">
                        <div class="totals-box">
                            <div class="total-row subtotal">
                                <span>Subtotal</span>
                                <span>₹${subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            ${discount > 0 ? `
                            <div class="total-row">
                                <span>Discount</span>
                                <span style="color: #10b981;">- ₹${discount.toLocaleString('en-IN')}</span>
                            </div>
                            ` : ''}
                            <div class="total-row">
                                <span>Shipping</span>
                                <span>+ ₹${shippingCost.toLocaleString('en-IN')}</span>
                            </div>
                            <div class="total-row final">
                                <span>Total Due</span>
                                <span>₹${total.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                    <div class="signature-section">
                        <div class="signature-box">
                            <div class="signature-placeholder">
                                <img src="https://res.cloudinary.com/djva05hfi/image/upload/v1766425380/Sign-EnergeniX_hvic9h.png" alt="signature" crossorigin="anonymous" />
                            </div>
                            <div class="signature-label">Authorized Signatory</div>
                        </div>
                    </div>
                </div>

                <div class="invoice-footer">
                    <div class="thank-you">Thank you for your business!</div>
                </div>
            </div>
        </body>
        </html>
    `;

    const element = document.createElement('div');
    element.innerHTML = content;

    const opt = {
        margin: 0,
        filename: `Invoice-${order.order_id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Use a Promise to handle the save to ensure it completes (though return value isn't strictly used in onClick)
    return html2pdf().set(opt).from(element).save();
};
