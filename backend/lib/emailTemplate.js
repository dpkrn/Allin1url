const  Verification_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              color: #333;
              line-height: 1.8;
          }
          .verification-code {
              display: block;
              margin: 20px 0;
              font-size: 22px;
              color: #4CAF50;
              background: #e8f5e9;
              border: 1px dashed #4CAF50;
              padding: 10px;
              text-align: center;
              border-radius: 5px;
              font-weight: bold;
              letter-spacing: 2px;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Verify Your Email</div>
          <div class="content">
              <p>Hello {username},</p>
              <p>Thank you for signing up! Please confirm your email address by entering the code below:</p>
              <span class="verification-code">{verificationCode}</span>
              <p>If you did not create an account, no further action is required. If you have any questions, feel free to contact our support team.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;




const Welcome_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to All in1 url!</title>
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 20px;
              color: #333;
          }
          .email-wrapper {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          }
          .header {
              background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #3b82f6 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
          }
          .header h1 {
              font-size: 32px;
              font-weight: 700;
              margin-bottom: 10px;
          }
          .header p {
              font-size: 16px;
              opacity: 0.95;
          }
          .content {
              padding: 40px 30px;
          }
          .welcome-message {
              font-size: 20px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 20px;
          }
          .highlight-box {
              background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
              border-left: 4px solid #9333ea;
              padding: 20px;
              border-radius: 8px;
              margin: 25px 0;
          }
          .highlight-box strong {
              color: #9333ea;
              font-size: 18px;
          }
          .benefits {
              margin: 30px 0;
          }
          .benefit-item {
              display: flex;
              align-items: flex-start;
              margin-bottom: 20px;
              padding: 15px;
              background: #f9fafb;
              border-radius: 10px;
          }
          .benefit-icon {
              font-size: 24px;
              margin-right: 15px;
              min-width: 30px;
          }
          .benefit-content h3 {
              color: #1f2937;
              font-size: 18px;
              margin-bottom: 5px;
          }
          .benefit-content p {
              color: #6b7280;
              font-size: 14px;
              line-height: 1.6;
          }
          .step-section {
              margin: 30px 0;
          }
          .step-item {
              display: flex;
              align-items: flex-start;
              margin-bottom: 25px;
              padding: 20px;
              background: #f9fafb;
              border-radius: 12px;
              border-left: 4px solid #9333ea;
          }
          .step-number {
              background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
              color: white;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 700;
              font-size: 18px;
              margin-right: 20px;
              flex-shrink: 0;
          }
          .step-content h3 {
              color: #1f2937;
              font-size: 18px;
              margin-bottom: 8px;
          }
          .step-content p {
              color: #6b7280;
              font-size: 14px;
              line-height: 1.6;
          }
          .cta-section {
              text-align: center;
              margin: 35px 0;
          }
          .cta-button {
              display: inline-block;
              padding: 16px 40px;
              background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
              color: white;
              text-decoration: none;
              border-radius: 12px;
              font-size: 18px;
              font-weight: 600;
              box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
          }
          .link-preview {
              background: #f3f4f6;
              padding: 15px;
              border-radius: 8px;
              text-align: center;
              margin: 25px 0;
              border: 2px dashed #9333ea;
          }
          .link-preview code {
              color: #9333ea;
              font-size: 16px;
              font-weight: 600;
              background: white;
              padding: 8px 15px;
              border-radius: 6px;
              display: inline-block;
          }
          .tips-box {
              background: #eff6ff;
              border-left: 4px solid #3b82f6;
              padding: 20px;
              border-radius: 8px;
              margin: 25px 0;
          }
          .tips-box h3 {
              color: #1e40af;
              font-size: 18px;
              margin-bottom: 10px;
          }
          .tips-box ul {
              color: #1e3a8a;
              padding-left: 20px;
              line-height: 1.8;
          }
          .tips-box li {
              margin-bottom: 8px;
          }
          .footer {
              background: #f9fafb;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
          }
          .footer p {
              color: #6b7280;
              font-size: 14px;
              margin: 5px 0;
          }
          .social-links {
              margin-top: 20px;
          }
          .social-links a {
              color: #9333ea;
              text-decoration: none;
              margin: 0 10px;
          }
          @media only screen and (max-width: 600px) {
              .content {
                  padding: 30px 20px;
              }
              .header {
                  padding: 30px 20px;
              }
              .header h1 {
                  font-size: 26px;
              }
          }
      </style>
  </head>
  <body>
      <div class="email-wrapper">
          <div class="header">
              <h1>🎉 Welcome to All in1 url!</h1>
              <p>Your journey to better link management starts now</p>
          </div>
          <div class="content">
              <p class="welcome-message">Hello {name} (@{username})!</p>
              
              <p style="color: #4b5563; line-height: 1.8; margin-bottom: 20px;">
                  We're absolutely thrilled to have you join the All in1 url community! 🚀 Your account has been successfully created, and you're just moments away from transforming how you share and manage your social media links.
              </p>

              <div class="highlight-box">
                  <strong>✨ Your Personalized Link is Ready!</strong>
                  <p style="margin-top: 10px; color: #6b7280;">
                      Share all your profiles with one simple link: <code style="color: #9333ea; background: white; padding: 5px 10px; border-radius: 4px;">https://allin1url.in/{username}</code>
                  </p>
              </div>

              <div class="benefits">
                  <h2 style="color: #1f2937; font-size: 24px; margin-bottom: 20px; text-align: center;">🌟 What You Can Do Now:</h2>
                  
                  <div class="benefit-item">
                      <div class="benefit-icon">🔗</div>
                      <div class="benefit-content">
                          <h3>One Link, All Your Profiles</h3>
                          <p>Create a single, memorable link that leads to all your social media profiles. No more long, complicated URLs!</p>
                      </div>
                  </div>

                  <div class="benefit-item">
                      <div class="benefit-icon">📊</div>
                      <div class="benefit-content">
                          <h3>Track Every Click</h3>
                          <p>Get real-time analytics on who's visiting your links. Know exactly when and where your audience is engaging.</p>
                      </div>
                  </div>

                  <div class="benefit-item">
                      <div class="benefit-icon">📧</div>
                      <div class="benefit-content">
                          <h3>Instant Email Notifications</h3>
                          <p>Receive email alerts every time someone clicks your links. Stay connected with your audience in real-time.</p>
                      </div>
                  </div>

                  <div class="benefit-item">
                      <div class="benefit-icon">⚡</div>
                      <div class="benefit-content">
                          <h3>Update Once, Reflect Everywhere</h3>
                          <p>Change a link once, and it updates across all platforms instantly. No more manual updates everywhere!</p>
                      </div>
                  </div>

                  <div class="benefit-item">
                      <div class="benefit-icon">🎨</div>
                      <div class="benefit-content">
                          <h3>Beautiful Landing Page</h3>
                          <p>Your profile gets a stunning, customizable landing page that showcases all your links in one beautiful place.</p>
                      </div>
                  </div>
              </div>

              <div class="cta-section">
                  <a href="https://allin1url.in/app/home" class="cta-button">Start Building Your Links →</a>
              </div>

              <div class="link-preview">
                  <p style="color: #6b7280; margin-bottom: 10px; font-size: 14px;">Your personalized link:</p>
                  <code>https://allin1url.in/{username}</code>
              </div>

              <div class="step-section">
                  <h2 style="color: #1f2937; font-size: 24px; margin-bottom: 20px; text-align: center;">📋 Quick Start Guide:</h2>
                  
                  <div class="step-item">
                      <div class="step-number">1</div>
                      <div class="step-content">
                          <h3>Add Your First Link</h3>
                          <p>Go to your dashboard and click "Create Bridge" to add your first social media link. Start with your most important profile!</p>
                      </div>
                  </div>

                  <div class="step-item">
                      <div class="step-number">2</div>
                      <div class="step-content">
                          <h3>Customize Your Profile</h3>
                          <p>Visit your profile page to add a bio, profile picture, and personalize your landing page. Make it uniquely yours!</p>
                      </div>
                  </div>

                  <div class="step-item">
                      <div class="step-number">3</div>
                      <div class="step-content">
                          <h3>Share Your Link</h3>
                          <p>Copy your personalized link <code style="background: #f3f4f6; padding: 2px 8px; border-radius: 4px;">https://allin1url.in/{username}</code> and share it everywhere - in your bio, email signature, business cards, and more!</p>
                      </div>
                  </div>

                  <div class="step-item">
                      <div class="step-number">4</div>
                      <div class="step-content">
                          <h3>Track Your Analytics</h3>
                          <p>Monitor who's clicking your links in real-time. You'll receive email notifications for every visit, so you never miss an engagement!</p>
                      </div>
                  </div>
              </div>

              <div class="tips-box">
                  <h3>💡 Pro Tips for Success:</h3>
                  <ul>
                      <li>Keep your link short and memorable - it's already done for you!</li>
                      <li>Update your links in one place - changes reflect everywhere instantly</li>
                      <li>Use descriptive platform names (e.g., "Instagram" instead of "ig")</li>
                      <li>Check your email notifications to see who's visiting your links</li>
                      <li>Share your link on all your social media profiles for maximum reach</li>
                  </ul>
              </div>

              <p style="color: #4b5563; line-height: 1.8; margin-top: 30px; text-align: center;">
                  Questions? We're here to help! Check out our <a href="https://allin1url.in/app/doc" style="color: #9333ea; text-decoration: none;">documentation</a> or reply to this email.
              </p>
          </div>
          <div class="footer">
              <p><strong>Happy Linking! 🎯</strong></p>
              <p>The All in1 url Team</p>
              <div class="social-links">
                  <a href="https://allin1url.in/app/doc">Documentation</a> | 
                  <a href="https://allin1url.in/app/home">Dashboard</a>
              </div>
              <p style="margin-top: 20px; font-size: 12px;">
                  &copy; ${new Date().getFullYear()} All in1 url. All rights reserved.
              </p>
              <p>For any kind of support you can visit to our Email <a href="mailto:support@All in1 url.com">support@All in1 url.com</a></p>
              <p style="font-size: 12px; color: #9ca3af;">
                  This is an automated welcome email from All in1 url.
              </p>
          </div>
      </div>
  </body>
  </html>
