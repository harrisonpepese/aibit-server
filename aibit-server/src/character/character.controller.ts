import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDto } from './dto/create-character.dto';

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  create(@Body() createCharacterDto: CreateCharacterDto) {
    return this.characterService.create(createCharacterDto);
  }

  @Get()
  findAll() {
    return this.characterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.characterService.findOne(id);
  }
}