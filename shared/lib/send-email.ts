import { Resend } from "resend";
                                                              {/** template: React.ReactNode,*/}
// export const sendEmail = async (to: string, subject: string,  html: string ) => {
//     const resend = new Resend(process.env.RESEND_API_KEY);
//     const { data, error } = await resend.emails.send({
//         from: 'onboarding@resend.dev',
//         to,
//         subject,
//       //  text: '',
//       //  react: template,
//         html,
//     });

//     if (error) {
//     throw error;
//     }

//     return data;
// }

export const sendEmail = (to: string, subject: string, html: string) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  return resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject,
    html,
  });
};
