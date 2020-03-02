import multer from 'multer';
import crypto from 'crypto'; // gera caracteres aleatórios.
import { extname, resolve } from 'path'; // para adicionar as extensões desejadas dos arquivos e resolve para percorrer um caminho.

// exporta objeto de configuração.
export default {
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, res) => {
                if (err) return cb(err);
                // cb é a function que precisa ser executado com o erro ou nome do arquivo.
                return cb(
                    null,
                    res.toString('hex') + extname(file.originalname)
                );
            });
        },
    }),
};
