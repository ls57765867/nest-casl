import { UserService } from './user.service';
import { User } from './user.entity';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<User[]>;
    addUser(user: User): Promise<User>;
    getProfile(): Promise<User | null>;
    getLogs(): Promise<import("../logs/logs.entity").Logs[]>;
}
