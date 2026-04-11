import {
  Controller,
  Get,
  Post as PostRequest,
  Param,
  Post as HttpPost,
  NotFoundException,
  Query,
  Body,
  UseGuards,
  Request,
  Patch,
  HttpCode
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post } from './posts.schema';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { MongoIdValidationPipe } from '../common/pipes/mongo-id.pipe';
import { CreatePostDto } from './dto/createPostDto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { PostStatsResponseDto } from './dto/post-stats-response.dto';
import { UpdatePostDto } from './dto/updatePostDto';
import { PaginatedResponse } from '../common/utils/pagination';
import { IncreasePostStatsDto } from './dto/increase-post-stats.dto';
import { SearchPostsDto } from './dto/search-posts.dto';
import { AuthRequest } from '../common/interfaces/auth-request';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyPosts(
    @Request() req: AuthRequest,
    @Query() pagination: PaginationQueryDto
  ): Promise<PaginatedResponse<Post>> {
    return this.postsService.findByUserId(
      req.user.userId,
      pagination.page,
      pagination.per_page
    );
  }

  @Get('me/stats')
  @UseGuards(JwtAuthGuard)
  async getMyPostsStats(
    @Request() req: AuthRequest
  ): Promise<PostStatsResponseDto> {
    return this.postsService.getUserPostsStats(req.user.userId);
  }

  @Get(':id/me')
  @UseGuards(JwtAuthGuard)
  async findOneForOwner(
    @Param('id', MongoIdValidationPipe) id: string,
    @Request() req: AuthRequest
  ): Promise<any> {
    const post = await this.postsService.findOneWithActionsForOwner(
      id,
      req.user.userId
    );
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  @UseGuards(ApiKeyGuard)
  @Get('latest-active-sitemap')
  async getLatestActivePostForSitemap(): Promise<Partial<Post>> {
    return this.postsService.findLatestActiveForSitemap();
  }

  @UseGuards(ApiKeyGuard)
  @Get('all-active-sitemap')
  async getAllActivePostsForSitemap(): Promise<Partial<Post>[]> {
    return this.postsService.findAllActiveForSitemap();
  }

  @UseGuards(JwtAuthGuard)
  @PostRequest()
  createPost(
    @Request() req: AuthRequest,
    @Body() createPostDto: CreatePostDto
  ): Promise<Post> {
    return this.postsService.create(createPostDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updatePost(
    @Request() req: AuthRequest,
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updatePostDto: UpdatePostDto
  ): Promise<Post> {
    const post = await this.postsService.update(
      id,
      updatePostDto,
      req.user.userId
    );
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  @UseGuards(JwtAuthGuard)
  @HttpPost(':id/close')
  @HttpCode(200)
  async closePost(
    @Request() req: AuthRequest,
    @Param('id', MongoIdValidationPipe) id: string
  ): Promise<boolean> {
    await this.postsService.close(id, req.user.userId);
    return true;
  }

  @UseGuards(ApiKeyGuard)
  @Get()
  async findAll(
    @Query() pagination: PaginationQueryDto
  ): Promise<PaginatedResponse<Post>> {
    return this.postsService.findAll(pagination.page, pagination.per_page);
  }

  @HttpPost('search')
  @HttpCode(200)
  async searchPosts(@Body() searchDto: SearchPostsDto): Promise<Post[]> {
    return this.postsService.searchPosts(searchDto);
  }

  @UseGuards(ApiKeyGuard)
  @Get('similar')
  async findSimilarPosts(
    @Query('postId', MongoIdValidationPipe) postId: string
  ): Promise<Post[]> {
    return this.postsService.findSimilarPosts(postId);
  }

  @HttpPost(':id/stats')
  @HttpCode(200)
  async increasePostStats(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() increasePostStatsDto: IncreasePostStatsDto
  ): Promise<void> {
    await this.postsService.increasePostStats(
      id,
      increasePostStatsDto.statType
    );
  }

  @UseGuards(ApiKeyGuard)
  @Get(':postNumber')
  async findOne(@Param('postNumber') postNumber: string): Promise<Post> {
    const post =
      await this.postsService.findByPostNumberAndIncreasePostView(postNumber);
    return post;
  }
}
