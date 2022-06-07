'use strict';

const { v3: uuidv3 } = require('uuid')
const fetch = require('node-fetch')
const crypto = require('crypto');

class ExplodiumAuth {
    async getAuth(username, password) {
        let auth = crypto.createHash('sha512').update('mK6XgF5KEnK#BEMSfjF6CjzCAdMsGQSfXbGMqSE#').digest('hex');
        let api_url = `https://launcher.explodium.fr/launcher/user-launcher/assets/php/user/GetUser.php?auth=${auth}`;
        let passwordcryp = crypto.createHash('sha512').update(password).digest('hex')
        let users = (await fetch(`${api_url}`).then(res => res.json())).find(users => users.pseudo == username);
        let UUID = uuidv3(users.pseudo, uuidv3.DNS)
        let user = {
            access_token: 'eyJhbGciOiJIUzI1NiJ9.eyJ4dWlkIjoiMjUzNTQzMjY5NzExODg4NiIsImFnZyI6IkFkdWx0Iiwic3ViIjoiOWJiNjI4ZjQtMmQ1ZS00ZTY3LWJkZWItZjVkN2IyN2RmNjRlIiwibmJmIjoxNjU0NTMxMzc5LCJhdXRoIjoiWEJPWCIsInJvbGVzIjpbXSwiaXNzIjoiYXV0aGVudGljYXRpb24iLCJleHAiOjE2NTQ2MTc3NzksImlhdCI6MTY1NDUzMTM3OSwicGxhdGZvcm0iOiJVTktOT1dOIiwieXVpZCI6IjY3MWI4MDIwZDU2Yjk2ZjA0NTc2NzliODdkYTI0MzcyIn0.Z4xaso9kKfi0Bxub_CQlI8uoTRuHDfEhqOe6euq7b68',
            client_token: 'null',
            uuid: UUID,
            name: username,
            user_properties: '{}',
            meta: {
                offline: true,
                type: 'ExploConnect'
            }
        }
        if (passwordcryp == users.password) return user
        else return { error: 'Impossible de se connecter au Launcher !\nNom d\'utilisateur et/ou mot de passe incorrect(s)' }  
    }

    async refresh(acc) {
        let UUID = uuidv3(acc.name, uuidv3.DNS)
        let user = {
            access_token: 'eyJhbGciOiJIUzI1NiJ9.eyJ4dWlkIjoiMjUzNTQzMjY5NzExODg4NiIsImFnZyI6IkFkdWx0Iiwic3ViIjoiOWJiNjI4ZjQtMmQ1ZS00ZTY3LWJkZWItZjVkN2IyN2RmNjRlIiwibmJmIjoxNjU0NTMxMzc5LCJhdXRoIjoiWEJPWCIsInJvbGVzIjpbXSwiaXNzIjoiYXV0aGVudGljYXRpb24iLCJleHAiOjE2NTQ2MTc3NzksImlhdCI6MTY1NDUzMTM3OSwicGxhdGZvcm0iOiJVTktOT1dOIiwieXVpZCI6IjY3MWI4MDIwZDU2Yjk2ZjA0NTc2NzliODdkYTI0MzcyIn0.Z4xaso9kKfi0Bxub_CQlI8uoTRuHDfEhqOe6euq7b68',
            client_token: 'null',
            uuid: UUID,
            name: acc.name,
            user_properties: '{}',
            meta: {
                offline: true,
                type: 'ExploConnect'
            }
        }
        return user
    }

    async validate(acc) {
        let post = {
            access_token: 'eyJhbGciOiJIUzI1NiJ9.eyJ4dWlkIjoiMjUzNTQzMjY5NzExODg4NiIsImFnZyI6IkFkdWx0Iiwic3ViIjoiOWJiNjI4ZjQtMmQ1ZS00ZTY3LWJkZWItZjVkN2IyN2RmNjRlIiwibmJmIjoxNjU0NTMxMzc5LCJhdXRoIjoiWEJPWCIsInJvbGVzIjpbXSwiaXNzIjoiYXV0aGVudGljYXRpb24iLCJleHAiOjE2NTQ2MTc3NzksImlhdCI6MTY1NDUzMTM3OSwicGxhdGZvcm0iOiJVTktOT1dOIiwieXVpZCI6IjY3MWI4MDIwZDU2Yjk2ZjA0NTc2NzliODdkYTI0MzcyIn0.Z4xaso9kKfi0Bxub_CQlI8uoTRuHDfEhqOe6euq7b68',
            client_token: 'null',
        }
        let auth = crypto.createHash('sha512').update('mK6XgF5KEnK#BEMSfjF6CjzCAdMsGQSfXbGMqSE#').digest('hex');
        let api_url = `https://launcher.explodium.fr/launcher/user-launcher/assets/php/user/GetUser.php?auth=${auth}`;
        let message = await fetch(`${api_url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        });

        if (message.status == 204) return true
        else return false
    }

    async invalidate(acc) {
        let post = {
            accessToken: "eyJhbGciOiJIUzI1NiJ9.eyJ4dWlkIjoiMjUzNTQzMjY5NzExODg4NiIsImFnZyI6IkFkdWx0Iiwic3ViIjoiOWJiNjI4ZjQtMmQ1ZS00ZTY3LWJkZWItZjVkN2IyN2RmNjRlIiwibmJmIjoxNjU0NTMxMzc5LCJhdXRoIjoiWEJPWCIsInJvbGVzIjpbXSwiaXNzIjoiYXV0aGVudGljYXRpb24iLCJleHAiOjE2NTQ2MTc3NzksImlhdCI6MTY1NDUzMTM3OSwicGxhdGZvcm0iOiJVTktOT1dOIiwieXVpZCI6IjY3MWI4MDIwZDU2Yjk2ZjA0NTc2NzliODdkYTI0MzcyIn0.Z4xaso9kKfi0Bxub_CQlI8uoTRuHDfEhqOe6euq7b68",
            clientToken: acc.client_token,
        }
        let auth = crypto.createHash('sha512').update('mK6XgF5KEnK#BEMSfjF6CjzCAdMsGQSfXbGMqSE#').digest('hex');
        let api_url = `https://launcher.explodium.fr/launcher/user-launcher/assets/php/user/GetUser.php?auth=${auth}`;
        let message = await fetch(`${api_url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        }).then(res => res.text());

        if (message == "") {
            return true;
        } else return false;
    }

    ChangeAuthApi(url) {
        api_url = url
    }
}

module.exports = new ExplodiumAuth;