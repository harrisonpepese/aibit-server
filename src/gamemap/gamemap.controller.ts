import { Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common';
import { GameMapService } from './gamemap.service';
import { CreateMapDto } from './dto/create-map.dto';
import { GetMapSectionDto } from './dto/get-map-section.dto';
import { UpdateTileDto } from './dto/update-tile.dto';


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
  createMap(@Body() createMapDto: CreateMapDto) {
    return this.gameMapService.create(createMapDto);
  }

  @Get('section')
  getMapSection(@Query() getMapSectionDto: GetMapSectionDto) {
    return this.gameMapService.getMapSection(getMapSectionDto);
  }

  @Patch('tile')
  updateTile(@Body() updateTileDto: UpdateTileDto) {
    return this.gameMapService.updateTile(updateTileDto);
  }
}