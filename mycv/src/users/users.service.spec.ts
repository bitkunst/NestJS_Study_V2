import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
// getRepositoryToken 함수는 NestJS의 TypeORM 모듈에서 제공하는 함수로, 특정 엔티티에 대한 리포지토리의 고유한 토큰을 생성

describe('UsersService', () => {
    let service: UsersService;
    let fakeUserRepo: Partial<Repository<User>>;

    beforeEach(async () => {
        fakeUserRepo = {};

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User), // getRepositoryToken 함수는 NestJS가 TypeORM 리포지토리를 DI 컨테이너에 등록할 때 사용하는 내부 토큰을 생성
                    useValue: fakeUserRepo,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
