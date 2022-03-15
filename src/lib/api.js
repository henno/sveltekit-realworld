const base = 'https://conduit.productionready.io/api';
import {PrismaClient} from '@prisma/client'

async function send({method, path, data, token}) {

    const prisma = new PrismaClient()

    async function main() {
        await prisma.Todo.create({
            data: {
                uid: 'fafafa',
                created_at: new Date,
                text: 'foo',
                done: true,
            },
        })

        const allUsers = await prisma.Todo.findMany({})
        console.dir(allUsers, {depth: null})
    }

    main()
        .catch((e) => {
            throw e
        })
        .finally(async () => {
            await prisma.$disconnect()
        })

    const opts = {method, headers: {}};

    if (data) {
        opts.headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(data);
    }

    if (token) {
        opts.headers['Authorization'] = `Token ${token}`;
    }

    return fetch(`${base}/${path}`, opts)
        .then((r) => r.text())
        .then((json) => {
            try {
                return JSON.parse(json);
            } catch (err) {
                return json;
            }
        });
}

export function get(path, token) {
    return send({method: 'GET', path, token});
}

export function del(path, token) {
    return send({method: 'DELETE', path, token});
}

export function post(path, data, token) {
    return send({method: 'POST', path, data, token});
}

export function put(path, data, token) {
    return send({method: 'PUT', path, data, token});
}
