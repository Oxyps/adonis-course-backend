const { randomBytes } = require('crypto');
const { promisify } = require('util');

const Mail = use('Mail');
const Env = use('Env');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class ForgotPasswordController {
	async store({ request }) {
		const email = request.input('email');

		const user = await User.findByOrFail('email', email);

		const random = await promisify(randomBytes)(24);
		const token = random.toString('hex');

		await user.tokens().create({
			token,
			type: 'forgot-password',
		});

		const resetPasswordUrl = `${Env.get(
			'FRONT_URL'
		)}/reset-password?token=${token}`;

		await Mail.send(
			'emails.forgot-password',
			{ name: user.name, token, resetPasswordUrl },
			message => {
				message
					.to(user.email)
					.from('622df40afd-f0dd99@inbox.mailtrap.io')
					.subject('Adonis-course - Recuperação de senha');
			}
		);
	}
}

module.exports = ForgotPasswordController;
