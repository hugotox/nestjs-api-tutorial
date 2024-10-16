import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from 'src/bookmark/bookmark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark])],
})
export class BookmarkModule {}
