import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import EMPLOYEE from '../model/EMPLOYEE.js'

dotenv.config()


const transporter = nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASS
    }
})

//Send email when employee create new account
export const sendMailToEmployee = async (req ,res, next)=>{
    try{
       const {empId} = req.params

       const {password} = req.body

       if(!empId || !password) return res.status(400).json({message:"Please provide employee id or employee password.",status:400})

       const existEmp = await EMPLOYEE.findById(empId)

       if(!existEmp) return res.status(404).json({message:"Employee is not found for sending mail.",status:404})

       const mailOption = {
        from:process.env.EMAIL,
        to:existEmp.email,
        subject:'Welcome to It Service.',
        html:`<!DOCTYPE html>
        <html lang="en">
        
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome Technician Email</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              font-family: 'Arial', sans-serif;
            }
        
            .email-container {
              max-width: 600px;
              margin: 20px auto;
              background: #ffffff;
              padding: 20px;
              border-radius: 8px;
            }
        
            h2 {
              color: #333333;
            }
        
            p {
              color: #555555;
              font-size: 16px;
              line-height: 1.5;
            }
        
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
        
            td {
              padding: 10px;
              border: 1px solid #dddddd;
              font-size: 15px;
            }
        
            .footer {
              margin-top: 30px;
              font-size: 14px;
              color: #888888;
              text-align: center;
            }
        
            @media (max-width: 600px) {
              .email-container {
                padding: 15px;
              }
        
              table td {
                font-size: 14px;
                padding: 8px;
              }
            }
          </style>
        </head>
        
        <body>
          <div class="email-container">
            <h2>Welcome to It Service!</h2>
        
            <p>Hi <strong>${existEmp.name}</strong>,</p>
        
            <p>We are excited to have you join as a Technician. Below are your account details:</p>
        
            <table>
              <tr>
                <td><strong>Name</strong></td>
                <td>${existEmp.name}</td>
              </tr>
              <tr>
                <td><strong>Email</strong></td>
                <td>${existEmp.email}</td>
              </tr>
              <tr>
                <td><strong>Password</strong></td>
                <td>${password}</td>
              </tr>
              <tr>
                <td><strong>Mobile</strong></td>
                <td>${existEmp.mobileno}</td>
              </tr>
            </table>
        
            <p style="margin-top: 20px;">You can now log in to your account and start using the platform.</p>
        
            <p>If you have any questions, feel free to contact us.</p>
        
            <div class="footer">
              Thanks,<br />
              The It Service Team
            </div>
          </div>
        </body>
        
        </html>
        `
       }

       //Send a mail
       const info = await transporter.sendMail(mailOption)

       return res.status(200).json({message:"Mail sended successfully",data:info.response})

    }catch(err){
        next(err)
    }
}
