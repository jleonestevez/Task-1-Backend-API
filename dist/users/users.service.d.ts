import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    create(dto: CreateUserDto): Promise<User>;
    findByUsername(username: string): Promise<User | undefined>;
    findOne(id: number): Promise<User>;
}
