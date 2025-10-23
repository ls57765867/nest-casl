import { AppDataSource } from './data-source'
import { User } from './user/user.entity'

AppDataSource.initialize()
    .then(async () => {
        const users = await AppDataSource.manager.find(User)
        console.log('Loaded users: ', users)

        console.log('Here you can setup and run express / fastify / any other framework.')
    })
    .catch((error) => console.log(error))
