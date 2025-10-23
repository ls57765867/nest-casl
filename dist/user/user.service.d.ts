import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Logs } from 'src/logs/logs.entity';
export declare class UserService {
    private readonly userRepository;
    private readonly logsRepository;
    constructor(userRepository: Repository<User>, logsRepository: Repository<Logs>);
    findAll(): Promise<User[]>;
    find(username: string): Promise<User | null>;
    getUserById(id: number): Promise<User | null>;
    create(user: User): Promise<User>;
    update(id: number, user: Partial<User>): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    getProfile(id: number): Promise<User | null>;
    getLogs(id: number): Promise<Logs[]>;
}
