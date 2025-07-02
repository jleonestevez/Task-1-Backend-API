import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
}
