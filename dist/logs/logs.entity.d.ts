import { User } from 'src/user/user.entity';
export declare class Logs {
    id: number;
    path: string;
    method: string;
    data: string;
    result: number;
    user: User;
}
