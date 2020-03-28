const assert = require('assert');
const PasswordHelper = require('../src/helpers/passwordHelper');

const SENHA = '123456';
const HASH = '$2b$04$5AzCaAbujScJuV4L1ocmLukhNuoHQ.MFva7C1/MNJQAhbGD5XjpaO'



describe('UserHelper test suite', function () {
    it('deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA);

        //const temp = await PasswordHelper.hashPassword('123456');
        //console.log('result', temp)
        assert.ok(result.length > 10);
    });
    it('deve comparar uma senha e seu hash', async () => {
        const result = PasswordHelper.comparePassword(SENHA, HASH)
        assert.ok(result)
    })

});