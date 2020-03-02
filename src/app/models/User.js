import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                password: Sequelize.VIRTUAL,
                password_hash: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );
        // antes de ser salvo esse código abaixo será executado automaticamente.
        this.addHook('beforeSave', async user => {
            if (user.password) {
                user.password_hash = await bcrypt.hash(user.password, 8);
            }
        });

        return this;
    }

    // relacionar o model de User com o de File por causa do avatar_id que foi adicionado depois sem causar nenhum problema.
    static associate(models) {
        this.belongsTo(models.File, { foreignKey: 'avatar_id' });
    }

    // checar se a senha está correta, comparando as duas.
    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }
}

export default User;
