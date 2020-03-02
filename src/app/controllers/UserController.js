import * as Yup from 'yup';
import User from '../models/User';

class UserController {
    async store(req, res) {
        // passar os parametros obrigatórios e os tipos.
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            password: Yup.string()
                .required()
                .min(6),
        });

        // verificar se o req.body está passando todas as informações solicitadas.
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const userExists = await User.findOne({
            where: { email: req.body.email },
        });

        if (userExists) {
            return res.status(400).json({ error: 'User already exists.' });
        }
        const { name, email } = await User.create(req.body);

        return res.json({
            name,
            email,
        });
    }

    // para atualização de senha, solicitar senha antiga e nova.
    async update(req, res) {
        // passar os parametros obrigatórios e os tipos para atualização de usuário.
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string()
                .min(6)
                .when('oldPassword', (oldPassword, field) =>
                    oldPassword ? field.required() : field
                ),
            confirmPassword: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('password')]) : field
            ),
            // when validação condicional onde tenho acesso a todos os outros campos do Yup.
        });

        // verificar se o req.body está passando todas as informações solicitadas.
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { email, oldPassword } = req.body;

        const user = await User.findByPk(req.userId);

        // verifica se está mudando o email.
        if (email && email !== user.email) {
            const userExists = await User.findOne({
                where: { email },
            });

            if (userExists) {
                return res.status(400).json({ error: 'User already exists.' });
            }
        }

        // verifica senha antiga.
        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ error: 'Password does not match' });
        }
        // se tudo deu certo, atualiza as informações.
        const { id, name } = await user.update(req.body);

        return res.json({
            id,
            name,
            email,
        });
    }
}
export default new UserController();