`;

const Notification_Email_Template=`<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;box-sizing:border-box;">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Visit Notification</title>
    <style>
        /* Reset */
        body, table, td, p, a {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            color: #333;
        }
        a {
            text-decoration: none;
        }
        .card {
            background: #f9f9f9;
            border-radius: 8px;
            padding: 15px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background: linear-gradient(90deg, #4f46e5, #7c3aed);
            color: #fff;
            border-radius: 6px;
            font-weight: bold;
            transition: background 0.4s ease;
        }
        .button:hover {
            background: linear-gradient(90deg, #7c3aed, #4f46e5);
        }
        @media (max-width: 600px) {
            .main-table {
                width: 100% !important;
            }
        }
    </style>
</head>
<body style="background-color:#f4f4f4;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding:20px 0;">
                <table class="main-table" role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <tr>
                        <td align="center" bgcolor="#4f46e5" style="padding:20px;color:#ffffff;">
                            <h1 style="margin:0;font-size:24px;">🔔 LinkBriger Visit Alert</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:20px;">
                            <p style="font-size:16px;margin-bottom:10px;">Hi <b>{{username}}</b>,</p>
                            <p style="font-size:16px;margin-bottom:20px;">Someone just visited your <b>{{platform}}</b> link!</p>
                              <p><b>Someone from {{city}}, {{country}} using {{browser}} visited your {{platform}} link at {{time}}.</b></p>
                            <div class="card">
                                <p><b>📍 Location:</b> {{city}}, {{country}}</p>
                                <p><b>🖥️ Browser:</b> {{browser}}</p>
                                <p><b>⏰ Time:</b> {{time}}</p>
                                <p><b>🌐 IP:</b> {{ipAdd}}</p>
                            </div>


                            <a href="https://linkbriger.com/analytics" class="button">View Analytics</a>

                            <p style="font-size:14px;color:#555;margin-top:20px;">This is an automatic notification from <b>LinkBriger</b>.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#f4f4f4" align="center" style="padding:15px;color:#999;font-size:12px;">
                            © 2025 LinkBriger. All rights reserved.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`

const Onboarding_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New User Joined - All in1 url</title>
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background: #f4f4f4;
              padding: 20px;
              color: #333;
          }
          .email-wrapper {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }
          .header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 30px;
              text-align: center;
          }
          .header h1 {
              font-size: 28px;
              font-weight: 700;
              margin-bottom: 8px;
          }
          .header p {
              font-size: 16px;
              opacity: 0.95;
          }
          .content {
              padding: 30px;
          }
          .notification-box {
              background: #f0fdf4;
              border: 2px solid #10b981;
              border-radius: 10px;
              padding: 25px;
              margin: 20px 0;
              text-align: center;
          }
          .notification-box h2 {
              color: #065f46;
              font-size: 24px;
              margin-bottom: 15px;
          }
          .user-info {
              background: #ffffff;
              border: 1px solid #d1d5db;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
          }
          .user-info-item {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #e5e7eb;
          }
          .user-info-item:last-child {
              border-bottom: none;
          }
          .user-info-label {
              font-weight: 600;
              color: #374151;
          }
          .user-info-value {
              color: #6b7280;
          }
          .user-info-value a {
              color: #9333ea;
              text-decoration: none;
          }
          .stats-box {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
          }
          .stats-box p {
              color: #92400e;
              line-height: 1.8;
          }
          .footer {
              background: #f9fafb;
              padding: 25px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
          }
          .footer p {
              color: #6b7280;
              font-size: 14px;
              margin: 5px 0;
          }
          @media only screen and (max-width: 600px) {
              .content {
                  padding: 20px;
              }
              .header {
                  padding: 25px 20px;
              }
              .header h1 {
                  font-size: 24px;
              }
          }
      </style>
  </head>
  <body>
      <div class="email-wrapper">
          <div class="header">
              <h1>🎉 New User Joined!</h1>
              <p>Someone just signed up for All in1 url</p>
          </div>
          
          <div class="content">
              <div class="notification-box">
                  <h2>Welcome to the Community!</h2>
                  <p style="color: #065f46; font-size: 16px; line-height: 1.6;">
                      A new user has successfully registered and joined the All in1 url community!
                  </p>
              </div>

              <div class="user-info">
                  <div class="user-info-item">
                      <span class="user-info-label">Username:</span>
                      <span class="user-info-value"><strong>@{username}</strong></span>
                  </div>
                  <div class="user-info-item">
                      <span class="user-info-label">Profile Link:</span>
                      <span class="user-info-value">
                          <a href="https://allin1url.in/{username}" target="_blank">https://allin1url.in/{username}</a>
                      </span>
                  </div>
                  <div class="user-info-item">
                      <span class="user-info-label">Registration Date:</span>
                      <span class="user-info-value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div class="user-info-item">
                      <span class="user-info-label">Registration Time:</span>
                      <span class="user-info-value">${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
              </div>

              <div class="stats-box">
                  <p style="margin-bottom: 10px;"><strong>📊 Community Growth:</strong></p>
                  <p style="font-size: 14px;">
                      Every new member helps grow the All in1 url community! This user can now create personalized links, track analytics, and manage their social media presence all in one place.
                  </p>
              </div>

              <p style="color: #4b5563; line-height: 1.8; margin-top: 25px; text-align: center;">
                  You can view user activity and manage your All in1 url platform from your admin dashboard.
              </p>
          </div>

          <div class="footer">
              <p><strong>All in1 url Admin Notification</strong></p>
              <p style="margin-top: 15px; font-size: 12px;">
                  &copy; ${new Date().getFullYear()} All in1 url. All rights reserved.
              </p>
              <p style="font-size: 12px; color: #9ca3af;">
                  This is an automated notification email sent to the project owner.
              </p>
          </div>
      </div>
  </body>
  </html>
`;

const Profile_Visit_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Profile Visit Notification</title>
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 20px;
              color: #333;
          }
          .email-wrapper {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          }
          .header {
              background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
              position: relative;
              overflow: hidden;
          }
          .header::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
              animation: pulse 3s ease-in-out infinite;
          }
          @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 0.5; }
              50% { transform: scale(1.1); opacity: 0.8; }
          }
          .header h1 {
              font-size: 32px;
              font-weight: 700;
              margin-bottom: 10px;
              position: relative;
              z-index: 1;
          }
          .header p {
              font-size: 16px;
              opacity: 0.95;
              position: relative;
              z-index: 1;
          }
          .content {
              padding: 40px 30px;
          }
          .visit-notification {
              background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
              border-left: 5px solid #3b82f6;
              padding: 25px;
              border-radius: 12px;
              margin: 25px 0;
              text-align: center;
          }
          .visit-notification h2 {
              color: #1e40af;
              font-size: 24px;
              margin-bottom: 15px;
          }
          .visitor-info {
              background: #ffffff;
              border: 2px solid #e5e7eb;
              border-radius: 12px;
              padding: 25px;
              margin: 25px 0;
          }
          .visitor-name {
              font-size: 28px;
              font-weight: 700;
              color: #1f2937;
              margin-bottom: 10px;
              text-align: center;
          }
          .visitor-username {
              font-size: 18px;
              color: #6b7280;
              text-align: center;
              margin-bottom: 20px;
          }
          .visitor-username code {
              background: #f3f4f6;
              padding: 4px 12px;
              border-radius: 6px;
              color: #3b82f6;
              font-weight: 600;
          }
          .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin: 25px 0;
          }
          .detail-card {
              background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
              border-radius: 10px;
              padding: 20px;
              text-align: center;
              border: 1px solid #e5e7eb;
              transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .detail-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .detail-icon {
              font-size: 32px;
              margin-bottom: 10px;
          }
          .detail-label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 5px;
          }
          .detail-value {
              font-size: 16px;
              font-weight: 600;
              color: #1f2937;
          }
          .profile-link-box {
              background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
              border: 2px dashed #f59e0b;
              border-radius: 12px;
              padding: 20px;
              margin: 25px 0;
              text-align: center;
          }
          .profile-link-box p {
              color: #92400e;
              font-size: 14px;
              margin-bottom: 10px;
          }
          .profile-link-box code {
              background: white;
              padding: 8px 16px;
              border-radius: 6px;
              color: #f59e0b;
              font-size: 16px;
              font-weight: 600;
              display: inline-block;
          }
          .cta-section {
              text-align: center;
              margin: 35px 0;
          }
          .cta-button {
              display: inline-block;
              padding: 16px 40px;
              background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
              color: white;
              text-decoration: none;
              border-radius: 12px;
              font-size: 18px;
              font-weight: 600;
              box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
              transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .cta-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
          }
          .stats-box {
              background: #f0fdf4;
              border-left: 4px solid #10b981;
              padding: 20px;
              border-radius: 8px;
              margin: 25px 0;
          }
          .stats-box p {
              color: #065f46;
              line-height: 1.8;
              font-size: 14px;
          }
          .footer {
              background: #f9fafb;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
          }
          .footer p {
              color: #6b7280;
              font-size: 14px;
              margin: 5px 0;
          }
          .footer a {
              color: #3b82f6;
              text-decoration: none;
          }
          @media only screen and (max-width: 600px) {
              .content {
                  padding: 30px 20px;
              }
              .header {
                  padding: 30px 20px;
              }
              .header h1 {
                  font-size: 26px;
              }
              .details-grid {
                  grid-template-columns: 1fr;
              }
              .visitor-name {
                  font-size: 24px;
              }
          }
      </style>
  </head>
  <body>
      <div class="email-wrapper">
          <div class="header">
              <h1>👋 Profile Visit Alert!</h1>
              <p>Someone just checked out your profile</p>
          </div>
          <div class="content">
              <div class="visit-notification">
                  <h2>🎉 Great News!</h2>
                  <p style="color: #1e40af; font-size: 18px; line-height: 1.6;">
                      {{visitorName}} has visited your All in1 url profile!
                  </p>
              </div>

              <div class="visitor-info">
                  <div class="visitor-name">{{visitorDisplayName}}</div>
                  <div class="visitor-username">
                      Username: <code>@{{visitorUsername}}</code>
                  </div>
              </div>

              <div class="details-grid">
                  <div class="detail-card">
                      <div class="detail-icon">📍</div>
                      <div class="detail-label">Location</div>
                      <div class="detail-value">{{city}}, {{country}}</div>
                  </div>
                  <div class="detail-card">
                      <div class="detail-icon">🖥️</div>
                      <div class="detail-label">Browser</div>
                      <div class="detail-value">{{browser}}</div>
                  </div>
                  <div class="detail-card">
                      <div class="detail-icon">⏰</div>
                      <div class="detail-label">Visit Time</div>
                      <div class="detail-value">{{time}}</div>
                  </div>
                  <div class="detail-card">
                      <div class="detail-icon">🌐</div>
                      <div class="detail-label">IP Address</div>
                      <div class="detail-value" style="font-size: 12px;">{{ipAdd}}</div>
                  </div>
              </div>

              <div class="profile-link-box">
                  <p>Your profile link:</p>
                  <code>https://allin1url.in/{{username}}</code>
              </div>

              <div class="stats-box">
                  <p style="margin-bottom: 10px;"><strong>📊 Engagement Insight:</strong></p>
                  <p>
                      Profile visits are a great indicator of interest! Keep sharing your link and engaging with your audience to grow your presence.
                  </p>
              </div>

              <div class="cta-section">
                  <a href="https://allin1url.in/app/analytics" class="cta-button">View Full Analytics →</a>
              </div>

              <p style="color: #4b5563; line-height: 1.8; margin-top: 30px; text-align: center; font-size: 14px;">
                  Want to see more details? Check your analytics dashboard to track all profile visits and link clicks in real-time.
              </p>
          </div>
          <div class="footer">
              <p><strong>All in1 url Notification</strong></p>
              <p style="margin-top: 15px;">
                  <a href="https://allin1url.in/app/settings">Manage Notification Settings</a> | 
                  <a href="https://allin1url.in/app/analytics">View Analytics</a>
              </p>
              <p style="margin-top: 20px; font-size: 12px;">
                  &copy; ${new Date().getFullYear()} All in1 url. All rights reserved.
              </p>
              <p style="font-size: 12px; color: #9ca3af;">
                  This is an automated notification email. You can disable these notifications in your settings.
              </p>
          </div>
      </div>
  </body>
  </html>
`;

module.exports={
    Verification_Email_Template,
    Welcome_Email_Template,
    Notification_Email_Template,
    Onboarding_Email_Template,
    Profile_Visit_Email_Template
}