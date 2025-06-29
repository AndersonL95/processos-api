import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "andersonmisterkill@gmail.com",
    pass: "zvvj gycy hozs lplz",
  },
});

export async function sendResetEmail(to: string, link: string) {
  await transporter.sendMail({
    from: '"Doc in Hand" <seuemail@gmail.com>',
    to,
    subject: "Redefinição de senha",
    html: `
      <p>Você solicitou a redefinição de senha.</p>
      <p><a href="${link}">Clique aqui para redefinir</a></p>
      <p>Esse link expira em 30 minutos.</p>
    `,
  });
}
