import { Controller, Get, Post, Body, Param, Query, Delete, HttpStatus, HttpCode, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { QueryEventsDto, QueryAreaEventsDto } from './dto/query-events.dto';
import { EventResponseDto } from './dto/event-response.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEventDto: CreateEventDto): Promise<EventResponseDto> {
    return this.eventsService.publishEvent(createEventDto);
  }

  @Get()
  async findAll(@Query() query: QueryEventsDto): Promise<EventResponseDto[]> {
    if (query.type) {
      return this.eventsService.findByType(query.type, query.limit);
    } else if (query.status) {
      return this.eventsService.findByStatus(query.status, query.limit);
    } else if (query.sourceModule) {
      return this.eventsService.findBySourceModule(query.sourceModule, query.limit);
    } else {
      // Default to returning events from all modules with optional limit
      return this.eventsService.findBySourceModule('', query.limit);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EventResponseDto> {
    const event = await this.eventsService.findOne(id);
    if (!event) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }
    return event;
  }

  @Get('entity/:entityId')
  async findForEntity(@Param('entityId') entityId: string, @Query('limit') limit?: number): Promise<EventResponseDto[]> {
    return this.eventsService.findVisibleToEntity(entityId, limit);
  }

  @Get('area')
  async findInArea(@Query() query: QueryAreaEventsDto): Promise<EventResponseDto[]> {
    return this.eventsService.findVisibleInArea(
      query.x,
      query.y,
      query.z,
      query.radius,
      query.limit
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    const deleted = await this.eventsService.deleteEvent(id);
    if (!deleted) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }
  }

  @Delete('cleanup/:days')
  async cleanup(@Param('days') days: string): Promise<{ message: string; count: number }> {
    const daysNum = parseInt(days, 10);
    if (isNaN(daysNum) || daysNum <= 0) {
      throw new BadRequestException('O número de dias deve ser um inteiro positivo');
    }
    
    const count = await this.eventsService.cleanupOldEvents(daysNum);
    return {
      message: `Eventos mais antigos que ${days} dias foram excluídos`,
      count,
    };
  }
}