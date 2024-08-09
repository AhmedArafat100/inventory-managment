const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Product = require('../models/productmodel');
const User = require('../models/userModel'); // Assuming you have a user model

class Email {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp-gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.APP_MAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    this.scheduleCronJob();
  }

  scheduleCronJob() {
    cron.schedule('0 0 1 * *', async () => {
      const now = new Date();
      const upcomingExpirationDate = new Date();
      upcomingExpirationDate.setMonth(now.getMonth() + 6); // add 3 months

      const expiringProducts = await Product.find({
        expirationDate: { $gte: now, $lte: upcomingExpirationDate },
      });

      const managers = await User.find({ role: 'manager' });

      if (managers.length === 0) {
        console.log('No managers found to send emails to.');
        return;
      }

      if (expiringProducts.length > 0) {
        const emailText = this.createEmailTemplate(expiringProducts, 'Expiring Products Alert', 'The following products in our inventory are nearing their expiration dates and require immediate attention:');
        await this.sendEmailsToManagers(emailText, 'Expiring Products Alert', managers);
      }


    });
    cron.schedule("* * * * 4",async()=>{
      const lowQuantityProducts = await Product.find({
        quantity: { $lte: 10},
      });

      const managers = await User.find({ role: 'manager' });

      if (managers.length === 0) {
        console.log('No managers found to send emails to.');
        return;
      }

      if (lowQuantityProducts.length > 0) {
        const emailText = this.createEmailTemplate(lowQuantityProducts, 'Low Quantity Products Alert', 'The following products in our inventory have a quantity of less than 4 and require immediate attention:');
        await this.sendEmailsToManagers(emailText, 'Low Quantity Products Alert', managers);
      }
    })
  }

  createEmailTemplate(products, subject, message) {
    const header = `Dear Team,\n\n${message}\n\n`;
    const productDetails = products.map(product =>
      `Product Name: ${product.name}\nQuantity: ${product.quantity}\nExpiration Date: ${product.expirationDate.toDateString()}\n\n`
    ).join('');
    const footer = 'Please ensure that these products are managed appropriately to avoid any wastage or loss.\n\nBest Regards,\nInventory Management Team';

    return header + productDetails + footer;
  }

  async sendEmailsToManagers(emailText, subject, managers) {
    for (const manager of managers) {
      try {
        await this.transporter.sendMail({
          from: process.env.APP_MAIL,
          to: manager.email,
          subject: subject,
          text: emailText,
        });
        console.log(`Email sent to ${manager.email}`);
      } catch (error) {
        console.error(`Error sending email to ${manager.email}:`, error);
      }
    }
  }
}

module.exports = Email;