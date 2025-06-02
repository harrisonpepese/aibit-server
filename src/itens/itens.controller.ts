import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ItensService } from './itens.service';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('itens')
export class ItensController {
  constructor(private readonly itensService: ItensService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itensService.create(createItemDto);
  }

  @Get()
  findAll() {
    return this.itensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itensService.findOne(id);
  }
}