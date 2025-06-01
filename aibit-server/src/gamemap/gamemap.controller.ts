import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GameMapService } from './gamemap.service';

@Controller('gamemap')
export class GameMapController {
  constructor(private readonly gameMapService: GameMapService) {}

  @Get()
  getAllMaps() {
    return this.gameMapService.findAll();
  }

  @Get(':id')
  getMapById(@Param('id') id: string) {
    return this.gameMapService.findOne(id);
  }

  @Post()
  createMap(@Body() createMapDto: any) {
    return this.gameMapService.create(createMapDto);
  }
}