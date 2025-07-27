import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDto } from './dto/create-character.dto';
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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Query('accountId') accountId: string,
  ): Promise<void> {
    return this.characterService.remove(id, accountId);
  }
}