import { Injectable, Inject } from '@nestjs/common';
import { Post } from './post.entity';
import { PostDto } from './dto/post.dto';
import { User } from '../users/user.entity';
import { POST_REPOSITORY } from '../../core/constants';

@Injectable()
export class PostsService {
    constructor(@Inject(POST_REPOSITORY) private readonly postRepository: typeof Post) { }

    async create(post: PostDto, userId): Promise<Post> { //게시물 올리기.
        return await this.postRepository.create<Post>({ ...post, userId });
    }

    async findAll(): Promise<Post[]> {
        return await this.postRepository.findAll<Post>({ //모든 게시물 목록 조회.
        	include: [{ model: User, attributes: { exclude: ['password'] } }],
    	});
    }

    async findOne(id): Promise<Post> { //id로 특정 게시물 조회. 
        return await this.postRepository.findOne({
        	where: { id },
        	include: [{ model: User, attributes: { exclude: ['password'] } }],
    	});
    }

    async delete(id, userId) { //게시물 삭제.
        return await this.postRepository.destroy({ where: { id, userId } });
    }

    async update(id, data, userId) { //게시물 수정.
        const [numberOfAffectedRows, [updatedPost]] = await this.postRepository.update({ ...data }, { where: { id, userId }, returning: true });

        return { numberOfAffectedRows, updatedPost };
    }
}