import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch, 
  Delete, 
  Query,
  HttpCode,
  HttpStatus,
  ParseBoolPipe,
} from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterStatsDto } from './dto/update-character-stats.dto';
import { UpdateCharacterPositionDto } from './dto/update-character-position.dto';
import { CharacterResponseDto } from './dto/character-response.dto';

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  async create(@Body() createCharacterDto: CreateCharacterDto): Promise<CharacterResponseDto> {
    return this.characterService.create(createCharacterDto);
  }

  @Get()
  async findAll(): Promise<CharacterResponseDto[]> {
    return this.characterService.findAll();
  }

  @Get('online')
  async findOnlineCharacters(): Promise<CharacterResponseDto[]> {
    return this.characterService.findOnlineCharacters();
  }

  @Get('by-account/:accountId')
  async findByAccountId(@Param('accountId') accountId: string): Promise<CharacterResponseDto[]> {
    return this.characterService.findByAccountId(accountId);
  }

  @Get('by-name/:name')
  async findByName(@Param('name') name: string): Promise<CharacterResponseDto> {
    return this.characterService.findByName(name);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CharacterResponseDto> {
    return this.characterService.findOne(id);
  }

  @Patch(':id/stats')
  async updateStats(
    @Param('id') id: string,
    @Body() updateStatsDto: UpdateCharacterStatsDto,
  ): Promise<CharacterResponseDto> {
    return this.characterService.updateStats(id, updateStatsDto);
  }

  @Patch(':id/position')
  async updatePosition(
    @Param('id') id: string,
    @Body() updatePositionDto: UpdateCharacterPositionDto,
  ): Promise<CharacterResponseDto> {
    return this.characterService.updatePosition(id, updatePositionDto);
  }

  @Patch(':id/online-status')
  async setOnlineStatus(
    @Param('id') id: string,
    @Query('isOnline', ParseBoolPipe) isOnline: boolean,
  ): Promise<CharacterResponseDto> {
    return this.characterService.setOnlineStatus(id, isOnline);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Query('accountId') accountId: string,
  ): Promise<void> {
    return this.characterService.remove(id, accountId);
  }
}