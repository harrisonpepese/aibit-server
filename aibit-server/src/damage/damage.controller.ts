import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DamageService } from './damage.service';

@Controller('damage')
export class DamageController {
  constructor(private readonly damageService: DamageService) {}

  @Get()
  findAll() {
    return this.damageService.findAll();
  }

  @Post()
  create(@Body() createDamageDto: any) {
    return this.damageService.create(createDamageDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.damageService.findOne(id);
  }
}